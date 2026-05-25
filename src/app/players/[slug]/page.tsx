import type { Metadata } from "next";
import { getPlayerProfileBySlug } from "@/lib/data/players";
import { Container } from "@/components/ui/container";

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
        <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/30">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Player profile
          </p>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            {player.photo_url ? (
              <img
                src={player.photo_url}
                alt={player.name ?? "Player"}
                className="h-24 w-24 rounded-3xl object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-3xl">
                ⚽
              </div>
            )}

            <div>
              <h1 className="text-4xl font-black text-white">
                {player.name ?? "Player TBC"}
              </h1>
              <p className="mt-2 text-slate-300">
                {player.team_name ?? "Team TBC"}
                {player.position ? ` · ${player.position}` : ""}
                {player.number ? ` · #${player.number}` : ""}
                {player.age ? ` · Age ${player.age}` : ""}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-6">
            <h2 className="text-2xl font-black text-white">Tournament rankings</h2>

            {player.rankings.length === 0 ? (
              <p className="mt-3 text-sm text-slate-300">
                No ranking data available yet. Goals, assists and card rankings will appear when API-Football publishes tournament stats.
              </p>
            ) : (
              <div className="mt-5 grid gap-3">
                {player.rankings.map((row) => (
                  <div
                    key={`${row.stat_type}-${row.value_numeric}`}
                    className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-4"
                  >
                    <span className="font-bold text-slate-200">
                      {labelStat(row.stat_type)}
                    </span>
                    <span className="text-xl font-black text-emerald-300">
                      {row.value_numeric ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-6">
            <h2 className="text-2xl font-black text-white">Injury status</h2>

            {player.injuries.length === 0 ? (
              <p className="mt-3 text-sm text-slate-300">
                No injury records currently available for this player.
              </p>
            ) : (
              <div className="mt-5 grid gap-3">
                {player.injuries.map((injury, index) => (
                  <div
                    key={`${injury.reason}-${index}`}
                    className="rounded-2xl bg-white/[0.04] p-4"
                  >
                    <p className="font-bold text-rose-200">
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
