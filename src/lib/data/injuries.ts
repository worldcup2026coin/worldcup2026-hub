import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type Injury = {
  id: string;
  api_fixture_id: number | null;
  api_team_id: number | null;
  api_player_id: number | null;
  player_name: string | null;
  team_name: string | null;
  type: string | null;
  reason: string | null;
  fixture_date: string | null;
  last_synced_at: string | null;
};

function asInjuries(data: unknown): Injury[] {
  return (data ?? []) as Injury[];
}

export async function getInjuriesForFixture(apiFixtureId: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("injuries")
    .select("*")
    .eq("api_fixture_id", apiFixtureId)
    .order("team_name", { ascending: true })
    .order("player_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load fixture injuries: ${error.message}`);
  }

  return asInjuries(data);
}

export async function getInjuriesForTeam(apiTeamId: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("injuries")
    .select("*")
    .eq("api_team_id", apiTeamId)
    .order("fixture_date", { ascending: true })
    .order("player_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load team injuries: ${error.message}`);
  }

  return asInjuries(data);
}

export async function getAllInjuries(limit = 100) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("injuries")
    .select("*")
    .order("fixture_date", { ascending: true })
    .order("team_name", { ascending: true })
    .order("player_name", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load injuries: ${error.message}`);
  }

  return asInjuries(data);
}
