
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
    <section className="neon-card rounded-[2rem] p-5">
      <p className="neon-kicker">Market signal</p>
      <h2 className="mt-4 text-2xl font-black uppercase text-white">Odds-style records</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Informational odds-style display only. No affiliate links are included.
      </p>

      <div className="cyber-table mt-5">
        <table className="min-w-[720px] text-sm">
          <thead>
            <tr>
              <th className="text-left">Market</th>
              <th className="text-left">Selection</th>
              <th className="text-center">Odds</th>
              <th className="text-left">Bookmaker</th>
              <th className="text-left">Source</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="text-slate-200">
                <td className="font-black text-white">{record.market}</td>
                <td>{record.selection}</td>
                <td className="text-center text-lg font-black text-lime-200">
                  {record.odds_decimal ?? "-"}
                </td>
                <td>{record.bookmaker ?? "-"}</td>
                <td>{record.source ?? "Manual"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
