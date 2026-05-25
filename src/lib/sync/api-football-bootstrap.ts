import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  fetchWorldCupLeagueMetadata,
  fetchWorldCupRounds,
} from "@/lib/api-football/endpoints";
import type { SyncJobSummary } from "./types";
import { runApiFootballFixturesSync } from "./api-football-fixtures";
import { runApiFootballStandingsSync } from "./api-football-standings";
import { runApiFootballTeamsSync } from "./api-football-teams";
import { normalizeApiFootballResponse } from "./sync-table-utils";

async function syncRounds() {
  const response = await fetchWorldCupRounds();
  const rounds = normalizeApiFootballResponse<string>(response);
  const apiRequestsUsed = (response as { apiRequestsUsed?: number }).apiRequestsUsed ?? 1;
  const now = new Date().toISOString();
  const supabase = createSupabaseAdminClient();

  const rows = rounds.map((roundName, index) => ({
    api_league_id: Number(process.env.API_FOOTBALL_LEAGUE_ID || "1"),
    season: Number(process.env.API_FOOTBALL_SEASON || "2026"),
    round_name: roundName,
    sort_order: index + 1,
    is_current: false,
    raw: { roundName },
    last_synced_at: now,
  }));

  if (!rows.length) {
    return {
      apiRequestsUsed,
      recordsSeen: 0,
      recordsUpdated: 0,
      message: "No World Cup rounds returned yet.",
    };
  }

  const { error } = await supabase
    .from("tournament_rounds")
    .upsert(rows, {
      onConflict: "api_league_id,season,round_name",
    });

  if (error) throw new Error(`Rounds upsert failed: ${error.message}`);

  return {
    apiRequestsUsed,
    recordsSeen: rows.length,
    recordsUpdated: rows.length,
    message: `Synced ${rows.length} World Cup rounds.`,
  };
}

async function syncLeagueMetadata() {
  const response = await fetchWorldCupLeagueMetadata();
  const items = normalizeApiFootballResponse<{
    league: { id: number; name: string; logo: string | null };
    country: { name: string; flag?: string | null };
    seasons: Array<{ year: number; coverage?: Record<string, unknown> }>;
  }>(response);

  const apiRequestsUsed = (response as { apiRequestsUsed?: number }).apiRequestsUsed ?? 1;
  const now = new Date().toISOString();
  const season = Number(process.env.API_FOOTBALL_SEASON || "2026");
  const item = items[0];

  if (!item) {
    return {
      apiRequestsUsed,
      recordsSeen: 0,
      recordsUpdated: 0,
      message: "No World Cup league metadata returned.",
    };
  }

  const seasonInfo = item.seasons.find((entry) => entry.year === season);

  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("api_tournament_metadata").upsert(
    {
      api_league_id: item.league.id,
      season,
      name: item.league.name,
      country: item.country.name,
      logo_url: item.league.logo,
      flag_url: item.country.flag || null,
      coverage: seasonInfo?.coverage || null,
      raw: item,
      api_raw_json: item,
      last_synced_at: now,
    },
    {
      onConflict: "api_league_id,season",
    }
  );

  if (error) throw new Error(`League metadata upsert failed: ${error.message}`);

  return {
    apiRequestsUsed,
    recordsSeen: 1,
    recordsUpdated: 1,
    message: "Synced World Cup league metadata.",
  };
}

export async function runApiFootballBootstrapSync(): Promise<
  Omit<SyncJobSummary, "startedAt" | "finishedAt" | "durationMs">
> {
  const results: Array<{
    name: string;
    ok: boolean;
    apiRequestsUsed: number;
    recordsSeen: number;
    recordsUpdated: number;
    message: string;
  }> = [];

  async function runChild(
    name: string,
    job: () => Promise<{
      apiRequestsUsed: number;
      recordsSeen: number;
      recordsUpdated: number;
      message: string;
    }>
  ) {
    try {
      const result = await job();

      results.push({
        name,
        ok: true,
        apiRequestsUsed: result.apiRequestsUsed,
        recordsSeen: result.recordsSeen,
        recordsUpdated: result.recordsUpdated,
        message: result.message,
      });
    } catch (error) {
      results.push({
        name,
        ok: false,
        apiRequestsUsed: 0,
        recordsSeen: 0,
        recordsUpdated: 0,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  await runChild("league-metadata", syncLeagueMetadata);
  await runChild("rounds", syncRounds);
  await runChild("fixtures", runApiFootballFixturesSync);
  await runChild("teams", runApiFootballTeamsSync);
  await runChild("standings", runApiFootballStandingsSync);

  const failed = results.filter((result) => !result.ok);
  const apiRequestsUsed = results.reduce((sum, result) => sum + result.apiRequestsUsed, 0);
  const recordsSeen = results.reduce((sum, result) => sum + result.recordsSeen, 0);
  const recordsUpdated = results.reduce((sum, result) => sum + result.recordsUpdated, 0);

  return {
    jobName: "bootstrap-sync",
    status: failed.length ? "partial" : "success",
    apiRequestsUsed,
    recordsSeen,
    recordsInserted: 0,
    recordsUpdated,
    recordsSkipped: 0,
    message: failed.length
      ? `Bootstrap sync completed with ${failed.length} partial failure(s).`
      : "Bootstrap sync completed successfully.",
    details: {
      results,
    },
  };
}
