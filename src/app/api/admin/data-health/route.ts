import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  isAuthorizedCronRequest,
  unauthorizedCronResponse,
} from "@/lib/sync/cron-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type TableHealthConfig = {
  tableName: string;
  latestColumn?: string;
  staleAfterMinutes?: number | null;
};

type TableHealthResult = {
  tableName: string;
  count: number | null;
  latestTimestamp: string | null;
  staleAfterMinutes: number | null;
  ageMinutes: number | null;
  status: "ok" | "empty" | "stale" | "missing" | "error";
  error: string | null;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getAgeMinutes(value: string | null) {
  if (!value) return null;

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) return null;

  return Math.round((Date.now() - timestamp) / 60000);
}

function getTableStatus(
  count: number | null,
  ageMinutes: number | null,
  staleAfterMinutes: number | null,
  error: string | null
): TableHealthResult["status"] {
  if (error) {
    if (error.toLowerCase().includes("does not exist")) return "missing";
    return "error";
  }

  if (count === 0) return "empty";

  if (
    ageMinutes !== null &&
    staleAfterMinutes !== null &&
    ageMinutes > staleAfterMinutes
  ) {
    return "stale";
  }

  return "ok";
}

async function getTableHealth(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  config: TableHealthConfig
): Promise<TableHealthResult> {
  try {
    const countResult = await supabase
      .from(config.tableName)
      .select("*", { count: "exact", head: true });

    if (countResult.error) {
      return {
        tableName: config.tableName,
        count: null,
        latestTimestamp: null,
        staleAfterMinutes: config.staleAfterMinutes ?? null,
        ageMinutes: null,
        status: getTableStatus(
          null,
          null,
          config.staleAfterMinutes ?? null,
          countResult.error.message
        ),
        error: countResult.error.message,
      };
    }

    let latestTimestamp: string | null = null;

    if (config.latestColumn) {
      const latestResult = await supabase
        .from(config.tableName)
        .select(config.latestColumn)
        .not(config.latestColumn, "is", null)
        .order(config.latestColumn, { ascending: false })
        .limit(1);

      if (!latestResult.error && latestResult.data?.[0]) {
        const row = latestResult.data[0] as unknown as Record<string, unknown>;
        const value = row[config.latestColumn];

        latestTimestamp = typeof value === "string" ? value : null;
      }
    }

    const ageMinutes = getAgeMinutes(latestTimestamp);
    const staleAfterMinutes = config.staleAfterMinutes ?? null;

    return {
      tableName: config.tableName,
      count: countResult.count ?? 0,
      latestTimestamp,
      staleAfterMinutes,
      ageMinutes,
      status: getTableStatus(
        countResult.count ?? 0,
        ageMinutes,
        staleAfterMinutes,
        null
      ),
      error: null,
    };
  } catch (error) {
    const message = getErrorMessage(error);

    return {
      tableName: config.tableName,
      count: null,
      latestTimestamp: null,
      staleAfterMinutes: config.staleAfterMinutes ?? null,
      ageMinutes: null,
      status: "error",
      error: message,
    };
  }
}

async function getLatestSyncLogs(
  supabase: ReturnType<typeof createSupabaseAdminClient>
) {
  const { data, error } = await supabase
    .from("api_sync_logs")
    .select(
      "job_name, scope, status, api_requests_used, records_seen, records_updated, error_message, started_at, finished_at, duration_ms"
    )
    .order("started_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);

  return data ?? [];
}

async function getRecentProblemLogs(
  supabase: ReturnType<typeof createSupabaseAdminClient>
) {
  const { data, error } = await supabase
    .from("api_sync_logs")
    .select(
      "job_name, scope, status, api_requests_used, records_seen, records_updated, error_message, started_at"
    )
    .in("status", ["failed", "partial"])
    .order("started_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);

  return data ?? [];
}

async function getTodaySyncTotals(
  supabase: ReturnType<typeof createSupabaseAdminClient>
) {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("api_sync_logs")
    .select("api_requests_used, records_seen, records_updated, status")
    .gte("started_at", startOfToday.toISOString());

  if (error) throw new Error(error.message);

  const rows = data ?? [];

  return {
    jobsToday: rows.length,
    apiRequestsToday: rows.reduce(
      (sum, row) => sum + Number(row.api_requests_used ?? 0),
      0
    ),
    recordsSeenToday: rows.reduce(
      (sum, row) => sum + Number(row.records_seen ?? 0),
      0
    ),
    recordsUpdatedToday: rows.reduce(
      (sum, row) => sum + Number(row.records_updated ?? 0),
      0
    ),
    failedJobsToday: rows.filter((row) => row.status === "failed").length,
    partialJobsToday: rows.filter((row) => row.status === "partial").length,
  };
}

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return unauthorizedCronResponse();
  }

  try {
    const supabase = createSupabaseAdminClient();

    const tableConfigs: TableHealthConfig[] = [
      {
        tableName: "fixtures",
        latestColumn: "last_synced_at",
        staleAfterMinutes: 24 * 60,
      },
      {
        tableName: "teams",
        latestColumn: "last_synced_at",
        staleAfterMinutes: 24 * 60,
      },
      {
        tableName: "standings",
        latestColumn: "last_synced_at",
        staleAfterMinutes: 6 * 60,
      },
      {
        tableName: "tournament_rounds",
        latestColumn: "last_synced_at",
        staleAfterMinutes: 24 * 60,
      },
      {
        tableName: "api_tournament_metadata",
        latestColumn: "last_synced_at",
        staleAfterMinutes: 24 * 60,
      },
      {
        tableName: "api_sync_logs",
        latestColumn: "started_at",
        staleAfterMinutes: 12 * 60,
      },
      {
        tableName: "data_completeness_checks",
        latestColumn: "last_checked_at",
        staleAfterMinutes: 24 * 60,
      },
      {
        tableName: "fixture_events",
        latestColumn: "updated_at",
        staleAfterMinutes: null,
      },
      {
        tableName: "fixture_lineups",
        latestColumn: "last_synced_at",
        staleAfterMinutes: null,
      },
      {
        tableName: "fixture_statistics",
        latestColumn: "last_synced_at",
        staleAfterMinutes: null,
      },
      {
        tableName: "odds_records",
        latestColumn: "last_synced_at",
        staleAfterMinutes: null,
      },
    ];

    const [latestSyncLogs, recentProblemLogs, todayTotals, tableSummary] =
      await Promise.all([
        getLatestSyncLogs(supabase),
        getRecentProblemLogs(supabase),
        getTodaySyncTotals(supabase),
        Promise.all(
          tableConfigs.map((config) => getTableHealth(supabase, config))
        ),
      ]);

    const blockingTables = tableSummary.filter((table) =>
      ["error", "missing"].includes(table.status)
    );

    const staleCoreTables = tableSummary.filter((table) =>
      ["fixtures", "teams", "standings", "tournament_rounds"].includes(
        table.tableName
      ) && table.status === "stale"
    );

    return NextResponse.json({
      ok: blockingTables.length === 0,
      generatedAt: new Date().toISOString(),
      environment: {
        hasApiFootballKey: Boolean(process.env.API_FOOTBALL_KEY),
        hasSupabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        hasCronSecret: Boolean(process.env.CRON_SECRET),
        leagueId: process.env.API_FOOTBALL_LEAGUE_ID || "1",
        season: process.env.API_FOOTBALL_SEASON || "2026",
      },
      todayTotals,
      latestSyncLogs,
      recentProblemLogs,
      tableSummary,
      health: {
        blockingIssueCount: blockingTables.length,
        staleCoreTableCount: staleCoreTables.length,
        blockingTables: blockingTables.map((table) => table.tableName),
        staleCoreTables: staleCoreTables.map((table) => table.tableName),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: getErrorMessage(error),
      },
      {
        status: 500,
      }
    );
  }
}


