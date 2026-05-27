export type TournamentPhase =
  | "group"
  | "round_of_32"
  | "round_of_16"
  | "quarter_final"
  | "semi_final"
  | "final"
  | "unknown";

export const EXACT_SCORE_RESULT_BONUS_ENABLED = false;
export const EXACT_SCORE_RESULT_BONUS_POINTS = 3;

export const MATCH_RESULT_POINTS: Record<TournamentPhase, number> = {
  group: 3,
  round_of_32: 5,
  round_of_16: 7,
  quarter_final: 10,
  semi_final: 15,
  final: 25,
  unknown: 3,
};

export const EXACT_SCORE_POINTS: Record<TournamentPhase, number> = {
  group: 8,
  round_of_32: 12,
  round_of_16: 15,
  quarter_final: 20,
  semi_final: 30,
  final: 50,
  unknown: 8,
};

export const GROUP_PREDICTION_POINTS = {
  winner: 10,
  topTwo: 20,
  fullStandings: 40,
  perfectGroupBonus: 15,
};

export const TOURNAMENT_PREDICTION_POINTS = {
  champion: 60,
  runnerUp: 30,
  semiFinalistEach: 15,
  semiFinalistMax: 60,
  quarterFinalistEach: 8,
  quarterFinalistMax: 64,
  goldenBoot: 40,
  hostNationFurthest: 30,
  bestThirdPlacedTeam: 10,
  darkHorse: 20,
  mostCleanSheets: 25,
  totalGoalsOverUnder: 20,
  finalPenaltyShootout: 20,
  goldenGlove: 30,
};

export const PREDICTION_TYPE_LABELS: Record<string, string> = {
  match_result: "Match result",
  exact_score: "Exact score",
  tournament_winner: "Tournament winner",
  tournament_runner_up: "Runner-up",
  semi_finalists: "Semi-finalists",
  quarter_finalists: "Quarter-finalists",
  golden_boot_winner: "Golden Boot",
  host_nation_furthest: "Host nation furthest",
  dark_horse: "Dark horse",
  group_winner: "Group winner",
  group_top_two: "Group top two",
  full_group_standings: "Full group standings",
  best_third_placed_teams: "Best third-placed teams",
  most_clean_sheets: "Most clean sheets",
  total_tournament_goals: "Total tournament goals",
  final_penalty_shootout: "Final shootout",
  golden_glove_winner: "Golden Glove",
};

export function detectTournamentPhase(round: string | null | undefined): TournamentPhase {
  const normalised = String(round ?? "").toLowerCase();

  if (normalised.includes("final") && !normalised.includes("semi")) {
    return "final";
  }

  if (normalised.includes("semi")) {
    return "semi_final";
  }

  if (normalised.includes("quarter")) {
    return "quarter_final";
  }

  if (normalised.includes("round of 16") || normalised.includes("last 16")) {
    return "round_of_16";
  }

  if (normalised.includes("round of 32") || normalised.includes("last 32")) {
    return "round_of_32";
  }

  if (normalised.includes("group")) {
    return "group";
  }

  return "unknown";
}

export function getMatchResultPoints(round: string | null | undefined) {
  return MATCH_RESULT_POINTS[detectTournamentPhase(round)];
}

export function getExactScorePoints(round: string | null | undefined) {
  return EXACT_SCORE_POINTS[detectTournamentPhase(round)];
}

export function getTournamentPredictionPoints(type: string) {
  if (type === "tournament_winner") return TOURNAMENT_PREDICTION_POINTS.champion;
  if (type === "tournament_runner_up") return TOURNAMENT_PREDICTION_POINTS.runnerUp;
  if (type === "semi_finalists") return TOURNAMENT_PREDICTION_POINTS.semiFinalistMax;
  if (type === "quarter_finalists") return TOURNAMENT_PREDICTION_POINTS.quarterFinalistMax;
  if (type === "golden_boot_winner") return TOURNAMENT_PREDICTION_POINTS.goldenBoot;
  if (type === "host_nation_furthest") return TOURNAMENT_PREDICTION_POINTS.hostNationFurthest;
  if (type === "dark_horse") return TOURNAMENT_PREDICTION_POINTS.darkHorse;
  if (type === "best_third_placed_teams") return TOURNAMENT_PREDICTION_POINTS.bestThirdPlacedTeam;
  if (type === "most_clean_sheets") return TOURNAMENT_PREDICTION_POINTS.mostCleanSheets;
  if (type === "total_tournament_goals") return TOURNAMENT_PREDICTION_POINTS.totalGoalsOverUnder;
  if (type === "final_penalty_shootout") return TOURNAMENT_PREDICTION_POINTS.finalPenaltyShootout;
  if (type === "golden_glove_winner") return TOURNAMENT_PREDICTION_POINTS.goldenGlove;

  return 0;
}

export function getGroupPredictionPoints(type: string) {
  if (type === "group_winner") return GROUP_PREDICTION_POINTS.winner;
  if (type === "group_top_two") return GROUP_PREDICTION_POINTS.topTwo;
  if (type === "full_group_standings") {
    return GROUP_PREDICTION_POINTS.fullStandings + GROUP_PREDICTION_POINTS.perfectGroupBonus;
  }

  return 0;
}
