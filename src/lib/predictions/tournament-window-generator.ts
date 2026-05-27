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
  status: "open";
  options: string[];
  opens_at: string;
  locks_at: string;
  points_result: number;
  points_exact: number;
  sort_order: number;
  fixture_api_id: null;
  visibility: "active";
  display_group: "tournament" | "groups";
  settlement_strategy: "final_result" | "top_scorer" | "group_standings" | "manual_safe";
  max_points: number;
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

function getGroupLetter(value: string) {
  const match = value.match(/group\s+([a-l])/i) ?? value.match(/\b([a-l])\b/i);

  return match?.[1]?.toLowerCase() ?? slugify(value).replace(/^group-/, "");
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

function withMetadata(
  window: Omit<
    PlannedLongTermWindow,
    "status" | "visibility" | "points_exact" | "fixture_api_id" | "max_points"
  >,
): PlannedLongTermWindow {
  return {
    ...window,
    status: "open",
    visibility: "active",
    points_exact: 0,
    fixture_api_id: null,
    max_points: window.points_result,
  };
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
  const baseSort = Math.floor(tournamentKickoff.getTime() / 1000) - 100000;

  const windows: PlannedLongTermWindow[] = [
    withMetadata({
      slug: "tournament-winner",
      title: "Tournament winner",
      description: "Pick the team you think will become World Cup 2026 champion.",
      prediction_type: "tournament_winner",
      options: teamOptions,
      opens_at: opensAt,
      locks_at: tournamentLock,
      points_result: getTournamentPredictionPoints("tournament_winner"),
      sort_order: baseSort,
      display_group: "tournament",
      settlement_strategy: "final_result",
    }),
    withMetadata({
      slug: "runner-up",
      title: "Runner-up",
      description: "Pick the team you think will finish as runner-up.",
      prediction_type: "runner_up",
      options: teamOptions,
      opens_at: opensAt,
      locks_at: tournamentLock,
      points_result: getTournamentPredictionPoints("runner_up"),
      sort_order: baseSort + 1,
      display_group: "tournament",
      settlement_strategy: "final_result",
    }),
    withMetadata({
      slug: "golden-boot-winner",
      title: "Golden Boot winner",
      description: "Pick the player you think will finish as the tournament top scorer.",
      prediction_type: "golden_boot",
      options: [],
      opens_at: opensAt,
      locks_at: tournamentLock,
      points_result: getTournamentPredictionPoints("golden_boot"),
      sort_order: baseSort + 2,
      display_group: "tournament",
      settlement_strategy: "top_scorer",
    }),
    withMetadata({
      slug: "host-nation-furthest",
      title: "Host nation furthest",
      description: "Pick which host nation will go deepest in the tournament.",
      prediction_type: "host_nation_furthest",
      options: hostNationOptions(teams),
      opens_at: opensAt,
      locks_at: tournamentLock,
      points_result: getTournamentPredictionPoints("host_nation_furthest"),
      sort_order: baseSort + 3,
      display_group: "tournament",
      settlement_strategy: "manual_safe",
    }),
    withMetadata({
      slug: "dark-horse-pick",
      title: "Dark horse pick",
      description: "Pick a team you think can outperform expectations.",
      prediction_type: "dark_horse",
      options: teamOptions,
      opens_at: opensAt,
      locks_at: tournamentLock,
      points_result: getTournamentPredictionPoints("dark_horse"),
      sort_order: baseSort + 4,
      display_group: "tournament",
      settlement_strategy: "manual_safe",
    }),
  ];

  const groupNames = Array.from(
    new Set(standings.map((row) => row.group_name).filter(Boolean)),
  ).sort();

  for (const groupName of groupNames) {
    const groupTeams = standings
      .filter((row) => row.group_name === groupName)
      .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
      .map((row) => row.team_name);

    if (groupTeams.length === 0) {
      continue;
    }

    const groupKickoff = getGroupKickoff(fixtures, groupName, tournamentKickoff);
    const groupLetter = getGroupLetter(groupName);
    const groupSort = Math.floor(groupKickoff.getTime() / 1000) - 50000;

    windows.push(
      withMetadata({
        slug: `group-${groupLetter}-winner`,
        title: `${groupName} winner`,
        description: `Pick the team you think will finish first in ${groupName}.`,
        prediction_type: "group_winner",
        options: groupTeams,
        opens_at: opensAt,
        locks_at: groupKickoff.toISOString(),
        points_result: getGroupPredictionPoints("group_winner"),
        sort_order: groupSort,
        display_group: "groups",
        settlement_strategy: "group_standings",
      }),
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

    const payload = {
      ...window,
      updated_at: now.toISOString(),
    };

    if (!existing) {
      inserted += 1;
      opened += 1;

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
    if (existing.status !== "open") opened += 1;

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
