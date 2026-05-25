import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type LeaderboardRow = {
  api_player_id: number;
  player_name: string | null;
  team_name: string | null;
  value_numeric: number | null;
};

export async function getLeaderboard(statType: string) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("top_player_stats")
    .select(`
      api_player_id,
      player_name,
      team_name,
      value_numeric
    `)
    .eq("stat_type", statType)
    .order("value_numeric", { ascending: false })
    .limit(50);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as LeaderboardRow[];
}

