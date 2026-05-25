
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { ThirdPlaceTable } from "@/components/worldcup/third-place-table";
import { getGroupsPageData } from "@/lib/data/worldcup";
import { breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "World Cup 2026 Best Third-Placed Teams Explained | Round of 32 Qualification",
  description:
    "Learn how the eight best third-placed teams qualify for the World Cup 2026 Round of 32, including ranking rules, tiebreakers and live qualification table.",
  alternates: {
    canonical: "/best-third-placed-teams",
  },
  openGraph: {
    title: "World Cup 2026 Best Third-Placed Teams Explained",
    description:
      "Track the live best third-placed teams table and learn how Round of 32 qualification works.",
    url: "/best-third-placed-teams",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "World Cup 2026 Best Third-Placed Teams Explained",
    description:
      "How the eight best third-placed teams qualify for the World Cup 2026 Round of 32.",
  },
};

const faqs = [
  {
    question: "Can a third-placed team qualify for the knockouts?",
    answer:
      "Yes. In World Cup 2026, the eight best third-placed teams from the 12 groups qualify for the Round of 32.",
  },
  {
    question: "How many third-placed teams go through?",
    answer: "Eight qualify and four are eliminated.",
  },
  {
    question: "What decides the best third-placed teams?",
    answer:
      "Points first, then goal difference, goals scored, team conduct score, and FIFA ranking if needed.",
  },
  {
    question: "Does every third-placed team play a group winner?",
    answer:
      "The Round of 32 matchup depends on which groups produce the eight qualifying third-placed teams.",
  },
  {
    question: "Why is it confusing?",
    answer:
      "Because 12 groups produce 12 third-placed teams, but only eight advance, and the knockout opponent depends on the final combination of qualifying groups.",
  },
];

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export default async function BestThirdPlacedTeamsPage() {
  const { standings, latestSync } = await getGroupsPageData();

  return (
    <div className="py-10 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Groups", path: "/groups" },
          {
            name: "Best third-placed teams",
            path: "/best-third-placed-teams",
          },
        ])}
      />
      <JsonLd data={faqJsonLd()} />

      <Container>
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <p className="neon-kicker">World Cup 2026 format guide</p>
                <span className="sticker-tilt inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-fuchsia-100">
                  3RD PLACE
                </span>
              </div>
              <h1 className="neon-title glow-text mt-5 max-w-5xl text-5xl font-black leading-[0.86] text-white sm:text-7xl">
                Third-place chaos, explained.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Twelve groups. Twelve third-placed teams. Eight survive. This page
                tracks the cut line and explains the tiebreaker signal without fake certainty.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/groups" className="glow-button-primary">
                  View groups
                </Link>
                <Link href="/fixtures" className="glow-button-secondary">
                  Fixtures
                </Link>
                <Link href="/live" className="glow-button-secondary">
                  Live centre
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:min-w-72">
              <div className="rounded-3xl border border-lime-300/25 bg-lime-300/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-200">
                  Qualify
                </p>
                <p className="mt-2 text-5xl font-black text-white">8</p>
              </div>
              <div className="rounded-3xl border border-fuchsia-300/25 bg-fuchsia-400/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-200">
                  Eliminated
                </p>
                <p className="mt-2 text-5xl font-black text-white">4</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {[
            {
              badge: "Why",
              title: "Third place matters",
              copy: "A team can finish third and still reach the knockouts, so final group games can stay chaotic even outside first and second.",
            },
            {
              badge: "Cut",
              title: "Eight go through",
              copy: "Twelve teams finish third. Eight qualify for the Round of 32 and four fall below the tournament cut.",
            },
            {
              badge: "Signal",
              title: "Cross-group ranking",
              copy: "Third-placed teams are compared across all groups using their full group-stage results.",
            },
          ].map((item) => (
            <article key={item.title} className="neon-card rounded-[2rem] p-5">
              <span className="neon-badge neon-badge-cyan">{item.badge}</span>
              <h2 className="mt-4 text-2xl font-black uppercase text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="neon-panel mt-8 rounded-[2rem] p-6">
          <p className="neon-kicker">Tiebreaker stack</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-white">
            Tiebreakers explained
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Third-placed teams are ranked by points, goal difference, goals
            scored, team conduct / fair play score if available, and FIFA
            ranking if still tied. Some tiebreakers may update when official
            data becomes available.
          </p>
          <ol className="mt-5 grid gap-3 text-sm text-slate-200 md:grid-cols-2">
            {[
              "Points obtained in all group matches",
              "Goal difference from all group matches",
              "Goals scored in all group matches",
              "Team conduct / fair play score if available",
              "FIFA ranking if still tied and available",
              "Stable team-name fallback only when data is missing",
            ].map((item, index) => (
              <li
                key={item}
                className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
              >
                <span className="mr-2 text-lime-200">#{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-8">
          <ThirdPlaceTable
            standings={standings}
            latestSync={latestSync?.ended_at}
          />
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="neon-card rounded-[2rem] border-lime-300/20 bg-lime-300/[0.06] p-6">
            <span className="neon-badge">Top 8</span>
            <h2 className="mt-4 text-2xl font-black uppercase text-white">
              Currently above the cut
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Teams ranked 1–8 in the live third-place table are currently in
              the Round of 32 picture.
            </p>
          </article>

          <article className="neon-card rounded-[2rem] border-fuchsia-300/20 bg-fuchsia-400/[0.06] p-6">
            <span className="neon-badge neon-badge-pink">Bottom 4</span>
            <h2 className="mt-4 text-2xl font-black uppercase text-white">
              Currently outside the cut
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Teams ranked 9–12 are below the line and may need points, goal
              difference swings, or help elsewhere.
            </p>
          </article>
        </section>

        <section className="neon-panel mt-8 rounded-[2rem] p-6">
          <p className="neon-kicker">FAQ</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-white">Format questions</h2>
          <div className="mt-5 grid gap-4">
            {faqs.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-4"
              >
                <h3 className="font-black uppercase text-white">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
