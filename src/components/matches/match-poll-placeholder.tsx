import type { Fixture } from "@/lib/data/worldcup";

type MatchPollPlaceholderProps = {
  fixture: Fixture;
};

export function MatchPollPlaceholder({ fixture }: MatchPollPlaceholderProps) {
  return (
    <section className="rounded-3xl border border-violet-400/20 bg-violet-400/10 p-6 shadow-2xl shadow-slate-950/30">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-200">
        Fan poll
      </p>
      <h2 className="mt-3 text-2xl font-black text-white">Who wins?</h2>

      <div className="mt-5 grid gap-3">
        {[fixture.home_team_name ?? "Home", "Draw", fixture.away_team_name ?? "Away"].map(
          (option) => (
            <button
              key={option}
              type="button"
              disabled
              className="min-h-11 rounded-2xl border border-white/10 bg-slate-950/50 px-4 text-sm font-bold text-white opacity-80"
            >
              {option}
            </button>
          )
        )}
      </div>

      <p className="mt-4 text-xs text-violet-100/80">
        Static placeholder only. Real polls will be built in a later phase.
      </p>
    </section>
  );
}
