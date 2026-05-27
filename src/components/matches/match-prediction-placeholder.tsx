import type { Fixture } from "@/lib/data/worldcup";

type MatchPredictionPlaceholderProps = {
  fixture: Fixture;
};

export function MatchPredictionPlaceholder({
  fixture,
}: MatchPredictionPlaceholderProps) {
  return (
    <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6 shadow-2xl shadow-slate-950/30">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
        Prediction context
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        Fan prediction and players to watch
      </h2>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl bg-slate-950/50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Fan prediction
          </p>
          <p className="mt-2 text-sm text-slate-300">
            A simple prediction card for {fixture.home_team_name ?? "Home"} vs{" "}
            {fixture.away_team_name ?? "Away"} will be added later.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-950/50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Fantasy-style players to watch
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Player watchlists will come after squad/player data is available.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-950/50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Football read
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Prediction data is unavailable for this match right now.
          </p>
        </div>
      </div>

      <p className="mt-5 text-xs leading-5 text-amber-100/80">
        Responsible use: future prediction content should be treated as
        informational football analysis only, never as certain advice.
      </p>
    </section>
  );
}


