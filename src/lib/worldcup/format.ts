import { hostCities } from "@/lib/data/venues";

export type FixtureDisplayStatus =
  | "upcoming"
  | "live"
  | "finished"
  | "postponed"
  | "cancelled"
  | "unknown";

const liveStatuses = new Set(["1H", "HT", "2H", "ET", "BT", "P", "LIVE"]);
const finishedStatuses = new Set(["FT", "AET", "PEN"]);
const postponedStatuses = new Set(["PST", "SUSP", "INT"]);
const cancelledStatuses = new Set(["CANC", "ABD", "AWD", "WO"]);

export function getFixtureDisplayStatus(
  statusShort: string | null | undefined
): FixtureDisplayStatus {
  const status = statusShort?.toUpperCase();

  if (!status) {
    return "unknown";
  }

  if (liveStatuses.has(status)) {
    return "live";
  }

  if (finishedStatuses.has(status)) {
    return "finished";
  }

  if (postponedStatuses.has(status)) {
    return "postponed";
  }

  if (cancelledStatuses.has(status)) {
    return "cancelled";
  }

  if (status === "NS" || status === "TBD") {
    return "upcoming";
  }

  return "unknown";
}

export function isLiveFixture(statusShort: string | null | undefined) {
  return getFixtureDisplayStatus(statusShort) === "live";
}

export function isFinishedFixture(statusShort: string | null | undefined) {
  return getFixtureDisplayStatus(statusShort) === "finished";
}

export function isUpcomingFixture(statusShort: string | null | undefined) {
  return getFixtureDisplayStatus(statusShort) === "upcoming";
}

export function formatDateTime(
  value: string | null | undefined,
  timeZone = "Europe/Dublin",
  options: { includeTimeZoneName?: boolean; locale?: string } = {}
) {
  if (!value) {
    return "Date TBC";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date TBC";
  }

  return new Intl.DateTimeFormat(options.locale ?? "en-IE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
    timeZoneName: options.includeTimeZoneName ? "short" : undefined,
  }).format(date);
}

function normalise(value: string | null | undefined) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getFixtureHostCity(input: {
  venue_name?: string | null;
  venue_city?: string | null;
}) {
  const venueCity = normalise(input.venue_city);
  const venueName = normalise(input.venue_name);

  return (
    hostCities.find((city) => normalise(city.city) === venueCity) ??
    hostCities.find((city) => venueCity.includes(normalise(city.city))) ??
    hostCities.find((city) => venueName.includes(normalise(city.stadium))) ??
    null
  );
}

export function getFixtureVenueTimeZone(input: {
  venue_name?: string | null;
  venue_city?: string | null;
  timezone?: string | null;
}) {
  return getFixtureHostCity(input)?.timezone ?? input.timezone ?? null;
}

export function formatVenueDateTime(input: {
  match_date?: string | null;
  venue_name?: string | null;
  venue_city?: string | null;
  timezone?: string | null;
}) {
  const timeZone = getFixtureVenueTimeZone(input);

  if (!timeZone) {
    return "Venue time TBC";
  }

  return formatDateTime(input.match_date, timeZone, {
    includeTimeZoneName: true,
  });
}

export function formatDateOnly(value: string | null | undefined) {
  if (!value) {
    return "Date TBC";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date TBC";
  }

  return new Intl.DateTimeFormat("en-IE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Dublin",
  }).format(date);
}

export function getDateInputValue(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

export function formatLastUpdated(value: string | null | undefined) {
  if (!value) {
    return "Last updated not available";
  }

  return formatDateTime(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function teamSlug(name: string, apiTeamId: number) {
  return `${slugify(name)}-${apiTeamId}`;
}

export function getTeamIdFromSlug(slug: string) {
  const match = slug.match(/-(\d+)$/);

  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);

  return Number.isFinite(parsed) ? parsed : null;
}

export function fixtureSlug(input: {
  api_fixture_id: number;
  match_date?: string | null;
  home_team_name?: string | null;
  away_team_name?: string | null;
}) {
  const datePart = input.match_date?.slice(0, 10) || "date-tbc";
  const homePart = slugify(input.home_team_name || "home-tbc");
  const awayPart = slugify(input.away_team_name || "away-tbc");

  return `${datePart}-${homePart}-vs-${awayPart}-${input.api_fixture_id}`;
}

export function getFixtureIdFromSlug(slug: string) {
  const match = slug.match(/-(\d+)$/);

  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);

  return Number.isFinite(parsed) ? parsed : null;
}
