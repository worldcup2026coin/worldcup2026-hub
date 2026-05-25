
export function CommunityCTA() {
  return (
    <section className="hero-panel rounded-[2.25rem] p-6 sm:p-8">
      <div className="relative z-10">
        <p className="neon-kicker">Fan signal</p>

        <h2 className="neon-title glow-text mt-4 text-4xl font-black leading-[0.9] text-white sm:text-6xl">
          Follow the tournament together
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
          Join the football-first fan layer for match reactions, polls, community roundups and shareable World Cup moments.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="#" className="glow-button-primary">
            Telegram coming soon
          </a>

          <a href="#" className="glow-button-secondary">
            X / Twitter coming soon
          </a>
        </div>
      </div>
    </section>
  );
}
