
export function CommunityRules() {
  return (
    <section className="neon-card rounded-[2rem] p-6">
      <p className="neon-kicker">Community rules</p>

      <h2 className="mt-4 text-3xl font-black uppercase text-white">
        Keep it football-first
      </h2>

      <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-300">
        {[
          "Respect other fans, countries, players and teams.",
          "Keep posts and replies football-focused.",
          "No spam, harassment, abuse or unsafe content.",
          "Community spaces are moderated to keep the hub football-first, safe and useful as the tournament grows.",
        ].map((item) => (
          <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
