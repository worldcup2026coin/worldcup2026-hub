import type { SupabaseClient } from "@supabase/supabase-js";

type SyncLogStatus = "running" | "success" | "error";

type FinishSyncLogInput = {
  status: Exclude<SyncLogStatus, "running">;
  startedAtMs: number;
  requestCount: number;
  recordsReceived: number;
  recordsUpserted: number;
  errorMessage?: string | null;
  metadata?: Record<string, unknown>;
};

export async function createSyncLog(
  supabase: SupabaseClient,
  scope: string,
  metadata: Record<string, unknown> = {},
  startedAtMs = Date.now()
): Promise<string> {
  const { data, error } = await supabase
    .from("api_sync_logs")
    .insert({
      scope,
      status: "running",
      started_at: new Date(startedAtMs).toISOString(),
      metadata,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create sync log for ${scope}: ${error.message}`);
  }

  return data.id as string;
}

export async function finishSyncLog(
  supabase: SupabaseClient,
  logId: string,
  input: FinishSyncLogInput
) {
  const durationMs = Date.now() - input.startedAtMs;

  const { error } = await supabase
    .from("api_sync_logs")
    .update({
      status: input.status,
      ended_at: new Date().toISOString(),
      duration_ms: durationMs,
      request_count: input.requestCount,
      records_received: input.recordsReceived,
      records_upserted: input.recordsUpserted,
      error_message: input.errorMessage ?? null,
      metadata: input.metadata ?? {},
    })
    .eq("id", logId);

  if (error) {
    throw new Error(`Failed to finish sync log ${logId}: ${error.message}`);
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
