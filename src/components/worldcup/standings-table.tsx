import Link from "next/link";
import type { Standing } from "@/lib/data/worldcup";
import { teamSlug } from "@/lib/worldcup/format";

type StandingsTableProps = {
  groupName: string;
  rows: Standing[];
};

export function StandingsTable({ groupName, rows }: StandingsTableProps) {
  const sortedRows = [...rows].sort((a, b) => {
    const rankA = a.rank ?? 999;
    const rankB = b.rank ?? 999;

    return rankA - rankB;
  });

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] shadow-2xl shadow-slate-950/30">
      <div className="border-b border-white/10 bg-white/[0.04] px-5 py-4">
        <h2 className="text-xl font-black text-white">{groupName}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-950/60 text-xs uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Pos</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3 text-center">P</th>
              <th className="px-4 py-3 text-center">W</th>
              <th className="px-4 py-3 text-center">D</th>
              <th className="px-4 py-3 text-center">L</th>
              <th className="px-4 py-3 text-center">GF</th>
              <th className="px-4 py-3 text-center">GA</th>
              <th className="px-4 py-3 text-center">GD</th>
              <th className="px-4 py-3 text-center">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sortedRows.map((row) => (
              <tr key={row.id} className="text-slate-200">
                <td className="px-4 py-4 font-black text-white">
                  {row.rank ?? "-"}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/teams/${teamSlug(row.team_name, row.api_team_id)}`}
                    className="flex min-w-0 items-center gap-3 font-bold text-white transition hover:text-emerald-200"
                  >
                    {row.team_logo_url ? (
                      <img
                        src={row.team_logo_url}
                        alt={`${row.team_name} logo`}
                        className="h-7 w-7 rounded-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="h-7 w-7 rounded-full bg-white/10" />
                    )}
                    <span className="truncate">{row.team_name}</span>
                  </Link>
                </td>
                <td className="px-4 py-4 text-center">{row.played ?? 0}</td>
                <td className="px-4 py-4 text-center">{row.wins ?? 0}</td>
                <td className="px-4 py-4 text-center">{row.draws ?? 0}</td>
                <td className="px-4 py-4 text-center">{row.losses ?? 0}</td>
                <td className="px-4 py-4 text-center">{row.goals_for ?? 0}</td>
                <td className="px-4 py-4 text-center">
                  {row.goals_against ?? 0}
                </td>
                <td className="px-4 py-4 text-center">
                  {row.goals_diff ?? 0}
                </td>
                <td className="px-4 py-4 text-center font-black text-emerald-200">
                  {row.points ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
