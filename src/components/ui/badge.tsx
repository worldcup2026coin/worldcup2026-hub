
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  tone?: "lime" | "cyan" | "pink" | "gold" | "slate";
};

const tones = {
  lime: "border-lime-300/35 bg-lime-300/10 text-lime-200 shadow-[0_0_18px_rgba(163,255,18,0.12)]",
  cyan: "border-cyan-300/35 bg-cyan-300/10 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.12)]",
  pink: "border-fuchsia-300/35 bg-fuchsia-400/10 text-fuchsia-200 shadow-[0_0_18px_rgba(255,43,214,0.12)]",
  gold: "border-amber-300/35 bg-amber-300/10 text-amber-200 shadow-[0_0_18px_rgba(255,209,102,0.12)]",
  slate: "border-white/10 bg-white/10 text-slate-200",
};

export function Badge({ children, className = "", tone = "lime" }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.22em] ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
