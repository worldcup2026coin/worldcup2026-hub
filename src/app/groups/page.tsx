import { EmptyState } from "@/components/worldcup/empty-state";
import { PageHeader } from "@/components/worldcup/page-header";
import { StandingsTable } from "@/components/worldcup/standings-table";
import { Container } from "@/components/ui/container";
import { FixtureCard } from "@/components/worldcup/fixture-card";
import {
  getFixtures,
  getGroupsPageData,
  groupStandingsByGroup,
} from "@/lib/data/worldcup";
import { createPageMetadata } from "@/lib/seo";
import { formatLastUpdated, getFixtureDisplayStatus } from "@/lib/worldcup/format";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Groups",
  description:
    "World Cup 2026 groups, standings, qualification rules and group-stage fixture context from the WC26 Hub.",
  path: "/groups",
});

const realGroupPattern = /^Group [A-L]$/;

function QualificationRulesSummary() {
  const rules = [
    "Top two teams in each group qualify automatically for the Round of 32.",
    "The eight best third-placed teams also advance.",
    "Group tables update as results come in.",
  ];

  return (
    <section className="neon-panel rounded-[2rem] p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="neon-kicker">Qualification rules</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-white">
            Top two auto, third place still matters
          </h2>
        </div>
        <span className="neon-badge neon-badge-lime w-fit">
          Round of 32 race
        </span>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        {rules.map((rule) => (
          <p
            key={rule}
            className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4 text-sm font-semibold leading-6 text-slate-200"
          >
            {rule}
          </p>
        ))}
      </div>
    </section>
  );
}

export default async function GroupsPage() {
  const [{ standings, latestSync }, fixtures] = await Promise.all([
    getGroupsPageData(),
    getFixtures(),
  ]);
  const groupedStandings = groupStandingsByGroup(standings);
  const groupNames = Object.keys(groupedStandings)
    .filter((groupName) => realGroupPattern.test(groupName))
    .sort();

  return (
    <>
      <PageHeader
        eyebrow="Groups"
        title="Groups and standings"
        description="Synced group tables, teams, upcoming fixtures and qualification rules for World Cup 2026."
        meta={`Last standings sync: ${formatLastUpdated(latestSync?.ended_at)}`}
      />

      <Container className="pb-14">
        <QualificationRulesSummary />

        {standings.length === 0 ? (
          <EmptyState
            title="No standings synced yet"
            description="The standings table is empty. Run the standings sync when API-Football has group data available, then this page will populate automatically."
          />
        ) : (
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            {groupNames.map((groupName) => {
              const groupRows = groupedStandings[groupName];
              const groupFixtures = fixtures
                .filter((fixture) => fixture.group_name === groupName)
                .filter(
                  (fixture) =>
                    getFixtureDisplayStatus(fixture.status_short) === "upcoming"
                )
                .slice(0, 3);

              return (
                <section
                  key={groupName}
                  className="neon-card overflow-hidden rounded-[2rem] p-4 sm:p-5"
                >
                  <StandingsTable
                    groupName={groupName}
                    rows={groupRows}
                    variant="embedded"
                  />

                  {groupFixtures.length > 0 ? (
                    <div className="mt-5 border-t border-white/10 pt-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-black uppercase text-white">
                          Upcoming fixtures
                        </h3>
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-fuchsia-200">
                          Next {groupFixtures.length}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-4">
                        {groupFixtures.map((fixture) => (
                          <FixtureCard key={fixture.id} fixture={fixture} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
}
