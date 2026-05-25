import { breadcrumbJsonLd, sportsTeamJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/worldcup/empty-state";
import { FixtureCard } from "@/components/worldcup/fixture-card";
import { PageHeader } from "@/components/worldcup/page-header";
import { StandingsTable } from "@/components/worldcup/standings-table";
import { Container } from "@/components/ui/container";
import { getTeamPageData, groupSquadByPosition } from "@/lib/data/worldcup";

export const dynamic = "force-dynamic";

type TeamPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: TeamPageProps) {
  const { slug } = await params;
  const data = await getTeamPageData(slug);

  if (!data) {
    return {
      title: "Team not found",
    };
  }

  return {
    title: data.team.name,
    description: `${data.team.name} World Cup 2026 team page.`,
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const data = await getTeamPageData(slug);

  if (!data) {
    notFound();
  }

  const { team, fixtures, results, standing, groupStandings, squad, coaches } = data;
  const squadGroups = groupSquadByPosition(squad);
  const coach = coaches[0] ?? null;

  const teamSchemaSlug = `${String(team.name ?? "team").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${team.api_team_id}`;

  return (
    <>
              <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Teams", path: "/teams" },
            {
              name: team.name,
              path: `/teams/${teamSchemaSlug}`,
            },
          ])}
        />

        <JsonLd
          data={sportsTeamJsonLd({
            name: team.name,
            path: `/teams/${teamSchemaSlug}`,
            logo: team.logo_url,
          })}
        />
        <PageHeader
        eyebrow={standing?.group_name ?? "Team"}
        title={team.name}
        description={`Team overview for ${team.name}, including fixtures, results, group position, coach information and squad data from Supabase.`}
        meta={`${team.code ?? "Code TBC"} · ${team.country ?? "Country TBC"}`}
      />

      <Container className="pb-14">
        <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/30">
            <div className="flex items-center gap-4">
              {team.logo_url ? (
                <img
                  src={team.logo_url}
                  alt={`${team.name} logo`}
                  className="h-20 w-20 rounded-full object-contain"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-black text-white">
                  {team.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <h2 className="text-2xl font-black text-white">{team.name}</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {team.country ?? "Country TBC"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm">
              <div className="rounded-2xl bg-white/[0.04] p-4">
                <p className="text-slate-400">Group</p>
                <p className="mt-1 font-black text-white">
                  {standing?.group_name ?? "TBC"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.04] p-4">
                <p className="text-slate-400">Current position</p>
                <p className="mt-1 font-black text-white">
                  {standing?.rank ? `#${standing.rank}` : "TBC"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.04] p-4">
                <p className="text-slate-400">Points</p>
                <p className="mt-1 font-black text-white">
                  {standing?.points ?? 0}
                </p>
              </div>
            </div>

            <Link
              href="/teams"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Back to all teams
            </Link>
          </aside>

          <div className="grid gap-6">
            {standing && groupStandings.length > 0 ? (
              <StandingsTable
                groupName={standing.group_name}
                rows={groupStandings}
              />
            ) : (
              <EmptyState
                title="No group standing available"
                description="This team exists in Supabase, but no standing row is currently linked to it."
              />
            )}

            <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/30">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Coach
              </p>

              {coach ? (
                <div className="mt-4 rounded-2xl bg-white/[0.04] p-4">
                  <h2 className="text-2xl font-black text-white">
                    {coach.name ?? "Coach TBC"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    {coach.nationality ?? "Nationality TBC"}
                    {coach.age ? ` · Age ${coach.age}` : ""}
                  </p>
                </div>
              ) : (
                <EmptyState
                  title="Coach data not available yet"
                  description="Coach information will appear here automatically when it is available in Supabase."
                />
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/30">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                    Squad
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-white">
                    {squad.length > 0
                      ? `${squad.length} players synced`
                      : "Squad data updating"}
                  </h2>
                </div>

                {squad[0]?.last_synced_at ? (
                  <p className="text-xs text-slate-400">
                    Last synced{" "}
                    {new Date(squad[0].last_synced_at).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                ) : null}
              </div>

              {squad.length === 0 ? (
                <div className="mt-6">
                  <EmptyState
                    title="No squad data yet"
                    description="Squad details will appear here automatically after the next squad sync."
                  />
                </div>
              ) : (
                <div className="mt-6 grid gap-5">
                  {Object.entries(squadGroups).map(([position, players]) => (
                    <div key={position} className="rounded-2xl bg-white/[0.04] p-4">
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300">
                        {position}
                      </h3>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {players.map((player) => (
                          <div
                            key={`${player.api_team_id}-${player.api_player_id}`}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2"
                          >
                            <div>
                              <p className="text-sm font-bold text-white">
                                {player.player_name ?? "Player TBC"}
                              </p>
                              <p className="text-xs text-slate-400">
                                {player.position ?? "Position TBC"}
                              </p>
                            </div>

                            {player.number ? (
                              <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-black text-emerald-200">
                                #{player.number}
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-black text-white">Fixtures</h2>
          <p className="mt-2 text-sm text-slate-300">
            Upcoming and scheduled matches involving {team.name}.
          </p>

          {fixtures.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No fixtures found for this team"
                description="The team exists, but there are no synced fixtures linked to its API-Football team ID yet."
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {fixtures.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-black text-white">Results</h2>
          <p className="mt-2 text-sm text-slate-300">
            Finished matches will appear here after results are synced.
          </p>

          {results.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No results yet"
                description="There are no finished fixtures for this team in Supabase yet."
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {results.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </>
  );
}


