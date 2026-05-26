import { Container } from "@/components/ui/container";
import { getAllInjuries } from "@/lib/data/injuries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "World Cup 2026 Injury Centre",
  description:
    "World Cup 2026 injury centre with player, team, reason and fixture-date context from synced data.",
};

export default async function InjuriesPage() {
  const injuries = await getAllInjuries();

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <p className="neon-kicker">Injury centre</p>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            Availability watch
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Player availability updates from the synced injury feed.
          </p>
        </section>

        <section className="neon-card mt-8 rounded-[2rem] p-5">
          {injuries.length === 0 ? (
            <p className="text-sm text-slate-300">No injury records available.</p>
          ) : (
            <div className="grid gap-3">
              {injuries.map((injury) => (
                <article
                  key={injury.id}
                  className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-4"
                >
                  <p className="font-black text-white">
                    {injury.player_name ?? "Player TBC"}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    {injury.team_name ?? "Team TBC"} · {injury.type ?? "Injury"} ·{" "}
                    {injury.reason ?? "Reason TBC"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
