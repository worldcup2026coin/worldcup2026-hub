import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { hostCities } from "@/lib/data/venues";
import { hostNations } from "@/lib/data/authority";

export async function generateStaticParams() {
  return hostCities.map((city) => ({
    slug: city.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = hostCities.find((c) => c.slug === slug);

  if (!city) return { title: "Host city not found" };

  return {
    title: `${city.city} World Cup 2026 Host City Guide`,
    description: `${city.city} host city guide for World Cup 2026 with ${city.stadium}, fixtures, timezone and fan context.`,
  };
}

export default async function HostCityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const city = hostCities.find((c) => c.slug === slug);

  if (!city) {
    notFound();
  }

  const heroImage = hostNations.find(
    (nation) => nation.name === city.country
  )?.image;

  return (
    <main className="container mx-auto px-6 pt-12 pb-16">
      <section className="hero-panel overflow-hidden rounded-[2.5rem] p-0">
        <div className="relative min-h-80 p-6 sm:p-10">
          {heroImage ? (
            <Image
              src={heroImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-40"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/20" />
          <div className="relative z-10 max-w-5xl">
            <p className="neon-kicker">{city.country}</p>

            <h1 className="mt-4 text-5xl font-black uppercase text-white">
              {city.city}
            </h1>

            <p className="mt-4 text-xl text-lime-300">{city.role}</p>

            <p className="mt-6 max-w-3xl text-slate-300">{city.summary}</p>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="card-panel p-6">
          <h2 className="text-xl font-bold">Tournament role</h2>

          <ul className="mt-4 space-y-3 text-slate-300">
            <li><strong>Stadium:</strong> {city.stadium}</li>
            <li><strong>Matches:</strong> {city.matchesHosted}</li>
            <li><strong>Timezone:</strong> {city.timezone}</li>
            <li><strong>Role:</strong> {city.role}</li>
          </ul>
        </div>

        <div className="card-panel p-6">
          <h2 className="text-xl font-bold">Fan notes</h2>

          <p className="mt-4 text-slate-300">
            {city.fanNote}
          </p>
        </div>

        <div className="card-panel p-6">
          <p className="neon-kicker">World Cup 2026</p>
          <h2 className="mt-4 text-xl font-bold">Tournament facts</h2>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              ["48", "Teams"],
              ["104", "Matches"],
              ["16", "Host cities"],
              ["3", "Nations"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-lime-200">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-cyan-300/20 bg-slate-950/45 p-6 shadow-[0_0_34px_rgba(34,211,238,0.08)]">
        <p className="neon-kicker">Linked venue</p>
        <h2 className="mt-3 text-2xl font-black uppercase text-white">
          {city.stadium}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          Jump into the stadium profile for capacity, tournament role and venue context.
        </p>
        <Link
          href={`/stadiums/${city.stadiumSlug}`}
          className="mt-5 inline-flex text-sm font-black uppercase tracking-[0.14em] text-lime-200 transition hover:text-white"
        >
          View Stadium →
        </Link>
      </div>
    </main>
  );
}



