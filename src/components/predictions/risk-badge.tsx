
import type { PredictionRiskLevel } from "@/lib/data/predictions";

type RiskBadgeProps = {
  riskLevel: PredictionRiskLevel;
};

const styles = {
  low: "border-lime-300/35 bg-lime-300/10 text-lime-100 shadow-[0_0_18px_rgba(163,255,18,0.12)]",
  medium: "border-amber-300/35 bg-amber-300/10 text-amber-100",
  high: "border-fuchsia-300/35 bg-fuchsia-400/10 text-fuchsia-100 shadow-[0_0_18px_rgba(255,43,214,0.12)]",
  no_lean: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
};

const labels = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
  no_lean: "No clear lean",
};

export function RiskBadge({ riskLevel }: RiskBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${styles[riskLevel]}`}
    >
      {labels[riskLevel]}
    </span>
  );
}
