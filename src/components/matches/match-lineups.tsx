import type { MatchLineup } from "@/lib/data/worldcup";
import Image from "next/image";
import { MatchEmptyState } from "@/components/matches/match-empty-state";

type MatchLineupsProps = {
  lineups: MatchLineup[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
}

function playerName(value: unknown, index: number) {
  if (typeof value === "string") {
    return value;
  }

  const record = asRecord(value);

  if (!record) {
    return `Player ${index + 1}`;
  }

  const playerRecord = asRecord(record.player) ?? record;

  if (typeof playerRecord.name === "string") {
    return playerRecord.name;
  }

  if (typeof playerRecord.player === "string") {
    return playerRecord.player;
  }

  return `Player ${index + 1}`;
}

function playersFrom(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, index) => playerName(item, index));
}

export function MatchLineups({ lineups }: MatchLineupsProps) {
  if (lineups.length === 0) {
    return (
      <MatchEmptyState
        title="Lineups not released yet"
        description="Starting XI, substitutes, coaches and formations will appear here once lineups are synced or released."
      />
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30">
      <h2 className="text-2xl font-black text-white">Lineups</h2>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {lineups.map((lineup) => {
          const starters = playersFrom(lineup.starting_xi);
          const substitutes = playersFrom(lineup.substitutes);

          return (
            <article key={lineup.id} className="rounded-2xl bg-white/[0.04] p-4">
              <div className="flex items-center gap-3">
                {lineup.team_logo_url ? (
                  <Image
                    src={lineup.team_logo_url}
                    alt={`${lineup.team_name} logo`}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-contain"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-white/10" />
                )}

                <div>
                  <h3 className="font-black text-white">{lineup.team_name}</h3>
                  <p className="text-xs text-slate-400">
                    {lineup.formation ? `Formation: ${lineup.formation}` : "Formation TBC"}
                    {lineup.coach_name ? ` · Coach: ${lineup.coach_name}` : ""}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                    Starting XI
                  </p>
                  {starters.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-400">Not available</p>
                  ) : (
                    <ol className="mt-3 grid gap-2 text-sm text-slate-200">
                      {starters.map((name, index) => (
                        <li key={`${name}-${index}`}>{name}</li>
                      ))}
                    </ol>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                    Substitutes
                  </p>
                  {substitutes.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-400">Not available</p>
                  ) : (
                    <ol className="mt-3 grid gap-2 text-sm text-slate-200">
                      {substitutes.map((name, index) => (
                        <li key={`${name}-${index}`}>{name}</li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
