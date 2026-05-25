
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { getPlayerProfileBySlug } from "@/lib/data/players";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayerProfileBySlug(slug);

  return {
    title: `${player.name ?? "Player"} | World Cup 2026 Hub`,
    description: `World Cup 2026 profile for ${player.name ?? "player"}, including squad role, injury status and tournament rankings.`,
  };
}

function labelStat(type: string) {
  if (type === "scorers") return "Goals";
  if (type === "assists") return "Assists";
  if (type === "yellow_cards") return "Yellow cards";
  if (type === "red_cards") return "Red cards";
  return type;
}

export default async function PlayerPage({ params }: Props) {
  const { slug } = await params;
  const player = await getPlayerProfileBySlug(slug);

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.25rem] p-6 sm:p-10">
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">
            {player.photo_url ? (
              <img
                src={player.photo_url}
                alt={player.name ?? "Player"}
                className="h-28 w-28 rounded-[2rem] border border-lime-300/25 object-cover shadow-[0_0_28px_rgba(163,255,18,0.14)]"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-lime-300/25 bg-lime-300/10 text-4xl">
                ⚽
              </div>
            )}

            <div>
              <p className="neon-kicker">Player signal</p>
              <h1 className="neon-title glow-text mt-4 text-5xl font-black leading-[0.9] text-white sm:text-7xl">
                {player.name ?? "Player TBC"}
              </h1>
              <p className="mt-4 text-base font-semibold text-slate-300">
                {player.team_name ?? "Team TBC"}
                {player.position ? ` · ${player.position}` : ""}
                {player.number ? ` · #${player.number}` : ""}
                {player.age ? ` · Age ${player.age}` : ""}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="neon-card rounded-[2rem] p-6">
            <p className="neon-kicker">Leaderboard context</p>
            <h2 className="mt-4 text-2xl font-black uppercase text-white">Tournament rankings</h2>

            {player.rankings.length === 0 ? (
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Ranking data will appear once API-Football publishes tournament stats.
              </p>
            ) : (
              <div className="mt-5 grid gap-3">
                {player.rankings.map((row) => (
                  <div
                    key={`${row.stat_type}-${row.value_numeric}`}
                    className="flex items-center justify-between rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4"
                  >
                    <span className="font-black uppercase tracking-[0.08em] text-slate-200">
                      {labelStat(row.stat_type)}
                    </span>
                    <span className="text-3xl font-black text-lime-200">
                      {row.value_numeric ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="neon-card rounded-[2rem] p-6">
            <p className="neon-kicker">Availability</p>
            <h2 className="mt-4 text-2xl font-black uppercase text-white">Injury status</h2>

            {player.injuries.length === 0 ? (
              <p className="mt-4 text-sm leading-6 text-slate-300">
                No injury records currently available for this player.
              </p>
            ) : (
              <div className="mt-5 grid gap-3">
                {player.injuries.map((injury, index) => (
                  <div
                    key={`${injury.reason}-${index}`}
                    className="rounded-2xl border border-fuchsia-300/25 bg-fuchsia-400/10 p-4"
                  >
                    <p className="font-black text-fuchsia-100">
                      {injury.type ?? "Injury"}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      {injury.reason ?? "Reason TBC"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}
