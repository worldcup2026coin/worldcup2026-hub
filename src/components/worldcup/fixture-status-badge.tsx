import { getFixtureDisplayStatus } from "@/lib/worldcup/format";

type FixtureStatusBadgeProps = {
  statusShort: string | null | undefined;
  statusLong?: string | null;
};

const styles = {
  upcoming: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  live: "border-rose-400/40 bg-rose-400/15 text-rose-200",
  finished: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  postponed: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  cancelled: "border-slate-400/30 bg-slate-400/10 text-slate-200",
  unknown: "border-white/10 bg-white/10 text-slate-200",
};

const labels = {
  upcoming: "Upcoming",
  live: "Live",
  finished: "Finished",
  postponed: "Postponed",
  cancelled: "Cancelled",
  unknown: "Status TBC",
};

export function FixtureStatusBadge({
  statusShort,
  statusLong,
}: FixtureStatusBadgeProps) {
  const displayStatus = getFixtureDisplayStatus(statusShort);

  return (
    <span
      title={statusLong ?? statusShort ?? undefined}
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${styles[displayStatus]}`}
    >
      {labels[displayStatus]}
    </span>
  );
}
