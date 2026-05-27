import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  EXACT_SCORE_RESULT_BONUS_ENABLED,
  EXACT_SCORE_RESULT_BONUS_POINTS,
  getExactScorePoints,
  getMatchResultPoints,
} from "@/lib/predictions/scoring";

type PredictionWindow = {
  id: string;
  slug: string;
  title: string;
  prediction_type: string;
  fixture_api_id: number | null;
  points_result: number;
  points_exact: number;
};

type Fixture = {
  api_fixture_id: number;
  round: string | null;
  group_name: string | null;
  home_team_name: string | null;
  away_team_name: string | null;
  status_short: string | null;
  home_goals: number | null;
  away_goals: number | null;
  ft_home_goals: number | null;
  ft_away_goals: number | null;
  winner_api_team_id: number | null;
};

type Standing = {
  group_name: string;
  team_name: string;
  rank: number | null;
  played: number | null;
};

type FanPrediction = {
  id: string;
  pick: string;
  exact_score: string | null;
};

type SettlementDecision = {
  correctPick: string;
  correctExactScore: string | null;
  isWinningPick: (prediction: FanPrediction) => boolean;
  pointsForWin: number;
  notes: string;
};

export type PredictionSettlementResult = {
  dryRun: boolean;
  settled: Array<{
    slug: string;
    fixture_api_id: number | null;
    correct_pick: string;
    correct_exact_score: string | null;
    predictions_settled: number;
  }>;
  skipped: Array<{
    slug: string;
    reason: string;
    fixture_api_id?: number | null;
    status_short?: string | null;
  }>;
};

function isFinalStatus(status: string | null | undefined) {
  return ["FT", "AET", "PEN"].includes(String(status ?? "").toUpperCase());
}

function isVoidStatus(status: string | null | undefined) {
  return ["CANC", "PST", "ABD", "AWD", "WO"].includes(
    String(status ?? "").toUpperCase(),
  );
}

function normalise(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseScore(value: string | null | undefined) {
  const match = String(value ?? "").match(/(\d+)\s*[-:]\s*(\d+)/);

  if (!match) {
    return null;
  }

  return {
    home: Number(match[1]),
    away: Number(match[2]),
  };
}

function getGoals(fixture: Fixture) {
  const home = fixture.home_goals ?? fixture.ft_home_goals;
  const away = fixture.away_goals ?? fixture.ft_away_goals;

  if (home === null || away === null) {
    return null;
  }

  return { home, away };
}

function getWinnerAndRunnerUp(
  fixture: Fixture,
  goals: { home: number; away: number },
) {
  if (goals.home > goals.away) {
    return {
      winner: fixture.home_team_name ?? "Home",
      runnerUp: fixture.away_team_name ?? "Away",
    };
  }

  if (goals.away > goals.home) {
    return {
      winner: fixture.away_team_name ?? "Away",
      runnerUp: fixture.home_team_name ?? "Home",
    };
  }

  return null;
}

function getCorrectResult(fixture: Fixture, goals: { home: number; away: number }) {
  const result = getWinnerAndRunnerUp(fixture, goals);

  if (!result) {
    return "Draw";
  }

  return `${result.winner} win`;
}

function getCorrectExactScore(
  fixture: Fixture,
  goals: { home: number; away: number },
) {
  return `${fixture.home_team_name ?? "Home"} ${goals.home}-${goals.away} ${
    fixture.away_team_name ?? "Away"
  }`;
}

function windowGroupSlug(window: PredictionWindow) {
  const match = window.slug.match(
    /^(?:group-winner|group-top-two|full-group-standings)-(.+)-2026$/,
  );

  return match?.[1] ?? null;
}

async function getFinalFixture(supabase: ReturnType<typeof createSupabaseAdminClient>) {
  const { data, error } = await supabase
    .from("fixtures")
    .select(
      "api_fixture_id, round, group_name, home_team_name, away_team_name, status_short, home_goals, away_goals, ft_home_goals, ft_away_goals, winner_api_team_id",
    )
    .eq("season", 2026)
    .ilike("round", "%final%")
    .order("match_date", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(`Could not load final fixture: ${error.message}`);
  }

  return ((data ?? []) as Fixture[]).find(
    (fixture) =>
      !String(fixture.round ?? "").toLowerCase().includes("semi") &&
      isFinalStatus(fixture.status_short),
  );
}

async function buildMatchDecision(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  window: PredictionWindow,
): Promise<SettlementDecision | { skip: string; status_short?: string | null }> {
  if (!window.fixture_api_id) {
    return { skip: "No fixture_api_id" };
  }

  const { data: fixture, error: fixtureError } = await supabase
    .from("fixtures")
    .select(
      "api_fixture_id, round, group_name, home_team_name, away_team_name, status_short, home_goals, away_goals, ft_home_goals, ft_away_goals, winner_api_team_id",
    )
    .eq("api_fixture_id", window.fixture_api_id)
    .maybeSingle();

  if (fixtureError || !fixture) {
    return { skip: fixtureError?.message ?? "Fixture not found" };
  }

  const typedFixture = fixture as Fixture;

  if (isVoidStatus(typedFixture.status_short)) {
    return {
      skip: "Fixture is void/cancelled and should be voided manually if needed",
      status_short: typedFixture.status_short,
    };
  }

  if (!isFinalStatus(typedFixture.status_short)) {
    return {
      skip: "Fixture not final",
      status_short: typedFixture.status_short,
    };
  }

  const goals = getGoals(typedFixture);

  if (!goals) {
    return {
      skip: "Final score missing",
      status_short: typedFixture.status_short,
    };
  }

  const correctPick = getCorrectResult(typedFixture, goals);
  const correctExactScore = getCorrectExactScore(typedFixture, goals);

  if (window.prediction_type === "match_result") {
    return {
      correctPick,
      correctExactScore,
      isWinningPick: (prediction) =>
        normalise(prediction.pick) === normalise(correctPick),
      pointsForWin: getMatchResultPoints(typedFixture.round),
      notes: `Auto-settled result from fixture ${window.fixture_api_id}`,
    };
  }

  return {
    correctPick,
    correctExactScore,
    isWinningPick: (prediction) => {
      const submittedScore = parseScore(prediction.exact_score ?? prediction.pick);

      return submittedScore?.home === goals.home && submittedScore?.away === goals.away;
    },
    pointsForWin:
      getExactScorePoints(typedFixture.round) +
      (EXACT_SCORE_RESULT_BONUS_ENABLED ? EXACT_SCORE_RESULT_BONUS_POINTS : 0),
    notes: `Auto-settled exact score from fixture ${window.fixture_api_id}`,
  };
}

async function buildGroupWinnerDecision(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  window: PredictionWindow,
): Promise<SettlementDecision | { skip: string }> {
  const targetSlug = windowGroupSlug(window);

  if (!targetSlug) {
    return { skip: "Group could not be read from window slug" };
  }

  const { data, error } = await supabase
    .from("standings")
    .select("group_name, team_name, rank, played")
    .eq("season", 2026);

  if (error) {
    return { skip: `Standings unavailable: ${error.message}` };
  }

  const groupRows = ((data ?? []) as Standing[])
    .filter((row) => slugify(row.group_name) === targetSlug)
    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));

  if (groupRows.length < 4 || groupRows.some((row) => (row.played ?? 0) < 3)) {
    return { skip: "Group standings are not final enough to settle safely" };
  }

  const winner = groupRows[0]?.team_name;

  if (!winner) {
    return { skip: "Group winner missing" };
  }

  return {
    correctPick: winner,
    correctExactScore: null,
    isWinningPick: (prediction) => normalise(prediction.pick) === normalise(winner),
    pointsForWin: window.points_result,
    notes: `Auto-settled from final ${groupRows[0].group_name} standings`,
  };
}

async function buildTournamentFinalDecision(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  window: PredictionWindow,
): Promise<SettlementDecision | { skip: string }> {
  const finalFixture = await getFinalFixture(supabase);

  if (!finalFixture) {
    return { skip: "Final fixture is not complete yet" };
  }

  const goals = getGoals(finalFixture);

  if (!goals) {
    return { skip: "Final score missing" };
  }

  const result = getWinnerAndRunnerUp(finalFixture, goals);

  if (!result) {
    return { skip: "Final winner missing" };
  }

  const correctPick =
    window.prediction_type === "tournament_runner_up"
      ? result.runnerUp
      : result.winner;

  return {
    correctPick,
    correctExactScore: null,
    isWinningPick: (prediction) =>
      normalise(prediction.pick) === normalise(correctPick),
    pointsForWin: window.points_result,
    notes: "Auto-settled from completed final fixture",
  };
}

async function buildGoldenBootDecision(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  window: PredictionWindow,
): Promise<SettlementDecision | { skip: string }> {
  const finalFixture = await getFinalFixture(supabase);

  if (!finalFixture) {
    return { skip: "Golden Boot waits until the final is complete" };
  }

  const { data, error } = await supabase
    .from("top_player_stats")
    .select("player_name, value_numeric")
    .eq("stat_type", "scorers")
    .eq("season", 2026)
    .order("value_numeric", { ascending: false })
    .limit(10);

  if (error) {
    return { skip: `Top scorer data unavailable: ${error.message}` };
  }

  const rows = (data ?? []) as Array<{
    player_name: string | null;
    value_numeric: number | null;
  }>;
  const topValue = rows[0]?.value_numeric;

  if (topValue === null || topValue === undefined) {
    return { skip: "Top scorer data is empty" };
  }

  const winners = rows
    .filter((row) => row.value_numeric === topValue && row.player_name)
    .map((row) => row.player_name as string);

  if (winners.length === 0) {
    return { skip: "Top scorer winner missing" };
  }

  return {
    correctPick: winners.join(" / "),
    correctExactScore: null,
    isWinningPick: (prediction) =>
      winners.some((winner) => normalise(winner) === normalise(prediction.pick)),
    pointsForWin: window.points_result,
    notes: "Auto-settled from synced top scorer table after the final",
  };
}

async function buildSettlementDecision(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  window: PredictionWindow,
): Promise<SettlementDecision | { skip: string; status_short?: string | null }> {
  if (window.prediction_type === "match_result" || window.prediction_type === "exact_score") {
    return buildMatchDecision(supabase, window);
  }

  if (window.prediction_type === "group_winner") {
    return buildGroupWinnerDecision(supabase, window);
  }

  if (
    window.prediction_type === "tournament_winner" ||
    window.prediction_type === "tournament_runner_up"
  ) {
    return buildTournamentFinalDecision(supabase, window);
  }

  if (window.prediction_type === "golden_boot_winner") {
    return buildGoldenBootDecision(supabase, window);
  }

  return {
    skip:
      "Settlement strategy is pending/manual-safe for this prediction type until reliable final data exists",
  };
}

export async function runAutomatedPredictionSettlement({
  dryRun = false,
}: {
  dryRun?: boolean;
} = {}): Promise<PredictionSettlementResult> {
  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();

  if (!dryRun) {
    const { error: lockError } = await supabase
      .from("prediction_windows")
      .update({ status: "locked", updated_at: now })
      .in("status", ["draft", "open"])
      .lt("locks_at", now);

    if (lockError) {
      throw new Error(`Could not lock expired windows: ${lockError.message}`);
    }
  }

  const { data: windows, error: windowsError } = await supabase
    .from("prediction_windows")
    .select(
      "id, slug, title, prediction_type, fixture_api_id, points_result, points_exact",
    )
    .in("status", ["open", "locked"])
    .order("sort_order");

  if (windowsError) {
    throw new Error(`Could not load prediction windows: ${windowsError.message}`);
  }

  const settled: PredictionSettlementResult["settled"] = [];
  const skipped: PredictionSettlementResult["skipped"] = [];

  for (const window of (windows ?? []) as PredictionWindow[]) {
    const decision = await buildSettlementDecision(supabase, window);

    if ("skip" in decision) {
      skipped.push({
        slug: window.slug,
        reason: decision.skip,
        fixture_api_id: window.fixture_api_id,
        status_short: decision.status_short,
      });
      continue;
    }

    const { data: predictions, error: predictionsError } = await supabase
      .from("fan_predictions")
      .select("id, pick, exact_score")
      .eq("window_id", window.id)
      .eq("result_status", "pending");

    if (predictionsError) {
      throw new Error(`Could not load fan predictions: ${predictionsError.message}`);
    }

    let settledCount = 0;

    for (const prediction of (predictions ?? []) as FanPrediction[]) {
      const won = decision.isWinningPick(prediction);
      const points = won ? decision.pointsForWin : 0;

      if (!dryRun) {
        const { error: updateError } = await supabase
          .from("fan_predictions")
          .update({
            points_awarded: points,
            result_status: won ? "won" : "lost",
            settled_at: now,
            updated_at: now,
          })
          .eq("id", prediction.id);

        if (updateError) {
          throw new Error(`Could not update fan prediction: ${updateError.message}`);
        }
      }

      settledCount += 1;
    }

    if (!dryRun) {
      const { error: windowError } = await supabase
        .from("prediction_windows")
        .update({
          status: "settled",
          correct_pick: decision.correctPick,
          correct_exact_score: decision.correctExactScore,
          settled_at: now,
          updated_at: now,
        })
        .eq("id", window.id);

      if (windowError) {
        throw new Error(`Could not update prediction window: ${windowError.message}`);
      }

      const { error: settlementError } = await supabase
        .from("prediction_settlements")
        .insert({
          window_id: window.id,
          settled_by: "auto-sync",
          correct_pick: decision.correctPick,
          correct_exact_score: decision.correctExactScore,
          notes: decision.notes,
        });

      if (settlementError) {
        throw new Error(`Could not write settlement record: ${settlementError.message}`);
      }
    }

    settled.push({
      slug: window.slug,
      fixture_api_id: window.fixture_api_id,
      correct_pick: decision.correctPick,
      correct_exact_score: decision.correctExactScore,
      predictions_settled: settledCount,
    });
  }

  return {
    dryRun,
    settled,
    skipped,
  };
}
