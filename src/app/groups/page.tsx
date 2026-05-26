import { EmptyState } from "@/components/worldcup/empty-state";
import { PageHeader } from "@/components/worldcup/page-header";
import { StandingsTable } from "@/components/worldcup/standings-table";
import { Container } from "@/components/ui/container";
import { FormatExplainerPanel } from "@/components/worldcup/authority-panels";
import { FixtureCard } from "@/components/worldcup/fixture-card";
import {
  getFixtures,
  getGroupsPageData,
  groupStandingsByGroup,
} from "@/lib/data/worldcup";
import { formatLastUpdated, getFixtureDisplayStatus } from "@/lib/worldcup/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Groups",
  description: "World Cup 2026 groups and standings from Supabase.",
};

export default async function GroupsPage() {
  const [{ standings, latestSync }, fixtures] = await Promise.all([
    getGroupsPageData(),
    getFixtures(),
  ]);
  const groupedStandings = groupStandingsByGroup(standings);
  const groupNames = Object.keys(groupedStandings).sort();

  return (
    <>
      <PageHeader
        eyebrow="Groups"
        title="Groups and standings"
        description="Synced group standings with qualification routes, best-third-place pressure, key fixtures and group storylines."
        meta={`Last standings sync: ${formatLastUpdated(latestSync?.ended_at)}`}
      />

      <Container className="pb-14">
        <FormatExplainerPanel />

        {standings.length === 0 ? (
          <EmptyState
            title="No standings synced yet"
            description="The standings table is empty. Run the standings sync when API-Football has group data available, then this page will populate automatically."
          />
        ) : (
          <div className="mt-8 grid gap-8">
            {groupNames.map((groupName) => {
              const groupRows = groupedStandings[groupName];
              const groupFixtures = fixtures
                .filter((fixture) => fixture.group_name === groupName)
                .filter(
                  (fixture) =>
                    getFixtureDisplayStatus(fixture.status_short) === "upcoming"
                )
                .slice(0, 3);
              const leader = groupRows.find((row) => row.rank === 1);
              const third = groupRows.find((row) => row.rank === 3);

              return (
                <section
                  key={groupName}
                  className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 lg:grid-cols-[1.15fr_0.85fr]"
                >
                  <StandingsTable groupName={groupName} rows={groupRows} />

                  <div className="grid content-start gap-4">
                    <article className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                      <p className="neon-kicker">Group storyline</p>
                      <h3 className="mt-3 text-2xl font-black uppercase text-white">
                        {leader?.team_name ?? groupName} set the pace
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        Top two spots send teams straight through.{" "}
                        {third
                          ? `${third.team_name} are the third-place marker right now, so every goal difference swing can matter.`
                          : "The third-place cut line will become clearer once every group has played."}
                      </p>
                    </article>

                    <article className="rounded-3xl border border-lime-300/20 bg-lime-300/10 p-5">
                      <p className="neon-kicker">Qualification impact</p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        Rank 1-2: automatic Round of 32 route. Rank 3: compared
                        against third-placed teams from the other 11 groups.
                        Rank 4: needs results to move up before the group closes.
                      </p>
                    </article>

                    <div className="grid gap-4">
                      <h3 className="text-xl font-black uppercase text-white">
                        Key fixtures
                      </h3>
                      {groupFixtures.length > 0 ? (
                        groupFixtures.map((fixture) => (
                          <FixtureCard key={fixture.id} fixture={fixture} />
                        ))
                      ) : (
                        <EmptyState
                          title="Key fixtures updating"
                          description="Upcoming fixtures for this group will appear here once fixture data is available."
                        />
                      )}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
}
