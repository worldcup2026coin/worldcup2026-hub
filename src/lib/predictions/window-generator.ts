import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  detectTournamentPhase,
  getExactScorePoints,
  getMatchResultPoints,
} from "@/lib/predictions/scoring";
import {
  generateTournamentPredictionWindows,
  type TournamentWindowGenerationResult,
} from "@/lib/predictions/tournament-window-generator";

type Fixture = {
  api_fixture_id: number;
  home_team_name: string | null;
  away_team_name: string | null;
  match_date: string | null;
  status_short: string | null;
  round: string | null;
};

type ExistingWindow = {
  slug: string;
  status: string;
  fixture_api_id: number | null;
  prediction_type: string;
};

type PlannedWindow = {
  slug: string;
  title: string;
  description: string;
  prediction_type: "match_result" | "exact_score";
  status: "draft" | "open" | "locked";
  options: string[];
  opens_at: string;
  locks_at: string;
  points_result: number;
  points_exact: number;
  sort_order: number;
  fixture_api_id: number;
};

export type PredictionWindowGenerationResult = {
  dryRun: boolean;
  horizonHours: number;
  fixturesSeen: number;
  windowsPlanned: number;
  inserted: number;
  updated: number;
  opened: number;
  skipped: Array<{
    fixture_api_id?: number;
    slug?: string;
    reason: string;
  }>;
};

const HORIZON_HOURS = 72;

const BLOCKED_STATUSES = new Set([
  "FT",
  "AET",
  "PEN",
  "CANC",
  "PST",
  "ABD",
  "AWD",
  "WO",
]);

const PROTECTED_WINDOW_STATUSES = new Set([
  "locked",
  "settled",
  "archived",
  "void",
]);

function teamSlug(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isBlockedFixtureStatus(status: string | null | undefined) {
  return BLOCKED_STATUSES.has(String(status ?? "").toUpperCase());
}

function buildWindowStatus(matchDate: Date, opensAt: Date, now: Date) {
  if (now >= matchDate) {
    return "locked" as const;
  }

  if (now >= opensAt && now < matchDate) {
    return "open" as const;
  }

  return "draft" as const;
}

function buildPlannedWindows(
  fixture: Fixture,
  now: Date,
  horizonHours: number,
): PlannedWindow[] {
  if (!fixture.api_fixture_id || !fixture.match_date) {
    return [];
  }

  if (!fixture.home_team_name || !fixture.away_team_name) {
    return [];
  }

  if (isBlockedFixtureStatus(fixture.status_short)) {
    return [];
  }

  const matchDate = new Date(fixture.match_date);

  if (Number.isNaN(matchDate.getTime())) {
    return [];
  }

  const opensAt = new Date(matchDate.getTime() - horizonHours * 60 * 60 * 1000);
  const status = buildWindowStatus(matchDate, opensAt, now);
  const home = fixture.home_team_name;
  const away = fixture.away_team_name;
  const homeSlug = teamSlug(home);
  const awaySlug = teamSlug(away);
  const baseSlug = `${homeSlug}-vs-${awaySlug}-${fixture.api_fixture_id}`;
  const sortBase = Math.floor(matchDate.getTime() / 1000);
  const phase = detectTournamentPhase(fixture.round);
  const phaseLabel = phase.replace(/_/g, " ");
  const resultPoints = getMatchResultPoints(fixture.round);
  const exactPoints = getExactScorePoints(fixture.round);

  return [
    {
      slug: `${baseSlug}-result`,
      title: `${home} vs ${away} Result`,
      description: `Pick the match result for ${home} vs ${away}. ${phaseLabel} scoring.`,
      prediction_type: "match_result",
      status,
      options: [`${home} win`, "Draw", `${away} win`],
      opens_at: opensAt.toISOString(),
      locks_at: matchDate.toISOString(),
      points_result: resultPoints,
      points_exact: 0,
      sort_order: sortBase,
      fixture_api_id: fixture.api_fixture_id,
    },
    {
      slug: `${baseSlug}-exact-score`,
      title: `${home} vs ${away} Exact Score`,
      description: `Predict the exact score for ${home} vs ${away}.`,
      prediction_type: "exact_score",
      status,
      options: [],
      opens_at: opensAt.toISOString(),
      locks_at: matchDate.toISOString(),
      points_result: 0,
      points_exact: exactPoints,
      sort_order: sortBase + 1,
      fixture_api_id: fixture.api_fixture_id,
    },
  ];
}

function existingKey(window: ExistingWindow) {
  return `${window.fixture_api_id}:${window.prediction_type}`;
}

export async function runAutomatedPredictionWindowGeneration({
  dryRun = false,
  horizonHours = HORIZON_HOURS,
}: {
  dryRun?: boolean;
  horizonHours?: number;
} = {}): Promise<PredictionWindowGenerationResult> {
  const supabase = createSupabaseAdminClient();
  const now = new Date();

  const { data: fixtures, error: fixturesError } = await supabase
    .from("fixtures")
    .select(
      "api_fixture_id, home_team_name, away_team_name, match_date, status_short, round",
    )
    .eq("season", 2026)
    .not("api_fixture_id", "is", null)
    .not("match_date", "is", null)
    .order("match_date", { ascending: true })
    .limit(500);

  if (fixturesError) {
    throw new Error(`Could not load fixtures: ${fixturesError.message}`);
  }

  const typedFixtures = (fixtures ?? []) as Fixture[];
  const planned = typedFixtures.flatMap((fixture) =>
    buildPlannedWindows(fixture, now, horizonHours),
  );
  const slugs = planned.map((window) => window.slug);
  const fixtureIds = Array.from(
    new Set(planned.map((window) => window.fixture_api_id)),
  );

  const skipped: PredictionWindowGenerationResult["skipped"] = [];

  let existingWindows: ExistingWindow[] = [];

  if (slugs.length > 0 || fixtureIds.length > 0) {
    const bySlugPromise = slugs.length
      ? supabase
          .from("prediction_windows")
          .select("slug, status, fixture_api_id, prediction_type")
          .in("slug", slugs)
      : Promise.resolve({ data: [], error: null });

    const byFixturePromise = fixtureIds.length
      ? supabase
          .from("prediction_windows")
          .select("slug, status, fixture_api_id, prediction_type")
          .in("fixture_api_id", fixtureIds)
          .in("prediction_type", ["match_result", "exact_score"])
      : Promise.resolve({ data: [], error: null });

    const [bySlug, byFixture] = await Promise.all([bySlugPromise, byFixturePromise]);

    if (bySlug.error) {
      throw new Error(`Could not load existing windows: ${bySlug.error.message}`);
    }

    if (byFixture.error) {
      throw new Error(`Could not load linked windows: ${byFixture.error.message}`);
    }

    existingWindows = [
      ...((bySlug.data ?? []) as ExistingWindow[]),
      ...((byFixture.data ?? []) as ExistingWindow[]),
    ];
  }

  const existingBySlug = new Map<string, ExistingWindow>();
  const existingByFixtureType = new Map<string, ExistingWindow[]>();

  for (const window of existingWindows) {
    existingBySlug.set(window.slug, window);

    const key = existingKey(window);
    const current = existingByFixtureType.get(key) ?? [];
    current.push(window);
    existingByFixtureType.set(key, current);
  }

  let inserted = 0;
  let updated = 0;
  let opened = 0;

  for (const window of planned) {
    const existing = existingBySlug.get(window.slug);
    const linkedWindows =
      existingByFixtureType.get(`${window.fixture_api_id}:${window.prediction_type}`) ??
      [];

    const manualLinkedWindow = linkedWindows.find(
      (linked) => linked.slug !== window.slug,
    );

    if (manualLinkedWindow) {
      skipped.push({
        fixture_api_id: window.fixture_api_id,
        slug: window.slug,
        reason: `Manual linked window exists: ${manualLinkedWindow.slug}`,
      });
      continue;
    }

    if (existing && PROTECTED_WINDOW_STATUSES.has(existing.status)) {
      skipped.push({
        fixture_api_id: window.fixture_api_id,
        slug: window.slug,
        reason: `Window is protected: ${existing.status}`,
      });
      continue;
    }

    const nextStatus =
      existing?.status === "open" && window.status === "draft"
        ? "open"
        : window.status;

    const payload = {
      slug: window.slug,
      title: window.title,
      description: window.description,
      prediction_type: window.prediction_type,
      status: nextStatus,
      options: window.options,
      opens_at: window.opens_at,
      locks_at: window.locks_at,
      points_result: window.points_result,
      points_exact: window.points_exact,
      sort_order: window.sort_order,
      fixture_api_id: window.fixture_api_id,
      updated_at: new Date().toISOString(),
    };

    if (!existing) {
      inserted += 1;

      if (!dryRun) {
        const { error } = await supabase.from("prediction_windows").insert(payload);

        if (error) {
          throw new Error(`Could not insert ${window.slug}: ${error.message}`);
        }
      }

      if (nextStatus === "open") {
        opened += 1;
      }

      continue;
    }

    updated += 1;

    if (existing.status !== "open" && nextStatus === "open") {
      opened += 1;
    }

    if (!dryRun) {
      const { error } = await supabase
        .from("prediction_windows")
        .update(payload)
        .eq("slug", window.slug);

      if (error) {
        throw new Error(`Could not update ${window.slug}: ${error.message}`);
      }
    }
  }

  let tournamentWindows: TournamentWindowGenerationResult | null = null;

  try {
    tournamentWindows = await generateTournamentPredictionWindows({
      supabase,
      dryRun,
      now,
    });
    inserted += tournamentWindows.inserted;
    updated += tournamentWindows.updated;
    opened += tournamentWindows.opened;
    skipped.push(...tournamentWindows.skipped);
  } catch (error) {
    skipped.push({
      reason:
        error instanceof Error
          ? `Long-term window generation skipped: ${error.message}`
          : "Long-term window generation skipped.",
    });
  }

  return {
    dryRun,
    horizonHours,
    fixturesSeen: typedFixtures.length,
    windowsPlanned: planned.length + (tournamentWindows?.windowsPlanned ?? 0),
    inserted,
    updated,
    opened,
    skipped,
  };
}
