import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getGroupPredictionPoints,
  getTournamentPredictionPoints,
} from "@/lib/predictions/scoring";

type Team = {
  api_team_id: number;
  name: string;
  country: string | null;
};

type Standing = {
  group_name: string;
  api_team_id: number;
  team_name: string;
  rank: number | null;
};

type Fixture = {
  match_date: string | null;
  group_name: string | null;
  round: string | null;
};

type ExistingWindow = {
  slug: string;
  status: string;
};

type PlannedLongTermWindow = {
  slug: string;
  title: string;
  description: string;
  prediction_type: string;
  status: "draft" | "open" | "locked";
  options: string[];
  opens_at: string;
  locks_at: string;
  points_result: number;
  points_exact: number;
  sort_order: number;
  fixture_api_id: null;
};

export type TournamentWindowGenerationResult = {
  windowsPlanned: number;
  inserted: number;
  updated: number;
  opened: number;
  skipped: Array<{
    slug?: string;
    reason: string;
  }>;
};

const PROTECTED_WINDOW_STATUSES = new Set([
  "locked",
  "settled",
  "archived",
  "void",
]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function statusForWindow(lockAt: Date, now: Date): "draft" | "open" | "locked" {
  return now >= lockAt ? "locked" : "open";
}

function getTournamentKickoff(fixtures: Fixture[]) {
  const kickoff = fixtures
    .map((fixture) => fixture.match_date)
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value))
    .filter((date) => Number.isFinite(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  return kickoff ?? new Date(Date.UTC(2026, 5, 11, 0, 0, 0));
}

function getGroupKickoff(fixtures: Fixture[], groupName: string, fallback: Date) {
  const kickoff = fixtures
    .filter((fixture) => fixture.group_name === groupName)
    .map((fixture) => fixture.match_date)
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value))
    .filter((date) => Number.isFinite(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  return kickoff ?? fallback;
}

function buildTeamOptions(teams: Team[]) {
  return teams.map((team) => team.name).filter(Boolean).sort();
}

function hostNationOptions(teams: Team[]) {
  const hostCountries = new Set(["United States", "USA", "Mexico", "Canada"]);
  const options = teams
    .filter((team) => hostCountries.has(team.country ?? "") || hostCountries.has(team.name))
    .map((team) => team.name);

  return options.length ? options.sort() : ["United States", "Mexico", "Canada"];
}

function buildLongTermWindows(input: {
  teams: Team[];
  standings: Standing[];
  fixtures: Fixture[];
  now: Date;
}): PlannedLongTermWindow[] {
  const { teams, standings, fixtures, now } = input;
  const teamOptions = buildTeamOptions(teams);
  const tournamentKickoff = getTournamentKickoff(fixtures);
  const opensAt = now.toISOString();
  const tournamentLock = tournamentKickoff.toISOString();
  const tournamentStatus = statusForWindow(tournamentKickoff, now);
  const baseSort = Math.floor(tournamentKickoff.getTime() / 1000) - 100000;

  const windows: PlannedLongTermWindow[] = [
    {
      slug: "tournament-winner-2026",
      title: "Tournament winner",
      description: "Pick the team you think will become World Cup 2026 champion.",
      prediction_type: "tournament_winner",
      status: tournamentStatus,
      options: teamOptions,
      opens_at: opensAt,
      locks_at: tournamentLock,
      points_result: getTournamentPredictionPoints("tournament_winner"),
      points_exact: 0,
      sort_order: baseSort,
      fixture_api_id: null,
    },
    {
      slug: "tournament-runner-up-2026",
      title: "Runner-up",
      description: "Pick the team you think will finish as runner-up.",
      prediction_type: "tournament_runner_up",
      status: tournamentStatus,
      options: teamOptions,
      opens_at: opensAt,
      locks_at: tournamentLock,
      points_result: getTournamentPredictionPoints("tournament_runner_up"),
      points_exact: 0,
      sort_order: baseSort + 1,
      fixture_api_id: null,
    },
    {
      slug: "golden-boot-winner-2026",
      title: "Golden Boot winner",
      description: "Pick the player you think will finish as the tournament top scorer.",
      prediction_type: "golden_boot_winner",
      status: tournamentStatus,
      options: [],
      opens_at: opensAt,
      locks_at: tournamentLock,
      points_result: getTournamentPredictionPoints("golden_boot_winner"),
      points_exact: 0,
      sort_order: baseSort + 2,
      fixture_api_id: null,
    },
    {
      slug: "host-nation-furthest-2026",
      title: "Host nation furthest",
      description: "Pick which host nation will go deepest in the tournament.",
      prediction_type: "host_nation_furthest",
      status: tournamentStatus,
      options: hostNationOptions(teams),
      opens_at: opensAt,
      locks_at: tournamentLock,
      points_result: getTournamentPredictionPoints("host_nation_furthest"),
      points_exact: 0,
      sort_order: baseSort + 3,
      fixture_api_id: null,
    },
    {
      slug: "dark-horse-2026",
      title: "Dark horse pick",
      description: "Pick a team you think can outperform expectations.",
      prediction_type: "dark_horse",
      status: tournamentStatus,
      options: teamOptions,
      opens_at: opensAt,
      locks_at: tournamentLock,
      points_result: getTournamentPredictionPoints("dark_horse"),
      points_exact: 0,
      sort_order: baseSort + 4,
      fixture_api_id: null,
    },
    {
      slug: "best-third-placed-teams-2026",
      title: "Best third-placed teams",
      description: "Pick teams you think will advance through the third-place table.",
      prediction_type: "best_third_placed_teams",
      status: tournamentStatus,
      options: teamOptions,
      opens_at: opensAt,
      locks_at: tournamentLock,
      points_result: getTournamentPredictionPoints("best_third_placed_teams"),
      points_exact: 0,
      sort_order: baseSort + 5,
      fixture_api_id: null,
    },
  ];

  const groupNames = Array.from(
    new Set(standings.map((row) => row.group_name).filter(Boolean)),
  ).sort();

  for (const groupName of groupNames) {
    const groupTeams = standings
      .filter((row) => row.group_name === groupName)
      .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
      .map((row) => row.team_name);
    const groupKickoff = getGroupKickoff(fixtures, groupName, tournamentKickoff);
    const groupStatus = statusForWindow(groupKickoff, now);
    const groupSlug = slugify(groupName);
    const groupSort = Math.floor(groupKickoff.getTime() / 1000) - 50000;

    windows.push(
      {
        slug: `group-winner-${groupSlug}-2026`,
        title: `${groupName} winner`,
        description: `Pick the team you think will finish first in ${groupName}.`,
        prediction_type: "group_winner",
        status: groupStatus,
        options: groupTeams,
        opens_at: opensAt,
        locks_at: groupKickoff.toISOString(),
        points_result: getGroupPredictionPoints("group_winner"),
        points_exact: 0,
        sort_order: groupSort,
        fixture_api_id: null,
      },
      {
        slug: `group-top-two-${groupSlug}-2026`,
        title: `${groupName} top two`,
        description: `Pick the top two teams in ${groupName}, in order.`,
        prediction_type: "group_top_two",
        status: groupStatus,
        options: groupTeams,
        opens_at: opensAt,
        locks_at: groupKickoff.toISOString(),
        points_result: getGroupPredictionPoints("group_top_two"),
        points_exact: 0,
        sort_order: groupSort + 1,
        fixture_api_id: null,
      },
      {
        slug: `full-group-standings-${groupSlug}-2026`,
        title: `${groupName} full standings`,
        description: `Pick the full 1st to 4th order for ${groupName}.`,
        prediction_type: "full_group_standings",
        status: groupStatus,
        options: groupTeams,
        opens_at: opensAt,
        locks_at: groupKickoff.toISOString(),
        points_result: getGroupPredictionPoints("full_group_standings"),
        points_exact: 0,
        sort_order: groupSort + 2,
        fixture_api_id: null,
      },
    );
  }

  return windows;
}

export async function generateTournamentPredictionWindows({
  supabase,
  dryRun,
  now,
}: {
  supabase: SupabaseClient;
  dryRun: boolean;
  now: Date;
}): Promise<TournamentWindowGenerationResult> {
  const [{ data: teams }, { data: standings }, { data: fixtures }] = await Promise.all([
    supabase
      .from("teams")
      .select("api_team_id, name, country")
      .order("name", { ascending: true }),
    supabase
      .from("standings")
      .select("group_name, api_team_id, team_name, rank")
      .eq("season", 2026)
      .order("group_name", { ascending: true })
      .order("rank", { ascending: true }),
    supabase
      .from("fixtures")
      .select("match_date, group_name, round")
      .eq("season", 2026)
      .not("match_date", "is", null)
      .order("match_date", { ascending: true }),
  ]);

  const planned = buildLongTermWindows({
    teams: (teams ?? []) as Team[],
    standings: (standings ?? []) as Standing[],
    fixtures: (fixtures ?? []) as Fixture[],
    now,
  });

  const slugs = planned.map((window) => window.slug);
  const { data: existingRows, error } = slugs.length
    ? await supabase
        .from("prediction_windows")
        .select("slug, status")
        .in("slug", slugs)
    : { data: [], error: null };

  if (error) {
    throw new Error(`Could not load long-term prediction windows: ${error.message}`);
  }

  const existingBySlug = new Map(
    ((existingRows ?? []) as ExistingWindow[]).map((window) => [
      window.slug,
      window,
    ]),
  );

  let inserted = 0;
  let updated = 0;
  let opened = 0;
  const skipped: TournamentWindowGenerationResult["skipped"] = [];

  for (const window of planned) {
    const existing = existingBySlug.get(window.slug);

    if (existing && PROTECTED_WINDOW_STATUSES.has(existing.status)) {
      skipped.push({
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
      ...window,
      status: nextStatus,
      updated_at: now.toISOString(),
    };

    if (!existing) {
      inserted += 1;
      if (nextStatus === "open") opened += 1;

      if (!dryRun) {
        const { error: insertError } = await supabase
          .from("prediction_windows")
          .insert(payload);

        if (insertError) {
          throw new Error(`Could not insert ${window.slug}: ${insertError.message}`);
        }
      }

      continue;
    }

    updated += 1;
    if (existing.status !== "open" && nextStatus === "open") opened += 1;

    if (!dryRun) {
      const { error: updateError } = await supabase
        .from("prediction_windows")
        .update(payload)
        .eq("slug", window.slug);

      if (updateError) {
        throw new Error(`Could not update ${window.slug}: ${updateError.message}`);
      }
    }
  }

  return {
    windowsPlanned: planned.length,
    inserted,
    updated,
    opened,
    skipped,
  };
}
