import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "World Cup 2026 Tournament Simulation Hub",
  description:
    "Explore World Cup 2026 tournament paths, bracket structure and future simulation features.",
};

export default function TournamentSimulationPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <p className="neon-kicker">Simulation hub</p>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            Simulate the tournament path
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            A factual launch shell for bracket paths, knockout routes and
            tournament structure. Prediction reads live in the dedicated
            predictions hub.
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
              <span className="neon-badge neon-badge-cyan">Simulation</span>
              <h2 className="mt-4 text-3xl font-black uppercase text-white">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-300">
                Interactive controls can be added later when the bracket data
                is final and reviewed.
              </div>
            </article>
          ))}
        </section>

        <Link href="/predictions" className="glow-button-secondary mt-8">
          Open predictions hub
        </Link>
      </Container>
    </main>
  );
}
