export type PredictionHubItem = {
  title: string;
  summary: string;
  status: "ready" | "pending";
};

export const groupPredictionSlots: PredictionHubItem[] = [
  {
    title: "Group winners",
    summary: "Upload group winner calls once the AI read is final.",
    status: "pending",
  },
  {
    title: "Qualifier routes",
    summary: "Track top-two and best third-place qualification calls.",
    status: "pending",
  },
  {
    title: "Group danger spots",
    summary: "Flag the groups where goal difference and late fixtures matter most.",
    status: "pending",
  },
];

export const tournamentOutrightSlots: PredictionHubItem[] = [
  {
    title: "Winner pick",
    summary: "Main tournament winner read.",
    status: "pending",
  },
  {
    title: "Finalists",
    summary: "Two-team final projection space.",
    status: "pending",
  },
  {
    title: "Semi-finalists",
    summary: "Four-team late-tournament projection space.",
    status: "pending",
  },
];

export const darkHorseWatch: PredictionHubItem[] = [
  {
    title: "Breakout team",
    summary: "A team with enough structure, draw path or upside to upset the bracket.",
    status: "pending",
  },
  {
    title: "Underrated squad",
    summary: "A team whose player pool may be stronger than casual expectation.",
    status: "pending",
  },
];

export const upsetWatch: PredictionHubItem[] = [
  {
    title: "Opening-week upset",
    summary: "A match where venue, travel, pressure or style clash could tilt the read.",
    status: "pending",
  },
  {
    title: "Group-stage shock",
    summary: "A future slot for a favourite-at-risk call.",
    status: "pending",
  },
];

export const predictionRecordRows = [
  ["Match reads", "0", "0", "No completed matches yet"],
  ["Group calls", "0", "0", "Tracking starts when groups begin"],
  ["Tournament outrights", "0", "0", "Settles after knockout rounds"],
];
