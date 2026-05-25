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

export type ApiFootballPlayerItem = {
  player: {
    id: number;
    name: string;
    firstname: string | null;
    lastname: string | null;
    age: number | null;
    birth?: {
      date: string | null;
      place: string | null;
      country: string | null;
    };
    nationality: string | null;
    height: string | null;
    weight: string | null;
    injured: boolean | null;
    photo: string | null;
  };
  statistics?: Array<{
    team?: {
      id: number;
      name: string;
      logo: string | null;
    };
    games?: {
      appearences?: number | null;
      appearances?: number | null;
      lineups?: number | null;
      minutes?: number | null;
      number?: number | null;
      position?: string | null;
      rating?: string | null;
      captain?: boolean | null;
    };
  }>;
};

export type ApiFootballCoachItem = {
  id: number;
  name: string;
  firstname: string | null;
  lastname: string | null;
  age: number | null;
  birth?: {
    date: string | null;
    place: string | null;
    country: string | null;
  };
  nationality: string | null;
  height: string | null;
  weight: string | null;
  photo: string | null;
  team?: {
    id: number;
    name: string;
    logo: string | null;
  };
};

export async function fetchWorldCupPlayersPage(page: number) {
  return apiFootballGet<ApiFootballPlayerItem[]>("/players", {
    league: getWorldCupLeagueId(),
    season: getWorldCupSeason(),
    page,
  });
}

export async function fetchCoachByTeam(teamId: number) {
  return apiFootballGet<ApiFootballCoachItem[]>("/coachs", {
    team: teamId,
  });
}

export async function fetchWorldCupInjuries() {
  return apiFootballGet<unknown[]>("/injuries", {
    league: getWorldCupLeagueId(),
    season: getWorldCupSeason(),
  });
}

export async function fetchFixturePredictions(fixtureId: number) {
  return apiFootballGet<unknown[]>("/predictions", {
    fixture: fixtureId,
  });
}

export async function fetchFixtureOdds(fixtureId: number) {
  return apiFootballGet<unknown[]>("/odds", {
    fixture: fixtureId,
  });
}

export async function fetchFixtureHeadToHead(homeTeamId: number, awayTeamId: number) {
  return apiFootballGet<unknown[]>("/fixtures/headtohead", {
    h2h: `${homeTeamId}-${awayTeamId}`,
  });
}

export async function fetchWorldCupTopScorers() {
  return apiFootballGet<unknown[]>("/players/topscorers", {
    league: getWorldCupLeagueId(),
    season: getWorldCupSeason(),
  });
}

export async function fetchWorldCupTopAssists() {
  return apiFootballGet<unknown[]>("/players/topassists", {
    league: getWorldCupLeagueId(),
    season: getWorldCupSeason(),
  });
}

export async function fetchWorldCupTopYellowCards() {
  return apiFootballGet<unknown[]>("/players/topyellowcards", {
    league: getWorldCupLeagueId(),
    season: getWorldCupSeason(),
  });
}

export async function fetchWorldCupTopRedCards() {
  return apiFootballGet<unknown[]>("/players/topredcards", {
    league: getWorldCupLeagueId(),
    season: getWorldCupSeason(),
  });
}
