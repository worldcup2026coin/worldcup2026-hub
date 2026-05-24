import type { PredictionRiskLevel } from "@/lib/data/predictions";

type RiskBadgeProps = {
  riskLevel: PredictionRiskLevel;
};

const styles = {
  low: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  medium: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  high: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  no_lean: "border-slate-400/30 bg-slate-400/10 text-slate-200",
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
