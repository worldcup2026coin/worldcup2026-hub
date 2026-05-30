import type { Metadata } from "next";
import { LeaderboardTable } from "@/components/leaderboards/leaderboard-table";
import { getLeaderboard } from "@/lib/data/leaderboards";

export const metadata: Metadata = {
  title: "World Cup 2026 Top Scorers",
  description:
    "Track World Cup 2026 top scorers with goals, teams and tournament scoring leaders.",
};

export default async function Page() {
  const rows = await getLeaderboard("scorers");

  return (
    <LeaderboardTable
      title="Top Scorers"
      valueLabel="Goals"
      rows={rows}
    />
  );
}
