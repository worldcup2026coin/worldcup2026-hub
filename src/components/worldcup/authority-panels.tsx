import Link from "next/link";
import {
  formatFacts,
  historicTopScorers,
  pastFinals,
  tournamentTimeline,
  worldCupWinners,
} from "@/lib/data/authority";

export function FormatExplainerPanel() {
  return (
    <section className="neon-panel rounded-[2rem] p-6">
      <p className="neon-kicker">World Cup format</p>
      <h2 className="mt-4 text-3xl font-black uppercase text-white">
        48 teams, 12 groups, one bigger knockout race
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
        World Cup 2026 uses 12 groups of four. The top two in each group
        qualify automatically, then the eight best third-placed teams join them
        in a new Round of 32.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {formatFacts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4"
          >
            <p className="text-3xl font-black text-white">{fact.value}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-lime-200">
              {fact.label}
            </p>
          </div>
        ))}
      </div>
      <Link href="/best-third-placed-teams" className="glow-button-secondary mt-5">
        Best third-place explainer
      </Link>
    </section>
  );
}

export function TournamentTimelinePanel() {
  return (
    <section className="neon-panel rounded-[2rem] p-6">
      <p className="neon-kicker">Tournament timeline</p>
      <h2 className="mt-4 text-3xl font-black uppercase text-white">
        From opening match to final
      </h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        {tournamentTimeline.map((item) => (
          <article
            key={item.label}
            className="rounded-3xl border border-cyan-300/15 bg-slate-950/45 p-5"
          >
            <span className="neon-badge neon-badge-cyan">{item.label}</span>
            <p className="mt-4 text-sm font-black uppercase tracking-[0.14em] text-lime-200">
              {item.date}
            </p>
            <h3 className="mt-3 text-xl font-black text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WorldCupHistoryPanel() {
  return (
    <section className="neon-panel rounded-[2rem] p-6">
      <p className="neon-kicker">World Cup history</p>
      <h2 className="mt-4 text-3xl font-black uppercase text-white">
        Winners, scorers and recent finals
      </h2>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-lime-300/20 bg-lime-300/10 p-5">
          <h3 className="font-black uppercase text-white">Most titles</h3>
          <div className="mt-4 grid gap-2">
            {worldCupWinners.map(([team, titles]) => (
              <p key={team} className="flex justify-between gap-3 text-sm text-slate-200">
                <span>{team}</span>
                <span className="font-black text-lime-200">{titles}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
          <h3 className="font-black uppercase text-white">All-time scorers</h3>
          <div className="mt-4 grid gap-2">
            {historicTopScorers.map(([player, goals]) => (
              <p key={player} className="flex justify-between gap-3 text-sm text-slate-200">
                <span>{player}</span>
                <span className="font-black text-cyan-200">{goals}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-5">
          <h3 className="font-black uppercase text-white">Recent finals</h3>
          <div className="mt-4 grid gap-3">
            {pastFinals.map(([year, score, note]) => (
              <div key={year} className="text-sm text-slate-200">
                <p className="font-black text-fuchsia-100">{year} · {score}</p>
                <p className="mt-1 text-slate-400">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
