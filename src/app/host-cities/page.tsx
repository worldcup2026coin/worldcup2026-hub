import Link from "next/link";
import {
  VenueStatCard,
  fixtureMatchesHostCity,
} from "@/components/venues/venue-content";
import { getFixtures } from "@/lib/data/worldcup";
import { hostCities } from "@/lib/data/venues";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Host Cities",
  description:
    "Explore the 16 World Cup 2026 host cities across Canada, Mexico and USA with stadium links, fixture context and fan travel notes.",
  path: "/host-cities",
});

const countryOrder = ["Canada", "Mexico", "USA"];

export default async function HostCitiesPage() {
  const fixtures = await getFixtures();
  const countries = [...new Set(hostCities.map((city) => city.country))];
  const groupedCities = countryOrder
    .map((country) => ({
      country,
      cities: hostCities.filter((city) => city.country === country),
    }))
    .filter((group) => group.cities.length > 0);

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <span className="neon-kicker">International fan guide</span>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            Host Cities
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Explore 16 host cities across 3 countries, with stadium links,
            fixture context and fan-focused travel notes for World Cup 2026.
          </p>
          <Link href="/host-nations" className="glow-button-secondary mt-6">
            View host nations
          </Link>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <VenueStatCard
            label="Host cities"
            value={`${hostCities.length}`}
            detail="Across Canada, Mexico and USA."
          />
          <VenueStatCard
            label="Host countries"
            value={`${countries.length}`}
            detail={countries.join(" · ")}
          />
          <VenueStatCard
            label="Fixture records"
            value={`${fixtures.length}`}
            detail="Provider fixture rows currently available."
          />
        </section>

        <div className="mt-8 grid gap-8">
          {groupedCities.map((group) => (
            <section key={group.country}>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="neon-kicker">{group.country}</p>
                  <h2 className="mt-3 text-3xl font-black uppercase text-white">
                    {group.country} host cities
                  </h2>
                </div>
                <span className="neon-badge neon-badge-lime w-fit">
                  {group.cities.length} cities
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {group.cities.map((city) => {
                  const cityFixtures = fixtures.filter((fixture) =>
                    fixtureMatchesHostCity(fixture, city),
                  );

                  return (
                    <Link
                      key={city.slug}
                      href={`/host-cities/${city.slug}`}
                      className="neon-card rounded-[2rem] p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="neon-badge neon-badge-cyan">
                          {city.country}
                        </span>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-lime-200">
                          {city.role}
                        </span>
                      </div>

                      <h3 className="mt-5 text-2xl font-black uppercase text-white">
                        {city.city}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-slate-300">
                        {city.stadium}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {city.summary ||
                          "A World Cup 2026 host city guide for travelling fans."}
                      </p>

                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Matches listed: {cityFixtures.length || "Updating"}
                      </div>

                      <span className="mt-5 inline-flex text-sm font-black text-lime-200">
                        View city guide →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
