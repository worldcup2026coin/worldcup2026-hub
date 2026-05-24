export function CommunityCTA() {
  return (
    <section className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-6 shadow-2xl shadow-slate-950/30">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-200">
        Community
      </p>

      <h2 className="mt-3 text-3xl font-black text-white">
        Follow the tournament together
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
        Join the football-first fan layer for match reactions, polls, community roundups and shareable World Cup moments.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <a
          href="#"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-slate-200"
        >
          Telegram coming soon
        </a>

        <a
          href="#"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
        >
          X / Twitter coming soon
        </a>
      </div>
    </section>
  );
}
