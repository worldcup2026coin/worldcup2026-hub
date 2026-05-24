import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "worldcup2026-hub",
    phase: "2",
    env: {
      supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabasePublishableKey: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ),
      supabaseSecretKey: Boolean(
        process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
      ),
      apiFootballBaseUrl: Boolean(process.env.API_FOOTBALL_BASE_URL),
      apiFootballKey: Boolean(process.env.API_FOOTBALL_KEY),
      apiFootballLeagueId: Boolean(
        process.env.API_FOOTBALL_WORLD_CUP_LEAGUE_ID
      ),
      apiFootballSeason: Boolean(process.env.API_FOOTBALL_SEASON),
      syncSecret: Boolean(process.env.SYNC_SECRET),
    },
  });
}
