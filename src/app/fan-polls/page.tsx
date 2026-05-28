import type { Metadata } from "next";
import { PollCard } from "@/components/community/poll-card";
import { Container } from "@/components/ui/container";
import { getPublishedPolls } from "@/lib/data/community";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "World Cup 2026 Fan Polls",
  description:
    "Vote in World Cup 2026 fan polls and track community opinion across teams, dark horses, favourites and host nations.",
  path: "/fan-polls",
});

const launchPollPrompts = [
  {
    title: "Who wins the tournament?",
    options: ["Argentina", "France", "Brazil", "Spain"],
  },
  {
    title: "Biggest dark horse?",
    options: ["Morocco", "Japan", "Colombia", "Senegal"],
  },
  {
    title: "Which host nation goes furthest?",
    options: ["USA", "Mexico", "Canada"],
  },
  {
    title: "Golden Boot pick?",
    options: ["Mbappe", "Messi", "Kane", "Vinicius Jr"],
  },
  {
    title: "First big upset?",
    options: ["Opening week", "Group finale", "Round of 32", "Quarter-finals"],
  },
  {
    title: "Most chaotic group?",
    options: ["Group A", "Group D", "Group G", "Group J"],
  },
];

export default async function FanPollsPage() {
  const polls = await getPublishedPolls({ limit: 12 }).catch(() => []);

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <p className="neon-kicker">Fan polls</p>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            Vote the tournament mood
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Vote in World Cup 2026 fan polls and reveal community results after
            your pick. No fake counts, no inflated social proof, just real
            recorded votes as the community wakes up.
          </p>
        </section>

        {polls.length > 0 ? (
          <section className="mt-8 grid gap-5 lg:grid-cols-2">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} source="fan_polls" />
            ))}
          </section>
        ) : (
          <section className="mt-8 grid gap-5 lg:grid-cols-2">
            {launchPollPrompts.map((poll) => (
              <article key={poll.title} className="neon-panel rounded-[2rem] p-5">
                <p className="neon-kicker">Launch poll prompt</p>
                <h2 className="mt-4 text-2xl font-black uppercase text-white">
                  {poll.title}
                </h2>
                <div className="mt-5 grid gap-3">
                  {poll.options.map((option) => (
                    <div
                      key={option}
                      className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black text-white">{option}</p>
                        <p className="text-sm font-black text-slate-500">
                          0 votes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 px-4 py-3 text-xs font-semibold leading-5 text-cyan-100">
                  Vote to reveal community results once this poll is published
                  in the live Supabase poll system.
                </p>
              </article>
            ))}
          </section>
        )}
      </Container>
    </main>
  );
}
