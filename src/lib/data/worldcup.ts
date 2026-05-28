import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatPublicVenueName } from "@/lib/venue-labels";
import {
  fixtureSlug,
  getFixtureDisplayStatus,
  getFixtureIdFromSlug,
  getTeamIdFromSlug,
} from "@/lib/worldcup/format";

export type Team = {
  id: string;
  api_team_id: number;
  name: string;
  code: string | null;
  country: string | null;
  founded: number | null;
  national: boolean;
  logo_url: string | null;
  raw: unknown;
  created_at: string;
  updated_at: string;
};

export type Fixture = {
  id: string;
  api_fixture_id: number;
  api_league_id: number;
  season: number;
  round: string | null;
  group_name: string | null;
  match_date: string | null;
  api_timestamp: number | null;
  timezone: string | null;
  referee: string | null;

  venue_api_id: number | null;
  venue_name: string | null;
  venue_city: string | null;

  home_team_api_id: number | null;
  away_team_api_id: number | null;
  home_team_name: string | null;
  away_team_name: string | null;
  home_team_logo_url: string | null;
  away_team_logo_url: string | null;

  status_long: string | null;
  status_short: string | null;
  elapsed: number | null;
  extra: number | null;

  home_goals: number | null;
  away_goals: number | null;
  ht_home_goals: number | null;
  ht_away_goals: number | null;
  ft_home_goals: number | null;
  ft_away_goals: number | null;
  et_home_goals: number | null;
  et_away_goals: number | null;
  pen_home_goals: number | null;
  pen_away_goals: number | null;

  winner_api_team_id: number | null;
  raw: unknown;
  created_at: string;
  updated_at: string;
};

export type Standing = {
  id: string;
  api_league_id: number;
  season: number;
  group_name: string;
  api_team_id: number;
  team_name: string;
  team_logo_url: string | null;
  rank: number | null;
  points: number | null;
  goals_diff: number | null;
  form: string | null;
  status: string | null;
  description: string | null;
  played: number | null;
  wins: number | null;
  draws: number | null;
  losses: number | null;
  goals_for: number | null;
  goals_against: number | null;
  api_updated_at: string | null;
  raw: unknown;
  created_at: string;
  updated_at: string;
};

export type TeamSquadPlayer = {
  id: string;
  api_team_id: number;
  api_player_id: number;
  season: number;
  player_name: string | null;
  team_name: string | null;
  position: string | null;
  number: number | null;
  appearances: number | null;
  lineups: number | null;
  minutes: number | null;
  rating: string | null;
  captain: boolean | null;
  last_synced_at: string | null;
};

export type Coach = {
  id: string;
  api_coach_id: number;
  api_team_id: number | null;
  name: string | null;
  firstname: string | null;
  lastname: string | null;
  age: number | null;
  nationality: string | null;
  photo_url: string | null;
  team_name: string | null;
  last_synced_at: string | null;
};

export type SyncLog = {
  id: string;
  scope: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  duration_ms: number | null;
  request_count: number;
  records_received: number;
  records_upserted: number;
  error_message: string | null;
};

export type FixtureFilters = {
  date?: string;
  team?: string;
  group?: string;
  status?: string;
  venue?: string;
  q?: string;
};

function asTeams(data: unknown): Team[] {
  return (data ?? []) as Team[];
}

function asFixtures(data: unknown): Fixture[] {
  return (data ?? []) as Fixture[];
}

function asStandings(data: unknown): Standing[] {
  return (data ?? []) as Standing[];
}

function asSyncLogs(data: unknown): SyncLog[] {
  return (data ?? []) as SyncLog[];
}

function asTeamSquadPlayers(data: unknown): TeamSquadPlayer[] {
  return (data ?? []) as TeamSquadPlayer[];
}

function asCoaches(data: unknown): Coach[] {
  return (data ?? []) as Coach[];
}

export async function getTeams() {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("teams")
    .select(
      "id, api_team_id, name, code, country, founded, national, logo_url, raw, created_at, updated_at"
    )
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load teams: ${error.message}`);
  }

  return asTeams(data);
}

export async function getFixtures() {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("fixtures")
    .select(
      [
        "id",
        "api_fixture_id",
        "api_league_id",
        "season",
        "round",
        "group_name",
        "match_date",
        "api_timestamp",
        "timezone",
        "referee",
        "venue_api_id",
        "venue_name",
        "venue_city",
        "home_team_api_id",
        "away_team_api_id",
        "home_team_name",
        "away_team_name",
        "home_team_logo_url",
        "away_team_logo_url",
        "status_long",
        "status_short",
        "elapsed",
        "extra",
        "home_goals",
        "away_goals",
        "ht_home_goals",
        "ht_away_goals",
        "ft_home_goals",
        "ft_away_goals",
        "et_home_goals",
        "et_away_goals",
        "pen_home_goals",
        "pen_away_goals",
        "winner_api_team_id",
        "raw",
        "created_at",
        "updated_at",
      ].join(", ")
    )
    .order("match_date", { ascending: true });

  if (error) {
    throw new Error(`Failed to load fixtures: ${error.message}`);
  }

  return asFixtures(data);
}

export async function getStandings() {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("standings")
    .select(
      [
        "id",
        "api_league_id",
        "season",
        "group_name",
        "api_team_id",
        "team_name",
        "team_logo_url",
        "rank",
        "points",
        "goals_diff",
        "form",
        "status",
        "description",
        "played",
        "wins",
        "draws",
        "losses",
        "goals_for",
        "goals_against",
        "api_updated_at",
        "raw",
        "created_at",
        "updated_at",
      ].join(", ")
    )
    .order("group_name", { ascending: true })
    .order("rank", { ascending: true });

  if (error) {
    throw new Error(`Failed to load standings: ${error.message}`);
  }

  return asStandings(data);
}

export async function getLatestSyncLogs(limit = 10) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("api_sync_logs")
    .select(
      "id, scope, status, started_at, ended_at, duration_ms, request_count, records_received, records_upserted, error_message"
    )
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load sync logs: ${error.message}`);
  }

  return asSyncLogs(data);
}

export async function getLastSuccessfulSync(scope?: string) {
  const supabase = createSupabaseAdminClient();

  let query = supabase
    .from("api_sync_logs")
    .select(
      "id, scope, status, started_at, ended_at, duration_ms, request_count, records_received, records_upserted, error_message"
    )
    .eq("status", "success")
    .order("ended_at", { ascending: false })
    .limit(1);

  if (scope) {
    query = query.eq("scope", scope);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load latest successful sync: ${error.message}`);
  }

  return asSyncLogs(data)[0] ?? null;
}

export async function getFixturesPageData() {
  const [fixtures, teams, standings, latestSync] = await Promise.all([
    getFixtures(),
    getTeams(),
    getStandings(),
    getLastSuccessfulSync("fixtures"),
  ]);

  return {
    fixtures,
    teams,
    standings,
    latestSync,
  };
}

export async function getLivePageData() {
  const [fixtures, latestSync] = await Promise.all([
    getFixtures(),
    getLastSuccessfulSync("fixtures"),
  ]);

  const liveFixtures = fixtures.filter((fixture) =>
    ["live"].includes(getFixtureDisplayStatus(fixture.status_short))
  );

  const now = Date.now();

  const upcomingFixtures = fixtures
    .filter((fixture) => {
      if (!fixture.match_date) {
        return false;
      }

      const matchTime = new Date(fixture.match_date).getTime();

      return (
        Number.isFinite(matchTime) &&
        matchTime >= now &&
        getFixtureDisplayStatus(fixture.status_short) === "upcoming"
      );
    })
    .slice(0, 8);

  return {
    liveFixtures,
    upcomingFixtures,
    latestSync,
  };
}

export async function getGroupsPageData() {
  const [standings, latestSync] = await Promise.all([
    getStandings(),
    getLastSuccessfulSync("standings"),
  ]);

  return {
    standings,
    latestSync,
  };
}

export async function getTeamsPageData() {
  const [teams, standings, fixtures, latestSync] = await Promise.all([
    getTeams(),
    getStandings(),
    getFixtures(),
    getLastSuccessfulSync("teams"),
  ]);

  return {
    teams,
    standings,
    fixtures,
    latestSync,
  };
}

export async function getTeamSquad(apiTeamId: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("team_squad_players")
    .select(
      [
        "id",
        "api_team_id",
        "api_player_id",
        "season",
        "player_name",
        "team_name",
        "position",
        "number",
        "appearances",
        "lineups",
        "minutes",
        "rating",
        "captain",
        "last_synced_at",
      ].join(", ")
    )
    .eq("api_team_id", apiTeamId)
    .order("position", { ascending: true })
    .order("player_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load team squad: ${error.message}`);
  }

  return asTeamSquadPlayers(data);
}

export async function getTeamCoaches(apiTeamId: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("coaches")
    .select(
      [
        "id",
        "api_coach_id",
        "api_team_id",
        "name",
        "firstname",
        "lastname",
        "age",
        "nationality",
        "photo_url",
        "team_name",
        "last_synced_at",
      ].join(", ")
    )
    .eq("api_team_id", apiTeamId)
    .order("last_synced_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load team coaches: ${error.message}`);
  }

  return asCoaches(data);
}

export function groupSquadByPosition(squad: TeamSquadPlayer[]) {
  const groups: Record<string, TeamSquadPlayer[]> = {
    Goalkeepers: [],
    Defenders: [],
    Midfielders: [],
    Forwards: [],
    Other: [],
  };

  for (const player of squad) {
    const position = player.position?.toLowerCase() ?? "";

    if (position.includes("goalkeeper")) {
      groups.Goalkeepers.push(player);
    } else if (position.includes("defender")) {
      groups.Defenders.push(player);
    } else if (position.includes("midfielder")) {
      groups.Midfielders.push(player);
    } else if (
      position.includes("attacker") ||
      position.includes("forward")
    ) {
      groups.Forwards.push(player);
    } else {
      groups.Other.push(player);
    }
  }

  return Object.fromEntries(
    Object.entries(groups).filter(([, players]) => players.length > 0)
  ) as Record<string, TeamSquadPlayer[]>;
}

export async function getTeamPageData(slug: string) {
  const apiTeamId = getTeamIdFromSlug(slug);

  if (!apiTeamId) {
    return null;
  }

  const supabase = createSupabaseAdminClient();

  const [{ data: teamData, error: teamError }, fixtures, standings, squad, coaches] =
    await Promise.all([
      supabase
        .from("teams")
        .select(
          "id, api_team_id, name, code, country, founded, national, logo_url, raw, created_at, updated_at"
        )
        .eq("api_team_id", apiTeamId)
        .maybeSingle(),
      getFixtures(),
      getStandings(),
      getTeamSquad(apiTeamId),
      getTeamCoaches(apiTeamId),
    ]);

  if (teamError) {
    throw new Error(`Failed to load team: ${teamError.message}`);
  }

  if (!teamData) {
    return null;
  }

  const team = teamData as Team;

  const teamFixtures = fixtures.filter(
    (fixture) =>
      fixture.home_team_api_id === apiTeamId ||
      fixture.away_team_api_id === apiTeamId
  );

  const standing = standings.find((row) => row.api_team_id === apiTeamId) ?? null;

  const groupStandings = standing
    ? standings.filter((row) => row.group_name === standing.group_name)
    : [];

  return {
    team,
    fixtures: teamFixtures,
    results: teamFixtures.filter(
      (fixture) => getFixtureDisplayStatus(fixture.status_short) === "finished"
    ),
    upcomingFixtures: teamFixtures.filter(
      (fixture) => getFixtureDisplayStatus(fixture.status_short) === "upcoming"
    ),
    standing,
    groupStandings,
    squad,
    coaches,
  };
}

export function getFixtureFilterOptions(fixtures: Fixture[], teams: Team[]) {
  const dates = Array.from(
    new Set(
      fixtures
        .map((fixture) => fixture.match_date?.slice(0, 10))
        .filter((value): value is string => Boolean(value))
    )
  ).sort();

  const groups = Array.from(
    new Set(
      fixtures
        .map((fixture) => fixture.group_name)
        .filter((value): value is string => Boolean(value))
    )
  ).sort();

  const venues = Array.from(
    new Set(
      fixtures
        .map((fixture) =>
          fixture.venue_name ? formatPublicVenueName(fixture.venue_name) : null,
        )
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort();

  return {
    dates,
    teams,
    groups,
    venues,
  };
}

export function filterFixtures(fixtures: Fixture[], filters: FixtureFilters) {
  return fixtures.filter((fixture) => {
    if (filters.q) {
      const query = filters.q.trim().toLowerCase();
      const haystack = [
        fixture.home_team_name,
        fixture.away_team_name,
        fixture.venue_name,
        fixture.venue_city,
        fixture.group_name,
        fixture.round,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (query && !haystack.includes(query)) {
        return false;
      }
    }

    if (filters.date && fixture.match_date?.slice(0, 10) !== filters.date) {
      return false;
    }

    if (filters.team) {
      const teamId = Number(filters.team);

      if (
        fixture.home_team_api_id !== teamId &&
        fixture.away_team_api_id !== teamId
      ) {
        return false;
      }
    }

    if (filters.group && fixture.group_name !== filters.group) {
      return false;
    }

    if (
      filters.status &&
      getFixtureDisplayStatus(fixture.status_short) !== filters.status
    ) {
      return false;
    }

    if (
      filters.venue &&
      formatPublicVenueName(fixture.venue_name) !== filters.venue
    ) {
      return false;
    }

    return true;
  });
}

export function groupStandingsByGroup(standings: Standing[]) {
  return standings.reduce<Record<string, Standing[]>>((groups, row) => {
    const key = row.group_name || "Ungrouped";

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(row);

    return groups;
  }, {});
}

export function getTeamGroupMap(standings: Standing[]) {
  const map = new Map<number, Standing>();

  for (const row of standings) {
    map.set(row.api_team_id, row);
  }

  return map;
}

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

function asMatchEvents(data: unknown): MatchEvent[] {
  return (data ?? []) as MatchEvent[];
}

function asMatchStatistics(data: unknown): MatchStatistic[] {
  return (data ?? []) as MatchStatistic[];
}

function asMatchLineups(data: unknown): MatchLineup[] {
  return (data ?? []) as MatchLineup[];
}

function isMissingOptionalMatchTableError(error: { code?: string; message?: string }) {
  const message = error.message ?? "";

  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    message.includes("does not exist") ||
    message.includes("Could not find the table")
  );
}

export async function getMatchBySlug(slug: string) {
  const apiFixtureId = getFixtureIdFromSlug(slug);

  if (!apiFixtureId) {
    return null;
  }

  const fixtures = await getFixtures();
  const fixture = fixtures.find(
    (row) => row.api_fixture_id === apiFixtureId
  );

  if (!fixture) {
    return null;
  }

  const canonicalSlug = fixtureSlug({
    api_fixture_id: fixture.api_fixture_id,
    match_date: fixture.match_date,
    home_team_name: fixture.home_team_name,
    away_team_name: fixture.away_team_name,
  });

  return {
    fixture,
    canonicalSlug,
  };
}

export async function getMatchEvents(apiFixtureId: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("match_events")
    .select(
      [
        "id",
        "fixture_id",
        "api_fixture_id",
        "api_event_key",
        "elapsed",
        "extra",
        "team_api_id",
        "team_name",
        "team_logo_url",
        "player_api_id",
        "player_name",
        "assist_api_id",
        "assist_name",
        "event_type",
        "event_detail",
        "comments",
        "raw",
        "created_at",
        "updated_at",
      ].join(", ")
    )
    .eq("api_fixture_id", apiFixtureId)
    .order("elapsed", { ascending: true })
    .order("extra", { ascending: true });

  if (error) {
    if (isMissingOptionalMatchTableError(error)) {
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
    .select(
      [
        "id",
        "fixture_id",
        "api_fixture_id",
        "team_api_id",
        "team_name",
        "team_logo_url",
        "stat_type",
        "stat_value",
        "raw",
        "created_at",
        "updated_at",
      ].join(", ")
    )
    .eq("api_fixture_id", apiFixtureId)
    .order("stat_type", { ascending: true });

  if (error) {
    if (isMissingOptionalMatchTableError(error)) {
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
    .select(
      [
        "id",
        "fixture_id",
        "api_fixture_id",
        "team_api_id",
        "team_name",
        "team_logo_url",
        "coach_name",
        "formation",
        "starting_xi",
        "substitutes",
        "raw",
        "created_at",
        "updated_at",
      ].join(", ")
    )
    .eq("api_fixture_id", apiFixtureId)
    .order("team_name", { ascending: true });

  if (error) {
    if (isMissingOptionalMatchTableError(error)) {
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
