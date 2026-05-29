import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Fixture } from "@/lib/data/worldcup";
import { fixtureSlug, getFixtureIdFromSlug } from "@/lib/worldcup/format";
import { getInjuriesForFixture } from "@/lib/data/injuries";

export type { Fixture } from "@/lib/data/worldcup";

export type MatchEvent = {
  id: string;
  fixture_id: string | null;
  api_fixture_id: number;
  api_event_key: string;
  elapsed: number | null;
  extra: number | null;
  team_api_id: number | null;
  team_name: string | null;
  team_logo_url: string | null;
  player_api_id: number | null;
  player_name: string | null;
  assist_api_id: number | null;
  assist_name: string | null;
  event_type: string | null;
  event_detail: string | null;
  comments: string | null;
  raw: unknown;
  created_at: string;
  updated_at: string;
};

export type MatchStatistic = {
  id: string;
  fixture_id: string | null;
  api_fixture_id: number;
  team_api_id: number;
  team_name: string;
  team_logo_url: string | null;
  stat_type: string;
  stat_value: string | null;
  raw: unknown;
  created_at: string;
  updated_at: string;
};

export type MatchLineup = {
  id: string;
  fixture_id: string | null;
  api_fixture_id: number;
  team_api_id: number;
  team_name: string;
  team_logo_url: string | null;
  coach_name: string | null;
  formation: string | null;
  starting_xi: unknown;
  substitutes: unknown;
  raw: unknown;
  created_at: string;
  updated_at: string;
};

export type MatchPrediction = {
  id: string;
  api_fixture_id: number;
  winner_name: string | null;
  winner_comment: string | null;
  advice: string | null;
  percent_home: string | null;
  percent_draw: string | null;
  percent_away: string | null;
  raw: unknown;
  api_raw_json: unknown;
  last_synced_at: string | null;
  updated_at: string;
};

export type MatchOddsRecord = {
  id: string;
  api_fixture_id: number;
  bookmaker_id: number | null;
  bookmaker_name: string | null;
  bet_id: number | null;
  bet_name: string | null;
  values: unknown;
  raw: unknown;
  api_raw_json: unknown;
  last_synced_at: string | null;
  updated_at: string;
};

export type MatchHeadToHead = {
  id: string;
  api_fixture_id: number;
  home_team_api_id: number;
  away_team_api_id: number;
  h2h_key: string;
  matches: unknown;
  raw: unknown;
  api_raw_json: unknown;
  last_synced_at: string | null;
  updated_at: string;
};

function asFixture(data: unknown): Fixture | null {
  return (data ?? null) as Fixture | null;
}

function asMatchEvents(data: unknown): MatchEvent[] {
  const rows = (data ?? []) as Array<Record<string, unknown>>;

  return rows.map((row) => ({
    ...row,
    team_api_id: row.team_api_id ?? row.api_team_id ?? null,
    player_api_id: row.player_api_id ?? row.api_player_id ?? null,
    assist_api_id: row.assist_api_id ?? row.api_assist_player_id ?? null,
    assist_name: row.assist_name ?? row.assist_player_name ?? null,
  })) as MatchEvent[];
}

function asMatchStatistics(data: unknown): MatchStatistic[] {
  const rows = (data ?? []) as Array<Record<string, unknown>>;
  const flatRows: Array<Record<string, unknown>> = [];

  for (const row of rows) {
    const stats = Array.isArray(row.statistics) ? row.statistics : [];

    if (stats.length === 0) {
      flatRows.push({
        ...row,
        team_api_id: row.team_api_id ?? row.api_team_id,
        stat_type: "Statistics",
        stat_value: null,
      });
      continue;
    }

    for (const stat of stats) {
      const statRecord =
        stat && typeof stat === "object" && !Array.isArray(stat)
          ? (stat as Record<string, unknown>)
          : {};

      flatRows.push({
        ...row,
        team_api_id: row.team_api_id ?? row.api_team_id,
        stat_type:
          typeof statRecord.type === "string" ? statRecord.type : "Statistic",
        stat_value:
          typeof statRecord.value === "string" ||
          typeof statRecord.value === "number"
            ? String(statRecord.value)
            : null,
      });
    }
  }

  return flatRows as MatchStatistic[];
}

function asMatchLineups(data: unknown): MatchLineup[] {
  const rows = (data ?? []) as Array<Record<string, unknown>>;

  return rows.map((row) => ({
    ...row,
    team_api_id: row.team_api_id ?? row.api_team_id,
    starting_xi: row.starting_xi ?? row.start_xi ?? [],
  })) as MatchLineup[];
}

function asMatchPrediction(data: unknown): MatchPrediction | null {
  return (data ?? null) as MatchPrediction | null;
}

function asMatchOddsRecords(data: unknown): MatchOddsRecord[] {
  return (data ?? []) as MatchOddsRecord[];
}

function asMatchHeadToHead(data: unknown): MatchHeadToHead | null {
  return (data ?? null) as MatchHeadToHead | null;
}

function isMissingOptionalTableError(error: { code?: string; message?: string }) {
  const message = error.message ?? "";

  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    message.includes("does not exist") ||
    message.includes("Could not find the table")
  );
}

export function getPublicSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/^/, "https://") ||
    "https://www.worldcup2026coin.com"
  ).replace(/\/+$/, "");
}

export function getMatchTitle(home?: string | null, away?: string | null) {
  return `${home || "Home"} vs ${away || "Away"}`;
}

export function getCanonicalMatchSlug(fixture: Fixture) {
  return fixtureSlug({
    api_fixture_id: fixture.api_fixture_id,
    match_date: fixture.match_date,
    home_team_name: fixture.home_team_name,
    away_team_name: fixture.away_team_name,
  });
}

export async function getMatchBySlug(slug: string) {
  const apiFixtureId = getFixtureIdFromSlug(slug);

  if (!apiFixtureId) {
    return null;
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("fixtures")
    .select("*")
    .eq("api_fixture_id", apiFixtureId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load match fixture: ${error.message}`);
  }

  const fixture = asFixture(data);

  if (!fixture) {
    return null;
  }

  return {
    fixture,
    canonicalSlug: getCanonicalMatchSlug(fixture),
  };
}

export async function getMatchEvents(apiFixtureId: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("fixture_events")
    .select("*")
    .eq("api_fixture_id", apiFixtureId)
    .order("elapsed", { ascending: true, nullsFirst: true })
    .order("extra", { ascending: true, nullsFirst: true });

  if (error) {
    if (isMissingOptionalTableError(error)) {
      return [];
    }

    throw new Error(`Failed to load match events: ${error.message}`);
  }

  return asMatchEvents(data);
}

export async function getMatchStats(apiFixtureId: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("fixture_statistics")
    .select("*")
    .eq("api_fixture_id", apiFixtureId)
    .order("stat_type", { ascending: true });

  if (error) {
    if (isMissingOptionalTableError(error)) {
      return [];
    }

    throw new Error(`Failed to load match stats: ${error.message}`);
  }

  return asMatchStatistics(data);
}

export async function getMatchLineups(apiFixtureId: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("fixture_lineups")
    .select("*")
    .eq("api_fixture_id", apiFixtureId)
    .order("team_name", { ascending: true });

  if (error) {
    if (isMissingOptionalTableError(error)) {
      return [];
    }

    throw new Error(`Failed to load match lineups: ${error.message}`);
  }

  return asMatchLineups(data);
}

export async function getFixturePrediction(apiFixtureId: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("fixture_predictions")
    .select("*")
    .eq("api_fixture_id", apiFixtureId)
    .maybeSingle();

  if (error) {
    if (isMissingOptionalTableError(error)) return null;
    throw new Error(`Failed to load fixture prediction: ${error.message}`);
  }

  return asMatchPrediction(data);
}

export async function getFixtureOdds(apiFixtureId: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("odds_records")
    .select("*")
    .eq("api_fixture_id", apiFixtureId)
    .order("bookmaker_name", { ascending: true })
    .order("bet_name", { ascending: true })
    .limit(24);

  if (error) {
    if (isMissingOptionalTableError(error)) return [];
    throw new Error(`Failed to load fixture odds: ${error.message}`);
  }

  return asMatchOddsRecords(data);
}

export async function getFixtureHeadToHead(apiFixtureId: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("fixture_head_to_head")
    .select("*")
    .eq("api_fixture_id", apiFixtureId)
    .maybeSingle();

  if (error) {
    if (isMissingOptionalTableError(error)) return null;
    throw new Error(`Failed to load fixture head-to-head: ${error.message}`);
  }

  return asMatchHeadToHead(data);
}

export async function getMatchPageData(slug: string) {
  const match = await getMatchBySlug(slug);

  if (!match) {
    return null;
  }

  const [events, stats, lineups, apiPrediction, apiOdds, headToHead, injuries] =
    await Promise.all([
      getMatchEvents(match.fixture.api_fixture_id),
      getMatchStats(match.fixture.api_fixture_id),
      getMatchLineups(match.fixture.api_fixture_id),
      getFixturePrediction(match.fixture.api_fixture_id),
      getFixtureOdds(match.fixture.api_fixture_id),
      getFixtureHeadToHead(match.fixture.api_fixture_id),
      getInjuriesForFixture(match.fixture.api_fixture_id),
    ]);

  return {
    ...match,
    events,
    stats,
    lineups,
    apiPrediction,
    apiOdds,
    headToHead,
    injuries,
  };
}




