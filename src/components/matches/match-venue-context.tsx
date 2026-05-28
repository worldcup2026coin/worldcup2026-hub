import Link from "next/link";
import type { Fixture } from "@/lib/data/matches";
import {
  formatDateTime,
  formatVenueDateTime,
  getFixtureHostCity,
  getFixtureVenueTimeZone,
} from "@/lib/worldcup/format";
import {
  formatPublicVenueName,
  venueNamingHelper,
} from "@/lib/venue-labels";

type MatchVenueContextProps = {
  fixture: Fixture;
};

function InfoTile({
  label,
  value,
  tone = "cyan",
}: {
  label: string;
  value: string;
  tone?: "cyan" | "lime" | "pink";
}) {
  const toneClass = {
    cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
    lime: "border-lime-300/20 bg-lime-300/10 text-lime-100",
    pink: "border-fuchsia-300/20 bg-fuchsia-400/10 text-fuchsia-100",
  }[tone];

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] opacity-80">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-white">
        {value}
      </p>
    </div>
  );
}

export function MatchVenueContext({ fixture }: MatchVenueContextProps) {
  const hostCity = getFixtureHostCity(fixture);
  const venueTimeZone = getFixtureVenueTimeZone(fixture);

  const venueLocalTime = formatVenueDateTime(fixture);
  const venueName = formatPublicVenueName(fixture.venue_name ?? hostCity?.stadium);
  const helper = venueNamingHelper(fixture.venue_name);
  const siteKickoff = formatDateTime(fixture.match_date, "Europe/Dublin", {
    includeTimeZoneName: true,
  });

  if (!fixture.match_date && !fixture.venue_name && !fixture.venue_city) {
    return null;
  }

  return (
    <section className="neon-panel mt-6 rounded-[2rem] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="neon-kicker">Matchday information</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-white">
            Timezone and venue context
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Kick-off times are calculated from the real fixture timestamp. Venue time uses the host city timezone where available, and stays explicit when the venue is still TBC.
          </p>
        </div>

        {hostCity ? (
          <span className="neon-badge neon-badge-cyan">
            {hostCity.country} host city
          </span>
        ) : (
          <span className="neon-badge">Venue lookup pending</span>
        )}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <InfoTile label="Venue local time" value={venueLocalTime} tone="lime" />
        <InfoTile label="Site local time" value={siteKickoff} tone="cyan" />
        <InfoTile
          label="Timezone source"
          value={
            hostCity
              ? hostCity.timezone
              : venueTimeZone
                ? `${venueTimeZone} fixture feed`
                : "Venue TBC"
          }
          tone="pink"
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
            Venue
          </p>
          <h3 className="mt-3 text-2xl font-black uppercase text-white">
            {venueName ?? "Venue TBC"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {fixture.venue_city ?? hostCity?.city ?? "Host city TBC"}
            {hostCity ? ` · ${hostCity.country}` : ""}
            {helper ? (
              <span className="mt-1 block text-xs text-slate-500">
                {helper}
              </span>
            ) : null}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">
            Tournament role
          </p>
          <h3 className="mt-3 text-2xl font-black uppercase text-white">
            {hostCity?.role ?? "World Cup 2026 fixture"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {hostCity?.matchesHosted ?? "Venue hosting information will update as fixture data is enriched."}
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
            Fan guide
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Use the venue and host-city guides for timezone, travel and tournament context.
          </p>

          <div className="mt-5 flex flex-col gap-3">
            {hostCity ? (
              <>
                <Link
                  href={`/host-cities/${hostCity.slug}`}
                  className="glow-button-primary"
                >
                  View host city
                </Link>
                <Link
                  href={`/stadiums/${hostCity.stadiumSlug}`}
                  className="glow-button-secondary"
                >
                  View stadium
                </Link>
              </>
            ) : (
              <Link href="/stadiums" className="glow-button-secondary">
                Explore stadiums
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
