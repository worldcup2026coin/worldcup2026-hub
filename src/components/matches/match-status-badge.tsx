import { getMatchStatusInfo } from "@/lib/worldcup/match-status";

type MatchStatusBadgeProps = {
  statusShort: string | null | undefined;
  statusLong?: string | null;
};

const statusStyles = {
  not_started: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  live: "border-rose-400/40 bg-rose-400/15 text-rose-200",
  half_time: "border-amber-400/40 bg-amber-400/15 text-amber-100",
  finished: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  extra_time: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200",
  penalties: "border-purple-400/30 bg-purple-400/10 text-purple-200",
  postponed: "border-orange-400/30 bg-orange-400/10 text-orange-200",
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
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${statusStyles[status.kind]}`}
      title={statusLong ?? statusShort ?? undefined}
    >
      {status.label}
    </span>
  );
}
