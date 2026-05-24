import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { MatchEventsTimeline } from "@/components/matches/match-events-timeline";
import { MatchHeader } from "@/components/matches/match-header";
import { MatchLineups } from "@/components/matches/match-lineups";
import { MatchPollPlaceholder } from "@/components/matches/match-poll-placeholder";
import { MatchPreviewBlock } from "@/components/matches/match-preview-block";
import { MatchShareButtons } from "@/components/matches/match-share-buttons";
import { MatchStats } from "@/components/matches/match-stats";
import { MatchPredictionSections } from "@/components/predictions/match-prediction-sections";
import {
  getMatchBySlug,
  getMatchPageData,
  getMatchTitle,
  getPublicSiteUrl,
} from "@/lib/data/matches";
import { getPredictionContentForFixture } from "@/lib/data/predictions";
import { formatDateOnly } from "@/lib/worldcup/format";

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

  const description = `Follow ${matchName} at World Cup 2026 with live score, match stats, team news, predictions and fan insights.`;

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

  const { fixture, canonicalSlug, events, stats, lineups } = data;

  const predictionContent = await getPredictionContentForFixture(fixture.id);

  const siteUrl = getPublicSiteUrl();
  const shareUrl = `${siteUrl}/matches/${canonicalSlug}`;
  const shareText = `${getMatchTitle(
    fixture.home_team_name,
    fixture.away_team_name
  )} · ${formatDateOnly(fixture.match_date)} · World Cup 2026 Hub`;

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <MatchHeader fixture={fixture} />

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-6">
            <MatchPreviewBlock fixture={fixture} />
            <MatchEventsTimeline events={events} />
            <MatchStats fixture={fixture} stats={stats} />
            <MatchLineups lineups={lineups} />

            <section className="rounded-[2rem] border border-emerald-400/15 bg-emerald-400/[0.04] p-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                Tips and predictions
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Fan insights, fantasy notes and betting-style views
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                This content is manually managed in Supabase for now. No full
                prediction engine is active in Phase 5.
              </p>

              <div className="mt-5">
                <MatchPredictionSections
                  fixture={fixture}
                  tips={predictionContent.tips}
                  oddsRecords={predictionContent.oddsRecords}
                />
              </div>
            </section>
          </div>

          <aside className="grid content-start gap-6">
            <MatchShareButtons shareText={shareText} shareUrl={shareUrl} />
            <MatchPollPlaceholder fixture={fixture} />
          </aside>
        </div>
      </Container>
    </div>
  );
}