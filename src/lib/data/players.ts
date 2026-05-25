import "server-only";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type PlayerProfile = {
  api_player_id: number;
  name: string | null;
  age: number | null;
  photo_url: string | null;
  team_name: string | null;
  position: string | null;
  number: number | null;
  injuries: Array<{
    type: string | null;
    reason: string | null;
    team_name: string | null;
    fixture_date: string | null;
  }>;
  rankings: Array<{
    stat_type: string;
    value_numeric: number | null;
    team_name: string | null;
  }>;
};

export function playerSlug(name: string | null, apiPlayerId: number) {
  const safeName = (name || "player")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeName}-${apiPlayerId}`;
}

export function getPlayerIdFromSlug(slug: string) {
  const match = slug.match(/-(\d+)$/);
  return match ? Number(match[1]) : null;
}

export async function getPlayerProfileBySlug(slug: string) {
  const apiPlayerId = getPlayerIdFromSlug(slug);

  if (!apiPlayerId) notFound();

  const supabase = createSupabaseAdminClient();

  const [{ data: player }, { data: squadRows }, { data: injuries }, { data: rankings }] =
    await Promise.all([
      supabase
        .from("players")
        .select("api_player_id,name,age,photo_url")
        .eq("api_player_id", apiPlayerId)
        .maybeSingle(),

      supabase
        .from("team_squad_players")
        .select("team_name,position,number")
        .eq("api_player_id", apiPlayerId)
        .limit(1),

      supabase
        .from("injuries")
        .select("type,reason,team_name,fixture_date")
        .eq("api_player_id", apiPlayerId)
        .order("fixture_date", { ascending: false }),

      supabase
        .from("top_player_stats")
        .select("stat_type,value_numeric,team_name")
        .eq("api_player_id", apiPlayerId)
        .order("value_numeric", { ascending: false }),
    ]);

  if (!player) notFound();

  const squad = squadRows?.[0] ?? null;

  return {
    api_player_id: player.api_player_id,
    name: player.name,
    age: player.age,
    photo_url: player.photo_url,
    team_name: squad?.team_name ?? null,
    position: squad?.position ?? null,
    number: squad?.number ?? null,
    injuries: injuries ?? [],
    rankings: rankings ?? [],
  } as PlayerProfile;
}
