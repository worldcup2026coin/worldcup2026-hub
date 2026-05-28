import Link from "next/link";
import type { Fixture } from "@/lib/data/worldcup";
import type { HostCity, Stadium } from "@/lib/data/venues";
import { formatPublicVenueName } from "@/lib/venue-labels";
import { fixtureSlug, formatVenueDateTime } from "@/lib/worldcup/format";

function normalise(value: string | null | undefined) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function routeForMatch(fixture: Fixture) {
  return `/matches/${fixtureSlug({
    api_fixture_id: fixture.api_fixture_id,
    match_date: fixture.match_date,
    home_team_name: fixture.home_team_name,
    away_team_name: fixture.away_team_name,
  })}`;
}

export function capacityNumber(value: string | null | undefined) {
  const parsed = Number(String(value ?? "").replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function fixtureMatchesStadium(fixture: Fixture, stadium: Stadium) {
  const venueName = normalise(formatPublicVenueName(fixture.venue_name));
  const venueCity = normalise(fixture.venue_city);
  const stadiumNames = [stadium.name, stadium.tournamentName]
    .filter(Boolean)
    .map((value) => normalise(value));

  return (
    Boolean(venueName) &&
    stadiumNames.some(
      (name) =>
        venueName === name || venueName.includes(name) || name.includes(venueName),
    ) ||
    (Boolean(venueName) &&
      venueCity === normalise(stadium.city) &&
      venueName.includes(normalise(stadium.name)))
  );
}

export function fixtureMatchesHostCity(fixture: Fixture, city: HostCity) {
  const venueCity = normalise(fixture.venue_city);
  const venueName = normalise(formatPublicVenueName(fixture.venue_name));
  const cityName = normalise(city.city);
  const stadiumName = normalise(city.stadium);

  return (
    (Boolean(venueCity) && venueCity === cityName) ||
    (Boolean(venueCity) && venueCity.includes(cityName)) ||
    (Boolean(venueCity) && cityName.includes(venueCity)) ||
    (Boolean(venueName) && venueName.includes(stadiumName))
  );
}

export function firstFixture(fixtures: Fixture[]) {
  return [...fixtures]
    .filter((fixture) => fixture.match_date)
    .sort(
      (a, b) =>
        new Date(a.match_date ?? "").getTime() -
        new Date(b.match_date ?? "").getTime(),
    )[0];
}

export function VenueStatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-lime-300/20 bg-lime-300/10 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-100">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
      {detail ? (
        <p className="mt-2 text-xs font-semibold leading-5 text-slate-300">
          {detail}
        </p>
      ) : null}
    </article>
  );
}

export function StadiumOverviewCard({ stadium }: { stadium: Stadium }) {
  return (
    <section className="neon-card rounded-[2rem] p-6">
      <p className="neon-kicker">Stadium overview</p>
      <h2 className="mt-4 text-2xl font-black uppercase text-white">
        {stadium.name}
      </h2>
      <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-300">
        <p>
          <strong className="text-white">City:</strong> {stadium.city},{" "}
          {stadium.country}
        </p>
        <p>
          <strong className="text-white">Capacity:</strong>{" "}
          {stadium.capacity || "Capacity TBC"}
        </p>
        <p>
          <strong className="text-white">Timezone:</strong> {stadium.timezone}
        </p>
        <p>
          <strong className="text-white">Role:</strong> {stadium.role}
        </p>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-300">
        {stadium.summary || "Part of the World Cup 2026 host venue network."}
      </p>
    </section>
  );
}

export function HostCityOverviewCard({ city }: { city: HostCity }) {
  return (
    <section className="neon-card rounded-[2rem] p-6">
      <p className="neon-kicker">City overview</p>
      <h2 className="mt-4 text-2xl font-black uppercase text-white">
        {city.city}
      </h2>
      <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-300">
        <p>
          <strong className="text-white">Country:</strong> {city.country}
        </p>
        <p>
          <strong className="text-white">Stadium:</strong> {city.stadium}
        </p>
        <p>
          <strong className="text-white">Timezone:</strong> {city.timezone}
        </p>
        <p>
          <strong className="text-white">Role:</strong> {city.role}
        </p>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-300">
        {city.summary || "A World Cup 2026 host city guide for travelling fans."}
      </p>
    </section>
  );
}

function FixtureRows({
  fixtures,
  emptyCopy,
}: {
  fixtures: Fixture[];
  emptyCopy: string;
}) {
  if (fixtures.length === 0) {
    return (
      <div className="mt-5 rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.04] p-5 text-sm leading-6 text-slate-300">
        {emptyCopy}
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-3">
      {fixtures.map((fixture) => (
        <Link
          key={fixture.id}
          href={routeForMatch(fixture)}
          className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/10 p-4 transition hover:border-lime-300/45"
        >
          <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
            {fixture.round || fixture.group_name || "Match"}
          </p>
          <h3 className="mt-2 text-lg font-black text-white">
            {fixture.home_team_name || "Team TBC"} vs{" "}
            {fixture.away_team_name || "Team TBC"}
          </h3>
          <p className="mt-2 text-sm font-semibold text-slate-300">
            {formatVenueDateTime(fixture)}
          </p>
        </Link>
      ))}
    </div>
  );
}

export function StadiumMatchList({
  fixtures,
}: {
  fixtures: Fixture[];
}) {
  return (
    <section className="neon-panel rounded-[2rem] p-6">
      <p className="neon-kicker">Match schedule</p>
      <h2 className="mt-4 text-2xl font-black uppercase text-white">
        Matches at this stadium
      </h2>
      <FixtureRows
        fixtures={fixtures}
        emptyCopy="Match schedule for this stadium will update as provider data confirms fixtures."
      />
    </section>
  );
}

export function HostCityMatchList({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <section className="neon-panel rounded-[2rem] p-6">
      <p className="neon-kicker">City match schedule</p>
      <h2 className="mt-4 text-2xl font-black uppercase text-white">
        Matches in this city
      </h2>
      <FixtureRows
        fixtures={fixtures}
        emptyCopy="Fixture details will update as provider records refresh."
      />
    </section>
  );
}

export function FanTravelNotes({
  title = "Fan guide / what to know",
  notes,
}: {
  title?: string;
  notes?: string[];
}) {
  const safeNotes = notes?.length
    ? notes
    : [
        "Arrive early and leave extra time for matchday movement.",
        "Check local transport before travelling to the venue.",
        "Use official ticket and travel guidance for final instructions.",
        "Confirm kickoff time in your local timezone before matchday.",
      ];

  return (
    <section className="neon-card rounded-[2rem] p-6">
      <p className="neon-kicker">Fan notes</p>
      <h2 className="mt-4 text-2xl font-black uppercase text-white">{title}</h2>
      <div className="mt-5 grid gap-3">
        {safeNotes.map((note) => (
          <p
            key={note}
            className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 px-4 py-3 text-sm font-semibold leading-6 text-slate-200"
          >
            {note}
          </p>
        ))}
      </div>
    </section>
  );
}

export function RelatedTournamentLinks({
  links,
}: {
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <p className="neon-kicker">Related content</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-lime-200 transition hover:border-lime-300/50 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
