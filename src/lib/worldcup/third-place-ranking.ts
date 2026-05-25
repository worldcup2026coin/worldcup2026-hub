import type { Standing } from "@/lib/data/worldcup";

export type ThirdPlaceStatus = "qualifying" | "eliminated" | "pending";

export type ThirdPlacedTeam = Standing & {
  third_place_rank: number;
  third_place_status: ThirdPlaceStatus;
  team_conduct_score: number | null;
  fifa_ranking: number | null;
  explanation: string;
};

function numberOrNull(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function readOptionalNumber(row: Standing, key: string) {
  const record = row as unknown as Record<string, unknown>;
  const direct = numberOrNull(record[key]);

  if (direct !== null) return direct;

  const raw = row.raw as Record<string, unknown> | null;

  if (raw && typeof raw === "object") {
    return numberOrNull(raw[key]);
  }

  return null;
}

function normaliseGroupName(value: string | null | undefined) {
  return value || "Group unknown";
}

function baseSort(a: Standing, b: Standing) {
  const aRank = a.rank ?? 999;
  const bRank = b.rank ?? 999;

  if (aRank !== bRank) return aRank - bRank;

  const pointsDiff = (b.points ?? 0) - (a.points ?? 0);
  if (pointsDiff !== 0) return pointsDiff;

  const gdDiff = (b.goals_diff ?? 0) - (a.goals_diff ?? 0);
  if (gdDiff !== 0) return gdDiff;

  const gfDiff = (b.goals_for ?? 0) - (a.goals_for ?? 0);
  if (gfDiff !== 0) return gfDiff;

  return a.team_name.localeCompare(b.team_name);
}

export function getThirdPlacedTeamsFromStandings(
  standings: Standing[]
): ThirdPlacedTeam[] {
  const grouped = standings.reduce<Record<string, Standing[]>>((groups, row) => {
    const groupName = normaliseGroupName(row.group_name);

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    groups[groupName].push(row);
    return groups;
  }, {});

  const thirdPlaced = Object.values(grouped)
    .map((rows) => [...rows].sort(baseSort)[2])
    .filter((row): row is Standing => Boolean(row));

  return sortThirdPlacedTeams(
    thirdPlaced.map((row) => ({
      ...row,
      third_place_rank: 0,
      third_place_status: "pending",
      team_conduct_score: readOptionalNumber(row, "team_conduct_score"),
      fifa_ranking: readOptionalNumber(row, "fifa_ranking"),
      explanation: "",
    }))
  );
}

function compareNumberDesc(a: number | null, b: number | null) {
  if (a === null || b === null || a === b) return null;
  return b - a;
}

function compareNumberAsc(a: number | null, b: number | null) {
  if (a === null || b === null || a === b) return null;
  return a - b;
}

export function sortThirdPlacedTeams(rows: ThirdPlacedTeam[]) {
  const sorted = [...rows].sort((a, b) => {
    const pointsDiff = (b.points ?? 0) - (a.points ?? 0);
    if (pointsDiff !== 0) return pointsDiff;

    const gdDiff = (b.goals_diff ?? 0) - (a.goals_diff ?? 0);
    if (gdDiff !== 0) return gdDiff;

    const gfDiff = (b.goals_for ?? 0) - (a.goals_for ?? 0);
    if (gfDiff !== 0) return gfDiff;

    const conductDiff = compareNumberDesc(
      a.team_conduct_score,
      b.team_conduct_score
    );
    if (conductDiff !== null) return conductDiff;

    const rankingDiff = compareNumberAsc(a.fifa_ranking, b.fifa_ranking);
    if (rankingDiff !== null) return rankingDiff;

    return a.team_name.localeCompare(b.team_name);
  });

  return sorted.map((row, index) => {
    const rank = index + 1;
    const status = getThirdPlaceStatus(rank, sorted.length, row.played ?? 0);

    return {
      ...row,
      third_place_rank: rank,
      third_place_status: status,
      explanation: formatThirdPlaceExplanation(rank, status, row),
    };
  });
}

export function getThirdPlaceStatus(
  rank: number,
  totalThirdPlacedTeams: number,
  played: number
): ThirdPlaceStatus {
  if (totalThirdPlacedTeams < 12 || played === 0) {
    return "pending";
  }

  return rank <= 8 ? "qualifying" : "eliminated";
}

export function formatThirdPlaceExplanation(
  rank: number,
  status: ThirdPlaceStatus,
  row: ThirdPlacedTeam
) {
  if (status === "pending") {
    return "Pending until more group standings data is available.";
  }

  if (rank <= 6) {
    return "Currently qualifying with room above the cut line.";
  }

  if (rank <= 8) {
    return "Currently qualifying, but still on the cut-line watch.";
  }

  if ((row.points ?? 0) === 0) {
    return "Needs points and results elsewhere.";
  }

  if ((row.goals_diff ?? 0) < 0) {
    return "Needs points or a goal difference swing.";
  }

  return "Currently outside the cut and needs results elsewhere.";
}
