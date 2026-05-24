import Link from "next/link";
import type { Fixture } from "@/lib/data/worldcup";
import { formatDateTime, getFixtureDisplayStatus, teamSlug } from "@/lib/worldcup/format";
import { FixtureStatusBadge } from "@/components/worldcup/fixture-status-badge";

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
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-black text-white">
        {alt.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-9 w-9 rounded-full object-contain"
      loading="lazy"
    />
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
      <span
        className={`truncate text-sm font-bold ${
          isWinner ? "text-emerald-200" : "text-white"
        }`}
      >
        {displayName}
      </span>
    </div>
  );

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.04] p-3">
      {apiTeamId && name ? (
        <Link href={`/teams/${teamSlug(name, apiTeamId)}`} className="min-w-0">
          {content}
        </Link>
      ) : (
        <div className="min-w-0">{content}</div>
      )}

      <span className="min-w-8 text-right text-xl font-black text-white">
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

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {fixture.round ?? fixture.group_name ?? "World Cup 2026"}
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-200">
            {formatDateTime(fixture.match_date)}
          </p>
        </div>
        <FixtureStatusBadge
          statusShort={fixture.status_short}
          statusLong={fixture.status_long}
        />
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

      <div className="mt-5 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
        <p>
          <span className="font-semibold text-slate-300">Venue:</span>{" "}
          {fixture.venue_name ?? "Venue TBC"}
          {fixture.venue_city ? `, ${fixture.venue_city}` : ""}
        </p>
        <p>
          <span className="font-semibold text-slate-300">Status:</span>{" "}
          {fixture.status_long ?? fixture.status_short ?? "TBC"}
        </p>
      </div>
    </article>
  );
}
