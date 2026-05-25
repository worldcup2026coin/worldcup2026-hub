import "server-only";

import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { SyncJobName, SyncJobSummary } from "./types";

type JobFunctionResult = Omit<
  SyncJobSummary,
  "startedAt" | "finishedAt" | "durationMs"
>;

type RunSyncJobArgs = {
  jobName: SyncJobName;
  job: () => Promise<JobFunctionResult>;
};

async function createLogRow(jobName: SyncJobName, startedAt: string) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("api_sync_logs")
    .insert({
      job_name: jobName,
      scope: jobName,
      status: "started",
      started_at: startedAt,
      api_requests_used: 0,
      records_seen: 0,
      records_inserted: 0,
      records_updated: 0,
      records_skipped: 0,
      summary: {
        message: "Sync job started",
      },
    })
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(`Could not create api_sync_logs row: ${error.message}`);
  }

  return String(data?.id || "");
}

async function updateLogRow(
  logId: string,
  summary: SyncJobSummary,
  errorMessage?: string
) {
  if (!logId) {
    return;
  }

  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("api_sync_logs")
    .update({
      status: summary.status,
      finished_at: summary.finishedAt,
      duration_ms: summary.durationMs,
      api_requests_used: summary.apiRequestsUsed,
      records_seen: summary.recordsSeen,
      records_inserted: summary.recordsInserted,
      records_updated: summary.recordsUpdated,
      records_skipped: summary.recordsSkipped,
      error_message: errorMessage || null,
      summary: {
        message: summary.message,
        details: summary.details || {},
      },
    })
    .eq("id", logId);

  if (error) {
    console.error("Could not update api_sync_logs row:", error.message);
  }
}

export async function runSyncJob({ jobName, job }: RunSyncJobArgs) {
  const startedAtDate = new Date();
  const startedAt = startedAtDate.toISOString();

  let logId = "";

  try {
    logId = await createLogRow(jobName, startedAt);

    const result = await job();

    const finishedAtDate = new Date();
    const finishedAt = finishedAtDate.toISOString();
    const durationMs = finishedAtDate.getTime() - startedAtDate.getTime();

    const summary: SyncJobSummary = {
      ...result,
      startedAt,
      finishedAt,
      durationMs,
    };

    await updateLogRow(logId, summary);

    return NextResponse.json({
      ok: true,
      summary,
    });
  } catch (error) {
    const finishedAtDate = new Date();
    const finishedAt = finishedAtDate.toISOString();
    const durationMs = finishedAtDate.getTime() - startedAtDate.getTime();

    const message = error instanceof Error ? error.message : "Unknown sync error";

    const summary: SyncJobSummary = {
      jobName,
      status: "failed",
      startedAt,
      finishedAt,
      durationMs,
      apiRequestsUsed: 0,
      recordsSeen: 0,
      recordsInserted: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
      message,
      details: {
        failedBeforeRealSync: true,
      },
    };

    await updateLogRow(logId, summary, message);

    return NextResponse.json(
      {
        ok: false,
        summary,
      },
      {
        status: 500,
      }
    );
  }
}

