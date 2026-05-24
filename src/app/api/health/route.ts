import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'worldcup2026-hub',
    phase: '0',
    env: {
      supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabasePublishableKey: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ),
      apiFootballBaseUrl: Boolean(process.env.API_FOOTBALL_BASE_URL),
      apiFootballKey: Boolean(process.env.API_FOOTBALL_KEY),
    },
  });
}
