import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  fetchWorldCupFixtures,
  type ApiFootballFixtureItem,
} from "@/lib/api-football/endpoints";
import type { SyncJobSummary } from "./types";

type FixtureColumnCheck = {
  column_name: string;
  data_type?: string;
  udt_name?: string;
};

type FixtureColumnInfo = {
  names: Set<string>;
  types: Map<string, string>;
};

type CompatibleFixtureResponse = {
  data?: {
    response?: ApiFootballFixtureItem[] | ApiFootballFixtureItem[][];
  };
  response?: ApiFootballFixtureItem[] | ApiFootballFixtureItem[][];
  apiRequestsUsed?: number;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function normalizeFixtureResponse(
  value: ApiFootballFixtureItem[] | ApiFootballFixtureItem[][] | undefined
) {
  if (!Array.isArray(value)) {
    return [];
  }

  if (Array.isArray(value[0])) {
    return (value as ApiFootballFixtureItem[][]).flat();
  }

  return value as ApiFootballFixtureItem[];
}

function buildFixtureSlug(item: ApiFootballFixtureItem) {
  const home = item.teams.home.name || "team";
  const away = item.teams.away.name || "team";
  const date = item.fixture.date.slice(0, 10);

  return slugify(`${date}-${home}-vs-${away}-${item.fixture.id}`);
}

function getResult(item: ApiFootballFixtureItem) {
  const home = item.goals.home;
  const away = item.goals.away;

  if (home === null || away === null) {
    return null;
  }

  if (home > away) return "H";
  if (away > home) return "A";
  return "D";
}

function buildCandidateRow(item: ApiFootballFixtureItem) {
  const result = getResult(item);
  const now = new Date().toISOString();

  return {
    api_fixture_id: item.fixture.id,
    api_id: item.fixture.id,

    api_league_id: item.league.id,
    league_id: item.league.id,
    api_season: item.league.season,
    season: item.league.season,
    round: item.league.round,
    slug: buildFixtureSlug(item),

    match_date: item.fixture.date,
    kickoff_at: item.fixture.date,
    api_timestamp: item.fixture.timestamp,
    timestamp: item.fixture.timestamp,
    timezone: item.fixture.timezone,

    referee: item.fixture.referee,

    venue_api_id: item.fixture.venue?.id ?? null,
    venue_name: item.fixture.venue?.name || null,
    venue_city: item.fixture.venue?.city || null,

    home_team_api_id: item.teams.home.id ?? null,
    away_team_api_id: item.teams.away.id ?? null,
    home_team_name: item.teams.home.name,
    away_team_name: item.teams.away.name,
    home_team_logo_url: item.teams.home.logo,
    away_team_logo_url: item.teams.away.logo,
    home_logo: item.teams.home.logo,
    away_logo: item.teams.away.logo,

    status: item.fixture.status.short,
    status_short: item.fixture.status.short,
    status_long: item.fixture.status.long,
    elapsed: item.fixture.status.elapsed,
    extra: item.fixture.status.extra,

    home_goals: item.goals.home,
    away_goals: item.goals.away,
    ht_home_goals: item.score.halftime?.home ?? null,
    ht_away_goals: item.score.halftime?.away ?? null,
    ft_home_goals: item.score.fulltime?.home ?? null,
    ft_away_goals: item.score.fulltime?.away ?? null,
    et_home_goals: item.score.extratime?.home ?? null,
    et_away_goals: item.score.extratime?.away ?? null,
    pen_home_goals: item.score.penalty?.home ?? null,
    pen_away_goals: item.score.penalty?.away ?? null,

    winner_api_team_id:
      item.teams.home.winner === true
        ? item.teams.home.id
        : item.teams.away.winner === true
          ? item.teams.away.id
          : null,
    winner: result,
    result,

    raw: item,
    last_synced_at: now,
    data_status: "partial",
    api_raw_json: item,
  };
}

async function getFixtureColumns(): Promise<FixtureColumnInfo> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase.rpc("get_table_columns_for_sync", {
    target_schema: "public",
    target_table: "fixtures",
  });

  if (error || !Array.isArray(data)) {
    throw new Error(
      `Could not read fixtures table columns: ${error?.message || "No data"}`
    );
  }

  const rows = data as FixtureColumnCheck[];

  return {
    names: new Set(rows.map((row) => row.column_name)),
    types: new Map(
      rows.map((row) => [
        row.column_name,
        row.udt_name || row.data_type || "",
      ])
    ),
  };
}

function isUuid(value: unknown) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

function filterRowToExistingColumns(
  row: Record<string, unknown>,
  columnInfo: FixtureColumnInfo
) {
  const blockedInternalColumns = new Set([
    "id",
    "fixture_id",
    "home_team_id",
    "away_team_id",
    "team_id",
    "venue_id",
    "stadium_id",
    "group_id",
  ]);

  return Object.fromEntries(
    Object.entries(row).filter(([key, value]) => {
      if (blockedInternalColumns.has(key)) {
        return false;
      }

      if (!columnInfo.names.has(key)) {
        return false;
      }

      const columnType = columnInfo.types.get(key);

      if (columnType === "uuid" && value !== null && value !== undefined) {
        return isUuid(value);
      }

      return true;
    })
  );
}

function pickConflictColumn(columnInfo: FixtureColumnInfo) {
  if (columnInfo.names.has("api_fixture_id")) {
    return "api_fixture_id";
  }

  if (columnInfo.names.has("api_id")) {
    return "api_id";
  }

  return "slug";
}

export async function runApiFootballFixturesSync(): Promise<
  Omit<SyncJobSummary, "startedAt" | "finishedAt" | "durationMs">
> {
  const fixtureResponse = await fetchWorldCupFixtures();
  const compatibleFixtureResponse =
    fixtureResponse as unknown as CompatibleFixtureResponse;

  const fixtures = normalizeFixtureResponse(
    compatibleFixtureResponse.data?.response ??
      compatibleFixtureResponse.response
  );

  const apiRequestsUsed = compatibleFixtureResponse.apiRequestsUsed ?? 1;

  const supabase = createSupabaseAdminClient();
  const columnInfo = await getFixtureColumns();
  const conflictColumn = pickConflictColumn(columnInfo);

  const rows = fixtures
    .map(buildCandidateRow)
    .map((row) => filterRowToExistingColumns(row, columnInfo));

  if (!rows.length) {
    return {
      jobName: "fixtures-sync",
      status: "partial",
      apiRequestsUsed,
      recordsSeen: 0,
      recordsInserted: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
      message: "API-Football returned no World Cup fixtures.",
      details: {
        endpoint: "/fixtures",
        league: process.env.API_FOOTBALL_LEAGUE_ID || "1",
        season: process.env.API_FOOTBALL_SEASON || "2026",
      },
    };
  }

  const { error } = await supabase.from("fixtures").upsert(rows, {
    onConflict: conflictColumn,
  });

  if (error) {
    throw new Error(`Fixture upsert failed: ${error.message}`);
  }

  return {
    jobName: "fixtures-sync",
    status: "success",
    apiRequestsUsed,
    recordsSeen: fixtures.length,
    recordsInserted: 0,
    recordsUpdated: rows.length,
    recordsSkipped: 0,
    message: `Synced ${rows.length} World Cup fixtures from API-Football.`,
    details: {
      endpoint: "/fixtures",
      conflictColumn,
      columnsUsed: Array.from(columnInfo.names).filter((column) =>
        Object.keys(rows[0] || {}).includes(column)
      ),
    },
  };
}


