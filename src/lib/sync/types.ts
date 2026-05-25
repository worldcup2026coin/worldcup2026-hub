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
  | "teams-sync"
  | "standings-sync"
  | "live-sync"
  | "enrichment-sync"
  | "finalization-sync"
  | "missing-data-backfill"
  | "full-sync"
  | "team-squads-sync-1"
  | "team-squads-sync-2"
  | "team-squads-sync-3"
  | "team-squads-sync-4"
  | "match-context-sync-1"
  | "match-context-sync-2"
  | "match-context-sync-3"
  | "match-context-sync-4"
  | "match-context-sync-5"
  | "match-context-sync-6";

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





