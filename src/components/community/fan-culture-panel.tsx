export function FanCulturePanel() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/30">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-fuchsia-300">
        Fan culture
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        Matchday fan reactions
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        Follow football-first fan reactions, social posts, matchday humour and tournament talking points throughout World Cup 2026.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {["Goal reactions", "Matchday humour", "Fan edits"].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm font-bold text-white"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
