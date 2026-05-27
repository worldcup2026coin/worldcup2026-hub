import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/seo/json-ld";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/worldcup/empty-state";
import { FixtureCard } from "@/components/worldcup/fixture-card";
import { MatchCountdown } from "@/components/worldcup/match-countdown";
import { PageHeader } from "@/components/worldcup/page-header";
import { StandingsTable } from "@/components/worldcup/standings-table";
import { TeamFlag } from "@/components/worldcup/team-flag";
import { Container } from "@/components/ui/container";
import { breadcrumbJsonLd, sportsTeamJsonLd } from "@/lib/seo";
import {
  getTeamPageData,
  groupSquadByPosition,
  type Fixture,
  type Standing,
  type TeamSquadPlayer,
} from "@/lib/data/worldcup";
import { playerSlug } from "@/lib/data/players";
import {
  fixtureSlug,
  formatDateTime,
  formatVenueDateTime,
} from "@/lib/worldcup/format";

export const dynamic = "force-dynamic";

type TeamPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getTeamSchemaSlug(name: string, apiTeamId: number) {
  return `${String(name ?? "team")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}-${apiTeamId}`;
}

function getQualificationRoute(standing: Standing | null) {
  if (!standing?.rank) {
    return "Group route pending: finish in the top two for automatic progress, or compete for one of the best third-place spots.";
  }

  if (standing.rank <= 2) {
    return `Currently ${standing.rank === 1 ? "top" : "second"} in ${
      standing.group_name
    }, which is an automatic qualification position.`;
  }

  if (standing.rank === 3) {
    return `Third in ${standing.group_name}: this can still be enough if they rank among the best third-place teams.`;
  }

  return `Currently outside the main route in ${standing.group_name}; they need to climb into the top two or third-place contention.`;
}

function scorePlayer(player: TeamSquadPlayer) {
  const rating = Number.parseFloat(player.rating ?? "0");

  return (
    (player.captain ? 10000 : 0) +
    (player.lineups ?? 0) * 100 +
    (player.minutes ?? 0) +
    (player.appearances ?? 0) * 10 +
    (Number.isFinite(rating) ? rating : 0)
  );
}

function getKeyPlayers(squad: TeamSquadPlayer[]) {
  return [...squad]
    .sort((a, b) => {
      const scoreDiff = scorePlayer(b) - scorePlayer(a);

      if (scoreDiff !== 0) return scoreDiff;

      return String(a.player_name ?? "").localeCompare(
        String(b.player_name ?? "")
      );
    })
    .slice(0, 6);
}

function getPlayerLabel(player: TeamSquadPlayer) {
  if (player.captain) return "Captain";
  if ((player.lineups ?? 0) > 0) return "Starter";
  if ((player.appearances ?? 0) > 0) return "Squad regular";
  return player.position ?? "Squad";
}

function getMatchSlug(fixture: Fixture) {
  return fixtureSlug({
    api_fixture_id: fixture.api_fixture_id,
    match_date: fixture.match_date,
    home_team_name: fixture.home_team_name,
    away_team_name: fixture.away_team_name,
  });
}

export async function generateMetadata({ params }: TeamPageProps) {
  const { slug } = await params;
  const data = await getTeamPageData(slug);

  if (!data) {
    return {
      title: "Team not found",
    };
  }

  const groupLabel = data.standing?.group_name ?? "World Cup 2026";

  return {
    title: `${data.team.name} World Cup 2026 Team Guide`,
    description: `${data.team.name} ${groupLabel} outlook with coach, squad, fixtures, results and qualification route for World Cup 2026.`,
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const data = await getTeamPageData(slug);

  if (!data) {
    notFound();
  }

  const {
    team,
    fixtures,
    results,
    upcomingFixtures,
    standing,
    groupStandings,
    squad,
    coaches,
  } = data;
  const squadGroups = groupSquadByPosition(squad);
  const coach = coaches[0] ?? null;
  const keyPlayers = getKeyPlayers(squad);
  const nextFixture = upcomingFixtures[0] ?? null;
  const teamSchemaSlug = getTeamSchemaSlug(team.name, team.api_team_id);
  const qualificationRoute = getQualificationRoute(standing);
  const anchorLinks = [
    ["Overview", "overview"],
    ["Group", "group"],
    ["Coach", "coach"],
    ["Squad", "squad"],
    ["Fixtures", "fixtures"],
    ["Results", "results"],
  ];

  return (
    <div data-team-page className="w-full max-w-full overflow-x-clip">
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
        description={`${team.name} tournament outlook with group position, qualification route, coach, squad, fixtures and results.`}
        meta={`${team.code ?? "Code TBC"}  -  ${team.country ?? "Country TBC"}`}
      />

      <Container className="pb-14">
        <nav data-sticky-nav className="sticky top-3 z-20 mb-6 w-full max-w-full overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/85 p-2 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <div className="flex w-max max-w-none gap-2">
            {anchorLinks.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        <section
          id="overview"
          className="scroll-mt-24 grid min-w-0 gap-6 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <aside className="w-full max-w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/30">
            <div className="flex min-w-0 items-center gap-4">
              {team.logo_url ? (
                <Image
                  src={team.logo_url}
                  alt={`${team.name} logo`}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-contain"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-black text-white">
                  <TeamFlag code={team.code} name={team.name} country={team.country} />
                </div>
              )}

              <div>
                <h2 className="flex min-w-0 items-center gap-2 text-2xl font-black text-white">
                  <TeamFlag
                    code={team.code}
                    name={team.name}
                    country={team.country}
                    className="h-8 w-8"
                  />
                  {team.name}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {team.country ?? "Country TBC"}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                Tournament outlook
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                {team.name} are in {standing?.group_name ?? "a group still to be confirmed"} and are{" "}
                {standing?.rank ? `currently ${standing.rank}${standing.rank === 1 ? "st" : standing.rank === 2 ? "nd" : standing.rank === 3 ? "rd" : "th"}` : "waiting for a confirmed table position"}.
                {" "}
                {qualificationRoute}
              </p>
            </div>

            <div className="mt-4 grid min-w-0 gap-3 text-sm sm:grid-cols-2">
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
                <p className="text-slate-400">Coach</p>
                <p className="mt-1 font-black text-white">
                  {coach?.name ?? "TBC"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.04] p-4">
                <p className="text-slate-400">Squad size</p>
                <p className="mt-1 font-black text-white">
                  {squad.length > 0 ? squad.length : "TBC"}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-100">
                Qualification route
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                World Cup 2026 has 48 teams in 12 groups. The top two in each
                group qualify automatically, with the best eight third-place
                teams also advancing to the knockouts.
              </p>
            </div>

            <Link
              href="/teams"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Back to all teams
            </Link>
          </aside>

          <div className="grid min-w-0 gap-6">
            <section className="w-full max-w-full overflow-hidden rounded-3xl border border-lime-300/20 bg-lime-300/[0.08] p-6 shadow-2xl shadow-slate-950/30">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lime-200">
                Next match
              </p>

              {nextFixture ? (
                <div className="mt-5 grid min-w-0 gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <h2 className="text-3xl font-black uppercase text-white">
                      {nextFixture.home_team_name ?? "Team TBC"} vs{" "}
                      {nextFixture.away_team_name ?? "Team TBC"}
                    </h2>
                    <p className="mt-3 text-sm font-semibold text-slate-300">
                      {formatVenueDateTime(nextFixture)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      Site time:{" "}
                      {formatDateTime(nextFixture.match_date, "Europe/Dublin", {
                        includeTimeZoneName: true,
                      })}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                      Venue
                    </p>
                    <p className="mt-2 font-black text-white">
                      {nextFixture.venue_name ?? "Venue TBC"}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {nextFixture.venue_city ?? "Host city TBC"}
                    </p>
                    <Link
                      href={`/matches/${getMatchSlug(nextFixture)}`}
                      className="glow-button-primary mt-5"
                    >
                      View Match Centre
                    </Link>
                  </div>
                  <div className="md:col-span-2">
                    <MatchCountdown matchDate={nextFixture.match_date} />
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  <EmptyState
                    title="Next match not available yet"
                    description="The next synced fixture for this team will appear here once the fixture feed is complete."
                  />
                </div>
              )}
            </section>

            <section
              id="group"
              className="scroll-mt-24 w-full max-w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/30"
            >
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
            </section>

            <section
              id="coach"
              className="scroll-mt-24 w-full max-w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/30"
            >
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
                    {coach.age ? `  -  Age ${coach.age}` : ""}
                  </p>
                </div>
              ) : (
                <EmptyState
                  title="Coach data not available yet"
                  description="Coach information will appear here automatically when it is available in Supabase."
                />
              )}
            </section>
          </div>
        </section>

        <section className="mt-10 scroll-mt-24" id="squad">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Key players
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Names to know
              </h2>
            </div>
          </div>

          {keyPlayers.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="Key players updating"
                description="Important players will appear here once squad data is available."
              />
            </div>
          ) : (
            <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {keyPlayers.map((player) => (
                <Link
                  key={`${player.api_team_id}-${player.api_player_id}`}
                  href={`/players/${playerSlug(
                    player.player_name,
                    player.api_player_id
                  )}`}
                  className="w-full max-w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-5 transition hover:border-lime-300/35 hover:bg-lime-300/10"
                >
                  <span className="neon-badge neon-badge-cyan">
                    {getPlayerLabel(player)}
                  </span>
                  <h3 className="mt-4 text-xl font-black text-white">
                    {player.player_name ?? "Player TBC"}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {player.position ?? "Position TBC"}
                    {player.number ? `  -  #${player.number}` : ""}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/30">
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
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
              <div className="mt-6 grid min-w-0 gap-5">
                {Object.entries(squadGroups).map(([position, players]) => (
                  <div key={position} className="rounded-2xl bg-white/[0.04] p-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300">
                      {position}
                    </h3>

                    <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2">
                      {players.map((player) => (
                        <div
                          key={`${player.api_team_id}-${player.api_player_id}`}
                          className="flex min-w-0 items-center justify-between rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2"
                        >
                          <div>
                            <Link
                              href={`/players/${playerSlug(
                                player.player_name,
                                player.api_player_id
                              )}`}
                              className="text-sm font-bold text-white hover:text-emerald-300"
                            >
                              {player.player_name ?? "Player TBC"}
                            </Link>
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
          </div>
        </section>

        <section className="mt-10 scroll-mt-24" id="fixtures">
          <h2 className="text-2xl font-black text-white">Fixtures</h2>
          <p className="mt-2 text-sm text-slate-300">
            Upcoming and scheduled matches involving {team.name}.
          </p>

          {standing?.form ? (
            <div className="mt-5 rounded-[2rem] border border-lime-300/20 bg-lime-300/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-100">
                Last 5 matches
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {standing.form.slice(-5).split("").map((result, index) => {
                  const tone =
                    result === "W"
                      ? "border-lime-300/30 bg-lime-300/15 text-lime-100"
                      : result === "D"
                        ? "border-cyan-300/30 bg-cyan-300/15 text-cyan-100"
                        : "border-fuchsia-300/30 bg-fuchsia-400/15 text-fuchsia-100";

                  return (
                    <span
                      key={`${result}-${index}`}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-black ${tone}`}
                    >
                      {result}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : null}

          {fixtures.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No fixtures found for this team"
                description="The team exists, but there are no synced fixtures linked to its API-Football team ID yet."
              />
            </div>
          ) : (
            <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-2">
              {fixtures.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 scroll-mt-24" id="results">
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
            <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-2">
              {results.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}
