import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  fetchWorldCupStandings,
  type ApiFootballStandingRow,
  type ApiFootballStandingsItem,
} from "@/lib/api-football/endpoints";
import type { SyncJobSummary } from "./types";
import {
  filterRowToExistingColumns,
  getTableColumnInfo,
  normalizeApiFootballResponse,

} from "./sync-table-utils";

type FlattenedStanding = {
  league: ApiFootballStandingsItem["league"];
  standing: ApiFootballStandingRow;
};

function flattenStandings(items: ApiFootballStandingsItem[]) {
  const rows: FlattenedStanding[] = [];

  for (const item of items) {
    for (const groupRows of item.league.standings || []) {
      for (const standing of groupRows) {
        rows.push({
          league: item.league,
          standing,
        });
      }
    }
  }

  return rows;
}

function buildStandingRow(item: FlattenedStanding) {
  const now = new Date().toISOString();
  const standing = item.standing;

  return {
    api_league_id: item.league.id,
    league_id: item.league.id,
    season: item.league.season,
    group_name: standing.group,
    group: standing.group,

    rank: standing.rank,
    api_team_id: standing.team.id,
    team_api_id: standing.team.id,
    team_name: standing.team.name,
    team_logo_url: standing.team.logo,

    points: standing.points,
    goals_diff: standing.goalsDiff,
    goalsDiff: standing.goalsDiff,
    form: standing.form,
    status: standing.status,
    description: standing.description,

    played: standing.all.played,
    matches_played: standing.all.played,
    wins: standing.all.win,
    win: standing.all.win,
    draws: standing.all.draw,
    draw: standing.all.draw,
    losses: standing.all.lose,
    lose: standing.all.lose,
    goals_for: standing.all.goals.for,
    goals_against: standing.all.goals.against,

    raw: item,
    api_raw_json: item,
    data_status: "partial",
    last_synced_at: now,
  };
}

export async function runApiFootballStandingsSync(): Promise<
  Omit<SyncJobSummary, "startedAt" | "finishedAt" | "durationMs">
> {
  const response = await fetchWorldCupStandings();
  const standingsItems = normalizeApiFootballResponse<ApiFootballStandingsItem>(response);
  const apiRequestsUsed = (response as { apiRequestsUsed?: number }).apiRequestsUsed ?? 1;

  const flattened = flattenStandings(standingsItems);
  const supabase = createSupabaseAdminClient();
  const columnInfo = await getTableColumnInfo("standings");
  const conflictColumn = "api_league_id,season,group_name,api_team_id";

  const rows = flattened
    .map(buildStandingRow)
    .map((row) =>
      filterRowToExistingColumns(row, columnInfo, [
        "id",
        "team_id",
      ])
    );

  if (!rows.length) {
    return {
      jobName: "standings-sync",
      status: "partial",
      apiRequestsUsed,
      recordsSeen: 0,
      recordsInserted: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
      message: "API-Football returned no World Cup standings yet.",
      details: { endpoint: "/standings" },
    };
  }

  const { error } = await supabase.from("standings").upsert(rows, {
    onConflict: conflictColumn,
  });

  if (error) throw new Error(`Standings upsert failed: ${error.message}`);

  return {
    jobName: "standings-sync",
    status: "success",
    apiRequestsUsed,
    recordsSeen: flattened.length,
    recordsInserted: 0,
    recordsUpdated: rows.length,
    recordsSkipped: 0,
    message: `Synced ${rows.length} World Cup standings rows from API-Football.`,
    details: {
      endpoint: "/standings",
      conflictColumn,
      columnsUsed: Array.from(columnInfo.names).filter((column) =>
        Object.keys(rows[0] || {}).includes(column)
      ),
    },
  };
}

