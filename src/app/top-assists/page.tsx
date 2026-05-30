import type { Metadata } from "next";
import { LeaderboardTable } from "@/components/leaderboards/leaderboard-table";
import { getLeaderboard } from "@/lib/data/leaderboards";

export const metadata: Metadata = {
  title: "World Cup 2026 Top Assists",
  description:
    "Track World Cup 2026 assist leaders with players, teams and tournament playmaking stats.",
};

export default async function Page() {
  const rows = await getLeaderboard("assists");

  return (
    <LeaderboardTable
      title="Top Assists"
      valueLabel="Assists"
      rows={rows}
    />
  );
}
