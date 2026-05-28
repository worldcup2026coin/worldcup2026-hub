import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { stadiums } from "@/lib/data/venues";
import { getStadiumImage } from "@/lib/data/visuals";

export async function generateStaticParams() {
  return stadiums.map((stadium) => ({
    slug: stadium.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stadium = stadiums.find((s) => s.slug === slug);

  if (!stadium) return { title: "Stadium not found" };

  return {
    title: `${stadium.name} World Cup 2026 Stadium Guide`,
    description: `${stadium.name} in ${stadium.city} host guide with capacity, timezone, matches and World Cup 2026 venue context.`,
  };
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

  const heroImage = getStadiumImage(stadium);

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
            <p className="neon-kicker">{stadium.country}</p>

            <h1 className="mt-4 text-5xl font-black uppercase text-white">
              {stadium.name}
            </h1>

            <p className="mt-4 text-xl text-lime-300">{stadium.role}</p>

            <p className="mt-6 max-w-3xl text-slate-300">{stadium.summary}</p>
            {stadium.slug === "estadio-azteca" ? (
              <p className="mt-3 max-w-3xl text-sm font-semibold text-slate-400">
                Also known locally by current naming rights.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="card-panel p-6">
          <h2 className="text-xl font-bold">Tournament information</h2>

          <ul className="mt-4 space-y-3 text-slate-300">
            <li><strong>Capacity:</strong> {stadium.capacity}</li>
            <li><strong>Matches:</strong> {stadium.matchesHosted}</li>
            <li><strong>Timezone:</strong> {stadium.timezone}</li>
            <li><strong>Role:</strong> {stadium.role}</li>
            <li><strong>City:</strong> {stadium.city}</li>
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
    </main>
  );
}



