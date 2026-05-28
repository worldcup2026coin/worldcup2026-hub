import Image from "next/image";
import { notFound } from "next/navigation";
import {
  FanTravelNotes,
  RelatedTournamentLinks,
  StadiumMatchList,
  StadiumOverviewCard,
  fixtureMatchesStadium,
} from "@/components/venues/venue-content";
import { getFixtures } from "@/lib/data/worldcup";
import { stadiums } from "@/lib/data/venues";
import { getStadiumImage } from "@/lib/data/visuals";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

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

  return createPageMetadata({
    title: `${stadium.name} World Cup 2026 Stadium Guide`,
    description: `Explore ${stadium.name}, a World Cup 2026 host stadium in ${stadium.city}. View fixtures, city context, fan notes and tournament guide.`,
    path: `/stadiums/${stadium.slug}`,
  });
}

function tournamentRoleCopy(role: string) {
  const value = role.toLowerCase();

  if (value.includes("opening")) {
    return "This venue is listed in the project data as the opening match host.";
  }

  if (value.includes("final")) {
    return "This venue is listed in the project data as the final host.";
  }

  if (value.includes("knockout")) {
    return "This venue is listed for group-stage and knockout tournament use.";
  }

  return "Part of the 2026 host venue network.";
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

  const [fixtures] = await Promise.all([getFixtures()]);
  const stadiumFixtures = fixtures.filter((fixture) =>
    fixtureMatchesStadium(fixture, stadium),
  );
  const heroImage = getStadiumImage(stadium);

  return (
    <main className="container mx-auto px-4 pt-10 pb-16 sm:px-6">
      <section className="hero-panel overflow-hidden rounded-[2.5rem] p-0">
        <div className="relative min-h-80 p-6 sm:p-10">
          {heroImage ? (
            <Image
              src={heroImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-40"
              priority
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/20" />
          <div className="relative z-10 max-w-5xl">
            <p className="neon-kicker">
              {stadium.city} · {stadium.country}
            </p>

            <h1 className="mt-4 text-4xl font-black uppercase text-white sm:text-5xl">
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

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <StadiumOverviewCard stadium={stadium} />
        <StadiumMatchList fixtures={stadiumFixtures} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <FanTravelNotes />

        <section className="neon-card rounded-[2rem] p-6">
          <p className="neon-kicker">Tournament role</p>
          <h2 className="mt-4 text-2xl font-black uppercase text-white">
            What this venue means
          </h2>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            {tournamentRoleCopy(stadium.role)}
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Fixture assignments and venue details may update as provider records
            refresh.
          </p>
        </section>
      </div>

      <div className="mt-8">
        <RelatedTournamentLinks
          links={[
            { href: `/host-cities/${stadium.citySlug}`, label: "Host city" },
            { href: "/fixtures", label: "Fixtures" },
            { href: "/groups", label: "Groups" },
            { href: "/predictions", label: "Predictions" },
            { href: "/stadiums", label: "Stadium index" },
          ]}
        />
      </div>
    </main>
  );
}
