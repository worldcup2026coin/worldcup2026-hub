import type { Fixture } from "@/lib/data/matches";
import { formatDateTime } from "@/lib/worldcup/format";
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
      {logo ? (
        <img
          src={logo}
          alt={`${displayName} logo`}
          className="h-20 w-20 rounded-full object-contain sm:h-24 sm:w-24"
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-black text-white sm:h-24 sm:w-24">
          {displayName.slice(0, 2).toUpperCase()}
        </div>
      )}

      <h1 className="mt-4 max-w-[12rem] truncate text-2xl font-black text-white sm:text-4xl">
        {displayName}
      </h1>
    </div>
  );
}

function ScoreBox({ fixture }: { fixture: Fixture }) {
  const status = getMatchStatusInfo(fixture.status_short, fixture.status_long);

  if (!status.showScore) {
    return (
      <p className="mt-2 text-3xl font-black text-white sm:text-5xl">
        <span className="text-slate-400">vs</span>
      </p>
    );
  }

  return (
    <p className="mt-2 text-4xl font-black text-white sm:text-6xl">
      {fixture.home_goals ?? "-"}
      <span className="mx-2 text-slate-600">-</span>
      {fixture.away_goals ?? "-"}
    </p>
  );
}

export function MatchHeader({ fixture }: MatchHeaderProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/40 sm:p-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
            {fixture.round || fixture.group_name || "World Cup 2026"}
          </p>
          <p className="mt-3 text-sm text-slate-300">
            {formatDateTime(fixture.match_date)}
          </p>
        </div>

        <MatchStatusBadge
          statusShort={fixture.status_short}
          statusLong={fixture.status_long}
        />
      </div>

      <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <TeamBadge
          name={fixture.home_team_name}
          logo={fixture.home_team_logo_url}
        />

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-center shadow-xl shadow-slate-950/40">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Score
          </p>
          <ScoreBox fixture={fixture} />
        </div>

        <TeamBadge
          name={fixture.away_team_name}
          logo={fixture.away_team_logo_url}
        />
      </div>

      <div className="mt-8 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Stage
          </p>
          <p className="mt-1 font-bold text-white">
            {fixture.round || fixture.group_name || "Stage TBC"}
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.04] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Venue
          </p>
          <p className="mt-1 font-bold text-white">
            {fixture.venue_name || "Venue TBC"}
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.04] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Host city
          </p>
          <p className="mt-1 font-bold text-white">
            {fixture.venue_city || "Host city TBC"}
          </p>
        </div>
      </div>
    </section>
  );
}
