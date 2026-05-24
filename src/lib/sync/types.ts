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
