import "server-only";

import { fetchWorldCupFixtureDetailsByIds } from "@/lib/api-football/endpoints";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { SyncJobSummary } from "./types";
import { normalizeApiFootballResponse } from "./sync-table-utils";

type MatchdayChunkOptions = {
  offset: number;
  limit: number;
  jobName: SyncJobSummary["jobName"];
};

type FixtureRow = {
  api_fixture_id: number;
};

type ApiFixtureDetail = {
  fixture: {
    id: number;
  };
  events?: unknown[];
  lineups?: unknown[];
  statistics?: unknown[];
  players?: unknown[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
}

function getApiRequestsUsed(value: unknown) {
  const envelope = value as { apiRequestsUsed?: number };
  return envelope.apiRequestsUsed ?? 1;
}

async function getFixtureRows(offset: number, limit: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("fixtures")
    .select("api_fixture_id")
    .order("match_date", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Could not read fixture chunk: ${error.message}`);
  }

  return (data ?? []) as FixtureRow[];
}

function makeEventKey(apiFixtureId: number, event: Record<string, unknown>) {
  const time = asRecord(event.time);
  const team = asRecord(event.team);
  const player = asRecord(event.player);

  return [
    apiFixtureId,
    time?.elapsed ?? "",
    time?.extra ?? "",
    team?.id ?? "",
    player?.id ?? "",
    event.type ?? "",
    event.detail ?? "",
    event.comments ?? "",
  ].join(":");
}

export async function runApiFootballMatchdayDataChunkSync({
  offset,
  limit,
  jobName,
}: MatchdayChunkOptions): Promise<
  Omit<SyncJobSummary, "startedAt" | "finishedAt" | "durationMs">
> {
  const supabase = createSupabaseAdminClient();
  const fixtureRows = await getFixtureRows(offset, limit);
  const fixtureIds = fixtureRows.map((fixture) => fixture.api_fixture_id);
  const now = new Date().toISOString();

  if (fixtureIds.length === 0) {
    return {
      jobName,
      status: "success",
      apiRequestsUsed: 0,
      recordsSeen: 0,
      recordsInserted: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
      message: `No fixtures found for matchday chunk offset ${offset}, limit ${limit}.`,
      details: { offset, limit, fixturesProcessed: 0 },
    };
  }

  const response = await fetchWorldCupFixtureDetailsByIds(fixtureIds);
  const details = normalizeApiFootballResponse<ApiFixtureDetail>(response);

  let recordsSeen = details.length;
  let recordsUpdated = 0;

  for (const detail of details) {
    const apiFixtureId = detail.fixture.id;

    const eventRows = (detail.events ?? [])
      .map(asRecord)
      .filter((event): event is Record<string, unknown> => Boolean(event))
      .map((event) => {
        const time = asRecord(event.time);
        const team = asRecord(event.team);
        const player = asRecord(event.player);
        const assist = asRecord(event.assist);

        return {
          api_fixture_id: apiFixtureId,
          api_event_key: makeEventKey(apiFixtureId, event),
          elapsed: typeof time?.elapsed === "number" ? time.elapsed : null,
          extra: typeof time?.extra === "number" ? time.extra : null,
          api_team_id: typeof team?.id === "number" ? team.id : null,
          team_name: typeof team?.name === "string" ? team.name : null,
          team_logo_url: typeof team?.logo === "string" ? team.logo : null,
          api_player_id: typeof player?.id === "number" ? player.id : null,
          player_name: typeof player?.name === "string" ? player.name : null,
          api_assist_player_id:
            typeof assist?.id === "number" ? assist.id : null,
          assist_player_name:
            typeof assist?.name === "string" ? assist.name : null,
          event_type: typeof event.type === "string" ? event.type : null,
          event_detail: typeof event.detail === "string" ? event.detail : null,
          comments: typeof event.comments === "string" ? event.comments : null,
          raw: event,
          api_raw_json: event,
          last_synced_at: now,
          updated_at: now,
        };
      });

    if (eventRows.length > 0) {
      const { error } = await supabase.from("fixture_events").upsert(eventRows, {
        onConflict: "api_fixture_id,api_event_key",
      });

      if (error) {
        throw new Error(`Fixture events upsert failed: ${error.message}`);
      }

      recordsUpdated += eventRows.length;
    }

    const lineupRows = (detail.lineups ?? [])
      .map(asRecord)
      .filter((lineup): lineup is Record<string, unknown> => Boolean(lineup))
      .map((lineup) => {
        const team = asRecord(lineup.team);
        const coach = asRecord(lineup.coach);

        return {
          api_fixture_id: apiFixtureId,
          api_team_id: Number(team?.id),
          team_name: typeof team?.name === "string" ? team.name : null,
          team_logo_url: typeof team?.logo === "string" ? team.logo : null,
          formation:
            typeof lineup.formation === "string" ? lineup.formation : null,
          coach_api_id: typeof coach?.id === "number" ? coach.id : null,
          coach_name: typeof coach?.name === "string" ? coach.name : null,
          start_xi: Array.isArray(lineup.startXI) ? lineup.startXI : [],
          substitutes: Array.isArray(lineup.substitutes)
            ? lineup.substitutes
            : [],
          raw: lineup,
          api_raw_json: lineup,
          last_synced_at: now,
          updated_at: now,
        };
      })
      .filter((lineup) => Number.isFinite(lineup.api_team_id));

    if (lineupRows.length > 0) {
      const { error } = await supabase
        .from("fixture_lineups")
        .upsert(lineupRows, {
          onConflict: "api_fixture_id,api_team_id",
        });

      if (error) {
        throw new Error(`Fixture lineups upsert failed: ${error.message}`);
      }

      recordsUpdated += lineupRows.length;
    }

    const statisticRows = (detail.statistics ?? [])
      .map(asRecord)
      .filter((stat): stat is Record<string, unknown> => Boolean(stat))
      .map((stat) => {
        const team = asRecord(stat.team);

        return {
          api_fixture_id: apiFixtureId,
          api_team_id: Number(team?.id),
          team_name: typeof team?.name === "string" ? team.name : null,
          team_logo_url: typeof team?.logo === "string" ? team.logo : null,
          statistics: Array.isArray(stat.statistics) ? stat.statistics : [],
          raw: stat,
          api_raw_json: stat,
          last_synced_at: now,
          updated_at: now,
        };
      })
      .filter((stat) => Number.isFinite(stat.api_team_id));

    if (statisticRows.length > 0) {
      const { error } = await supabase
        .from("fixture_statistics")
        .upsert(statisticRows, {
          onConflict: "api_fixture_id,api_team_id",
        });

      if (error) {
        throw new Error(`Fixture statistics upsert failed: ${error.message}`);
      }

      recordsUpdated += statisticRows.length;
    }

    const playerStatRows = (detail.players ?? [])
      .map(asRecord)
      .filter((teamBlock): teamBlock is Record<string, unknown> =>
        Boolean(teamBlock)
      )
      .flatMap((teamBlock) => {
        const team = asRecord(teamBlock.team);
        const players = Array.isArray(teamBlock.players)
          ? teamBlock.players
          : [];

        return players
          .map(asRecord)
          .filter((playerBlock): playerBlock is Record<string, unknown> =>
            Boolean(playerBlock)
          )
          .map((playerBlock) => {
            const player = asRecord(playerBlock.player);

            return {
              api_fixture_id: apiFixtureId,
              api_team_id: Number(team?.id),
              api_player_id: Number(player?.id),
              team_name:
                typeof team?.name === "string" ? team.name : null,
              team_logo_url:
                typeof team?.logo === "string" ? team.logo : null,
              player_name:
                typeof player?.name === "string" ? player.name : null,
              player_photo_url:
                typeof player?.photo === "string" ? player.photo : null,
              statistics: Array.isArray(playerBlock.statistics)
                ? playerBlock.statistics
                : [],
              raw: playerBlock,
              api_raw_json: playerBlock,
              last_synced_at: now,
              updated_at: now,
            };
          });
      })
      .filter(
        (row) =>
          Number.isFinite(row.api_team_id) &&
          Number.isFinite(row.api_player_id)
      );

    if (playerStatRows.length > 0) {
      const { error } = await supabase
        .from("fixture_player_statistics")
        .upsert(playerStatRows, {
          onConflict: "api_fixture_id,api_team_id,api_player_id",
        });

      if (error) {
        throw new Error(
          `Fixture player statistics upsert failed: ${error.message}`
        );
      }

      recordsUpdated += playerStatRows.length;
    }

    recordsSeen +=
      eventRows.length +
      lineupRows.length +
      statisticRows.length +
      playerStatRows.length;

    await supabase
      .from("fixtures")
      .update({
        details_last_synced_at: now,
        events_last_synced_at: eventRows.length ? now : null,
        lineups_last_synced_at: lineupRows.length ? now : null,
        stats_last_synced_at: statisticRows.length ? now : null,
      })
      .eq("api_fixture_id", apiFixtureId);
  }

  return {
    jobName,
    status: "success",
    apiRequestsUsed: getApiRequestsUsed(response),
    recordsSeen,
    recordsInserted: 0,
    recordsUpdated,
    recordsSkipped: 0,
    message: `Synced matchday-data chunk offset ${offset}, limit ${limit}.`,
    details: {
      offset,
      limit,
      fixturesProcessed: fixtureIds.length,
    },
  };
}
