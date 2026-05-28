import { SOCIAL_LINKS } from "@/lib/social-links";
import Image from "next/image";

export function CommunityCTA() {
  return (
    <section className="hero-panel overflow-hidden rounded-[2.25rem] p-6 sm:p-8">
      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="neon-kicker">$WC26 community signal</p>

          <h2 className="neon-title glow-text mt-4 text-4xl font-black leading-[0.9] text-white sm:text-6xl">
            Join the football meme layer
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            $WC26 is the fan-made community layer for World Cup chaos, match
            reactions, memes, polls, predictions and launch updates.
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
            $WC26 is fan-made and unofficial. It is not affiliated with FIFA,
            World Cup, teams, players, sponsors or governing bodies. Crypto
            tokens are high risk.
          </p>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-lime-300/20 bg-black/40 shadow-[0_0_34px_rgba(163,255,18,0.12)]">
          <Image
            src="/wc26/wc26-website-hero.png"
            alt="$WC26 fan-made mascot crew"
            width={626}
            height={299}
            className="h-auto w-full"
          />
        </div>
      </div>
    <a
  href={SOCIAL_LINKS.x}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-cyan-100 transition hover:border-lime-300/70 hover:bg-lime-300/15 hover:text-lime-100"
>
  Follow @WC26_Hub on X
</a>
</section>
  );
}

