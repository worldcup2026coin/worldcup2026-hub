import Link from "next/link";
import { notFound } from "next/navigation";
import { hostCities } from "@/lib/data/venues";

export async function generateStaticParams() {
  return hostCities.map((city) => ({
    slug: city.slug,
  }));
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

  return (
    <main className="container mx-auto px-6 pt-12 pb-16">
      <div className="max-w-5xl">
        <p className="neon-kicker">{city.country}</p>

        <h1 className="mt-4 text-5xl font-black uppercase text-white">
          {city.city}
        </h1>

        <p className="mt-4 text-xl text-lime-300">
          {city.role}
        </p>

        <p className="mt-6 text-slate-300 max-w-3xl">
          {city.summary}
        </p>
      </div>

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



