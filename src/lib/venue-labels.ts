const aztecaNames = ["estadio azteca", "estadio banorte"];

export const MEXICO_CITY_AZTECA_LABEL = "Mexico City Stadium / Estadio Azteca";

export function formatPublicVenueName(value: string | null | undefined) {
  if (!value) return null;

  const normalised = value.toLowerCase().trim();
  if (aztecaNames.some((name) => normalised.includes(name))) {
    return MEXICO_CITY_AZTECA_LABEL;
  }

  return value;
}

export function venueNamingHelper(value: string | null | undefined) {
  if (!value) return null;

  const normalised = value.toLowerCase().trim();
  if (normalised.includes("estadio banorte")) {
    return "Also known locally by current naming rights.";
  }

  return null;
}
