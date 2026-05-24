import { apiFootballGetAllPages } from "@/lib/api-football/client";
import type { ApiFootballFixtureItem } from "@/lib/api-football/types";
import { getWorldCupApiConfig } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  getTeamIdMap,
  upsertStadiumFromVenue,
} from "@/lib/sync/helpers";
import {
  createSyncLog,
  finishSyncLog,
  getErrorMessage,
} from "@/lib/sync/logs";
import type { SyncResult } from "@/lib/sync/types";

function getWinnerApiTeamId(item: ApiFootballFixtureItem): number | null {
  if (item.teams.home.winner === true) {
    return item.teams.home.id;
  }

  if (item.teams.away.winner === true) {
    return item.teams.away.id;
  }

  return null;
}

export async function syncFixtures(): Promise<SyncResult> {
  const supabase = createSupabaseAdminClient();
  const config = getWorldCupApiConfig();
  const startedAtMs = Date.now();
  const logId = await createSyncLog(supabase, "fixtures", config, startedAtMs);

  try {
    const apiResult = await apiFootballGetAllPages<ApiFootballFixtureItem>(
      "fixtures",
      {
        league: config.leagueId,
        season: config.season,
        timezone: config.timezone,
      }
    );

    const teamApiIds = apiResult.response.flatMap((item) => [
      item.teams.home.id,
      item.teams.away.id,
    ]);

    const teamIdMap = await getTeamIdMap(supabase, teamApiIds);
    const rows = [];

    for (const item of apiResult.response) {
      const stadiumId = await upsertStadiumFromVenue(
        supabase,
        item.fixture.venue,
        item.league.country
      );

      rows.push({
        api_fixture_id: item.fixture.id,
        api_league_id: item.league.id,
        season: item.league.season,
        round: item.league.round,
        group_name: null,
        match_date: item.fixture.date,
        api_timestamp: item.fixture.timestamp,
        timezone: item.fixture.timezone,
        referee: item.fixture.referee,

        stadium_id: stadiumId,
        venue_api_id: item.fixture.venue?.id ?? null,
        venue_name: item.fixture.venue?.name ?? null,
        venue_city: item.fixture.venue?.city ?? null,

        home_team_id: teamIdMap.get(item.teams.home.id) ?? null,
        away_team_id: teamIdMap.get(item.teams.away.id) ?? null,
        home_team_api_id: item.teams.home.id,
        away_team_api_id: item.teams.away.id,
        home_team_name: item.teams.home.name,
        away_team_name: item.teams.away.name,
        home_team_logo_url: item.teams.home.logo,
        away_team_logo_url: item.teams.away.logo,

        status_long: item.fixture.status.long,
        status_short: item.fixture.status.short,
        elapsed: item.fixture.status.elapsed,
        extra: item.fixture.status.extra,

        home_goals: item.goals.home,
        away_goals: item.goals.away,
        ht_home_goals: item.score.halftime.home,
        ht_away_goals: item.score.halftime.away,
        ft_home_goals: item.score.fulltime.home,
        ft_away_goals: item.score.fulltime.away,
        et_home_goals: item.score.extratime.home,
        et_away_goals: item.score.extratime.away,
        pen_home_goals: item.score.penalty.home,
        pen_away_goals: item.score.penalty.away,

        winner_api_team_id: getWinnerApiTeamId(item),
        raw: item,
        updated_at: new Date().toISOString(),
      });
    }

    if (rows.length > 0) {
      const { error } = await supabase.from("fixtures").upsert(rows, {
        onConflict: "api_fixture_id",
      });

      if (error) {
        throw new Error(`Failed to upsert fixtures: ${error.message}`);
      }
    }

    const durationMs = Date.now() - startedAtMs;

    await finishSyncLog(supabase, logId, {
      status: "success",
      startedAtMs,
      requestCount: apiResult.requestCount,
      recordsReceived: apiResult.response.length,
      recordsUpserted: rows.length,
      metadata: config,
    });

    return {
      scope: "fixtures",
      status: "success",
      logId,
      requestCount: apiResult.requestCount,
      recordsReceived: apiResult.response.length,
      recordsUpserted: rows.length,
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

