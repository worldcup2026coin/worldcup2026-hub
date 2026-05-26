import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import { PredictionCard } from "@/components/predictions/prediction-card";
import { PredictionEmptyState } from "@/components/predictions/prediction-empty-state";
import { ResponsibleUseDisclaimer } from "@/components/predictions/responsible-use-disclaimer";
import { getPredictionsIndexData } from "@/lib/data/predictions";
import { formatVenueDateTime } from "@/lib/worldcup/format";

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

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            [
              "Match angle",
              "Every preview starts with the game state: stakes, venue, group pressure and team context.",
            ],
            [
              "Risk notes",
              "Prediction cards separate low-confidence reads from stronger signals and avoid fake certainty.",
            ],
            [
              "Likely script",
              "Fan previews describe how the match may unfold instead of dumping raw odds or data tables.",
            ],
          ].map(([title, copy]) => (
            <article key={title} className="neon-card rounded-[2rem] p-5">
              <span className="neon-badge neon-badge-cyan">Fan preview</span>
              <h2 className="mt-4 text-2xl font-black uppercase text-white">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
            </article>
          ))}
        </section>

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
                  <article className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                      Match angle
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">
                      {item.matchTitle} is scheduled for{" "}
                      {formatVenueDateTime(item.fixture)}. The preview should
                      read the venue, group pressure and available team data
                      before any lean.
                    </p>
                  </article>
                  <article className="rounded-3xl border border-lime-300/20 bg-lime-300/10 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-100">
                      Likely script
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">
                      Expect this page to frame tempo, first-goal pressure and
                      late-game risk once published analysis is available.
                    </p>
                  </article>
                  <article className="rounded-3xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-100">
                      Risk note
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">
                      Risk labels are fan context only. Lineups, venue changes
                      and injuries can move the read quickly.
                    </p>
                  </article>
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
