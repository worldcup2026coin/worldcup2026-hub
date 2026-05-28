export type BracketTeam = {
  id: string;
  apiTeamId: number;
  name: string;
  code: string | null;
  country: string | null;
  groupName: string;
};

export type BracketGroup = {
  name: string;
  teams: BracketTeam[];
};

export type GroupPick = {
  groupName: string;
  first: string;
  second: string;
  third: string;
  fourth?: string;
};

export type BracketMatch = {
  id: string;
  round: KnockoutRound;
  index: number;
  teamAId: string | null;
  teamBId: string | null;
  winnerId?: string | null;
};

export type KnockoutRound =
  | "round32"
  | "round16"
  | "quarterFinals"
  | "semiFinals"
  | "final";

export type BracketChallengeData = {
  version: 1;
  seedingModel: "fan";
  groupPicks: GroupPick[];
  bestThirdTeamIds: string[];
  round32Slots: Array<string | null>;
  picks: Record<KnockoutRound, Array<string | null>>;
  championTeamId: string;
  finalistTeamId: string | null;
  semiFinalistTeamIds: string[];
  darkHorseTeamId: string | null;
  generatedAt: string;
};

export type SavedBracketChallenge = {
  id: string;
  user_id: string | null;
  slug: string;
  display_name: string | null;
  title: string | null;
  champion_team_id: string;
  finalist_team_id: string | null;
  third_place_team_id: string | null;
  dark_horse_team_id: string | null;
  bracket_data: BracketChallengeData;
  is_public: boolean;
  status: "visible" | "hidden" | "deleted" | "flagged";
  created_at: string;
  updated_at: string;
};
