
type PredictionEmptyStateProps = {
  title: string;
  description: string;
};

function copy(description: string) {
  if (description.toLowerCase().includes("odds")) {
    return "Odds-style snapshots will appear when the market signal is reliable.";
  }

  if (description.toLowerCase().includes("prediction")) {
    return "No prediction signal published for this match yet.";
  }

  return description;
}

export function PredictionEmptyState({
  title,
  description,
}: PredictionEmptyStateProps) {
  return (
    <div className="neon-panel rounded-3xl border-dashed p-6 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-fuchsia-300/25 bg-fuchsia-400/10 text-xl shadow-[0_0_20px_rgba(255,43,214,0.12)]">
        🧠
      </div>
      <h3 className="mt-4 text-lg font-black uppercase tracking-tight text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-300">
        {copy(description)}
      </p>
    </div>
  );
}
