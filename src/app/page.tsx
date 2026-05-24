import type { Metadata } from "next";
import Link from "next/link";
import { EmailSignupForm } from "@/components/community/email-signup-form";
import { PollCard } from "@/components/community/poll-card";
import { Container } from "@/components/ui/container";
import { fixtureSlug, teamSlug } from "@/lib/worldcup/format";
import { createPageMetadata } from "@/lib/seo";
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
    return "vs";
  }

  return `${fixture.home_goals} - ${fixture.away_goals}`;
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
      className="block rounded-3xl border border-white/10 bg-white/[0.055] p-5 transition hover:-translate-y-1 hover:border-emerald-400/30"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
          {statusLabel(fixture.status_short)}
        </span>
        <span className="text-xs text-slate-400">
          {formatDateTime(fixture.match_date)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="min-w-0 text-center">
          {fixture.home_team_logo ? (
            <img
              src={fixture.home_team_logo}
              alt=""
              className="mx-auto h-12 w-12 rounded-full object-contain"
              loading="lazy"
            />
          ) : null}
          <p className="mt-2 truncate text-sm font-black text-white">
            {fixture.home_team_name ?? "Home"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-950/70 px-4 py-3 text-center text-lg font-black text-white">
          {scoreText(fixture)}
        </div>

        <div className="min-w-0 text-center">
          {fixture.away_team_logo ? (
            <img
              src={fixture.away_team_logo}
              alt=""
              className="mx-auto h-12 w-12 rounded-full object-contain"
              loading="lazy"
            />
          ) : null}
          <p className="mt-2 truncate text-sm font-black text-white">
            {fixture.away_team_name ?? "Away"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {fixture.round ?? "World Cup 2026"}
        {fixture.venue_name ? ` · ${fixture.venue_name}` : ""}
      </p>
    </Link>
  );
}

export default async function HomePage() {
  const data = await getHomepagePolishData();
  const featuredMatch = data.featuredMatch;

  return (
    <div className="pb-14">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.22),_transparent_42%),linear-gradient(180deg,_rgba(15,23,42,1),_rgba(2,6,23,1))]">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-300">
                World Cup 2026 Hub
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
                Fixtures, live scores, predictions and fan energy in one place.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                Follow the tournament with match centres, group tables, team pages,
                fan polls, safe prediction content and football-first community updates.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/fixtures"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-6 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                >
                  View fixtures
                </Link>
                <Link
                  href="/live"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Live centre
                </Link>
                <Link
                  href="/community"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Join community
                </Link>
              </div>

              {data.latestSyncLog ? (
                <p className="mt-5 text-xs text-slate-500">
                  Data last synced:{" "}
                  {formatDateTime(data.latestSyncLog.ended_at ?? data.latestSyncLog.started_at)}
                  {" · "}
                  {data.latestSyncLog.status}
                </p>
              ) : null}
            </div>

            <div>
              {featuredMatch ? (
                <div className="rounded-[2rem] border border-emerald-400/20 bg-white/[0.07] p-5 shadow-2xl shadow-emerald-950/20">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                    Featured match
                  </p>
                  <div className="mt-4">
                    <MiniFixtureCard fixture={featuredMatch} />
                  </div>
                </div>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
                  <h2 className="text-2xl font-black text-white">
                    Fixtures coming soon
                  </h2>
                  <p className="mt-3 text-sm text-slate-300">
                    Once fixtures are synced, the featured match will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <Container className="pt-10">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
                  What to watch
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Next matches
                </h2>
              </div>
              <Link href="/fixtures" className="text-sm font-bold text-emerald-300">
                Full fixture list →
              </Link>
            </div>

            {data.liveFixtures.length > 0 ? (
              <div className="mt-5 rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4">
                <p className="text-sm font-black text-rose-100">
                  {data.liveFixtures.length} live match
                  {data.liveFixtures.length === 1 ? "" : "es"} right now
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-slate-300">
                  No live matches right now. The next scheduled fixtures are below.
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
              <PollCard poll={data.polls[0]} source="homepage_polish" />
            ) : null}

            <EmailSignupForm
              source="homepage_polish"
              title="Get matchday updates"
              description="Join the list for World Cup updates, feature launches and community highlights."
            />
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 lg:col-span-2">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">
                  Latest predictions
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Fan insights and risk-labelled previews
                </h2>
              </div>
              <Link href="/predictions" className="text-sm font-bold text-sky-300">
                All predictions →
              </Link>
            </div>

            <div className="mt-5 grid gap-4">
              {data.latestPredictions.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-center">
                  <h3 className="text-lg font-black text-white">
                    No published predictions yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Publish prediction rows in Supabase and they will appear here.
                  </p>
                </div>
              ) : (
                data.latestPredictions.slice(0, 3).map((prediction) => (
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
                    className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 transition hover:border-sky-400/30"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                      {prediction.type.replaceAll("_", " ")} ·{" "}
                      {prediction.risk_level ?? "no lean"}
                    </p>
                    <h3 className="mt-2 text-lg font-black text-white">
                      {prediction.title}
                    </h3>
                    {prediction.summary ? (
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {prediction.summary}
                      </p>
                    ) : null}
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-300">
                  Trending teams
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Team pages
                </h2>
              </div>
              <Link href="/teams" className="text-sm font-bold text-amber-300">
                Teams →
              </Link>
            </div>

            <div className="mt-5 grid gap-3">
              {data.trendingTeams.slice(0, 6).map((team) => (
                <Link
                  key={team.id}
                  href={`/teams/${teamSlug(team.name, team.api_team_id)}`}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3 transition hover:bg-white/10"
                >
                  {team.logo_url ? (
                    <img
                      src={team.logo_url}
                      alt=""
                      className="h-9 w-9 rounded-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-white/10" />
                  )}
                  <div>
                    <p className="text-sm font-black text-white">{team.name}</p>
                    <p className="text-xs text-slate-400">
                      {team.group_name ?? team.country ?? "World Cup 2026"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-fuchsia-300">
                Latest articles
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                News, guides and fan culture
              </h2>
            </div>
            <Link href="/news" className="text-sm font-bold text-fuchsia-300">
              News hub →
            </Link>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {data.latestArticles.slice(0, 3).map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 transition hover:-translate-y-1 hover:border-fuchsia-400/30"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-300">
                  {article.category.replaceAll("_", " ")}
                </p>
                <h3 className="mt-3 text-lg font-black text-white">
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
