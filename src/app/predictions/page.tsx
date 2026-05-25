import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import { PredictionCard } from "@/components/predictions/prediction-card";
import { PredictionEmptyState } from "@/components/predictions/prediction-empty-state";
import { ResponsibleUseDisclaimer } from "@/components/predictions/responsible-use-disclaimer";
import { getPredictionsIndexData } from "@/lib/data/predictions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "World Cup 2026 Predictions & Fan Insights",
  description:
    "World Cup 2026 match previews, fantasy-style notes, risk-labelled predictions and betting-style informational views.",
};

export default async function PredictionsPage() {
  const predictionItems = await getPredictionsIndexData();

  return (
    <>
      <PageHeader
        eyebrow="Predictions"
        title="World Cup 2026 predictions and fan insights"
        description="Safe, risk-labelled match preview content from Supabase. This section separates fan previews, fantasy-style notes and betting-style informational views."
        meta="No promised outcomes · No affiliate links · Informational views only"
      />

      <Container className="pb-14">
        <ResponsibleUseDisclaimer />

        {predictionItems.length === 0 ? (
          <div className="mt-8">
            <PredictionEmptyState
              title="No prediction published yet"
              description="Prediction and tip rows can be inserted through Supabase. Published rows will appear here automatically."
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            {predictionItems.map((item) => (
              <section
                key={item.fixture.id}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                      Match predictions
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-white">
                      {item.matchTitle}
                    </h2>
                  </div>

                  <a
                    href={`/predictions/${item.canonicalSlug}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    View prediction page
                  </a>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {item.tips.map((tip) => (
                    <PredictionCard
                      key={tip.id}
                      tip={tip}
                      fixture={item.fixture}
                      href={`/predictions/${item.canonicalSlug}`}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
