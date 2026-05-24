export type ApiFootballErrors =
  | string[]
  | Record<string, string | string[]>
  | null;

export type ApiFootballEnvelope<T> = {
  get: string;
  parameters: Record<string, string>;
  errors: ApiFootballErrors;
  results: number;
  paging?: {
    current: number;
    total: number;
  };
  response: T[];
};

export type ApiFootballPagedResult<T> = {
  response: T[];
  requestCount: number;
  firstEnvelope: ApiFootballEnvelope<T>;
};

export type ApiFootballVenue = {
  id: number | null;
  name: string | null;
  address?: string | null;
  city: string | null;
  capacity?: number | null;
  surface?: string | null;
  image?: string | null;
};

export type ApiFootballTeamItem = {
  team: {
    id: number;
    name: string;
    code: string | null;
    country: string | null;
    founded: number | null;
    national: boolean;
    logo: string | null;
  };
  venue: ApiFootballVenue | null;
};

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
    venue: ApiFootballVenue;
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
    country: string | null;
    logo: string | null;
    flag: string | null;
    season: number;
    round: string | null;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string | null;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string | null;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
};

export type ApiFootballStandingStats = {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: {
    for: number;
    against: number;
  };
};

export type ApiFootballStandingRow = {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string | null;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string | null;
  status: string | null;
  description: string | null;
  all: ApiFootballStandingStats;
  home: ApiFootballStandingStats;
  away: ApiFootballStandingStats;
  update: string | null;
};

export type ApiFootballStandingsItem = {
  league: {
    id: number;
    name: string;
    country: string | null;
    logo: string | null;
    flag: string | null;
    season: number;
    standings: ApiFootballStandingRow[][];
  };
};
