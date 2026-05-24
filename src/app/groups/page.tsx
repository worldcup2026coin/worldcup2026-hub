import { EmptyState } from "@/components/worldcup/empty-state";
import { PageHeader } from "@/components/worldcup/page-header";
import { StandingsTable } from "@/components/worldcup/standings-table";
import { Container } from "@/components/ui/container";
import { getGroupsPageData, groupStandingsByGroup } from "@/lib/data/worldcup";
import { formatLastUpdated } from "@/lib/worldcup/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Groups",
  description: "World Cup 2026 groups and standings from Supabase.",
};

export default async function GroupsPage() {
  const { standings, latestSync } = await getGroupsPageData();
  const groupedStandings = groupStandingsByGroup(standings);
  const groupNames = Object.keys(groupedStandings).sort();

  return (
    <>
      <PageHeader
        eyebrow="Groups"
        title="Groups and standings"
        description="Synced group standings from Supabase, including points, wins, draws, losses, goals for, goals against, and goal difference."
        meta={`Last standings sync: ${formatLastUpdated(latestSync?.ended_at)}`}
      />

      <Container className="pb-14">
        {standings.length === 0 ? (
          <EmptyState
            title="No standings synced yet"
            description="The standings table is empty. Run the standings sync when API-Football has group data available, then this page will populate automatically."
          />
        ) : (
          <div className="grid gap-6">
            {groupNames.map((groupName) => (
              <StandingsTable
                key={groupName}
                groupName={groupName}
                rows={groupedStandings[groupName]}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
