
import type { Fixture } from "@/lib/data/matches";
import Image from "next/image";
import { formatFixtureTimes } from "@/lib/worldcup/format";
import {
  formatPublicVenueName,
  venueNamingHelper,
} from "@/lib/venue-labels";
import { getMatchStatusInfo } from "@/lib/worldcup/match-status";
import { MatchStatusBadge } from "@/components/matches/match-status-badge";

type MatchHeaderProps = {
  fixture: Fixture;
};

function TeamBadge({
  name,
  logo,
}: {
  name: string | null;
  logo: string | null;
}) {
  const displayName = name || "Team TBC";

  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <span className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-lime-300/25 bg-white/10 p-2 shadow-[0_0_30px_rgba(163,255,18,0.13)] sm:h-28 sm:w-28">
        {logo ? (
          <Image
            src={logo}
            alt={`${displayName} logo`}
            width={112}
            height={112}
            className="h-full w-full rounded-2xl object-contain"
          />
        ) : (
          <span className="text-2xl font-black text-white">
            {displayName.slice(0, 2).toUpperCase()}
          </span>
        )}
      </span>

      <h1 className="mt-4 w-full max-w-full whitespace-normal break-normal text-center text-base font-black uppercase leading-tight tracking-tight text-white [overflow-wrap:normal] [text-wrap:balance] [word-break:normal] max-[380px]:text-sm sm:max-w-[18rem] sm:text-4xl lg:max-w-[24rem]">
        {displayName}
      </h1>
    </div>
  );
}

function ScoreBox({ fixture }: { fixture: Fixture }) {
  const status = getMatchStatusInfo(fixture.status_short, fixture.status_long);

  if (!status.showScore) {
    return (
      <p className="mt-2 text-4xl font-black uppercase text-white sm:text-6xl">
        <span className="glow-text text-cyan-200">VS</span>
      </p>
    );
  }

  return (
    <p className="mt-2 text-5xl font-black text-white sm:text-7xl">
      {fixture.home_goals ?? "-"}
      <span className="mx-2 text-cyan-300">:</span>
      {fixture.away_goals ?? "-"}
    </p>
  );
}

export function MatchHeader({ fixture }: MatchHeaderProps) {
  const times = formatFixtureTimes(fixture);
  const venueName = formatPublicVenueName(fixture.venue_name);
  const helper = venueNamingHelper(fixture.venue_name);

  return (
    <section className="hero-panel w-full max-w-full overflow-hidden rounded-[2.25rem] p-6 sm:p-10">
      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="neon-kicker">
            {fixture.round || fixture.group_name || "World Cup 2026"}
          </p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
            {times.venueTimeLabel}
          </p>
        </div>

        <MatchStatusBadge
          statusShort={fixture.status_short}
          statusLong={fixture.status_long}
        />
      </div>

      <div className="relative z-10 mt-10 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-5">
        <TeamBadge
          name={fixture.home_team_name}
          logo={fixture.home_team_logo_url}
        />

        <div className="rounded-[2rem] border border-fuchsia-300/25 bg-slate-950/75 px-4 py-5 text-center shadow-[0_0_30px_rgba(255,43,214,0.14)] sm:px-6">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-fuchsia-200">
            Match signal
          </p>
          <ScoreBox fixture={fixture} />
        </div>

        <TeamBadge
          name={fixture.away_team_name}
          logo={fixture.away_team_logo_url}
        />
      </div>

      <div className="relative z-10 mt-8 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
            Venue
          </p>
          <p className="mt-2 font-semibold text-white">
            {venueName ?? "Venue TBC"}
            {fixture.venue_city ? `  -  ${fixture.venue_city}` : ""}
            {helper ? (
              <span className="mt-1 block text-xs text-slate-400">
                {helper}
              </span>
            ) : null}
          </p>
        </div>

        <div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">
            Status
          </p>
          <p className="mt-2 font-semibold text-white">
            {fixture.status_long ?? fixture.status_short ?? "Status TBC"}
          </p>
        </div>

        <div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-200">
            Site time
          </p>
          <p className="mt-2 font-semibold text-white">
            {times.userTimeLabel}
          </p>
        </div>
      </div>
    </section>
  );
}
