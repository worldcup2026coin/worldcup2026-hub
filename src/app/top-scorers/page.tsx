import { LeaderboardTable } from "@/components/leaderboards/leaderboard-table";
import { getLeaderboard } from "@/lib/data/leaderboards";

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
