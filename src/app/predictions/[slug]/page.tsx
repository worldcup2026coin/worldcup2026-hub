import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { MatchHeader } from "@/components/matches/match-header";
import { MatchPredictionSections } from "@/components/predictions/match-prediction-sections";
import {
  getPredictionPageDataBySlug,
  getPredictionTypeLabel,
} from "@/lib/data/predictions";
import {
  getMatchBySlug,
  getMatchTitle,
  getPublicSiteUrl,
} from "@/lib/data/matches";

export const dynamic = "force-dynamic";

type PredictionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PredictionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = await getMatchBySlug(slug);
  const siteUrl = getPublicSiteUrl();

  if (!match) {
    return {
      title: "Prediction not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const matchName = getMatchTitle(
    match.fixture.home_team_name,
    match.fixture.away_team_name
  );

  const title = `${matchName} | World Cup 2026 Predictions & Fan Insights`;
  const description = `Read safe World Cup 2026 fan predictions, fantasy-style players to watch and risk-labelled betting-style views for ${matchName}.`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: `/predictions/${match.canonicalSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `/predictions/${match.canonicalSlug}`,
      siteName: "World Cup 2026 Hub",
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function PredictionDetailPage({
  params,
}: PredictionPageProps) {
  const { slug } = await params;
  const data = await getPredictionPageDataBySlug(slug);

  if (!data) {
    notFound();
  }

  if (slug !== data.canonicalSlug) {
    permanentRedirect(`/predictions/${data.canonicalSlug}`);
  }

  const typeLabels = Array.from(
    new Set(data.tips.map((tip) => getPredictionTypeLabel(tip.type)))
  );

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <MatchHeader fixture={data.fixture} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/matches/${data.canonicalSlug}`}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
          >
            View match centre
          </Link>
          <Link
            href="/predictions"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
          >
            All predictions
          </Link>
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
            Prediction coverage
          </p>
          <h1 className="mt-3 text-3xl font-black text-white">
            {data.fixture.home_team_name ?? "Home"} vs{" "}
            {data.fixture.away_team_name ?? "Away"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {typeLabels.length > 0
              ? `Published sections: ${typeLabels.join(", ")}.`
              : "No prediction content has been published for this match yet."}
          </p>
        </section>

        <div className="mt-8">
          <MatchPredictionSections
            fixture={data.fixture}
            tips={data.tips}
            oddsRecords={data.oddsRecords}
          />
        </div>
      </Container>
    </div>
  );
}