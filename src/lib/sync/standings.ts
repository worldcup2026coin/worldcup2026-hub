import { apiFootballGetAllPages } from "@/lib/api-football/client";
import type {
  ApiFootballStandingRow,
  ApiFootballStandingsItem,
} from "@/lib/api-football/types";
import { getWorldCupApiConfig } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTeamIdMap } from "@/lib/sync/helpers";
import {
  createSyncLog,
  finishSyncLog,
  getErrorMessage,
} from "@/lib/sync/logs";
import type { SyncResult } from "@/lib/sync/types";

function flattenStandings(
  items: ApiFootballStandingsItem[]
): ApiFootballStandingRow[] {
  return items.flatMap((item) => item.league.standings.flat());
}

export async function syncStandings(): Promise<SyncResult> {
  const supabase = createSupabaseAdminClient();
  const config = getWorldCupApiConfig();
  const startedAtMs = Date.now();
  const logId = await createSyncLog(supabase, "standings", config, startedAtMs);

  try {
    const apiResult = await apiFootballGetAllPages<ApiFootballStandingsItem>(
      "standings",
      {
        league: config.leagueId,
        season: config.season,
      }
    );

    const firstLeague = apiResult.response[0]?.league;
    const standings = flattenStandings(apiResult.response);

    const uniqueGroupNames = Array.from(
      new Set(standings.map((row) => row.group || "Overall"))
    );

    const groupRows = uniqueGroupNames.map((name) => ({
      api_league_id: firstLeague?.id ?? config.leagueId,
      season: firstLeague?.season ?? config.season,
      name,
      raw: {
        source: "api-football",
      },
      updated_at: new Date().toISOString(),
    }));

    if (groupRows.length > 0) {
      const { error } = await supabase.from("groups").upsert(groupRows, {
        onConflict: "api_league_id,season,name",
      });

      if (error) {
        throw new Error(`Failed to upsert groups: ${error.message}`);
      }
    }

    const { data: dbGroups, error: groupsError } = await supabase
      .from("groups")
      .select("id, name")
      .eq("api_league_id", firstLeague?.id ?? config.leagueId)
      .eq("season", firstLeague?.season ?? config.season);

    if (groupsError) {
      throw new Error(`Failed to load groups: ${groupsError.message}`);
    }

    const groupIdMap = new Map<string, string>();

    for (const group of dbGroups ?? []) {
      groupIdMap.set(String(group.name), String(group.id));
    }

    const teamIdMap = await getTeamIdMap(
      supabase,
      standings.map((row) => row.team.id)
    );

    const standingRows = standings.map((row) => {
      const groupName = row.group || "Overall";

      return {
        api_league_id: firstLeague?.id ?? config.leagueId,
        season: firstLeague?.season ?? config.season,
        group_id: groupIdMap.get(groupName) ?? null,
        group_name: groupName,

        team_id: teamIdMap.get(row.team.id) ?? null,
        api_team_id: row.team.id,
        team_name: row.team.name,
        team_logo_url: row.team.logo,

        rank: row.rank,
        points: row.points,
        goals_diff: row.goalsDiff,
        form: row.form,
        status: row.status,
        description: row.description,

        played: row.all.played,
        wins: row.all.win,
        draws: row.all.draw,
        losses: row.all.lose,
        goals_for: row.all.goals.for,
        goals_against: row.all.goals.against,

        home_played: row.home.played,
        home_wins: row.home.win,
        home_draws: row.home.draw,
        home_losses: row.home.lose,
        home_goals_for: row.home.goals.for,
        home_goals_against: row.home.goals.against,

        away_played: row.away.played,
        away_wins: row.away.win,
        away_draws: row.away.draw,
        away_losses: row.away.lose,
        away_goals_for: row.away.goals.for,
        away_goals_against: row.away.goals.against,

        api_updated_at: row.update,
        raw: row,
        updated_at: new Date().toISOString(),
      };
    });

    if (standingRows.length > 0) {
      const { error } = await supabase.from("standings").upsert(standingRows, {
        onConflict: "api_league_id,season,group_name,api_team_id",
      });

      if (error) {
        throw new Error(`Failed to upsert standings: ${error.message}`);
      }
    }

    const durationMs = Date.now() - startedAtMs;

    await finishSyncLog(supabase, logId, {
      status: "success",
      startedAtMs,
      requestCount: apiResult.requestCount,
      recordsReceived: standings.length,
      recordsUpserted: standingRows.length,
      metadata: config,
    });

    return {
      scope: "standings",
      status: "success",
      logId,
      requestCount: apiResult.requestCount,
      recordsReceived: standings.length,
      recordsUpserted: standingRows.length,
      durationMs,
    };
  } catch (error) {
    await finishSyncLog(supabase, logId, {
      status: "error",
      startedAtMs,
      requestCount: 0,
      recordsReceived: 0,
      recordsUpserted: 0,
      errorMessage: getErrorMessage(error),
      metadata: config,
    });

    throw error;
  }
}

