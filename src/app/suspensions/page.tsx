import { Container } from "@/components/ui/container";
import { getLeaderboard } from "@/lib/data/leaderboards";
import { TeamFlag } from "@/components/worldcup/team-flag";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "World Cup 2026 Suspension Tracker",
  description:
    "World Cup 2026 suspension tracker using yellow-card and red-card leaderboard signals.",
};

export default async function SuspensionsPage() {
  const [yellowCards, redCards] = await Promise.all([
    getLeaderboard("yellow_cards"),
    getLeaderboard("red_cards"),
  ]);

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <p className="neon-kicker">Suspension tracker</p>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            Discipline watch
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Yellow and red card leaders, ready to evolve into a suspension-risk
            tracker when official thresholds and match rules are synced.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {[
            { title: "Yellow-card watch", rows: yellowCards },
            { title: "Red-card watch", rows: redCards },
          ].map(({ title, rows }) => (
            <article key={title} className="neon-card rounded-[2rem] p-5">
              <h2 className="text-2xl font-black uppercase text-white">{title}</h2>
              <div className="mt-5 grid gap-3">
                {rows.slice(0, 10).map((row, index) => (
                    <div
                      key={`${row.api_player_id}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                    >
                      <div>
                        <p className="font-black text-white">
                          {row.player_name ?? "Player TBC"}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-400">
                          <TeamFlag name={row.team_name} className="h-6 w-6 text-sm" />
                          {row.team_name ?? "Team TBC"}
                        </p>
                      </div>
                      <p className="text-2xl font-black text-lime-200">
                        {row.value_numeric ?? 0}
                      </p>
                    </div>
                  ))}
              </div>
            </article>
          ))}
        </section>
      </Container>
    </main>
  );
}
