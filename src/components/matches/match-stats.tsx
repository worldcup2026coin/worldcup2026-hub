import type { Fixture, MatchStatistic } from "@/lib/data/worldcup";
import { MatchEmptyState } from "@/components/matches/match-empty-state";

type MatchStatsProps = {
  fixture: Fixture;
  stats: MatchStatistic[];
};

function displayValue(value: string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
}

export function MatchStats({ fixture, stats }: MatchStatsProps) {
  if (stats.length === 0) {
    return (
      <MatchEmptyState
        title="No match stats yet"
        description="Possession, shots, shots on target, corners, fouls, cards and other stats will appear once match statistics are synced."
      />
    );
  }

  const statMap = new Map<
    string,
    {
      type: string;
      home: string | null;
      away: string | null;
    }
  >();

  for (const stat of stats) {
    const current = statMap.get(stat.stat_type) ?? {
      type: stat.stat_type,
      home: null,
      away: null,
    };

    if (stat.team_api_id === fixture.home_team_api_id) {
      current.home = stat.stat_value;
    }

    if (stat.team_api_id === fixture.away_team_api_id) {
      current.away = stat.stat_value;
    }

    statMap.set(stat.stat_type, current);
  }

  const rows = Array.from(statMap.values()).sort((a, b) =>
    a.type.localeCompare(b.type)
  );

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30">
      <h2 className="text-2xl font-black text-white">Match stats</h2>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">
                {fixture.home_team_name ?? "Home"}
              </th>
              <th className="px-4 py-3 text-center">Stat</th>
              <th className="px-4 py-3 text-right">
                {fixture.away_team_name ?? "Away"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row) => (
              <tr key={row.type} className="text-slate-200">
                <td className="px-4 py-3 font-black text-white">
                  {displayValue(row.home)}
                </td>
                <td className="px-4 py-3 text-center text-slate-300">
                  {row.type}
                </td>
                <td className="px-4 py-3 text-right font-black text-white">
                  {displayValue(row.away)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
