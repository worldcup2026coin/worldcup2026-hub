import Link from "next/link";
import {
  VenueStatCard,
  capacityNumber,
  firstFixture,
  fixtureMatchesStadium,
} from "@/components/venues/venue-content";
import { getFixtures } from "@/lib/data/worldcup";
import { stadiums } from "@/lib/data/venues";
import { createPageMetadata } from "@/lib/seo";
import { formatVenueDateTime } from "@/lib/worldcup/format";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Stadiums",
  description:
    "Explore all 16 World Cup 2026 stadiums across Canada, Mexico and USA with venue guides, fixture context and fan notes.",
  path: "/stadiums",
});

type StadiumsPageProps = {
  searchParams?: Promise<{
    q?: string;
    country?: string;
  }>;
};

function normalise(value: string | null | undefined) {
  return String(value ?? "").toLowerCase().trim();
}

function stadiumSearchText(stadium: (typeof stadiums)[number]) {
  return [stadium.name, stadium.city, stadium.country, stadium.role]
    .join(" ")
    .toLowerCase();
}

export default async function StadiumsPage({
  searchParams,
}: StadiumsPageProps) {
  const params = await searchParams;
  const query = normalise(params?.q);
  const country = params?.country ?? "all";
  const fixtures = await getFixtures();
  const countries = [...new Set(stadiums.map((stadium) => stadium.country))];
  const largest = [...stadiums]
    .map((stadium) => ({ stadium, capacity: capacityNumber(stadium.capacity) }))
    .filter((item) => item.capacity)
    .sort((a, b) => (b.capacity ?? 0) - (a.capacity ?? 0))[0];
  const openingVenue = stadiums.find((stadium) =>
    stadium.badges.includes("Opening Match"),
  );
  const finalVenue = stadiums.find((stadium) => stadium.badges.includes("Final"));
  const filteredStadiums = stadiums.filter((stadium) => {
    const matchesQuery = query ? stadiumSearchText(stadium).includes(query) : true;
    const matchesCountry = country === "all" || stadium.country === country;
    return matchesQuery && matchesCountry;
  });

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <span className="neon-kicker">Tournament venues</span>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            Stadiums
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Explore 16 World Cup 2026 stadiums across Canada, Mexico and USA,
            from Mexico City Stadium / Estadio Azteca on opening day to
            MetLife Stadium for the final.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <VenueStatCard
            label="Total stadiums"
            value={`${stadiums.length}`}
            detail="Across the full 2026 host venue network."
          />
          <VenueStatCard
            label="Host countries"
            value={`${countries.length}`}
            detail={countries.join(" · ")}
          />
          <VenueStatCard
            label="Largest capacity"
            value={largest?.stadium.capacity ?? "TBC"}
            detail={largest?.stadium.name ?? "Capacity data updating"}
          />
          <VenueStatCard
            label="Opening / final"
            value="Confirmed roles"
            detail={`${openingVenue?.city ?? "Opening TBC"} · ${
              finalVenue?.city ?? "Final TBC"
            }`}
          />
        </section>

        <form className="neon-card mt-8 grid gap-4 rounded-[2rem] p-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
              Search stadium, city or country
            </span>
            <input
              name="q"
              defaultValue={params?.q ?? ""}
              placeholder="Search by stadium, city or country..."
              className="min-h-12 rounded-2xl border border-cyan-300/20 bg-black/30 px-4 text-sm font-bold text-white outline-none transition focus:border-lime-300/60"
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                Country
              </span>
              <select
                name="country"
                defaultValue={country}
                className="min-h-12 rounded-2xl border border-cyan-300/20 bg-black/30 px-4 text-sm font-bold text-white outline-none transition focus:border-lime-300/60"
              >
                <option value="all">All countries</option>
                {countries.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="glow-button-primary min-h-12">
              Filter
            </button>
          </div>
        </form>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredStadiums.map((stadium) => {
            const stadiumFixtures = fixtures.filter((fixture) =>
              fixtureMatchesStadium(fixture, stadium),
            );
            const nextMatch = firstFixture(stadiumFixtures);

            return (
              <Link
                key={stadium.slug}
                href={`/stadiums/${stadium.slug}`}
                className="neon-card rounded-[2rem] p-5"
              >
                <div className="flex flex-wrap gap-2">
                  {stadium.badges.slice(0, 2).map((badge) => (
                    <span key={badge} className="neon-badge neon-badge-cyan">
                      {badge}
                    </span>
                  ))}
                </div>

                <h2 className="mt-5 text-2xl font-black uppercase text-white">
                  {stadium.name}
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-300">
                  {stadium.city} · {stadium.country}
                </p>

                <div className="mt-4 grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  <p>Capacity: {stadium.capacity || "TBC"}</p>
                  <p>Matches listed: {stadiumFixtures.length || "Updating"}</p>
                  <p>{stadium.role}</p>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">
                  {nextMatch
                    ? `First listed match: ${nextMatch.home_team_name || "Team TBC"} vs ${
                        nextMatch.away_team_name || "Team TBC"
                      } · ${formatVenueDateTime(nextMatch)}`
                    : "Fixture list will update as provider records refresh."}
                </p>

                <span className="mt-5 inline-flex text-sm font-black text-lime-200">
                  View stadium guide →
                </span>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}
