import Link from "next/link";

export function MemeWallHero() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 shadow-2xl shadow-black/30 md:p-10">
      <div className="max-w-4xl space-y-6">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-300">
          Open Meme Community
        </p>

        <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
          Football. Chaos. Memes. World Cup 2026.
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-white/70">
          Built for World Cup fans, meme makers, match-day chaos merchants, and
          everyone who lives the tournament online.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://twitter.com/intent/tweet?text=Football.%20Chaos.%20Memes.%20World%20Cup%202026."
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-white/85"
          >
            Tag us on X to get featured
          </a>

          <Link
            href="#submit-meme"
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
          >
            Submit your World Cup meme
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/65">
          No private club. No premium tier. Just football, chaos, memes, and fans.
        </div>
      </div>
    </section>
  );
}
