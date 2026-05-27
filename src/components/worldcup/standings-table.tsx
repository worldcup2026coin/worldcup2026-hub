
import Link from "next/link";
import Image from "next/image";
import type { Standing } from "@/lib/data/worldcup";
import { teamSlug } from "@/lib/worldcup/format";
import { TeamFlag } from "@/components/worldcup/team-flag";

type StandingsTableProps = {
  groupName: string;
  rows: Standing[];
};

function badgeForRank(rank: number | null | undefined) {
  if (!rank) return "Signal TBC";
  if (rank <= 2) return "Auto";
  if (rank === 3) return "3rd watch";
  return "Danger";
}

function rowGlow(rank: number | null | undefined) {
  if (!rank) return "";
  if (rank <= 2) return "bg-lime-300/[0.055]";
  if (rank === 3) return "bg-cyan-300/[0.055]";
  return "bg-fuchsia-400/[0.035]";
}

export function StandingsTable({ groupName, rows }: StandingsTableProps) {
  return (
    <section className="neon-card rounded-[2rem] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="neon-kicker">Group signal</p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white">
            {groupName}
          </h2>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          Top 2 auto · 3rd-place watch
        </p>
      </div>

      <div className="cyber-table mt-5">
        <table className="min-w-[820px] text-left text-sm">
          <thead>
            <tr>
              <th className="text-left">Rank</th>
              <th className="text-left">Team</th>
              <th className="text-center">P</th>
              <th className="text-center">W</th>
              <th className="text-center">D</th>
              <th className="text-center">L</th>
              <th className="text-center">GF</th>
              <th className="text-center">GA</th>
              <th className="text-center">GD</th>
              <th className="text-center">Pts</th>
              <th className="text-center">Signal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={`text-slate-200 ${rowGlow(row.rank)}`}>
                <td className="font-black text-white">
                  <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-xl border border-lime-300/25 bg-lime-300/10 text-lime-100">
                    {row.rank ?? "-"}
                  </span>
                </td>
                <td>
                  <Link
                    href={`/teams/${teamSlug(row.team_name, row.api_team_id)}`}
                    className="flex min-w-0 items-center gap-3 font-black text-white transition hover:text-lime-200"
                  >
                    {row.team_logo_url ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/10 p-1">
                        <Image
                          src={row.team_logo_url}
                          alt={`${row.team_name} logo`}
                          width={32}
                          height={32}
                          className="h-full w-full rounded-lg object-contain"
                        />
                      </span>
                    ) : (
                      <TeamFlag name={row.team_name} className="h-8 w-8 text-base" />
                    )}
                    <span className="truncate">{row.team_name}</span>
                  </Link>
                </td>
                <td className="text-center">{row.played ?? 0}</td>
                <td className="text-center">{row.wins ?? 0}</td>
                <td className="text-center">{row.draws ?? 0}</td>
                <td className="text-center">{row.losses ?? 0}</td>
                <td className="text-center">{row.goals_for ?? 0}</td>
                <td className="text-center">{row.goals_against ?? 0}</td>
                <td className="text-center font-bold">{row.goals_diff ?? 0}</td>
                <td className="text-center text-xl font-black text-lime-200">
                  {row.points ?? 0}
                </td>
                <td className="text-center">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-cyan-100">
                    {badgeForRank(row.rank)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

