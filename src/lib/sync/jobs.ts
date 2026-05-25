import { runApiFootballSquadsChunkSync } from "./api-football-squads";
import { runApiFootballFullIngestSync } from "./api-football-full-ingest";
import { runApiFootballStandingsSync } from "./api-football-standings";
import { runApiFootballTeamsSync } from "./api-football-teams";
import { runApiFootballBootstrapSync } from "./api-football-bootstrap";
import { runApiFootballFixturesSync } from "./api-football-fixtures";
import "server-only";

import type { SyncJobName, SyncJobSummary } from "./types";

function createPlaceholderSummary(jobName: SyncJobName): Omit<SyncJobSummary, "startedAt" | "finishedAt" | "durationMs"> {
  return {
    jobName,
    status: "success",
    apiRequestsUsed: 0,
    recordsSeen: 0,
    recordsInserted: 0,
    recordsUpdated: 0,
    recordsSkipped: 0,
    message:
      "Protected cron route is working. Real API-Football sync logic will be added in the next Phase 11 step.",
    details: {
      mode: "placeholder",
      serverSideOnly: true,
      publicPagesReadFromSupabaseOnly: true,
    },
  };
}

export async function runBootstrapSyncJob() {
  return runApiFootballBootstrapSync();
}

export async function runTeamsSyncJob() {
  return runApiFootballTeamsSync();
}

export async function runStandingsSyncJob() {
  return runApiFootballStandingsSync();
}

export async function runFixturesSyncJob() {
  return runApiFootballFixturesSync();
}

export async function runLiveSyncJob() {
  return createPlaceholderSummary("live-sync");
}

export async function runEnrichmentSyncJob() {
  return createPlaceholderSummary("enrichment-sync");
}

export async function runFinalizationSyncJob() {
  return createPlaceholderSummary("finalization-sync");
}

export async function runMissingDataBackfillJob() {
  return createPlaceholderSummary("missing-data-backfill");
}
export async function runFullSyncJob() {
  return runApiFootballFullIngestSync();
}
export async function runTeamSquadsSync1Job() {
  return runApiFootballSquadsChunkSync({
    offset: 0,
    limit: 12,
    jobName: "team-squads-sync-1",
  });
}

export async function runTeamSquadsSync2Job() {
  return runApiFootballSquadsChunkSync({
    offset: 12,
    limit: 12,
    jobName: "team-squads-sync-2",
  });
}

export async function runTeamSquadsSync3Job() {
  return runApiFootballSquadsChunkSync({
    offset: 24,
    limit: 12,
    jobName: "team-squads-sync-3",
  });
}

export async function runTeamSquadsSync4Job() {
  return runApiFootballSquadsChunkSync({
    offset: 36,
    limit: 12,
    jobName: "team-squads-sync-4",
  });
}
