import type { MatchPrediction } from "@/lib/data/matches";
import { MatchEmptyState } from "@/components/matches/match-empty-state";

type ApiFootballPredictionCardProps = {
  prediction: MatchPrediction | null;
};

export function ApiFootballPredictionCard({
  prediction,
}: ApiFootballPredictionCardProps) {
  if (!prediction) {
    return (
      <MatchEmptyState
        title="API prediction not available yet"
        description="Prediction data will appear here automatically once API-Football publishes it and the match-context sync has run."
      />
    );
  }

  const percentages = [
    { label: "Home", value: prediction.percent_home },
    { label: "Draw", value: prediction.percent_draw },
    { label: "Away", value: prediction.percent_away },
  ].filter((item) => item.value);

  return (
    <section className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.04] p-5 shadow-2xl shadow-slate-950/30">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
        API prediction
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        {prediction.winner_name
          ? `${prediction.winner_name} lean`
          : "Prediction signal available"}
      </h2>

      {prediction.winner_comment ? (
        <p className="mt-2 text-sm font-bold text-emerald-100">
          {prediction.winner_comment}
        </p>
      ) : null}

      {prediction.advice ? (
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {prediction.advice}
        </p>
      ) : null}

      {percentages.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {percentages.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/[0.05] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-5 text-slate-400">
        API-Football prediction data is informational only and not a guarantee
        of outcome.
      </p>
    </section>
  );
}
