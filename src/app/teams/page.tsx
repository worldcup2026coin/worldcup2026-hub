import { EmptyState } from "@/components/worldcup/empty-state";
import { PageHeader } from "@/components/worldcup/page-header";
import { TeamCard } from "@/components/worldcup/team-card";
import { Container } from "@/components/ui/container";
import { getTeamGroupMap, getTeamsPageData } from "@/lib/data/worldcup";
import { formatLastUpdated } from "@/lib/worldcup/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Teams",
  description: "World Cup 2026 teams from Supabase.",
};

export default async function TeamsPage() {
  const { teams, standings, latestSync } = await getTeamsPageData();
  const teamGroupMap = getTeamGroupMap(standings);

  return (
    <>
      <PageHeader
        eyebrow="Teams"
        title="Team hub"
        description="All synced World Cup teams from Supabase, with group and points context where standings data is available."
        meta={`Last teams sync: ${formatLastUpdated(latestSync?.ended_at)}`}
      />

      <Container className="pb-14">
        {teams.length === 0 ? (
          <EmptyState
            title="No teams synced yet"
            description="The teams table is empty. Run the protected teams sync when API-Football has data available."
          />
        ) : (
          <>
            <p className="mb-6 text-sm text-slate-300">
              Showing{" "}
              <span className="font-black text-white">{teams.length}</span>{" "}
              teams.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  standing={teamGroupMap.get(team.api_team_id)}
                />
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
}
