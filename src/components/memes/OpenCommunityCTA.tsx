import Link from "next/link";

export function OpenCommunityCTA() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-lime-300 to-white p-6 text-black md:p-8">
      <p className="text-sm font-black uppercase tracking-[0.25em]">
        Open Community
      </p>

      <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
        Join the open World Cup meme community.
      </h2>

      <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-black/70">
        No private club. No premium tier. Just football, chaos, memes, and fans.
        An open community launch may come later. No presale. No fundraising. No
        premium tier.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/community"
          className="rounded-full bg-black px-5 py-3 text-sm font-black text-white"
        >
          Visit community
        </Link>

        <Link
          href="/memes"
          className="rounded-full border border-black/20 px-5 py-3 text-sm font-black text-black"
        >
          View meme wall
        </Link>
      </div>
    </section>
  );
}
