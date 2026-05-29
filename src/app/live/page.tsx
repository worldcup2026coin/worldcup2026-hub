import Link from "next/link";
import { EmptyState } from "@/components/worldcup/empty-state";
import { FixtureCard } from "@/components/worldcup/fixture-card";
import { PageHeader } from "@/components/worldcup/page-header";
import { Container } from "@/components/ui/container";
import { getLivePageData } from "@/lib/data/worldcup";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Live Scores",
  description: "World Cup 2026 live scores from Supabase.",
};

export default async function LivePage() {
  const { liveFixtures, upcomingFixtures } = await getLivePageData();

  return (
    <>
      <PageHeader
        eyebrow="Live"
        title="Live scores centre"
        description="Live match status will appear here from Supabase once the fixtures sync marks matches as in play. Provider records refresh as tournament data updates."
        meta="Fixture records refresh as provider data updates."
      />

      <Container className="pb-14">
        {liveFixtures.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">
                Live right now
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                These fixtures are currently marked as live in the database.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {liveFixtures.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          </>
        ) : upcomingFixtures.length > 0 ? (
          <>
            <EmptyState
              title="No live matches right now"
              description="There are no fixtures currently marked as live. Here are the next upcoming fixtures from the synced fixtures table."
              action={
                <Link
                  href="/fixtures"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-400 px-5 text-sm font-black text-slate-950"
                >
                  View all fixtures
                </Link>
              }
            />

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {upcomingFixtures.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="No live or upcoming fixtures available"
            description="The fixtures table may be empty or all available fixtures may be missing dates. Provider records refresh as tournament data updates."
          />
        )}
      </Container>
    </>
  );
}
