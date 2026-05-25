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
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/40 sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-300">
            World Cup 2026 format guide
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
            World Cup 2026 Best Third-Placed Teams Explained
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            World Cup 2026 has 12 groups of four. The top two teams in every
            group qualify automatically, then the eight best third-placed teams
            also reach the Round of 32.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/groups"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-6 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
            >
              View groups
            </Link>
            <Link
              href="/fixtures"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Fixtures
            </Link>
            <Link
              href="/live"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Live centre
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Why third place matters in 2026",
              copy: "A team can finish third in its group and still reach the knockouts. That means some final group games can matter even when a team cannot finish first or second.",
            },
            {
              title: "How many third-placed teams qualify?",
              copy: "Twelve teams finish third across Groups A to L. Eight qualify for the Round of 32 and four are eliminated.",
            },
            {
              title: "How the table works",
              copy: "The third-placed teams are compared across all groups using group-stage results, not just their position inside one group.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5"
            >
              <h2 className="text-xl font-black text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {item.copy}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-black text-white">
            Tiebreakers explained
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Third-placed teams are ranked by points, goal difference, goals
            scored, team conduct / fair play score if available, and FIFA
            ranking if still tied. Some tiebreakers may update when official
            data becomes available, so this page avoids fake certainty.
          </p>
          <ol className="mt-5 grid gap-3 text-sm text-slate-200 md:grid-cols-2">
            {[
              "Points obtained in all group matches",
              "Goal difference from all group matches",
              "Goals scored in all group matches",
              "Team conduct / fair play score if available",
              "FIFA ranking if still tied and available",
              "Stable team-name fallback only when data is missing",
            ].map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
              >
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
          <article className="rounded-[2rem] border border-emerald-400/15 bg-emerald-400/[0.05] p-6">
            <h2 className="text-2xl font-black text-white">
              Who is currently qualifying?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Teams ranked 1–8 in the live third-place table are currently
              above the cut. This remains provisional until all group matches
              and official tiebreakers are complete.
            </p>
          </article>

          <article className="rounded-[2rem] border border-rose-400/15 bg-rose-400/[0.05] p-6">
            <h2 className="text-2xl font-black text-white">
              Who is currently eliminated?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Teams ranked 9–12 are currently outside the cut. They may need
              more points, a goal difference swing, or results elsewhere.
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-black text-white">
            What happens after the group stage?
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The eight qualifying third-placed teams are placed into the Round of
            32 bracket. The exact matchups depend on which groups produce the
            eight qualifying third-placed teams, so the opponent is not always
            obvious until the final combination is known.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-black text-white">FAQ</h2>
          <div className="mt-5 grid gap-4">
            {faqs.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
              >
                <h3 className="font-black text-white">{item.question}</h3>
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
