import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Fixture } from "@/lib/data/matches";
import {
  getCanonicalMatchSlug,
  getMatchBySlug,
  getMatchTitle,
} from "@/lib/data/matches";

export type PredictionType = "fan_preview" | "fantasy_tip" | "betting_style";
export type PredictionRiskLevel = "low" | "medium" | "high" | "no_lean";
export type PredictionStatus = "draft" | "published";

export type PredictionTip = {
  id: string;
  fixture_id: string;
  type: PredictionType;
  title: string;
  summary: string | null;
  prediction_text: string | null;
  risk_level: PredictionRiskLevel;
  confidence_score: number | null;
  key_factors: unknown;
  players_to_watch: unknown;
  market_label: string | null;
  odds_decimal: number | null;
  bookmaker: string | null;
  disclaimer: string;
  status: PredictionStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OddsStyleRecord = {
  id: string;
  fixture_id: string;
  market: string;
  selection: string;
  odds_decimal: number | null;
  bookmaker: string | null;
  source: string | null;
  captured_at: string;
  is_manual: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PredictionIndexItem = {
  fixture: Fixture;
  canonicalSlug: string;
  matchTitle: string;
  tips: PredictionTip[];
};

export const responsibleUseText =
  "Betting-style content is for entertainment and informational purposes only. It is not financial advice, gambling advice, or a guarantee of outcome. Odds and availability may vary by location and provider. Only participate where legal, and never risk money you cannot afford to lose.";

function asPredictionTips(data: unknown): PredictionTip[] {
  return (data ?? []) as PredictionTip[];
}

function asOddsStyleRecords(data: unknown): OddsStyleRecord[] {
  return (data ?? []) as OddsStyleRecord[];
}

function asFixtures(data: unknown): Fixture[] {
  return (data ?? []) as Fixture[];
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

export function getPredictionTypeLabel(type: PredictionType) {
  if (type === "fan_preview") return "Fan preview";
  if (type === "fantasy_tip") return "Fantasy-style";
  return "Betting-style";
}

export async function getPublishedPredictionTips() {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("predictions_tips")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingOptionalTableError(error)) return [];
    throw new Error(`Failed to load prediction tips: ${error.message}`);
  }

  return asPredictionTips(data);
}

export async function getPredictionTipsForFixture(fixtureId: string) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("predictions_tips")
    .select("*")
    .eq("fixture_id", fixtureId)
    .eq("status", "published")
    .order("type", { ascending: true })
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingOptionalTableError(error)) return [];
    throw new Error(`Failed to load fixture prediction tips: ${error.message}`);
  }

  return asPredictionTips(data);
}

export async function getOddsStyleRecordsForFixture(fixtureId: string) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("odds_style_records")
    .select("*")
    .eq("fixture_id", fixtureId)
    .order("captured_at", { ascending: false });

  if (error) {
    if (isMissingOptionalTableError(error)) return [];
    throw new Error(`Failed to load odds-style records: ${error.message}`);
  }

  return asOddsStyleRecords(data);
}

export async function getPredictionContentForFixture(fixtureId: string) {
  const [tips, oddsRecords] = await Promise.all([
    getPredictionTipsForFixture(fixtureId),
    getOddsStyleRecordsForFixture(fixtureId),
  ]);

  return {
    tips,
    oddsRecords,
  };
}

export async function getPredictionsIndexData() {
  const supabase = createSupabaseAdminClient();
  const tips = await getPublishedPredictionTips();

  const fixtureIds = Array.from(new Set(tips.map((tip) => tip.fixture_id)));

  if (fixtureIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("fixtures")
    .select("*")
    .in("id", fixtureIds)
    .order("match_date", { ascending: true });

  if (error) {
    throw new Error(`Failed to load prediction fixtures: ${error.message}`);
  }

  const fixtures = asFixtures(data);
  const fixtureMap = new Map(fixtures.map((fixture) => [fixture.id, fixture]));
  const grouped = new Map<string, PredictionTip[]>();

  for (const tip of tips) {
    grouped.set(tip.fixture_id, [...(grouped.get(tip.fixture_id) ?? []), tip]);
  }

  return Array.from(grouped.entries())
    .map(([fixtureId, fixtureTips]) => {
      const fixture = fixtureMap.get(fixtureId);

      if (!fixture) return null;

      return {
        fixture,
        canonicalSlug: getCanonicalMatchSlug(fixture),
        matchTitle: getMatchTitle(
          fixture.home_team_name,
          fixture.away_team_name
        ),
        tips: fixtureTips,
      };
    })
    .filter((item): item is PredictionIndexItem => Boolean(item));
}

export async function getPredictionPageDataBySlug(slug: string) {
  const match = await getMatchBySlug(slug);

  if (!match) {
    return null;
  }

  const { tips, oddsRecords } = await getPredictionContentForFixture(
    match.fixture.id
  );

  return {
    ...match,
    tips,
    oddsRecords,
  };
}
