import { Container } from "@/components/ui/container";

export const metadata = {
  title: "World Cup 2026 Prediction Leaderboard",
  description:
    "Community prediction leaderboard structure for match winners, scores and bracket picks.",
};

const sampleRows = [
  ["Fan rank #1", "Winner picks", "84 pts"],
  ["Bracket boss", "Score picks", "79 pts"],
  ["Dark horse scout", "Upset calls", "71 pts"],
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
            Leaderboard shell for winner picks, score predictions and bracket
            forecasts. Ready for user prediction data when accounts go live.
          </p>
        </section>

        <section className="neon-card mt-8 rounded-[2rem] p-5">
          <div className="cyber-table">
            <table className="min-w-[640px] text-left">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Speciality</th>
                  <th className="text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {sampleRows.map(([name, type, points], index) => (
                  <tr key={name} className="text-slate-200">
                    <td className="font-black text-white">#{index + 1} {name}</td>
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
      </Container>
    </main>
  );
}
