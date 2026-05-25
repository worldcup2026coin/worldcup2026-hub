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
