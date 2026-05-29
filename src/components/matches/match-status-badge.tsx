
import { getMatchStatusInfo } from "@/lib/worldcup/match-status";

type MatchStatusBadgeProps = {
  statusShort: string | null | undefined;
  statusLong?: string | null;
};

const statusStyles = {
  not_started: "border-cyan-300/35 bg-cyan-300/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.13)]",
  live: "border-fuchsia-300/45 bg-fuchsia-400/15 text-fuchsia-100 shadow-[0_0_20px_rgba(255,43,214,0.20)]",
  half_time: "border-amber-300/40 bg-amber-300/15 text-amber-100",
  finished: "border-lime-300/35 bg-lime-300/10 text-lime-100 shadow-[0_0_18px_rgba(163,255,18,0.13)]",
  extra_time: "border-fuchsia-300/35 bg-fuchsia-400/10 text-fuchsia-100",
  penalties: "border-purple-300/35 bg-purple-400/10 text-purple-100",
  postponed: "border-orange-300/35 bg-orange-400/10 text-orange-100",
  cancelled: "border-slate-400/30 bg-slate-400/10 text-slate-200",
  unknown: "border-white/10 bg-white/10 text-slate-200",
};

export function MatchStatusBadge({
  statusShort,
  statusLong,
}: MatchStatusBadgeProps) {
  const status = getMatchStatusInfo(statusShort, statusLong);

  return (
    <span
      className={`inline-flex min-w-max whitespace-nowrap rounded-full border px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.08em] sm:text-xs sm:tracking-[0.16em] ${statusStyles[status.kind]}`}
      title={statusLong ?? statusShort ?? undefined}
    >
      {status.kind === "live" ? "● " : ""}
      {status.label}
    </span>
  );
}
