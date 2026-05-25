
import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { LeaderboardRow } from "@/lib/data/leaderboards";
import { playerSlug } from "@/lib/data/players";

type Props = {
  title: string;
  valueLabel: string;
  rows: LeaderboardRow[];
};

function emptyCopy(valueLabel: string) {
  const label = valueLabel.toLowerCase();

  if (label.includes("assist")) return "Top assists will appear once the playmakers start cooking.";
  if (label.includes("card")) return "Card signal lands here once tournament edge shows up.";
  return "Goal chart waiting for the finishers to light it up.";
}

export function LeaderboardTable({ title, valueLabel, rows }: Props) {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.25rem] p-6 sm:p-10">
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="neon-kicker">Leaderboard signal</p>
              <h1 className="neon-title glow-text mt-4 text-4xl font-black leading-[0.9] text-white sm:text-6xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Tournament leaders with bold ranks, player links and live-data energy.
              </p>
            </div>
            <span className="sticker-tilt inline-flex w-fit rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-fuchsia-100">
              Top table
            </span>
          </div>
        </section>

        <section className="neon-card mt-8 rounded-[2rem] p-5">
          {rows.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-lime-300/20 bg-lime-300/10 p-8 text-center text-slate-300">
              <p className="text-3xl">⚡</p>
              <h2 className="mt-4 text-2xl font-black uppercase text-white">No data yet</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6">
                {emptyCopy(valueLabel)}
              </p>
            </div>
          ) : (
            <div className="cyber-table">
              <table className="min-w-[720px] text-left">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Player</th>
                    <th>Team</th>
                    <th className="text-right">{valueLabel}</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => {
                    const topThree =
                      index === 0
                        ? "bg-lime-300/[0.08]"
                        : index === 1
                          ? "bg-cyan-300/[0.06]"
                          : index === 2
                            ? "bg-fuchsia-400/[0.055]"
                            : "";

                    return (
                      <tr
                        key={`${row.api_player_id}-${index}`}
                        className={`text-slate-200 ${topThree}`}
                      >
                        <td>
                          <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-lime-300/25 bg-lime-300/10 text-sm font-black text-lime-100">
                            {index + 1}
                          </span>
                        </td>

                        <td className="font-black text-white">
                          <Link
                            href={`/players/${playerSlug(row.player_name, row.api_player_id)}`}
                            className="transition hover:text-lime-200 hover:drop-shadow-[0_0_12px_rgba(163,255,18,0.35)]"
                          >
                            {row.player_name ?? "Unknown"}
                          </Link>
                        </td>

                        <td className="font-semibold text-slate-300">
                          {row.team_name ?? "-"}
                        </td>

                        <td className="text-right text-2xl font-black text-lime-200">
                          {row.value_numeric ?? 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
