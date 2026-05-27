import { NextRequest, NextResponse } from "next/server";
import {
  isAuthorizedCronRequest,
  unauthorizedCronResponse,
} from "@/lib/sync/cron-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
  if (!isAuthorizedCronRequest(request)) {
    return unauthorizedCronResponse();
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
      supabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      legacySupabaseSecretKey: Boolean(process.env.SUPABASE_SECRET_KEY),
      apiFootballBaseUrl: Boolean(process.env.API_FOOTBALL_BASE_URL),
      apiFootballKey: Boolean(process.env.API_FOOTBALL_KEY),
      cronSecret: Boolean(process.env.CRON_SECRET),
      legacySyncSecret: Boolean(process.env.SYNC_SECRET),
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
    !checks.env.supabaseServiceRoleKey && !checks.env.legacySupabaseSecretKey,
    !checks.env.cronSecret && !checks.env.legacySyncSecret,
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
