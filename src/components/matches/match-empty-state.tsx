
type MatchEmptyStateProps = {
  title: string;
  description: string;
};

export function MatchEmptyState({ title, description }: MatchEmptyStateProps) {
  return (
    <div className="neon-panel rounded-3xl border-dashed p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-2xl">
        ⚡
      </div>
      <h3 className="mt-4 text-xl font-black uppercase tracking-tight text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-300">
        {description.toLowerCase().includes("lineup")
          ? "Lineups are still in the tunnel. They will drop here when the feed updates."
          : description.toLowerCase().includes("stat")
            ? "Stats will light up when the feed updates."
            : description}
      </p>
    </div>
  );
}
