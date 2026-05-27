export function CommunityCTA() {
  return (
    <section className="hero-panel rounded-[2.25rem] p-6 sm:p-8">
      <div className="relative z-10">
        <p className="neon-kicker">$WC26 community signal</p>

        <h2 className="neon-title glow-text mt-4 text-4xl font-black leading-[0.9] text-white sm:text-6xl">
          Join the football meme layer
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
          $WC26 is the fan-made community layer for World Cup chaos, match reactions, memes, polls, predictions and launch updates.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="/wc26" className="glow-button-primary">
            View $WC26
          </a>

          <a href="/launch" className="glow-button-secondary">
            Launch status
          </a>

          <a href="/how-to-buy" className="glow-button-secondary">
            How to buy
          </a>
        </div>

        <p className="mt-4 max-w-3xl text-xs font-semibold leading-5 text-slate-400">
          $WC26 is fan-made and unofficial. It is not affiliated with FIFA, World Cup, teams, players, sponsors or governing bodies. Crypto tokens are high risk.
        </p>
      </div>
    </section>
  );
}

