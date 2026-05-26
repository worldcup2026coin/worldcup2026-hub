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

      <div className="mt-10 grid gap-6 md:grid-cols-2">
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


