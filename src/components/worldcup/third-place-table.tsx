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
  if (row.third_place_status === "qualifying") return "Currently qualifying";
  return "Currently outside the cut";
}

function rowClassName(row: ThirdPlacedTeam) {
  if (row.third_place_status === "qualifying") {
    return "border-emerald-400/20 bg-emerald-400/[0.08]";
  }

  if (row.third_place_status === "eliminated") {
    return "border-rose-400/20 bg-rose-400/[0.07]";
  }

  return "border-white/10 bg-white/[0.045]";
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
      <section className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.04] p-6 text-center">
        <h2 className="text-2xl font-black text-white">
          Third-place table pending
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          No group standings are available yet. Once standings are synced, this
          page will automatically identify each group’s third-placed team.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
            Live third-place ranking table
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            Best third-placed teams
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            The top eight third-placed teams qualify for the Round of 32. The
            bottom four are currently outside the cut. Rankings remain
            provisional until group matches and official tiebreaker data are
            complete.
          </p>
        </div>

        <p className="text-xs text-slate-400">
          Last updated: {formatLastUpdated(latestSync)}
        </p>
      </div>

      {!hasAllGroups ? (
        <div className="mt-5 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
          Standings are still incomplete. Showing the third-placed teams
          currently available from synced group data.
        </div>
      ) : null}

      <div className="mt-5 overflow-x-auto rounded-3xl border border-white/10">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Rank</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-left">Group</th>
              <th className="px-4 py-3 text-center">Played</th>
              <th className="px-4 py-3 text-center">Points</th>
              <th className="px-4 py-3 text-center">GD</th>
              <th className="px-4 py-3 text-center">GF</th>
              <th className="px-4 py-3 text-center">GA</th>
              <th className="px-4 py-3 text-center">Conduct</th>
              <th className="px-4 py-3 text-center">FIFA rank</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.slice(0, compact ? 12 : undefined).map((row) => (
              <tr
                key={`${row.group_name}-${row.api_team_id}`}
                className={rowClassName(row)}
              >
                <td className="px-4 py-3 font-black text-white">
                  {row.third_place_rank}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {row.team_logo_url ? (
                      <img
                        src={row.team_logo_url}
                        alt=""
                        className="h-7 w-7 rounded-full object-contain"
                        loading="lazy"
                      />
                    ) : null}
                    <span className="font-black text-white">
                      {row.team_name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">{row.group_name}</td>
                <td className="px-4 py-3 text-center text-slate-200">
                  {formatNumber(row.played)}
                </td>
                <td className="px-4 py-3 text-center font-black text-white">
                  {formatNumber(row.points)}
                </td>
                <td className="px-4 py-3 text-center text-slate-200">
                  {formatNumber(row.goals_diff)}
                </td>
                <td className="px-4 py-3 text-center text-slate-200">
                  {formatNumber(row.goals_for)}
                </td>
                <td className="px-4 py-3 text-center text-slate-200">
                  {formatNumber(row.goals_against)}
                </td>
                <td className="px-4 py-3 text-center text-slate-200">
                  {formatNumber(row.team_conduct_score)}
                </td>
                <td className="px-4 py-3 text-center text-slate-200">
                  {formatNumber(row.fifa_ranking)}
                </td>
                <td className="px-4 py-3">
                  <span className="font-bold text-white">
                    {statusLabel(row)}
                  </span>
                  {!compact ? (
                    <p className="mt-1 text-xs leading-5 text-slate-300">
                      {row.explanation}
                    </p>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        Team conduct and FIFA ranking are only used when required tiebreakers
        are available. If those fields are missing from the API data, the table
        does not invent them.
      </p>
    </section>
  );
}
