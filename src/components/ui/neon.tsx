
import type { ReactNode } from "react";

type Tone = "lime" | "cyan" | "pink" | "gold" | "slate";

const toneClasses: Record<Tone, string> = {
  lime: "border-lime-300/30 bg-lime-300/10 text-lime-100 shadow-[0_0_24px_rgba(163,255,18,0.10)]",
  cyan: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.10)]",
  pink: "border-fuchsia-300/30 bg-fuchsia-400/10 text-fuchsia-100 shadow-[0_0_24px_rgba(255,43,214,0.10)]",
  gold: "border-amber-300/30 bg-amber-300/10 text-amber-100 shadow-[0_0_24px_rgba(255,209,102,0.10)]",
  slate: "border-white/10 bg-white/[0.055] text-slate-100 shadow-[0_0_24px_rgba(255,255,255,0.04)]",
};

export function NeonCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`neon-card rounded-[2rem] p-5 ${className}`}>{children}</div>;
}

export function HeroPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`hero-panel rounded-[2.25rem] p-6 sm:p-10 ${className}`}>{children}</section>;
}

export function NeonBadge({
  children,
  tone = "lime",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${toneClasses[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function StatPill({
  label,
  value,
  tone = "lime",
}: {
  label: string;
  value: string | number;
  tone?: Tone;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${toneClasses[tone]}`}>
      <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] opacity-75">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

export function GlowButton({
  children,
  href,
  variant = "primary",
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  const className = variant === "primary" ? "glow-button-primary" : "glow-button-secondary";

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
