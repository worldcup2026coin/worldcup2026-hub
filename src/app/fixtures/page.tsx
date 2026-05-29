import Link from "next/link";
import { EmptyState } from "@/components/worldcup/empty-state";
import { FixtureCard } from "@/components/worldcup/fixture-card";
import { PageHeader } from "@/components/worldcup/page-header";
import { Container } from "@/components/ui/container";
import {
  filterFixtures,
  getFixtureFilterOptions,
  getFixturesPageData,
  type FixtureFilters,
} from "@/lib/data/worldcup";
import { createPageMetadata } from "@/lib/seo";
import { formatDateOnly } from "@/lib/worldcup/format";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Fixtures",
  description:
    "World Cup 2026 fixtures by date, team, group, venue and kickoff time, with synced match status and tournament context.",
  path: "/fixtures",
});

type FixturesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function FixturesPage({
  searchParams,
}: FixturesPageProps) {
  const params = await searchParams;
  const { fixtures, teams } = await getFixturesPageData();

  const filters: FixtureFilters = {
    q: getParam(params, "q") || undefined,
    date: getParam(params, "date") || undefined,
    team: getParam(params, "team") || undefined,
    group: getParam(params, "group") || undefined,
    status: getParam(params, "status") || undefined,
    venue: getParam(params, "venue") || undefined,
  };

  const filteredFixtures = filterFixtures(fixtures, filters);
  const options = getFixtureFilterOptions(fixtures, teams);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      <PageHeader
        eyebrow="Fixtures"
        title="World Cup 2026 fixtures"
        description="Browse the synced World Cup fixture list from Supabase. Filter by date, team, group, status, and venue where data is available."
        meta="Fixture records refresh as provider data updates."
      />

      <Container className="pb-14">
        <form className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30">
          <label className="mb-4 grid gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-lime-200">
              Search fixtures
            </span>
            <input
              name="q"
              defaultValue={filters.q ?? ""}
              placeholder="Search team, venue or group..."
              className="min-h-12 rounded-2xl border border-lime-300/20 bg-slate-950 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-500 focus:border-lime-300/70"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Date
              </span>
              <select
                name="date"
                defaultValue={filters.date ?? ""}
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm text-white"
              >
                <option value="">All dates</option>
                {options.dates.map((date) => (
                  <option key={date} value={date}>
                    {formatDateOnly(date)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Team
              </span>
              <select
                name="team"
                defaultValue={filters.team ?? ""}
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm text-white"
              >
                <option value="">All teams</option>
                {options.teams.map((team) => (
                  <option key={team.api_team_id} value={team.api_team_id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Group
              </span>
              <select
                name="group"
                defaultValue={filters.group ?? ""}
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm text-white"
              >
                <option value="">All groups</option>
                {options.groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Status
              </span>
              <select
                name="status"
                defaultValue={filters.status ?? ""}
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm text-white"
              >
                <option value="">All statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="finished">Finished</option>
                <option value="postponed">Postponed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Venue
              </span>
              <select
                name="venue"
                defaultValue={filters.venue ?? ""}
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm text-white"
              >
                <option value="">All venues</option>
                {options.venues.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="min-h-12 rounded-2xl bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
            >
              Apply filters
            </button>
            <Link
              href="/fixtures"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Clear filters
            </Link>
          </div>
        </form>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-300">
            Showing{" "}
            <span className="font-black text-white">
              {filteredFixtures.length}
            </span>{" "}
            of <span className="font-black text-white">{fixtures.length}</span>{" "}
            fixtures
          </p>
          <p className="max-w-2xl text-xs font-semibold leading-5 text-slate-400 sm:text-right">
            Showing 72 group-stage fixtures. Knockout fixtures will populate as
            the bracket is confirmed. The full tournament has 104 matches.
            Fixture and venue data is refreshed from provider syncs and may
            update as official records change.
          </p>
          {activeFilterCount > 0 ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {activeFilterCount} active filter
              {activeFilterCount === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>

        {fixtures.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No fixtures synced yet"
              description="The fixtures table is empty. Run the protected sync route when API-Football has data available, then this page will populate automatically."
            />
          </div>
        ) : filteredFixtures.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No fixtures match those filters"
              description="Try clearing one or more filters. The database has fixtures, but none match the current combination."
              action={
                <Link
                  href="/fixtures"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-400 px-5 text-sm font-black text-slate-950"
                >
                  Clear filters
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {filteredFixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
