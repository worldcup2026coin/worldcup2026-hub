import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  fetchSquadByTeam,
  type ApiFootballSquadItem,
} from "@/lib/api-football/endpoints";
import type { SyncJobSummary } from "./types";
import { normalizeApiFootballResponse } from "./sync-table-utils";

type TeamRow = {
  api_team_id: number;
  name?: string | null;
};

type SquadChunkOptions = {
  offset: number;
  limit: number;
  jobName: SyncJobSummary["jobName"];
};

function getApiRequestsUsed(value: unknown) {
  const envelope = value as { apiRequestsUsed?: number };

  return envelope.apiRequestsUsed ?? 1;
}

async function getTeamRows(offset: number, limit: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("teams")
    .select("api_team_id,name")
    .not("api_team_id", "is", null)
    .order("api_team_id", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Could not read team chunk: ${error.message}`);
  }

  return (data ?? []) as TeamRow[];
}

async function cacheRaw(
  endpoint: string,
  params: Record<string, unknown>,
  response: unknown
) {
  const supabase = createSupabaseAdminClient();
  const envelope = response as {
    response?: unknown;
    data?: { response?: unknown };
  };

  const body = envelope.data?.response ?? envelope.response;
  const count = Array.isArray(body) ? body.length : null;
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;

  const { error } = await supabase.from("api_raw_cache").upsert(
    {
      endpoint,
      params,
      cache_key: cacheKey,
      status: "success",
      results_count: count,
      raw: response,
      error_message: null,
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "cache_key",
    }
  );

  if (error) {
    throw new Error(`Raw cache upsert failed: ${error.message}`);
  }
}

export async function runApiFootballSquadsChunkSync({
  offset,
  limit,
  jobName,
}: SquadChunkOptions): Promise<
  Omit<SyncJobSummary, "startedAt" | "finishedAt" | "durationMs">
> {
  const supabase = createSupabaseAdminClient();
  const teams = await getTeamRows(offset, limit);
  const now = new Date().toISOString();

  let apiRequestsUsed = 0;
  let recordsSeen = 0;
  let recordsUpdated = 0;
  let recordsSkipped = 0;

  for (const team of teams) {
    if (!team.api_team_id) {
      recordsSkipped += 1;
      continue;
    }

    const response = await fetchSquadByTeam(team.api_team_id);
    apiRequestsUsed += getApiRequestsUsed(response);

    await cacheRaw("/players/squads", { team: team.api_team_id }, response);

    const squadItems = normalizeApiFootballResponse<ApiFootballSquadItem>(response);

    for (const squadItem of squadItems) {
      const apiTeamId = squadItem.team?.id ?? team.api_team_id;
      const teamName = squadItem.team?.name ?? team.name ?? null;
      const players = squadItem.players ?? [];

      recordsSeen += players.length;

      const playerRows = players.map((player) => ({
        api_player_id: player.id,
        name: player.name,
        age: player.age,
        photo_url: player.photo,
        raw: player,
        api_raw_json: {
          team: squadItem.team,
          player,
        },
        last_synced_at: now,
        updated_at: now,
      }));

      if (playerRows.length) {
        const { error } = await supabase.from("players").upsert(playerRows, {
          onConflict: "api_player_id",
        });

        if (error) {
          throw new Error(`Players upsert failed: ${error.message}`);
        }
      }

      const squadRows = players.map((player) => ({
        api_team_id: apiTeamId,
        api_player_id: player.id,
        season: Number(process.env.API_FOOTBALL_SEASON || "2026"),
        player_name: player.name,
        team_name: teamName,
        position: player.position,
        number: player.number,
        raw: {
          team: squadItem.team,
          player,
        },
        api_raw_json: {
          team: squadItem.team,
          player,
        },
        last_synced_at: now,
        updated_at: now,
      }));

      if (squadRows.length) {
        const { error } = await supabase
          .from("team_squad_players")
          .upsert(squadRows, {
            onConflict: "api_team_id,api_player_id,season",
          });

        if (error) {
          throw new Error(`Squad upsert failed: ${error.message}`);
        }

        recordsUpdated += squadRows.length;
      }
    }

    await supabase
      .from("teams")
      .update({
        squad_last_synced_at: now,
        last_synced_at: now,
      })
      .eq("api_team_id", team.api_team_id);
  }

  return {
    jobName,
    status: "success",
    apiRequestsUsed,
    recordsSeen,
    recordsInserted: 0,
    recordsUpdated,
    recordsSkipped,
    message: `Synced squad chunk offset ${offset}, limit ${limit}.`,
    details: {
      offset,
      limit,
      teamsProcessed: teams.length,
    },
  };
}
