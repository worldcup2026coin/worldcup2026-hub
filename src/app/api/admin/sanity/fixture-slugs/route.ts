import { NextRequest, NextResponse } from "next/server";
import { getFixtures } from "@/lib/data/worldcup";
import { fixtureSlug, getFixtureIdFromSlug } from "@/lib/worldcup/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(request: NextRequest): boolean {
  const expectedSecret = process.env.SYNC_SECRET;
  const providedSecret = request.headers.get("x-sync-secret");

  return Boolean(
    expectedSecret &&
      providedSecret &&
      providedSecret.trim() === expectedSecret.trim()
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        status: "error",
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const fixtures = await getFixtures();

  const slugRows = fixtures.map((fixture) => {
    const slug = fixtureSlug({
      api_fixture_id: fixture.api_fixture_id,
      match_date: fixture.match_date,
      home_team_name: fixture.home_team_name,
      away_team_name: fixture.away_team_name,
    });

    const parsedFixtureId = getFixtureIdFromSlug(slug);

    return {
      api_fixture_id: fixture.api_fixture_id,
      slug,
      parsedFixtureId,
      isValid:
        Boolean(slug) &&
        parsedFixtureId === fixture.api_fixture_id &&
        fixture.api_fixture_id > 0,
      home_team_name: fixture.home_team_name,
      away_team_name: fixture.away_team_name,
      match_date: fixture.match_date,
    };
  });

  const slugCounts = new Map<string, number>();

  for (const row of slugRows) {
    slugCounts.set(row.slug, (slugCounts.get(row.slug) ?? 0) + 1);
  }

  const invalidRows = slugRows.filter((row) => !row.isValid);
  const duplicateRows = slugRows.filter((row) => {
    return (slugCounts.get(row.slug) ?? 0) > 1;
  });

  const pass = invalidRows.length === 0 && duplicateRows.length === 0;

  return NextResponse.json({
    status: "ok",
    pass,
    counts: {
      fixtures: fixtures.length,
      validSlugs: slugRows.length - invalidRows.length,
      invalidSlugs: invalidRows.length,
      duplicateSlugs: duplicateRows.length,
      uniqueSlugs: new Set(slugRows.map((row) => row.slug)).size,
    },
    sample: slugRows.slice(0, 5),
    invalidRows,
    duplicateRows,
  });
}