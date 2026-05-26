const flagByCode: Record<string, string> = {
  ARG: "🇦🇷",
  AUS: "🇦🇺",
  AUT: "🇦🇹",
  BEL: "🇧🇪",
  BIH: "🇧🇦",
  BRA: "🇧🇷",
  CAN: "🇨🇦",
  COL: "🇨🇴",
  CRO: "🇭🇷",
  CZE: "🇨🇿",
  ECU: "🇪🇨",
  EGY: "🇪🇬",
  ENG: "🏴",
  FRA: "🇫🇷",
  GER: "🇩🇪",
  GHA: "🇬🇭",
  IRN: "🇮🇷",
  JPN: "🇯🇵",
  KOR: "🇰🇷",
  MEX: "🇲🇽",
  MAR: "🇲🇦",
  NED: "🇳🇱",
  NZL: "🇳🇿",
  POR: "🇵🇹",
  QAT: "🇶🇦",
  KSA: "🇸🇦",
  SEN: "🇸🇳",
  ESP: "🇪🇸",
  SUI: "🇨🇭",
  TUN: "🇹🇳",
  UKR: "🇺🇦",
  USA: "🇺🇸",
  URU: "🇺🇾",
};

const flagByName: Record<string, string> = {
  algeria: "🇩🇿",
  argentina: "🇦🇷",
  australia: "🇦🇺",
  austria: "🇦🇹",
  belgium: "🇧🇪",
  "bosnia herzegovina": "🇧🇦",
  brazil: "🇧🇷",
  canada: "🇨🇦",
  "cape verde islands": "🇨🇻",
  "cape verde": "🇨🇻",
  colombia: "🇨🇴",
  "congo dr": "🇨🇩",
  croatia: "🇭🇷",
  curacao: "🇨🇼",
  "czech republic": "🇨🇿",
  ecuador: "🇪🇨",
  egypt: "🇪🇬",
  england: "🏴",
  france: "🇫🇷",
  germany: "🇩🇪",
  ghana: "🇬🇭",
  iran: "🇮🇷",
  japan: "🇯🇵",
  jordan: "🇯🇴",
  "korea republic": "🇰🇷",
  mexico: "🇲🇽",
  morocco: "🇲🇦",
  netherlands: "🇳🇱",
  "new zealand": "🇳🇿",
  norway: "🇳🇴",
  panama: "🇵🇦",
  paraguay: "🇵🇾",
  portugal: "🇵🇹",
  qatar: "🇶🇦",
  "saudi arabia": "🇸🇦",
  scotland: "🏴",
  senegal: "🇸🇳",
  serbia: "🇷🇸",
  "south africa": "🇿🇦",
  spain: "🇪🇸",
  switzerland: "🇨🇭",
  tunisia: "🇹🇳",
  ukraine: "🇺🇦",
  "united states": "🇺🇸",
  usa: "🇺🇸",
  uruguay: "🇺🇾",
  wales: "🏴",
};

function normalize(value: string | null | undefined) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getTeamFlag(input: {
  code?: string | null;
  name?: string | null;
  country?: string | null;
}) {
  const code = String(input.code ?? "").toUpperCase();

  return (
    flagByCode[code] ??
    flagByName[normalize(input.name)] ??
    flagByName[normalize(input.country)] ??
    "🏳️"
  );
}
