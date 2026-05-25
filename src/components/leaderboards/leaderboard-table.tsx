import type { LeaderboardRow } from "@/lib/data/leaderboards";

type Props = {
  title: string;
  valueLabel: string;
  rows: LeaderboardRow[];
};

export function LeaderboardTable({
  title,
  valueLabel,
  rows,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-3xl font-black text-white">
        {title}
      </h1>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white/5 p-4 text-slate-300">
          No data available yet from API-Football.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3">#</th>
                <th className="py-3">Player</th>
                <th className="py-3">Team</th>
                <th className="py-3">{valueLabel}</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={`${row.api_player_id}-${index}`}
                  className="border-b border-white/5"
                >
                  <td className="py-3">{index + 1}</td>

                  <td className="py-3 font-semibold text-white">
                    {row.player_name ?? "Unknown"}
                  </td>

                  <td className="py-3 text-slate-300">
                    {row.team_name ?? "-"}
                  </td>

                  <td className="py-3 text-emerald-400 font-bold">
                    {row.value_numeric ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

