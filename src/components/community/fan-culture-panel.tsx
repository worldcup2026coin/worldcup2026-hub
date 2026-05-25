
export function FanCulturePanel() {
  return (
    <section className="neon-card rounded-[2rem] p-6">
      <p className="neon-kicker">Fan culture</p>

      <h2 className="mt-4 text-3xl font-black uppercase text-white">
        Matchday internet energy
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        Football-first reactions, social posts, matchday humour and tournament talking points throughout World Cup 2026.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {["Goal reactions", "Matchday humour", "Fan edits"].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-4 text-sm font-black uppercase tracking-[0.08em] text-white"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
