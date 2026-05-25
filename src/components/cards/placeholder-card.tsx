
import type { PlaceholderCardData } from "@/lib/placeholder-data";

const toneClasses = {
  emerald:
    "border-lime-300/25 bg-lime-300/10 text-lime-100 shadow-[0_0_24px_rgba(163,255,18,0.10)]",
  sky: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.10)]",
  violet:
    "border-fuchsia-300/25 bg-fuchsia-400/10 text-fuchsia-100 shadow-[0_0_24px_rgba(255,43,214,0.10)]",
  amber:
    "border-amber-300/25 bg-amber-300/10 text-amber-100 shadow-[0_0_24px_rgba(255,209,102,0.10)]",
  rose: "border-fuchsia-300/25 bg-fuchsia-400/10 text-fuchsia-100 shadow-[0_0_24px_rgba(255,43,214,0.10)]",
  slate:
    "border-cyan-300/18 bg-white/[0.055] text-slate-100 shadow-[0_0_24px_rgba(34,211,238,0.06)]",
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
      className={`neon-card group rounded-[2rem] border p-5 transition duration-200 ${toneClasses[tone]} ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-black uppercase tracking-[0.22em] opacity-85">
          {eyebrow}
        </p>
        <span className="neon-badge">Signal</span>
      </div>

      <h3 className="mt-5 text-2xl font-black uppercase tracking-tight text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>

      {meta ? (
        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-white/55">
          {meta}
        </p>
      ) : null}
    </article>
  );
}
