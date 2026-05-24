import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const expected = process.env.SYNC_SECRET;

  if (!expected) return false;

  return request.headers.get("x-sync-secret") === expected;
}

async function countRows(tableName: string) {
  const supabase = createSupabaseAdminClient();

  const { count, error } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true });

  if (error) {
    return {
      ok: false,
      count: 0,
      error: error.message,
    };
  }

  return {
    ok: true,
    count: count ?? 0,
    error: null,
  };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        status: "error",
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const [
    teams,
    fixtures,
    standings,
    blogPosts,
    predictions,
    polls,
    pollVotes,
    subscribers,
    syncLogs,
  ] = await Promise.all([
    countRows("teams"),
    countRows("fixtures"),
    countRows("standings"),
    countRows("blog_posts"),
    countRows("predictions_tips"),
    countRows("polls"),
    countRows("poll_votes"),
    countRows("subscribers"),
    countRows("api_sync_logs"),
  ]);

  const { data: latestLogs } = await supabase
    .from("api_sync_logs")
    .select("scope,status,started_at,ended_at,records_received,records_upserted,error_message")
    .order("started_at", { ascending: false })
    .limit(5);

  const checks = {
    env: {
      supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabasePublishableKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
      supabaseSecretKey: Boolean(process.env.SUPABASE_SECRET_KEY),
      apiFootballBaseUrl: Boolean(process.env.API_FOOTBALL_BASE_URL),
      apiFootballKey: Boolean(process.env.API_FOOTBALL_KEY),
      syncSecret: Boolean(process.env.SYNC_SECRET),
      publicSiteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    },
    counts: {
      teams,
      fixtures,
      standings,
      blogPosts,
      predictions,
      polls,
      pollVotes,
      subscribers,
      syncLogs,
    },
    latestLogs: latestLogs ?? [],
  };

  const hardFailures = [
    !checks.env.supabaseUrl,
    !checks.env.supabaseSecretKey,
    !checks.env.syncSecret,
    !teams.ok,
    !fixtures.ok,
    !syncLogs.ok,
  ].filter(Boolean).length;

  return NextResponse.json({
    status: hardFailures === 0 ? "ok" : "warning",
    hardFailures,
    checks,
  });
}
