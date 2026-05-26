import { Container } from "@/components/ui/container";

export const metadata = {
  title: "World Cup 2026 Fan Polls",
  description:
    "Fan polls for World Cup 2026 groups, matches, dark horses and tournament predictions.",
};

const pollOptions = ["Argentina", "Austria", "Jordan", "Algeria"];

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
            Poll templates for groups, matches and tournament storylines. Live
            poll rows can plug into this hub as the community system expands.
          </p>
        </section>

        <section className="neon-panel mt-8 rounded-[2rem] p-6">
          <p className="neon-kicker">Sample poll</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-white">
            Who wins Group J?
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {pollOptions.map((option, index) => (
              <div
                key={option}
                className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-white">{option}</p>
                  <p className="text-sm font-black text-lime-200">
                    {[42, 24, 18, 16][index]}%
                  </p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-lime-300"
                    style={{ width: `${[42, 24, 18, 16][index]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
