import type { Metadata } from "next";
import { LeaderboardTable } from "@/components/leaderboards/leaderboard-table";
import { getLeaderboard } from "@/lib/data/leaderboards";

export const metadata: Metadata = {
  title: "World Cup 2026 Top Cards",
  description:
    "Track World Cup 2026 disciplinary leaders with yellow card totals and player card stats.",
};

export default async function Page() {
  const rows = await getLeaderboard("yellow_cards");

  return (
    <LeaderboardTable
      title="Top Cards"
      valueLabel="Cards"
      rows={rows}
    />
  );
}
