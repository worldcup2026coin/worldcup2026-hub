export function CommunityRules() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/30">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">
        Community rules
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        Keep it football-first
      </h2>

      <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-300">
        <li className="rounded-2xl bg-white/[0.04] p-4">
          Respect other fans, countries, players and teams.
        </li>
        <li className="rounded-2xl bg-white/[0.04] p-4">
          Keep posts and replies football-focused.
        </li>
        <li className="rounded-2xl bg-white/[0.04] p-4">
          No spam, harassment, abuse or unsafe content.
        </li>
        <li className="rounded-2xl bg-white/[0.04] p-4">
          Open comments are not enabled yet. Moderation tools will come before any public discussion features.
        </li>
      </ul>
    </section>
  );
}
