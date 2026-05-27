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
    throw new Error(`Failed to count ${tableName}: ${error.message}`);
  }

  return count ?? 0;
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return unauthorizedCronResponse();
  }

  const supabase = createSupabaseAdminClient();

  const [
    teams,
    fixtures,
    groups,
    standings,
    stadiums,
    hostCities,
    syncLogs,
  ] = await Promise.all([
    countRows("teams"),
    countRows("fixtures"),
    countRows("groups"),
    countRows("standings"),
    countRows("stadiums"),
    countRows("host_cities"),
    countRows("api_sync_logs"),
  ]);

  const { data: latestLogs, error: logsError } = await supabase
    .from("api_sync_logs")
    .select(
      "id, scope, status, started_at, ended_at, duration_ms, request_count, records_received, records_upserted, error_message"
    )
    .order("started_at", { ascending: false })
    .limit(10);

  if (logsError) {
    throw new Error(`Failed to load latest sync logs: ${logsError.message}`);
  }

  return NextResponse.json({
    status: "ok",
    counts: {
      teams,
      fixtures,
      groups,
      standings,
      stadiums,
      hostCities,
      syncLogs,
    },
    latestLogs,
  });
}
