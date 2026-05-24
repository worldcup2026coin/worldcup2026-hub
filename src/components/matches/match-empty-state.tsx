type MatchEmptyStateProps = {
  title: string;
  description: string;
};

export function MatchEmptyState({ title, description }: MatchEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">
        ⚽
      </div>
      <h3 className="mt-4 text-lg font-black text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-300">
        {description}
      </p>
    </div>
  );
}
