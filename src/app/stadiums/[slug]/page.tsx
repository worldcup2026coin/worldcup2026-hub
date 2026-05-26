import Link from "next/link";
import { notFound } from "next/navigation";
import { stadiums } from "@/lib/data/venues";

export async function generateStaticParams() {
  return stadiums.map((stadium) => ({
    slug: stadium.slug,
  }));
}

export default async function StadiumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const stadium = stadiums.find((s) => s.slug === slug);

  if (!stadium) {
    notFound();
  }

  return (
    <main className="container mx-auto px-6 pt-12 pb-16">
      <div className="max-w-5xl">
        <p className="neon-kicker">{stadium.country}</p>

        <h1 className="mt-4 text-5xl font-black uppercase text-white">
          {stadium.name}
        </h1>

        <p className="mt-4 text-xl text-lime-300">
          {stadium.role}
        </p>

        <p className="mt-6 text-slate-300 max-w-3xl">
          {stadium.summary}
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card-panel p-6">
          <h2 className="text-xl font-bold">Tournament information</h2>

          <ul className="mt-4 space-y-3 text-slate-300">
            <li><strong>Capacity:</strong> {stadium.capacity}</li>
            <li><strong>Matches:</strong> {stadium.matchesHosted}</li>
            <li><strong>Timezone:</strong> {stadium.timezone}</li>
            <li><strong>Role:</strong> {stadium.role}</li>
          </ul>
        </div>

        <div className="card-panel p-6">
          <h2 className="text-xl font-bold">Host city</h2>

          <p className="mt-4 text-slate-300">
            {stadium.city}
          </p>

          <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-slate-950/45 p-5 shadow-[0_0_34px_rgba(34,211,238,0.08)]">
            <p className="neon-kicker">City guide</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              See timezone, fan notes and city-level tournament context for this venue.
            </p>
            <Link
              href={`/host-cities/${stadium.citySlug}`}
              className="mt-5 inline-flex text-sm font-black uppercase tracking-[0.14em] text-lime-200 transition hover:text-white"
            >
              View Host City →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}


