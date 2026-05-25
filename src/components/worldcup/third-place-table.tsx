
import type { Standing } from "@/lib/data/worldcup";
import {
  getThirdPlacedTeamsFromStandings,
  type ThirdPlacedTeam,
} from "@/lib/worldcup/third-place-ranking";
import { formatLastUpdated } from "@/lib/worldcup/format";

type ThirdPlaceTableProps = {
  standings: Standing[];
  latestSync?: string | null;
  compact?: boolean;
};

function formatNumber(value: number | null | undefined) {
  return value === null || value === undefined ? "—" : String(value);
}

function statusLabel(row: ThirdPlacedTeam) {
  if (row.third_place_status === "pending") return "Pending";
  if (row.third_place_status === "qualifying") return "Above cut";
  return "Danger zone";
}

function rowClassName(row: ThirdPlacedTeam) {
  if (row.third_place_status === "qualifying") {
    return "border-lime-300/25 bg-lime-300/[0.075] shadow-[0_0_22px_rgba(163,255,18,0.08)]";
  }

  if (row.third_place_status === "eliminated") {
    return "border-fuchsia-300/25 bg-fuchsia-400/[0.065] shadow-[0_0_22px_rgba(255,43,214,0.07)]";
  }

  return "border-cyan-300/18 bg-cyan-300/[0.045]";
}

export function ThirdPlaceTable({
  standings,
  latestSync,
  compact = false,
}: ThirdPlaceTableProps) {
  const rows = getThirdPlacedTeamsFromStandings(standings);
  const hasAllGroups = rows.length >= 12;

  if (rows.length === 0) {
    return (
      <section className="neon-panel rounded-[2rem] border-dashed p-6 text-center">
        <p className="neon-kicker mx-auto">3rd place signal</p>
        <h2 className="mt-4 text-3xl font-black uppercase text-white">
          Third-place table pending
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          No group standings are available yet. Once standings sync, this page
          will automatically identify each group’s third-placed team.
        </p>
      </section>
    );
  }

  return (
    <section className="neon-panel rounded-[2rem] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="sticker-tilt inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-fuchsia-100">
            3RD PLACE SIGNAL
          </span>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Best third-placed teams
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Top eight advance. Bottom four are outside the cut. Table updates from synced standings.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-100">
          <p className="font-black uppercase tracking-[0.16em]">Live context</p>
          <p className="mt-1 text-slate-300">
            {hasAllGroups ? "All 12 groups detected" : `${rows.length}/12 groups detected`}
            {latestSync ? ` · ${formatLastUpdated(latestSync)}` : ""}
          </p>
        </div>
      </div>

      <div className={`mt-6 grid gap-3 ${compact ? "" : "lg:grid-cols-2"}`}>
        {rows.map((row, index) => (
          <article
            key={`${row.group_name}-${row.team_name}-${index}`}
            className={`rounded-3xl border p-4 ${rowClassName(row)}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/55 text-sm font-black text-white">
                    #{index + 1}
                  </span>
                  <span className="neon-badge neon-badge-cyan">{row.group_name}</span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${
                    row.third_place_status === "qualifying"
                      ? "border-lime-300/35 bg-lime-300/10 text-lime-100"
                      : row.third_place_status === "eliminated"
                        ? "border-fuchsia-300/35 bg-fuchsia-400/10 text-fuchsia-100"
                        : "border-cyan-300/25 bg-cyan-300/10 text-cyan-100"
                  }`}>
                    {statusLabel(row)}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-black uppercase tracking-tight text-white">
                  {row.team_name ?? "Team TBC"}
                </h3>
              </div>

              <div className="text-right">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-slate-400">
                  Points
                </p>
                <p className="text-3xl font-black text-lime-200">
                  {formatNumber(row.points)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs font-black uppercase tracking-[0.12em] text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
                <p className="text-slate-500">GD</p>
                <p className="mt-1 text-white">{formatNumber(row.goals_diff)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
                <p className="text-slate-500">GF</p>
                <p className="mt-1 text-white">{formatNumber(row.goals_for)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
                <p className="text-slate-500">P</p>
                <p className="mt-1 text-white">{formatNumber(row.played)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
                <p className="text-slate-500">Rank</p>
                <p className="mt-1 text-white">{formatNumber(row.rank)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
