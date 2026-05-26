
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CountdownTimer } from "@/components/worldcup/countdown-timer";
import { EmailSignupForm } from "@/components/community/email-signup-form";
import { PollCard } from "@/components/community/poll-card";
import { Container } from "@/components/ui/container";
import { fixtureSlug, teamSlug } from "@/lib/worldcup/format";
import { createPageMetadata } from "@/lib/seo";
import { getOpeningFixtureCountdownTarget } from "@/lib/data/countdown";
import {
  getHomepagePolishData,
  type HomeFixture,
} from "@/lib/data/homepage-polish";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "World Cup 2026 Hub",
  description:
    "Follow World Cup 2026 fixtures, live scores, groups, teams, match pages, predictions, news, polls and fan community.",
  path: "/",
});

function formatDateTime(value: string | null) {
  if (!value) return "Date TBC";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function matchHref(fixture: HomeFixture) {
  return `/matches/${fixtureSlug({
    api_fixture_id: fixture.api_fixture_id,
    match_date: fixture.match_date,
    home_team_name: fixture.home_team_name,
    away_team_name: fixture.away_team_name,
  })}`;
}

function scoreText(fixture: HomeFixture) {
  if (fixture.home_goals === null || fixture.away_goals === null) {
    return "VS";
  }

  return `${fixture.home_goals} : ${fixture.away_goals}`;
}

function statusLabel(status: string | null) {
  const value = String(status ?? "").toUpperCase();

  if (["1H", "2H", "LIVE", "ET", "P"].includes(value)) return "Live now";
  if (value === "HT") return "Half-time";
  if (["FT", "AET", "PEN"].includes(value)) return "Finished";
  if (["PST", "CANC", "ABD"].includes(value)) return "Changed";
  return "Upcoming";
}

function MiniFixtureCard({ fixture }: { fixture: HomeFixture }) {
  return (
    <Link
      href={matchHref(fixture)}
      className="neon-card block rounded-[2rem] p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="neon-badge neon-badge-pink">
          {statusLabel(fixture.status_short)}
        </span>
        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          {formatDateTime(fixture.match_date)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="min-w-0 text-center">
          {fixture.home_team_logo ? (
            <Image
              src={fixture.home_team_logo}
              alt=""
              width={56}
              height={56}
              className="mx-auto h-14 w-14 rounded-2xl border border-white/10 bg-white/10 object-contain p-1"
            />
          ) : null}
          <p className="mt-2 truncate text-sm font-black uppercase text-white">
            {fixture.home_team_name ?? "Home"}
          </p>
        </div>

        <div className="rounded-2xl border border-lime-300/25 bg-lime-300/10 px-4 py-3 text-center text-xl font-black text-white shadow-[0_0_22px_rgba(163,255,18,0.10)]">
          {scoreText(fixture)}
        </div>

        <div className="min-w-0 text-center">
          {fixture.away_team_logo ? (
            <Image
              src={fixture.away_team_logo}
              alt=""
              width={56}
              height={56}
              className="mx-auto h-14 w-14 rounded-2xl border border-white/10 bg-white/10 object-contain p-1"
            />
          ) : null}
          <p className="mt-2 truncate text-sm font-black uppercase text-white">
            {fixture.away_team_name ?? "Away"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        {fixture.round ?? "World Cup 2026"}
        {fixture.venue_name ? ` · ${fixture.venue_name}` : ""}
      </p>
    </Link>
  );
}

function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "lime" | "cyan" | "pink" | "gold";
}) {
  const toneClass = {
    lime: "border-lime-300/30 bg-lime-300/10 text-lime-100",
    cyan: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
    pink: "border-fuchsia-300/30 bg-fuchsia-400/10 text-fuchsia-100",
    gold: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  }[tone];

  return (
    <div className={`rounded-3xl border p-4 ${toneClass}`}>
      <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] opacity-80">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

export default async function HomePage() {
  const data = await getHomepagePolishData();
  const countdownTarget = await getOpeningFixtureCountdownTarget();
  const featuredMatch = data.featuredMatch;

  return (
    <div className="pb-14">
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <Container className="px-0">
          <div className="hero-panel rounded-[2.5rem] p-6 sm:p-10 lg:p-12">
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="neon-kicker">World Cup 2026 hub</span>
                  <span className="sticker-tilt inline-flex rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-fuchsia-100">
                    Fan chaos online
                  </span>
                </div>

                <h1 className="neon-title glow-text mt-6 max-w-5xl text-5xl font-black leading-[0.82] text-white sm:text-7xl lg:text-8xl">
                  FOOTBALL. CULTURE. CHAOS.
                </h1>
                <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-200">
                  The complete World Cup 2026 launch hub with live fixtures, standings, teams, players, stadiums, predictions and global fan energy across USA, Mexico and Canada.
                </p>                  <div className="mt-7">
                    <CountdownTimer
                      targetDate={countdownTarget}
                      label="Countdown to Kick-Off"
                      matchLabel="Mexico vs South Africa · 11 June 2026"
                      badge="Road to 2026"
                    />
                  </div>



                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/fixtures" className="glow-button-primary">
                    View fixtures
                  </Link>
                  <Link href="/live" className="glow-button-secondary">
                    Live scores
                  </Link>
                  <Link href="/teams" className="glow-button-secondary">
                    Explore teams
                  </Link>
                </div>


                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  <StatTile label="Live data" value="ON" tone="lime" />
                  <StatTile label="Fan signal" value="24/7" tone="pink" />
                  <StatTile label="Teams" value="48" tone="cyan" />
                  <StatTile label="Matches" value="104" tone="gold" />
                  <StatTile label="Groups" value="12" tone="lime" />
                </div>

                {data.latestSyncLog ? (
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Data last synced:{" "}
                    {formatDateTime(data.latestSyncLog.ended_at ?? data.latestSyncLog.started_at)}
                    {" · "}
                    {data.latestSyncLog.status}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4">
                <div className="neon-card rounded-[2rem] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="neon-kicker">Opening match · Estadio Azteca</p>
                    <span className="neon-badge neon-badge-cyan">11 June 2026</span>
                  </div>
                  <div className="mt-4">
                    {featuredMatch ? (
                      <MiniFixtureCard fixture={featuredMatch} />
                    ) : (
                      <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
                        <h2 className="text-2xl font-black text-white">
                          Fixtures coming soon
                        </h2>
                        <p className="mt-3 text-sm text-slate-300">
                          Once fixtures sync, the featured match lights up here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Link href="/groups" className="neon-card rounded-[2rem] p-5">
                    <span className="neon-badge">Group pulse</span>
                    <h2 className="mt-4 text-2xl font-black uppercase text-white">
                      Group-stage race
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Follow qualification pressure, knockout qualification paths and third-place chaos.
                    </p>
                  </Link>
                  <Link href="/top-scorers" className="neon-card rounded-[2rem] p-5">
                    <span className="neon-badge neon-badge-pink">Leaderboard</span>
                    <h2 className="mt-4 text-2xl font-black uppercase text-white">
                      Golden Boot race
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Track goals, assists, cards and tournament momentum leaders.
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="pt-4">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="neon-panel rounded-[2rem] p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="neon-kicker">Matchday Launch fixture</p>
                <h2 className="mt-4 text-3xl font-black uppercase text-white">
                  Opening week fixtures
                </h2>
              </div>
              <Link href="/fixtures" className="link-neon text-sm">
                Full fixture list →
              </Link>
            </div>

            {data.liveFixtures.length > 0 ? (
              <div className="mt-5 rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/10 p-4">
                <p className="text-sm font-black text-fuchsia-100">
                  {data.liveFixtures.length} live match
                  {data.liveFixtures.length === 1 ? "" : "es"} right now
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                <p className="text-sm font-semibold text-slate-300">
                  No live matches right now. Opening week countdown is underway.
                </p>
              </div>
            )}

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {data.nextFixtures.slice(0, 4).map((fixture) => (
                <MiniFixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            {data.polls[0] ? (
              <div className="neon-card rounded-[2rem] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="neon-badge neon-badge-cyan">Updated live</span>
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-lime-200">
                    4,321 fan votes
                  </span>
                </div>
                <PollCard poll={data.polls[0]} source="homepage_polish" />
              </div>
            ) : null}

            <Link
              href="/best-third-placed-teams"
              className="neon-card block rounded-[2rem] p-5"
            >
              <span className="sticker-tilt inline-flex rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-fuchsia-100">
                3RD PLACE SIGNAL
              </span>
              <h2 className="mt-4 text-3xl font-black uppercase text-white">
                Best third-placed teams
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Eight third-placed teams can still reach the knockouts. This is
                where the group-stage chaos gets serious.
              </p>
              <span className="mt-5 inline-flex text-sm font-black text-lime-200">
                View third-place table →
              </span>
            </Link>
            <EmailSignupForm
              source="homepage_polish"
              title="Get matchday updates"
              description="Join the fan signal for World Cup updates, feature launches and community highlights."
            />
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="neon-panel rounded-[2rem] p-5 lg:col-span-2">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="neon-kicker">Prediction signal</p>
                <h2 className="mt-4 text-3xl font-black uppercase text-white">
                  Fan insights and match reads
                </h2>
              </div>
              <Link href="/predictions" className="link-neon text-sm">
                All predictions →
              </Link>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {data.latestPredictions.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-cyan-300/20 bg-cyan-300/10 p-6 text-center">
                  <h3 className="text-lg font-black text-white">
                    No prediction signal yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Publish prediction rows in Supabase and they will light up here.
                  </p>
                </div>
              ) : (
                <>
                  {data.latestPredictions.slice(0, 3).map((prediction) => (
                    <Link
                      key={prediction.id}
                      href={
                        prediction.fixture
                          ? `/predictions/${fixtureSlug({
                              api_fixture_id: prediction.fixture.api_fixture_id,
                              match_date: prediction.fixture.match_date,
                              home_team_name: prediction.fixture.home_team_name,
                              away_team_name: prediction.fixture.away_team_name,
                            })}`
                          : "/predictions"
                      }
                      className="neon-card rounded-3xl p-5"
                    >
                      <p className="neon-badge neon-badge-cyan">
                        {prediction.type.replaceAll("_", " ")} ·{" "}
                        {prediction.risk_level ?? "no lean"}
                      </p>
                      <h3 className="mt-3 text-xl font-black uppercase text-white">
                        {prediction.title}
                      </h3>
                      {prediction.summary ? (
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {prediction.summary}
                        </p>
                      ) : null}
                    </Link>
                  ))}

                  {[
                    ["Opening Match Pressure", "Mexico start at home with the whole tournament watching."],
                    ["Dark Horse Watch", "Track the teams that can break brackets and ruin group predictions."],
                    ["Golden Boot Signal", "Follow the early scoring race before the first whistle."],
                  ].map(([title, summary]) => (
                    <Link key={title} href="/predictions" className="neon-card rounded-3xl p-5">
                      <p className="neon-badge neon-badge-pink">Tournament read</p>
                      <h3 className="mt-3 text-xl font-black uppercase text-white">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{summary}</p>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="neon-panel rounded-[2rem] p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="neon-kicker">Team radar</p>
                <h2 className="mt-4 text-3xl font-black uppercase text-white">
                  Team pages
                </h2>
              </div>
              <Link href="/teams" className="link-neon text-sm">
                Teams →
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {data.trendingTeams.length > 0
                ? data.trendingTeams.slice(0, 6).map((team) => (
                    <Link
                      key={team.id}
                      href={`/teams/${teamSlug(team.name, team.api_team_id)}`}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-3 transition hover:border-lime-300/30 hover:bg-lime-300/10"
                    >
                      {team.logo_url ? (
                        <Image
                          src={team.logo_url}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-xl border border-white/10 bg-white/10 object-contain p-1"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-white/10" />
                      )}
                      <div>
                        <p className="text-sm font-black uppercase text-white">{team.name}</p>
                        <p className="text-xs text-slate-400">
                          {team.group_name ?? team.country ?? "World Cup 2026"}
                        </p>
                      </div>
                    </Link>
                  ))
                : ["Argentina", "Brazil", "France", "England", "Spain", "USA"].map((team) => (
                    <Link
                      key={team}
                      href="/teams"
                      className="rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-4 transition hover:border-lime-300/30 hover:bg-lime-300/10"
                    >
                      <p className="text-sm font-black uppercase text-white">{team}</p>
                      <p className="mt-1 text-xs text-slate-400">Squad · fixtures · stats</p>
                    </Link>
                  ))}
            </div>
          </div>
        </section>

        <section className="neon-panel mt-10 rounded-[2rem] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="neon-kicker">Host city signal</p>
              <h2 className="mt-4 text-3xl font-black uppercase text-white">
                16 host cities across 3 nations
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Follow the tournament trail across USA, Mexico and Canada — from Mexico City&apos;s opener to the final in New York/New Jersey.
              </p>
            </div>
            <Link href="/stadiums" className="link-neon text-sm">
              Explore stadiums →
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Mexico City", "Opening match · Estadio Azteca"],
              ["Los Angeles", "Group-stage spotlight"],
              ["New York/New Jersey", "Final destination"],
              ["Toronto", "Canada host city"],
              ["Vancouver", "Pacific tournament stop"],
              ["Dallas", "Knockout-stage heavyweight"],
              ["Miami", "South Florida matchday"],
              ["Seattle", "Pacific Northwest signal"],
            ].map(([city, note]) => (
              <Link
                key={city}
                href="/stadiums"
                className="rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-4 transition hover:border-lime-300/30 hover:bg-lime-300/10"
              >
                <p className="text-sm font-black uppercase text-white">{city}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{note}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <Link href="/host-cities" className="neon-panel block rounded-[2rem] p-6">
            <span className="neon-badge neon-badge-cyan">International fan guide</span>
            <h2 className="mt-5 text-3xl font-black uppercase text-white">
              Host Cities
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Explore all 16 World Cup 2026 host cities across USA, Mexico and Canada.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {["Mexico City", "Guadalajara", "Toronto", "Vancouver", "New York/New Jersey", "Los Angeles"].map((city) => (
                <span key={city} className="rounded-2xl border border-cyan-300/15 bg-black/30 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-cyan-100">
                  {city}
                </span>
              ))}
            </div>
            <span className="mt-5 inline-flex text-sm font-black uppercase tracking-[0.14em] text-lime-200">
              Explore all host cities →
            </span>
          </Link>

          <Link href="/stadiums" className="neon-panel block rounded-[2rem] p-6">
            <span className="neon-badge neon-badge-pink">Tournament venues</span>
            <h2 className="mt-5 text-3xl font-black uppercase text-white">
              World Cup Venues
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              From Estadio Azteca to MetLife Stadium, follow every venue on the 2026 map.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {["Estadio Azteca", "MetLife Stadium", "SoFi Stadium", "AT&T Stadium", "BC Place", "Lumen Field"].map((venue) => (
                <span key={venue} className="rounded-2xl border border-fuchsia-300/15 bg-black/30 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-fuchsia-100">
                  {venue}
                </span>
              ))}
            </div>
            <span className="mt-5 inline-flex text-sm font-black uppercase tracking-[0.14em] text-lime-200">
              Explore all stadiums →
            </span>
          </Link>
        </section>
        <section className="neon-panel mt-10 rounded-[2rem] p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="neon-kicker">Football internet</p>
              <h2 className="mt-4 text-3xl font-black uppercase text-white">
                News, guides and fan culture
              </h2>
            </div>
            <Link href="/news" className="link-neon text-sm">
              News hub →
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.latestArticles.slice(0, 3).map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="neon-card rounded-3xl p-5"
              >
                <p className="neon-badge neon-badge-pink">
                  {article.category.replaceAll("_", " ")}
                </p>
                <h3 className="mt-4 text-xl font-black uppercase text-white">
                  {article.title}
                </h3>
                {article.excerpt ? (
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {article.excerpt}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
















