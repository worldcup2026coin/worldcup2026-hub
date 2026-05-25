import type { MatchOddsRecord } from "@/lib/data/matches";
import { MatchEmptyState } from "@/components/matches/match-empty-state";

type MatchOddsSnapshotProps = {
  odds: MatchOddsRecord[];
};

type OddsValue = {
  value?: string;
  odd?: string;
  handicap?: string;
};

function getValues(values: unknown): OddsValue[] {
  if (!Array.isArray(values)) return [];

  return values
    .map((item) =>
      item && typeof item === "object" ? (item as OddsValue) : null
    )
    .filter((item): item is OddsValue => Boolean(item));
}

export function MatchOddsSnapshot({ odds }: MatchOddsSnapshotProps) {
  if (odds.length === 0) {
    return (
      <MatchEmptyState
        title="Odds snapshot not available yet"
        description="Bookmaker market data will appear here automatically when it is available from the API and the match-context sync has run."
      />
    );
  }

  const visibleOdds = odds.slice(0, 8);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
            Odds snapshot
          </p>
          <h2 className="mt-3 text-2xl font-black text-white">
            Synced market data
          </h2>
        </div>

        {odds[0]?.last_synced_at ? (
          <p className="text-xs text-slate-400">
            Last synced{" "}
            {new Date(odds[0].last_synced_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3">
        {visibleOdds.map((record) => {
          const values = getValues(record.values).slice(0, 4);

          return (
            <article
              key={`${record.api_fixture_id}-${record.bookmaker_id}-${record.bet_id}`}
              className="rounded-2xl bg-white/[0.04] p-4"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-black text-white">
                  {record.bet_name ?? "Market"}
                </h3>
                <p className="text-xs text-slate-400">
                  {record.bookmaker_name ?? "Bookmaker TBC"}
                </p>
              </div>

              {values.length > 0 ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {values.map((value, index) => (
                    <div
                      key={`${value.value ?? "selection"}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm"
                    >
                      <span className="text-slate-300">
                        {value.value ?? "Selection"}
                        {value.handicap ? ` ${value.handicap}` : ""}
                      </span>
                      <span className="font-black text-white">
                        {value.odd ?? "-"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  Market values are not available yet.
                </p>
              )}
            </article>
          );
        })}
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        Odds are displayed as synced API data only. Availability, prices and
        markets can change.
      </p>
    </section>
  );
}
