import { LeaderboardTable } from "@/components/leaderboards/leaderboard-table";
import { getLeaderboard } from "@/lib/data/leaderboards";

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
