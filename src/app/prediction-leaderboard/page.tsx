import { Container } from "@/components/ui/container";

export const metadata = {
  title: "World Cup 2026 Prediction Leaderboard",
  description:
    "Community prediction leaderboard structure for match winners, scores and bracket picks.",
};

const sampleRows = [
  ["AI match reads", "Fixture picks and score lean", "Pending"],
  ["Group calls", "Winner and qualifier calls", "Pending"],
  ["Tournament outcomes", "Winner, finalist and dark horse calls", "Pending"],
];

export default function PredictionLeaderboardPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <p className="neon-kicker">Prediction leaderboard</p>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase text-white sm:text-7xl">
            Climb the fan table
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            A launch structure for tracking AI-assisted football reads and
            community fan picks once results start landing. No user account or
            live submission system is being claimed here yet.
          </p>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            [
              "1. Official $WC26 AI Picks",
              "The site prediction record will track uploaded AI-assisted match reads, group calls and tournament outcomes.",
            ],
            [
              "2. Community Fan Table",
              "Community picks can sit in a separate table when a safe submission flow exists.",
            ],
            [
              "3. Before kick-off",
              "This page shows the scoring structure. Live records and scoring rules will be added before matches begin.",
            ],
          ].map(([title, copy]) => (
            <article key={title} className="neon-panel rounded-[2rem] p-5">
              <p className="neon-kicker">How it works</p>
              <h2 className="mt-4 text-2xl font-black uppercase text-white">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
            </article>
          ))}
        </section>

        <section className="neon-card mt-8 rounded-[2rem] p-5">
          <div className="mb-5">
            <p className="neon-kicker">Official $WC26 AI Picks</p>
            <h2 className="mt-3 text-2xl font-black uppercase text-white">
              Prediction record structure
            </h2>
          </div>
          <div className="cyber-table">
            <table className="min-w-[640px] text-left">
              <thead>
                <tr>
                  <th>Track</th>
                  <th>What counts</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleRows.map(([name, type, points]) => (
                  <tr key={name} className="text-slate-200">
                    <td className="font-black text-white">{name}</td>
                    <td>{type}</td>
                    <td className="text-right text-xl font-black text-lime-200">
                      {points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="neon-card mt-8 rounded-[2rem] p-5">
          <p className="neon-kicker">Community Fan Table</p>
          <h2 className="mt-4 text-2xl font-black uppercase text-white">
            Fan scoring will stay separate
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            When community picks are supported, they should be scored in their
            own table so fan entries do not mix with uploaded $WC26 AI reads.
          </p>
        </section>
      </Container>
    </main>
  );
}
