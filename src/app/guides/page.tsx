import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "World Cup 2026 Guides",
  description:
    "Evergreen World Cup 2026 guides for qualification, schedule, 48-team format, host cities, stadiums and best third-place rules.",
};

const guides = [
  ["/world-cup-format", "Why 48 teams?", "The 48-team format, 12 groups and Round of 32 route."],
  ["/best-third-placed-teams", "Best third-place teams explained", "How eight third-placed teams reach the knockouts."],
  ["/tournament-timeline", "World Cup schedule explained", "Opening match, group stage, knockouts and final."],
  ["/host-cities", "Host cities guide", "All 16 cities across USA, Mexico and Canada."],
  ["/stadiums", "Stadium guides", "Capacity, location, role and match context."],
];

export default function GuidesPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <p className="neon-kicker">World Cup guides</p>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            Evergreen fan guides
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Search-friendly explainers for format, fixtures, host cities,
            stadiums and qualification routes.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {guides.map(([href, title, copy]) => (
            <Link key={href} href={href} className="neon-card rounded-[2rem] p-6">
              <span className="neon-badge neon-badge-cyan">Guide</span>
              <h2 className="mt-4 text-2xl font-black uppercase text-white">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
            </Link>
          ))}
        </section>
      </Container>
    </main>
  );
}
