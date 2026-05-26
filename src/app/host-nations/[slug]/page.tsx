import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHostNation, hostNations } from "@/lib/data/authority";
import { hostCities, stadiums } from "@/lib/data/venues";

export function generateStaticParams() {
  return hostNations.map((nation) => ({ slug: nation.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nation = getHostNation(slug);

  if (!nation) return { title: "Host nation not found" };

  return {
    title: `${nation.name} World Cup 2026 Host Nation Guide`,
    description: `${nation.name} World Cup 2026 host guide with cities, stadiums and fixture links.`,
  };
}

export default async function HostNationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nation = getHostNation(slug);

  if (!nation) notFound();

  const cities = hostCities.filter(
    (city) => city.country.toLowerCase() === nation.slug
  );
  const nationStadiums = stadiums.filter(
    (stadium) => stadium.country.toLowerCase() === nation.slug
  );

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="hero-panel overflow-hidden rounded-[2.5rem] p-0">
          <div className="relative min-h-[26rem] p-6 sm:p-10">
            <Image
              src={nation.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/20" />
            <div className="relative z-10 max-w-4xl pt-16">
              <p className="neon-kicker">Host nation</p>
              <h1 className="neon-title glow-text mt-5 text-6xl font-black uppercase text-white sm:text-8xl">
                {nation.name}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                {nation.summary}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/fixtures" className="glow-button-primary">
                  View fixtures
                </Link>
                <Link href="/host-cities" className="glow-button-secondary">
                  All host cities
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="neon-panel rounded-[2rem] p-6">
            <p className="neon-kicker">Cities</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">
              Host city route
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/host-cities/${city.slug}`}
                  className="rounded-3xl border border-cyan-300/15 bg-slate-950/45 p-5 transition hover:border-lime-300/30"
                >
                  <span className="neon-badge neon-badge-cyan">
                    {city.role}
                  </span>
                  <h3 className="mt-4 text-2xl font-black uppercase text-white">
                    {city.city}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">{city.stadium}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <section className="neon-panel rounded-[2rem] p-6">
              <p className="neon-kicker">Stadiums</p>
              <div className="mt-4 grid gap-3">
                {nationStadiums.map((stadium) => (
                  <Link
                    key={stadium.slug}
                    href={`/stadiums/${stadium.slug}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-black text-white transition hover:border-fuchsia-300/30"
                  >
                    {stadium.name} · {stadium.city}
                  </Link>
                ))}
              </div>
            </section>

            <section className="neon-panel rounded-[2rem] p-6">
              <p className="neon-kicker">Fixture links</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Use the fixtures hub to filter by venue, team, group and date as
                the tournament feed updates.
              </p>
              <Link href="/fixtures" className="glow-button-secondary mt-5">
                Browse fixtures
              </Link>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
