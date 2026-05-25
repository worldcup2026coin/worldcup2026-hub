import "server-only";

import {
  apiFootballGet,
  getWorldCupLeagueId,
  getWorldCupSeason,
} from "./client";

export type ApiFootballFixtureItem = {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods?: {
      first: number | null;
      second: number | null;
    };
    venue?: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
      extra: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string | null;
    flag: string | null;
    season: number;
    round: string;
    standings?: boolean;
  };
  teams: {
    home: {
      id: number | null;
      name: string | null;
      logo: string | null;
      winner: boolean | null;
    };
    away: {
      id: number | null;
      name: string | null;
      logo: string | null;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime?: {
      home: number | null;
      away: number | null;
    };
    fulltime?: {
      home: number | null;
      away: number | null;
    };
    extratime?: {
      home: number | null;
      away: number | null;
    };
    penalty?: {
      home: number | null;
      away: number | null;
    };
  };
  events?: unknown[];
  lineups?: unknown[];
  statistics?: unknown[];
  players?: unknown[];
};

export async function fetchWorldCupFixtures() {
  return apiFootballGet<ApiFootballFixtureItem[]>("/fixtures", {
    league: getWorldCupLeagueId(),
    season: getWorldCupSeason(),
  });
}

export async function fetchWorldCupFixtureDetailsByIds(apiFixtureIds: number[]) {
  return apiFootballGet<ApiFootballFixtureItem[]>("/fixtures", {
    ids: apiFixtureIds.join("-"),
  });
}

export type ApiFootballTeamItem = {
  team: {
    id: number;
    name: string;
    code: string | null;
    country: string | null;
    founded: number | null;
    national: boolean | null;
    logo: string | null;
  };
  venue?: {
    id: number | null;
    name: string | null;
    address?: string | null;
    city: string | null;
    capacity: number | null;
    surface: string | null;
    image: string | null;
  };
};

export type ApiFootballStandingRow = {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string | null;
  };
  points: number | null;
  goalsDiff: number | null;
  group: string | null;
  form: string | null;
  status: string | null;
  description: string | null;
  all: {
    played: number | null;
    win: number | null;
    draw: number | null;
    lose: number | null;
    goals: {
      for: number | null;
      against: number | null;
    };
  };
};

export type ApiFootballStandingsItem = {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string | null;
    flag: string | null;
    season: number;
    standings: ApiFootballStandingRow[][];
  };
};

export type ApiFootballLeagueItem = {
  league: {
    id: number;
    name: string;
    type?: string;
    logo: string | null;
  };
  country: {
    name: string;
    code?: string | null;
    flag?: string | null;
  };
  seasons: Array<{
    year: number;
    current: boolean;
    coverage?: Record<string, unknown>;
  }>;
};

export async function fetchWorldCupTeams() {
  return apiFootballGet<ApiFootballTeamItem[]>("/teams", {
    league: getWorldCupLeagueId(),
    season: getWorldCupSeason(),
  });
}

export async function fetchWorldCupStandings() {
  return apiFootballGet<ApiFootballStandingsItem[]>("/standings", {
    league: getWorldCupLeagueId(),
    season: getWorldCupSeason(),
  });
}

export async function fetchWorldCupRounds() {
  return apiFootballGet<string[]>("/fixtures/rounds", {
    league: getWorldCupLeagueId(),
    season: getWorldCupSeason(),
  });
}

export async function fetchWorldCupLeagueMetadata() {
  return apiFootballGet<ApiFootballLeagueItem[]>("/leagues", {
    id: getWorldCupLeagueId(),
    season: getWorldCupSeason(),
  });
}
