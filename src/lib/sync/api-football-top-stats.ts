import "server-only";

import {
  fetchWorldCupTopAssists,
  fetchWorldCupTopRedCards,
  fetchWorldCupTopScorers,
  fetchWorldCupTopYellowCards,
} from "@/lib/api-football/endpoints";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { SyncJobSummary } from "./types";
import { normalizeApiFootballResponse } from "./sync-table-utils";

type TopStatsJob = {
  statType: "scorers" | "assists" | "yellow_cards" | "red_cards";
  fetcher: () => Promise<unknown>;
};

function getApiRequestsUsed(value: unknown) {
  const envelope = value as { apiRequestsUsed?: number };
  return envelope.apiRequestsUsed ?? 1;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
}

function getValueNumeric(statType: string, item: Record<string, unknown>) {
  const statistics = Array.isArray(item.statistics)
    ? asRecord(item.statistics[0])
    : null;

  const goals = asRecord(statistics?.goals);
  const cards = asRecord(statistics?.cards);

  if (statType === "scorers") return Number(goals?.total ?? 0);
  if (statType === "assists") return Number(goals?.assists ?? 0);
  if (statType === "yellow_cards") return Number(cards?.yellow ?? 0);
  if (statType === "red_cards") return Number(cards?.red ?? 0);

  return 0;
}

export async function runTopStatsSyncJob(): Promise<
  Omit<SyncJobSummary, "startedAt" | "finishedAt" | "durationMs">
> {
  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();

  const jobs: TopStatsJob[] = [
    { statType: "scorers", fetcher: fetchWorldCupTopScorers },
    { statType: "assists", fetcher: fetchWorldCupTopAssists },
    { statType: "yellow_cards", fetcher: fetchWorldCupTopYellowCards },
    { statType: "red_cards", fetcher: fetchWorldCupTopRedCards },
  ];

  let apiRequestsUsed = 0;
  let recordsSeen = 0;
  let recordsUpdated = 0;

  for (const job of jobs) {
    const response = await job.fetcher();
    apiRequestsUsed += getApiRequestsUsed(response);

    const rows = normalizeApiFootballResponse<Record<string, unknown>>(response);
    recordsSeen += rows.length;

    const upsertRows = rows
      .map((item) => {
        const player = asRecord(item.player);
        const statistics = Array.isArray(item.statistics)
          ? asRecord(item.statistics[0])
          : null;
        const team = asRecord(statistics?.team);

        const apiPlayerId = Number(player?.id);

        if (!Number.isFinite(apiPlayerId)) return null;

        return {
          stat_type: job.statType,
          api_league_id: Number(process.env.API_FOOTBALL_LEAGUE_ID || "1"),
          season: Number(process.env.API_FOOTBALL_SEASON || "2026"),
          api_team_id: typeof team?.id === "number" ? team.id : null,
          team_name: typeof team?.name === "string" ? team.name : null,
          api_player_id: apiPlayerId,
          player_name: typeof player?.name === "string" ? player.name : null,
          value_numeric: getValueNumeric(job.statType, item),
          raw: item,
          api_raw_json: item,
          last_synced_at: now,
          updated_at: now,
        };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row));

    if (upsertRows.length > 0) {
      const { error } = await supabase.from("top_player_stats").upsert(upsertRows, {
        onConflict: "stat_type,api_league_id,season,api_player_id",
      });

      if (error) {
        throw new Error(`Top stats upsert failed: ${error.message}`);
      }

      recordsUpdated += upsertRows.length;
    }
  }

  return {
    jobName: "top-stats-sync",
    status: "success",
    apiRequestsUsed,
    recordsSeen,
    recordsInserted: 0,
    recordsUpdated,
    recordsSkipped: 0,
    message: "Synced top scorers, assists, yellow cards and red cards.",
  };
}
