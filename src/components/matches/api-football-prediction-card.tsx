import type { MatchPrediction } from "@/lib/data/matches";
import { MatchEmptyState } from "@/components/matches/match-empty-state";

type ApiFootballPredictionCardProps = {
  prediction: MatchPrediction | null;
};

function parsePercent(value: unknown) {
  if (value === null || value === undefined) return null;

  const cleaned = String(value).replace("%", "").trim();
  if (!cleaned) return null;

  const numberValue = Number(cleaned);
  if (!Number.isFinite(numberValue)) return null;

  return numberValue;
}

function formatPercent(value: unknown) {
  const parsed = parsePercent(value);
  if (parsed === null) return null;

  return `${Math.round(parsed)}%`;
}

function hasRealPredictionData(prediction: MatchPrediction | null) {
  if (!prediction) return false;

  const home = parsePercent(prediction.percent_home);
  const draw = parsePercent(prediction.percent_draw);
  const away = parsePercent(prediction.percent_away);

  const values = [home, draw, away];

  if (values.some((value) => value === null)) {
    return false;
  }

  const isDefaultEvenSplit = values.every(
    (value) => value !== null && Math.round(value) === 33
  );

  if (isDefaultEvenSplit && !prediction.winner_name && !prediction.advice) {
    return false;
  }

  return values.some((value) => value !== null && value > 0);
}

export function ApiFootballPredictionCard({
  prediction,
}: ApiFootballPredictionCardProps) {
  if (!hasRealPredictionData(prediction)) {
    return (
      <MatchEmptyState
        title="Prediction data not available yet"
        description="API prediction data is not available for this match yet. This section will update automatically when the match-context sync receives prediction data."
      />
    );
  }

  const percentages = [
    { label: "Home", value: formatPercent(prediction?.percent_home) },
    { label: "Draw", value: formatPercent(prediction?.percent_draw) },
    { label: "Away", value: formatPercent(prediction?.percent_away) },
  ].filter((item) => item.value);

  return (
    <section className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.04] p-5 shadow-2xl shadow-slate-950/30">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
        API prediction signal
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        {prediction?.winner_name
          ? `${prediction.winner_name} lean`
          : "Prediction signal available"}
      </h2>

      {prediction?.winner_comment ? (
        <p className="mt-2 text-sm font-bold text-emerald-100">
          {prediction.winner_comment}
        </p>
      ) : null}

      {prediction?.advice ? (
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {prediction.advice}
        </p>
      ) : null}

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

      <p className="mt-4 text-xs leading-5 text-slate-400">
        API-Football prediction data is informational only and does not guarantee any outcome.
      </p>
    </section>
  );
}
