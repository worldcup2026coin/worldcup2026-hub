import Link from "next/link";
import { stadiums } from "@/lib/data/venues";

export const metadata = {
  title: "World Cup 2026 Stadiums",
  description: "Explore every World Cup 2026 stadium and tournament venue.",
};

export default function StadiumsPage() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <span className="neon-kicker">Tournament venues</span>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            Stadiums
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Explore the 16 World Cup 2026 stadiums across USA, Mexico and Canada —
            from the opening match in Mexico City to the final in New York/New Jersey.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stadiums.map((stadium) => (
            <Link key={stadium.slug} href={`/stadiums/${stadium.slug}`} className="neon-card rounded-[2rem] p-5">
              <div className="flex flex-wrap gap-2">
                {stadium.badges.slice(0, 2).map((badge) => (
                  <span key={badge} className="neon-badge neon-badge-cyan">{badge}</span>
                ))}
              </div>

              <h2 className="mt-5 text-2xl font-black uppercase text-white">
                {stadium.name}
              </h2>

              <p className="mt-2 text-sm font-semibold text-slate-300">
                {stadium.city} · {stadium.country}
              </p>

              <div className="mt-4 grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                <p>Capacity: {stadium.capacity}</p>
                <p>{stadium.role}</p>
              </div>

              <span className="mt-5 inline-flex text-sm font-black text-lime-200">
                View stadium →
              </span>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
