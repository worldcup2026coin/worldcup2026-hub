import "server-only";

import { createClient } from "@supabase/supabase-js";

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
  home_team_name: string | null;
  away_team_name: string | null;
  status_short: string | null;
  home_goals: number | null;
  away_goals: number | null;
  ft_home_goals: number | null;
  ft_away_goals: number | null;
};

type FanPrediction = {
  id: string;
  pick: string;
  exact_score: string | null;
};

export type PredictionSettlementResult = {
  dryRun: boolean;
  settled: Array<{
    slug: string;
    fixture_api_id: number;
    correct_pick: string;
    correct_exact_score: string;
    predictions_settled: number;
  }>;
  skipped: Array<{
    slug: string;
    reason: string;
    fixture_api_id?: number | null;
    status_short?: string | null;
  }>;
};

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function isFinalStatus(status: string | null | undefined) {
  return ["FT", "AET", "PEN"].includes(String(status ?? "").toUpperCase());
}

function normalise(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
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

function getCorrectResult(fixture: Fixture, goals: { home: number; away: number }) {
  if (goals.home > goals.away) {
    return `${fixture.home_team_name ?? "Home"} win`;
  }

  if (goals.away > goals.home) {
    return `${fixture.away_team_name ?? "Away"} win`;
  }

  return "Draw";
}

function getCorrectExactScore(
  fixture: Fixture,
  goals: { home: number; away: number },
) {
  return `${fixture.home_team_name ?? "Home"} ${goals.home}-${goals.away} ${
    fixture.away_team_name ?? "Away"
  }`;
}

export async function runAutomatedPredictionSettlement({
  dryRun = false,
}: {
  dryRun?: boolean;
} = {}): Promise<PredictionSettlementResult> {
  const supabase = getAdminClient();
  const now = new Date().toISOString();

  if (!dryRun) {
    const { error: lockError } = await supabase
      .from("prediction_windows")
      .update({ status: "locked", updated_at: now })
      .eq("status", "open")
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
    .in("prediction_type", ["match_result", "exact_score"])
    .in("status", ["open", "locked"])
    .not("fixture_api_id", "is", null)
    .order("sort_order");

  if (windowsError) {
    throw new Error(`Could not load prediction windows: ${windowsError.message}`);
  }

  const settled: PredictionSettlementResult["settled"] = [];
  const skipped: PredictionSettlementResult["skipped"] = [];

  for (const window of (windows ?? []) as PredictionWindow[]) {
    if (!window.fixture_api_id) {
      skipped.push({ slug: window.slug, reason: "No fixture_api_id" });
      continue;
    }

    const { data: fixture, error: fixtureError } = await supabase
      .from("fixtures")
      .select(
        "api_fixture_id, home_team_name, away_team_name, status_short, home_goals, away_goals, ft_home_goals, ft_away_goals",
      )
      .eq("api_fixture_id", window.fixture_api_id)
      .maybeSingle();

    if (fixtureError || !fixture) {
      skipped.push({
        slug: window.slug,
        reason: fixtureError?.message ?? "Fixture not found",
        fixture_api_id: window.fixture_api_id,
      });
      continue;
    }

    const typedFixture = fixture as Fixture;

    if (!isFinalStatus(typedFixture.status_short)) {
      skipped.push({
        slug: window.slug,
        reason: "Fixture not final",
        fixture_api_id: window.fixture_api_id,
        status_short: typedFixture.status_short,
      });
      continue;
    }

    const goals = getGoals(typedFixture);

    if (!goals) {
      skipped.push({
        slug: window.slug,
        reason: "Final score missing",
        fixture_api_id: window.fixture_api_id,
        status_short: typedFixture.status_short,
      });
      continue;
    }

    const correctPick = getCorrectResult(typedFixture, goals);
    const correctExactScore = getCorrectExactScore(typedFixture, goals);

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
      let won = false;
      let points = 0;

      if (window.prediction_type === "match_result") {
        won = normalise(prediction.pick) === normalise(correctPick);
        points = won ? window.points_result : 0;
      }

      if (window.prediction_type === "exact_score") {
        const submittedScore = parseScore(prediction.exact_score ?? prediction.pick);
        won =
          submittedScore?.home === goals.home && submittedScore?.away === goals.away;
        points = won ? window.points_exact : 0;
      }

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
          correct_pick: correctPick,
          correct_exact_score: correctExactScore,
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
          correct_pick: correctPick,
          correct_exact_score: correctExactScore,
          notes: `Auto-settled from fixture ${window.fixture_api_id}`,
        });

      if (settlementError) {
        throw new Error(`Could not write settlement record: ${settlementError.message}`);
      }
    }

    settled.push({
      slug: window.slug,
      fixture_api_id: window.fixture_api_id,
      correct_pick: correctPick,
      correct_exact_score: correctExactScore,
      predictions_settled: settledCount,
    });
  }

  return {
    dryRun,
    settled,
    skipped,
  };
}
