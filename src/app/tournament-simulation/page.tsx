import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "World Cup 2026 Tournament Simulation Hub",
  description:
    "Predict World Cup 2026 winners, semi-finalists, Golden Boot contenders and dark horses.",
};

export default function TournamentSimulationPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <p className="neon-kicker">Simulation hub</p>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            Predict the tournament
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            A fan-first prediction hub for winners, semi-finalists, Golden Boot
            picks and dark horses. This creates the structure for community
            submissions without adding account risk yet.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            ["Winner", "Who lifts the trophy on 19 July 2026?"],
            ["Semi-finalists", "Pick the four teams still standing late."],
            ["Golden Boot", "Name the scorer who owns the month."],
            ["Dark horses", "Spot the team that breaks the bracket."],
          ].map(([title, copy]) => (
            <article key={title} className="neon-card rounded-[2rem] p-6">
              <span className="neon-badge neon-badge-cyan">Prediction</span>
              <h2 className="mt-4 text-3xl font-black uppercase text-white">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-300">
                Interactive submission controls can connect to the community
                prediction backend when user accounts are ready.
              </div>
            </article>
          ))}
        </section>

        <Link href="/predictions" className="glow-button-secondary mt-8">
          View match predictions
        </Link>
      </Container>
    </main>
  );
}
