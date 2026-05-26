import Link from "next/link";
import { hostCities } from "@/lib/data/venues";

export const metadata = {
  title: "Host Cities | World Cup 2026 Hub",
  description: "Explore the 16 World Cup 2026 host cities across USA, Mexico and Canada.",
};

export default function HostCitiesPage() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <span className="neon-kicker">International fan guide</span>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            Host Cities
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Explore the 16 cities hosting World Cup 2026 matches across USA, Mexico and Canada.
            Each guide focuses on tournament role, stadium, timezone and practical fan context.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {hostCities.map((city) => (
            <Link key={city.slug} href={`/host-cities/${city.slug}`} className="neon-card rounded-[2rem] p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="neon-badge neon-badge-cyan">{city.country}</span>
                <span className="text-xs font-black uppercase tracking-[0.14em] text-lime-200">
                  {city.role}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-black uppercase text-white">
                {city.city}
              </h2>

              <p className="mt-2 text-sm font-semibold text-slate-300">
                {city.stadium}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {city.summary}
              </p>

              <span className="mt-5 inline-flex text-sm font-black text-lime-200">
                View city guide →
              </span>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
