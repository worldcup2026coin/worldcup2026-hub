import { Container } from "@/components/ui/container";

export const metadata = {
  title: "World Cup 2026 Fan Polls",
  description:
    "Fan polls for World Cup 2026 groups, matches, dark horses and tournament predictions.",
};

const polls = [
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
  {
    title: "Team most likely to bottle it?",
    options: ["A favourite", "A host nation", "A dark horse", "Too early"],
  },
  {
    title: "Best fanbase?",
    options: ["Mexico", "Argentina", "Morocco", "Japan"],
  },
  {
    title: "Most exciting young player?",
    options: ["Musiala", "Yamal", "Endrick", "Bellingham"],
  },
  {
    title: "Biggest group-stage shock?",
    options: ["Favourite exits", "Host run", "New nation breaks out", "Goal storm"],
  },
];

const samplePercentages = [38, 27, 21, 14];

export default function FanPollsPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <p className="neon-kicker">Fan polls</p>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            Vote the tournament mood
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Static launch polls for groups, matches and tournament storylines.
            Live voting can plug into this hub later; these cards are launch
            prompts for review and community discussion.
          </p>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          {polls.map((poll) => (
            <article key={poll.title} className="neon-panel rounded-[2rem] p-5">
              <p className="neon-kicker">Launch poll prompt</p>
              <h2 className="mt-4 text-2xl font-black uppercase text-white">
                {poll.title}
              </h2>
              <div className="mt-5 grid gap-3">
                {poll.options.map((option, index) => {
                  const value = samplePercentages[index] ?? 14;

                  return (
                    <div
                      key={option}
                      className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black text-white">{option}</p>
                        <p className="text-sm font-black text-lime-200">
                          {value}%
                        </p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-lime-300"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                </div>
              <p className="mt-4 text-xs font-semibold text-slate-500">
                Static launch sample. Live vote totals will be labelled when
                voting is connected.
              </p>
            </article>
          ))}
        </section>
      </Container>
    </main>
  );
}
