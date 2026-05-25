import { LeaderboardTable } from "@/components/leaderboards/leaderboard-table";
import { getLeaderboard } from "@/lib/data/leaderboards";

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
