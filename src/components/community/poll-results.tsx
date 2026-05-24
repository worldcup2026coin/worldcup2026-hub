import type { PollResult } from "@/lib/data/community";

type PollResultsProps = {
  results: PollResult[];
  totalVotes: number;
};

export function PollResults({ results, totalVotes }: PollResultsProps) {
  return (
    <div className="grid gap-3">
      {results.map((result) => (
        <div key={result.optionId}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-white">{result.label}</span>
            <span className="text-slate-400">
              {result.percentage}% · {result.votes}
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${result.percentage}%` }}
            />
          </div>
        </div>
      ))}

      <p className="text-xs text-slate-500">
        {totalVotes} vote{totalVotes === 1 ? "" : "s"} recorded
      </p>
    </div>
  );
}
