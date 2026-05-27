
import Link from "next/link";
import Image from "next/image";
import type { Fixture } from "@/lib/data/worldcup";
import {
  fixtureSlug,
  formatFixtureTimes,
  getFixtureDisplayStatus,
  teamSlug,
} from "@/lib/worldcup/format";
import { FixtureStatusBadge } from "@/components/worldcup/fixture-status-badge";
import { TeamFlag } from "@/components/worldcup/team-flag";

type FixtureCardProps = {
  fixture: Fixture;
};

function TeamLogo({
  src,
  alt,
}: {
  src: string | null | undefined;
  alt: string;
}) {
  if (!src) {
    return <TeamFlag name={alt} className="h-10 w-10" />;
  }

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-1 shadow-[0_0_18px_rgba(163,255,18,0.10)]">
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className="h-full w-full rounded-xl object-contain"
      />
    </span>
  );
}

function TeamLine({
  apiTeamId,
  name,
  logo,
  score,
  isWinner,
}: {
  apiTeamId: number | null;
  name: string | null;
  logo: string | null;
  score: number | null;
  isWinner: boolean;
}) {
  const displayName = name ?? "Team TBC";
  const content = (
    <div className="flex min-w-0 items-center gap-3">
      <TeamLogo src={logo} alt={displayName} />
      <TeamFlag name={displayName} className="h-7 w-7 text-base" />
      <span
        className={`truncate text-sm font-black ${
          isWinner ? "text-lime-200 glow-text" : "text-white"
        }`}
      >
        {displayName}
      </span>
    </div>
  );

  return (
    <div className={`flex items-center justify-between gap-4 rounded-2xl border p-3 ${
      isWinner
        ? "border-lime-300/25 bg-lime-300/10"
        : "border-white/10 bg-slate-950/45"
    }`}>
      {apiTeamId && name ? (
        <Link href={`/teams/${teamSlug(name, apiTeamId)}`} className="min-w-0 flex-1 hover:text-lime-200">
          {content}
        </Link>
      ) : (
        <div className="min-w-0">{content}</div>
      )}

      <span className="min-w-9 text-right text-2xl font-black text-white">
        {score ?? "-"}
      </span>
    </div>
  );
}

export function FixtureCard({ fixture }: FixtureCardProps) {
  const displayStatus = getFixtureDisplayStatus(fixture.status_short);
  const showScore = displayStatus === "live" || displayStatus === "finished";

  const homeScore = showScore ? fixture.home_goals : null;
  const awayScore = showScore ? fixture.away_goals : null;

  const matchSlug = fixtureSlug({
    api_fixture_id: fixture.api_fixture_id,
    match_date: fixture.match_date,
    home_team_name: fixture.home_team_name,
    away_team_name: fixture.away_team_name,
  });
  const times = formatFixtureTimes(fixture);

  return (
    <article className="neon-card group w-full max-w-full rounded-[2rem] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FixtureStatusBadge
          statusShort={fixture.status_short}
          statusLong={fixture.status_long}
        />
        <span className="max-w-full break-words rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-fuchsia-100">
          {times.venueTimeLabel}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <TeamLine
          apiTeamId={fixture.home_team_api_id}
          name={fixture.home_team_name}
          logo={fixture.home_team_logo_url}
          score={homeScore}
          isWinner={fixture.winner_api_team_id === fixture.home_team_api_id}
        />
        <TeamLine
          apiTeamId={fixture.away_team_api_id}
          name={fixture.away_team_name}
          logo={fixture.away_team_logo_url}
          score={awayScore}
          isWinner={fixture.winner_api_team_id === fixture.away_team_api_id}
        />
      </div>

      <div className="mt-5 grid gap-2 text-xs font-semibold text-slate-400 sm:grid-cols-2">
        <p>
          <span className="text-cyan-200">Venue:</span>{" "}
          {fixture.venue_name ?? "Venue TBC"}
          {fixture.venue_city ? `, ${fixture.venue_city}` : ""}
        </p>
        <p>
          <span className="text-lime-200">Site time:</span>{" "}
          {times.userTimeLabel}
        </p>
        <p className="sm:col-span-2">
          <span className="text-fuchsia-200">Round:</span>{" "}
          {fixture.round ?? fixture.group_name ?? "World Cup 2026"}
        </p>
      </div>

      <Link href={`/matches/${matchSlug}`} className="glow-button-secondary mt-5 w-full">
        Match centre
      </Link>
    </article>
  );
}
