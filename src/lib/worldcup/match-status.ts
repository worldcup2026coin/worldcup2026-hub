export type MatchStatusKind =
  | "not_started"
  | "live"
  | "half_time"
  | "finished"
  | "extra_time"
  | "penalties"
  | "postponed"
  | "cancelled"
  | "unknown";

export type MatchStatusInfo = {
  kind: MatchStatusKind;
  label: string;
  showScore: boolean;
};

export function getMatchStatusInfo(
  statusShort: string | null | undefined,
  statusLong?: string | null
): MatchStatusInfo {
  const status = statusShort?.toUpperCase();

  if (!status) {
    return {
      kind: "unknown",
      label: statusLong || "Status unknown",
      showScore: false,
    };
  }

  if (status === "NS") {
    return {
      kind: "not_started",
      label: "Not started",
      showScore: false,
    };
  }

  if (status === "1H") {
    return {
      kind: "live",
      label: "Live · 1st half",
      showScore: true,
    };
  }

  if (status === "HT") {
    return {
      kind: "half_time",
      label: "Half-time",
      showScore: true,
    };
  }

  if (status === "2H") {
    return {
      kind: "live",
      label: "Live · 2nd half",
      showScore: true,
    };
  }

  if (status === "ET") {
    return {
      kind: "extra_time",
      label: "Extra time",
      showScore: true,
    };
  }

  if (status === "BT") {
    return {
      kind: "extra_time",
      label: "Extra-time break",
      showScore: true,
    };
  }

  if (status === "P") {
    return {
      kind: "penalties",
      label: "Penalties",
      showScore: true,
    };
  }

  if (status === "FT") {
    return {
      kind: "finished",
      label: "Finished",
      showScore: true,
    };
  }

  if (status === "AET") {
    return {
      kind: "finished",
      label: "Finished after extra time",
      showScore: true,
    };
  }

  if (status === "PEN") {
    return {
      kind: "penalties",
      label: "Finished on penalties",
      showScore: true,
    };
  }

  if (status === "PST") {
    return {
      kind: "postponed",
      label: "Postponed",
      showScore: false,
    };
  }

  if (["CANC", "ABD", "AWD", "WO"].includes(status)) {
    return {
      kind: "cancelled",
      label: statusLong || "Cancelled",
      showScore: false,
    };
  }

  if (["SUSP", "INT"].includes(status)) {
    return {
      kind: "postponed",
      label: statusLong || "Interrupted",
      showScore: true,
    };
  }

  if (status === "TBD") {
    return {
      kind: "unknown",
      label: "Time TBC",
      showScore: false,
    };
  }

  return {
    kind: "unknown",
    label: statusLong || status,
    showScore: false,
  };
}
