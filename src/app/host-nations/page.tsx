import Image from "next/image";
import Link from "next/link";
import { hostNations } from "@/lib/data/authority";
import { hostCities, stadiums } from "@/lib/data/venues";

export const metadata = {
  title: "World Cup 2026 Host Nations | USA, Mexico & Canada",
  description:
    "Explore the USA, Mexico and Canada host nation guides with links to World Cup 2026 cities, stadiums and fixtures.",
};

export default function HostNationsPage() {
  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <span className="neon-kicker">Host nations</span>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            USA, Mexico and Canada
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Three countries share the biggest World Cup yet. Jump into each
            nation for its host cities, stadium route and fixture links.
          </p>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {hostNations.map((nation) => {
            const cities = hostCities.filter(
              (city) => city.country.toLowerCase() === nation.slug
            );
            const nationStadiums = stadiums.filter(
              (stadium) => stadium.country.toLowerCase() === nation.slug
            );

            return (
              <Link
                key={nation.slug}
                href={`/host-nations/${nation.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-2xl shadow-slate-950/30 transition hover:border-lime-300/30"
              >
                <div className="relative h-52">
                  <Image
                    src={nation.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover opacity-80 transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>
                <div className="p-5">
                  <span className="neon-badge neon-badge-cyan">
                    {cities.length} cities · {nationStadiums.length} stadiums
                  </span>
                  <h2 className="mt-4 text-3xl font-black uppercase text-white">
                    {nation.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {nation.summary}
                  </p>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
