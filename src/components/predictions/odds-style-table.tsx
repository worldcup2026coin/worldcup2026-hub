import type { OddsStyleRecord } from "@/lib/data/predictions";
import { PredictionEmptyState } from "@/components/predictions/prediction-empty-state";

type OddsStyleTableProps = {
  records: OddsStyleRecord[];
};

export function OddsStyleTable({ records }: OddsStyleTableProps) {
  if (records.length === 0) {
    return (
      <PredictionEmptyState
        title="Odds unavailable"
        description="Odds-style snapshots will appear here when reliable market data is available."
      />
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30">
      <h2 className="text-2xl font-black text-white">Odds-style records</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Informational odds-style display only. No affiliate links are included.
      </p>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Market</th>
              <th className="px-4 py-3 text-left">Selection</th>
              <th className="px-4 py-3 text-center">Odds</th>
              <th className="px-4 py-3 text-left">Bookmaker</th>
              <th className="px-4 py-3 text-left">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {records.map((record) => (
              <tr key={record.id} className="text-slate-200">
                <td className="px-4 py-3 font-bold text-white">
                  {record.market}
                </td>
                <td className="px-4 py-3">{record.selection}</td>
                <td className="px-4 py-3 text-center font-black text-emerald-200">
                  {record.odds_decimal ?? "-"}
                </td>
                <td className="px-4 py-3">{record.bookmaker ?? "-"}</td>
                <td className="px-4 py-3">{record.source ?? "Manual"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
