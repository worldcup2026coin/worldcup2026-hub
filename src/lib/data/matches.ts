import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Fixture } from "@/lib/data/worldcup";
import { fixtureSlug, getFixtureIdFromSlug } from "@/lib/worldcup/format";

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

function asFixture(data: unknown): Fixture | null {
  return (data ?? null) as Fixture | null;
}

function asMatchEvents(data: unknown): MatchEvent[] {
  return (data ?? []) as MatchEvent[];
}

function asMatchStatistics(data: unknown): MatchStatistic[] {
  return (data ?? []) as MatchStatistic[];
}

function asMatchLineups(data: unknown): MatchLineup[] {
  return (data ?? []) as MatchLineup[];
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
    "https://worldcup2026-hub.vercel.app"
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
    .from("match_events")
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
    .from("match_statistics")
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
    .from("match_lineups")
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

export async function getMatchPageData(slug: string) {
  const match = await getMatchBySlug(slug);

  if (!match) {
    return null;
  }

  const [events, stats, lineups] = await Promise.all([
    getMatchEvents(match.fixture.api_fixture_id),
    getMatchStats(match.fixture.api_fixture_id),
    getMatchLineups(match.fixture.api_fixture_id),
  ]);

  return {
    ...match,
    events,
    stats,
    lineups,
  };
}
