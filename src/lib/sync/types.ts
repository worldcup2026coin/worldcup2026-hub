export type SyncScope = "teams" | "fixtures" | "standings" | "all";

export type SyncResult = {
  scope: Exclude<SyncScope, "all">;
  status: "success";
  logId: string;
  requestCount: number;
  recordsReceived: number;
  recordsUpserted: number;
  durationMs: number;
  details?: Record<string, unknown>;
};

export type SyncJobName =
  | "bootstrap-sync"
  | "fixtures-sync"
  | "live-sync"
  | "enrichment-sync"
  | "finalization-sync"
  | "missing-data-backfill";

export type SyncJobStatus = "started" | "success" | "partial" | "failed";

export type SyncJobSummary = {
  jobName: SyncJobName;
  status: SyncJobStatus;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  apiRequestsUsed: number;
  recordsSeen: number;
  recordsInserted: number;
  recordsUpdated: number;
  recordsSkipped: number;
  message: string;
  details?: Record<string, unknown>;
};
