import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { MatchEventsTimeline } from "@/components/matches/match-events-timeline";
import { MatchHeader } from "@/components/matches/match-header";
import { MatchLineups } from "@/components/matches/match-lineups";
import { MatchPollPlaceholder } from "@/components/matches/match-poll-placeholder";
import { MatchPredictionPlaceholder } from "@/components/matches/match-prediction-placeholder";
import { MatchPreviewBlock } from "@/components/matches/match-preview-block";
import { MatchShareButtons } from "@/components/matches/match-share-buttons";
import { MatchStats } from "@/components/matches/match-stats";
import { getMatchBySlug, getMatchPageData } from "@/lib/data/worldcup";
import { formatDateOnly } from "@/lib/worldcup/format";

export const dynamic = "force-dynamic";

type MatchPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function matchTitle(home?: string | null, away?: string | null) {
  return `${home ?? "Home"} vs ${away ?? "Away"}`;
}

export async function generateMetadata({
  params,
}: MatchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = await getMatchBySlug(slug);

  if (!match) {
    return {
      title: "Match not found",
    };
  }

  const { fixture, canonicalSlug } = match;
  const title = `${matchTitle(
    fixture.home_team_name,
    fixture.away_team_name
  )} | World Cup 2026 Preview, Live Score & Stats`;

  const description = `Follow ${matchTitle(
    fixture.home_team_name,
    fixture.away_team_name
  )} at World Cup 2026 with live score, match stats, team news, predictions and fan insights.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/matches/${canonicalSlug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
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

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://worldcup2026-hub.vercel.app";

  const shareUrl = `${siteUrl.replace(/\/+$/, "")}/matches/${canonicalSlug}`;
  const shareText = `${matchTitle(
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
          </div>

          <aside className="grid content-start gap-6">
            <MatchShareButtons shareText={shareText} shareUrl={shareUrl} />
            <MatchPredictionPlaceholder fixture={fixture} />
            <MatchPollPlaceholder fixture={fixture} />
          </aside>
        </div>
      </Container>
    </div>
  );
}