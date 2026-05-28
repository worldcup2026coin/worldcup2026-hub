import Image from "next/image";
import { notFound } from "next/navigation";
import {
  FanTravelNotes,
  HostCityMatchList,
  HostCityOverviewCard,
  RelatedTournamentLinks,
  fixtureMatchesHostCity,
} from "@/components/venues/venue-content";
import { getFixtures } from "@/lib/data/worldcup";
import { hostCities } from "@/lib/data/venues";
import { getCityImage, getTravelHighlights } from "@/lib/data/visuals";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

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

  return createPageMetadata({
    title: `${city.city} World Cup 2026 Host City Guide`,
    description: `Explore ${city.city}, a World Cup 2026 host city in ${city.country}. View fixtures at ${city.stadium}, fan notes and tournament context.`,
    path: `/host-cities/${city.slug}`,
  });
}

function cityHighlights(cityName: string) {
  return [
    {
      title: "Football atmosphere",
      copy: `${cityName} is part of the 2026 matchday map, with local fan energy shaped by the fixtures assigned to the city.`,
    },
    {
      title: "Matchday base",
      copy: "Use the stadium page, fixture list and local time labels together before planning matchday movement.",
    },
    {
      title: "Before travelling",
      copy: "Confirm tickets, kickoff time, transport options and official event guidance close to matchday.",
    },
  ];
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

  const [fixtures] = await Promise.all([getFixtures()]);
  const cityFixtures = fixtures.filter((fixture) =>
    fixtureMatchesHostCity(fixture, city),
  );
  const heroImage = getCityImage(city);
  const travelHighlights = getTravelHighlights(city);

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
            <p className="neon-kicker">{city.country}</p>

            <h1 className="mt-4 text-4xl font-black uppercase text-white sm:text-5xl">
              {city.city}
            </h1>

            <p className="mt-4 text-xl text-lime-300">{city.role}</p>

            <p className="mt-6 max-w-3xl text-slate-300">{city.summary}</p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <HostCityOverviewCard city={city} />
        <HostCityMatchList fixtures={cityFixtures} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <FanTravelNotes
          title="Travel / fan notes"
          notes={[
            `Local timezone: ${city.timezone}. Re-check kickoff labels before travelling.`,
            city.fanNote ||
              "Use this city guide as a starting point and confirm local matchday guidance close to the fixture.",
            ...travelHighlights,
            "Arrive early and use official event guidance for final instructions.",
          ]}
        />

        <section className="neon-card rounded-[2rem] p-6">
          <p className="neon-kicker">City highlights</p>
          <h2 className="mt-4 text-2xl font-black uppercase text-white">
            What fans should know
          </h2>
          <div className="mt-5 grid gap-3">
            {cityHighlights(city.city).map((highlight) => (
              <article
                key={highlight.title}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"
              >
                <h3 className="font-black uppercase text-white">
                  {highlight.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {highlight.copy}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8">
        <RelatedTournamentLinks
          links={[
            { href: `/stadiums/${city.stadiumSlug}`, label: "Stadium page" },
            { href: "/fixtures", label: "Fixtures" },
            { href: "/host-nations", label: "Host nations" },
            { href: "/predictions", label: "Predictions" },
            { href: "/community", label: "Community" },
          ]}
        />
      </div>
    </main>
  );
}
