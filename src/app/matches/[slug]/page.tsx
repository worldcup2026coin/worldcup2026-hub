import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { MatchEventsTimeline } from "@/components/matches/match-events-timeline";
import { MatchHeader } from "@/components/matches/match-header";
import { MatchVenueContext } from "@/components/matches/match-venue-context";
import { MatchLineups } from "@/components/matches/match-lineups";
import { MatchPollPlaceholder } from "@/components/matches/match-poll-placeholder";
import { PollCard } from "@/components/community/poll-card";
import { MatchPreviewBlock } from "@/components/matches/match-preview-block";
import { MatchHeadToHeadCard } from "@/components/matches/match-head-to-head-card";
import { InjuryList } from "@/components/matches/injury-list";
import { MatchShareButtons } from "@/components/matches/match-share-buttons";
import { MatchStats } from "@/components/matches/match-stats";
import { EmailSignupForm } from "@/components/community/email-signup-form";
import { MatchCountdown } from "@/components/worldcup/match-countdown";
import { WorldClock } from "@/components/worldcup/world-clock";
import {
  getMatchBySlug,
  getMatchPageData,
  getMatchTitle,
  getPublicSiteUrl,
} from "@/lib/data/matches";
import { getPublishedPolls } from "@/lib/data/community";
import { formatDateOnly } from "@/lib/worldcup/format";
import { getFixtureVenueTimeZone } from "@/lib/worldcup/format";
import { breadcrumbJsonLd, sportsEventJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

type MatchPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: MatchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = await getMatchBySlug(slug);
  const siteUrl = getPublicSiteUrl();

  if (!match) {
    return {
      title: "Match not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { fixture, canonicalSlug } = match;
  const matchName = getMatchTitle(
    fixture.home_team_name,
    fixture.away_team_name
  );

  const title = `${matchName} | World Cup 2026 Preview, Live Score & Stats`;

  const description = `Follow ${matchName} at World Cup 2026 with live score, venue context, match stats, team news and fan conversation.`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: `/matches/${canonicalSlug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/matches/${canonicalSlug}`,
      siteName: "World Cup 2026 Hub",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { slug } = await params;
  const data = await getMatchPageData(slug);

  if (!data) {
    notFound();
  }

  if (slug !== data.canonicalSlug) {
    permanentRedirect(`/matches/${data.canonicalSlug}`);
  }

  const {
    fixture,
    canonicalSlug,
    events,
    stats,
    lineups,
    headToHead,
    injuries,
  } = data;

  const fixturePolls = await getPublishedPolls({
      contextType: "fixture",
      fixtureId: fixture.id,
      limit: 1,
    });

  const siteUrl = getPublicSiteUrl();
  const shareUrl = `${siteUrl}/matches/${canonicalSlug}`;
  const shareText = `${getMatchTitle(
    fixture.home_team_name,
    fixture.away_team_name
  )}  -  ${formatDateOnly(fixture.match_date)}  -  World Cup 2026 Hub`;

  return (
    <div data-match-page className="w-full max-w-full overflow-x-clip py-10 sm:py-14">
      <Container>
                <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Fixtures", path: "/fixtures" },
            {
              name: `${fixture.home_team_name ?? "Home"} vs ${
                fixture.away_team_name ?? "Away"
              }`,
              path: `/matches/${canonicalSlug}`,
            },
          ])}
        />

        <JsonLd
          data={sportsEventJsonLd({
            name: `${fixture.home_team_name ?? "Home"} vs ${
              fixture.away_team_name ?? "Away"
            }`,
            startDate: fixture.match_date,
            locationName: fixture.venue_name,
            locationCity: fixture.venue_city,
            homeTeam: fixture.home_team_name,
            awayTeam: fixture.away_team_name,
            path: `/matches/${canonicalSlug}`,
          })}
        />
        <MatchHeader fixture={fixture} />
        <nav data-sticky-nav className="sticky top-3 z-20 mt-6 w-full max-w-full overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/85 p-2 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <div className="flex w-max max-w-none gap-2">
            {[
              ["Overview", "overview"],
              ["Venue", "venue"],
              ["Preview", "preview"],
              ["Stats", "stats"],
              ["Lineups", "lineups"],
            ].map(([label, id]) => (
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
        <div id="venue" className="scroll-mt-24">
        <MatchVenueContext fixture={fixture} />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <MatchCountdown matchDate={fixture.match_date} label="Match countdown" />
          <WorldClock
            matchDate={fixture.match_date}
            venueLabel={fixture.venue_city ?? fixture.venue_name ?? "Venue"}
            venueTimeZone={getFixtureVenueTimeZone(fixture)}
          />
        </div>

        <div id="overview" className="mt-8 grid scroll-mt-24 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-6">
            <div id="preview" className="scroll-mt-24">
            <MatchPreviewBlock fixture={fixture} />
            </div>
            <MatchHeadToHeadCard headToHead={headToHead} />
            <InjuryList title="Match injury news" injuries={injuries} />
            <MatchEventsTimeline events={events} />
            <div id="stats" className="scroll-mt-24">
            <MatchStats fixture={fixture} stats={stats} />
            </div>
            <div id="lineups" className="scroll-mt-24">
            <MatchLineups lineups={lineups} />
            </div>

          </div>

          <aside className="grid content-start gap-6">
            <MatchShareButtons shareText={shareText} shareUrl={shareUrl} />
            <EmailSignupForm
              source="match_page"
              title="Get matchday updates"
              description="Join the list for World Cup updates, matchday notes and community features."
            />
                        {fixturePolls[0] ? (
              <PollCard poll={fixturePolls[0]} source="match_page" />
            ) : (
              <MatchPollPlaceholder fixture={fixture} />
            )}
          </aside>
        </div>
      </Container>
    </div>
  );
}







