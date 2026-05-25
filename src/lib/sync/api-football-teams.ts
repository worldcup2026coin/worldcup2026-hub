import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  fetchWorldCupTeams,
  type ApiFootballTeamItem,
} from "@/lib/api-football/endpoints";
import type { SyncJobSummary } from "./types";
import {
  filterRowToExistingColumns,
  getTableColumnInfo,
  normalizeApiFootballResponse,
  pickConflictColumn,
  slugify,
} from "./sync-table-utils";

function buildTeamRow(item: ApiFootballTeamItem) {
  const now = new Date().toISOString();

  return {
    api_team_id: item.team.id,
    api_id: item.team.id,
    slug: slugify(item.team.name),
    name: item.team.name,
    team_name: item.team.name,
    code: item.team.code,
    country: item.team.country,
    founded: item.team.founded,
    national: item.team.national,
    logo_url: item.team.logo,
    team_logo_url: item.team.logo,
    logo: item.team.logo,

    venue_api_id: item.venue?.id ?? null,
    venue_name: item.venue?.name || null,
    venue_city: item.venue?.city || null,
    venue_address: item.venue?.address || null,
    venue_capacity: item.venue?.capacity ?? null,
    venue_surface: item.venue?.surface || null,
    venue_image_url: item.venue?.image || null,

    raw: item,
    api_raw_json: item,
    data_status: "complete",
    last_synced_at: now,
  };
}

export async function runApiFootballTeamsSync(): Promise<
  Omit<SyncJobSummary, "startedAt" | "finishedAt" | "durationMs">
> {
  const response = await fetchWorldCupTeams();
  const teams = normalizeApiFootballResponse<ApiFootballTeamItem>(response);
  const apiRequestsUsed = (response as { apiRequestsUsed?: number }).apiRequestsUsed ?? 1;

  const supabase = createSupabaseAdminClient();
  const columnInfo = await getTableColumnInfo("teams");
  const conflictColumn = pickConflictColumn(columnInfo, ["api_team_id", "api_id", "slug"], "slug");

  const rows = teams
    .map(buildTeamRow)
    .map((row) =>
      filterRowToExistingColumns(row, columnInfo, [
        "id",
        "venue_id",
        "stadium_id",
        "group_id",
      ])
    );

  if (!rows.length) {
    return {
      jobName: "teams-sync",
      status: "partial",
      apiRequestsUsed,
      recordsSeen: 0,
      recordsInserted: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
      message: "API-Football returned no World Cup teams.",
      details: { endpoint: "/teams" },
    };
  }

  const { error } = await supabase.from("teams").upsert(rows, {
    onConflict: conflictColumn,
  });

  if (error) throw new Error(`Teams upsert failed: ${error.message}`);

  return {
    jobName: "teams-sync",
    status: "success",
    apiRequestsUsed,
    recordsSeen: teams.length,
    recordsInserted: 0,
    recordsUpdated: rows.length,
    recordsSkipped: 0,
    message: `Synced ${rows.length} World Cup teams from API-Football.`,
    details: {
      endpoint: "/teams",
      conflictColumn,
      columnsUsed: Array.from(columnInfo.names).filter((column) =>
        Object.keys(rows[0] || {}).includes(column)
      ),
    },
  };
}
