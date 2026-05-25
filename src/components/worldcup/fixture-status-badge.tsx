
import { getFixtureDisplayStatus } from "@/lib/worldcup/format";

type FixtureStatusBadgeProps = {
  statusShort: string | null | undefined;
  statusLong?: string | null;
};

const styles = {
  upcoming: "border-cyan-300/35 bg-cyan-300/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.13)]",
  live: "border-fuchsia-300/45 bg-fuchsia-400/15 text-fuchsia-100 shadow-[0_0_20px_rgba(255,43,214,0.20)]",
  finished: "border-lime-300/35 bg-lime-300/10 text-lime-100 shadow-[0_0_18px_rgba(163,255,18,0.13)]",
  postponed: "border-amber-300/35 bg-amber-300/10 text-amber-100",
  cancelled: "border-slate-400/30 bg-slate-400/10 text-slate-200",
  unknown: "border-white/10 bg-white/10 text-slate-200",
};

const labels = {
  upcoming: "Upcoming",
  live: "Live",
  finished: "Finished",
  postponed: "Changed",
  cancelled: "Cancelled",
  unknown: "Signal TBC",
};

export function FixtureStatusBadge({
  statusShort,
  statusLong,
}: FixtureStatusBadgeProps) {
  const displayStatus = getFixtureDisplayStatus(statusShort);

  return (
    <span
      title={statusLong ?? statusShort ?? undefined}
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${styles[displayStatus]}`}
    >
      {displayStatus === "live" ? "● " : ""}
      {labels[displayStatus]}
    </span>
  );
}
