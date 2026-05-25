import { getFixturesPageData } from "@/lib/data/worldcup";

export const OPENING_FIXTURE_FALLBACK_UTC = "2026-06-11T21:00:00Z";

function isValidDate(value: string | null | undefined) {
  if (!value) return false;
  return Number.isFinite(new Date(value).getTime());
}

function normaliseTeamName(value: string | null | undefined) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isMexicoSouthAfricaFixture(fixture: {
  home_team_name?: string | null;
  away_team_name?: string | null;
  match_date?: string | null;
}) {
  const home = normaliseTeamName(fixture.home_team_name);
  const away = normaliseTeamName(fixture.away_team_name);

  const isOpeningPair =
    (home.includes("mexico") && away.includes("south africa")) ||
    (home.includes("south africa") && away.includes("mexico"));

  if (!isOpeningPair) return false;

  if (!fixture.match_date) return true;

  return fixture.match_date.startsWith("2026-06-11");
}

export async function getOpeningFixtureCountdownTarget() {
  try {
    const { fixtures } = await getFixturesPageData();
    const openingFixture = fixtures.find(isMexicoSouthAfricaFixture);

    const kickoff =
      (openingFixture as { kickoff_at?: string | null } | undefined)
        ?.kickoff_at ??
      openingFixture?.match_date ??
      null;

    if (isValidDate(kickoff)) {
      return new Date(kickoff as string).toISOString();
    }
  } catch {
    // Keep the homepage resilient if Supabase is unavailable during rendering.
  }

  return OPENING_FIXTURE_FALLBACK_UTC;
}
