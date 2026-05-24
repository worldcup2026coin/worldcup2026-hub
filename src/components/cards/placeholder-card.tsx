import type { PlaceholderCardData } from "@/lib/placeholder-data";

const toneClasses = {
  emerald:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-200 shadow-emerald-950/30",
  sky: "border-sky-400/20 bg-sky-400/10 text-sky-200 shadow-sky-950/30",
  violet:
    "border-violet-400/20 bg-violet-400/10 text-violet-200 shadow-violet-950/30",
  amber:
    "border-amber-400/20 bg-amber-400/10 text-amber-200 shadow-amber-950/30",
  rose: "border-rose-400/20 bg-rose-400/10 text-rose-200 shadow-rose-950/30",
  slate:
    "border-slate-400/20 bg-slate-400/10 text-slate-200 shadow-slate-950/30",
};

type PlaceholderCardProps = PlaceholderCardData & {
  className?: string;
};

export function PlaceholderCard({
  eyebrow,
  title,
  description,
  meta,
  tone = "slate",
  className = "",
}: PlaceholderCardProps) {
  return (
    <article
      className={`group rounded-3xl border p-5 shadow-2xl transition duration-200 hover:-translate-y-1 hover:border-white/20 ${toneClasses[tone]} ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-80">
          {eyebrow}
        </p>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/70">
          Phase 1
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>

      {meta ? (
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
          {meta}
        </p>
      ) : null}
    </article>
  );
}
