import { runTopStatsSyncJob as runApiFootballTopStatsSync } from "./api-football-top-stats";
import { runApiFootballMatchdayDataChunkSync } from "./api-football-matchday-data";
import { runApiFootballMatchContextChunkSync } from "./api-football-match-context";
import { runApiFootballSquadsChunkSync } from "./api-football-squads";
import { runApiFootballFullIngestSync } from "./api-football-full-ingest";
import { runApiFootballStandingsSync } from "./api-football-standings";
import { runApiFootballTeamsSync } from "./api-football-teams";
import { runApiFootballBootstrapSync } from "./api-football-bootstrap";
import { runApiFootballFixturesSync } from "./api-football-fixtures";
import { runAutomatedPredictionSettlement } from "@/lib/predictions/settlement";
import { runAutomatedPredictionWindowGeneration } from "@/lib/predictions/window-generator";
import "server-only";

import type { SyncJobName, SyncJobSummary } from "./types";

type JobResult = Omit<SyncJobSummary, "startedAt" | "finishedAt" | "durationMs">;

function createPlaceholderSummary(jobName: SyncJobName): JobResult {
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

function detailsObject(details: JobResult["details"]) {
  if (details && typeof details === "object" && !Array.isArray(details)) {
    return details;
  }

  return {};
}

async function withPredictionAutomation(
  resultPromise: Promise<JobResult>,
): Promise<JobResult> {
  const result = await resultPromise;
  let status = result.status;
  let message = result.message ?? "Sync completed.";
  const details = detailsObject(result.details);

  try {
    const predictionWindowGeneration =
      await runAutomatedPredictionWindowGeneration();

    message = `${message} Prediction windows checked: ${predictionWindowGeneration.inserted} inserted, ${predictionWindowGeneration.updated} updated, ${predictionWindowGeneration.opened} opened.`;

    Object.assign(details, {
      predictionWindowGeneration,
    });
  } catch (error) {
    status = "partial";
    const predictionWindowGenerationError =
      error instanceof Error ? error.message : "Unknown error";

    message = `${message} Prediction window generation failed: ${predictionWindowGenerationError}`;

    Object.assign(details, {
      predictionWindowGenerationError,
    });
  }

  try {
    const predictionSettlement = await runAutomatedPredictionSettlement();

    message = `${message} Prediction settlement checked: ${predictionSettlement.settled.length} settled, ${predictionSettlement.skipped.length} skipped.`;

    Object.assign(details, {
      predictionSettlement,
    });
  } catch (error) {
    status = "partial";
    const predictionSettlementError =
      error instanceof Error ? error.message : "Unknown error";

    message = `${message} Prediction settlement failed: ${predictionSettlementError}`;

    Object.assign(details, {
      predictionSettlementError,
    });
  }

  return {
    ...result,
    status,
    message,
    details,
  };
}

export async function runBootstrapSyncJob() {
  return withPredictionAutomation(runApiFootballBootstrapSync());
}

export async function runTeamsSyncJob() {
  return runApiFootballTeamsSync();
}

export async function runStandingsSyncJob() {
  return withPredictionAutomation(runApiFootballStandingsSync());
}

export async function runFixturesSyncJob() {
  return withPredictionAutomation(runApiFootballFixturesSync());
}

export async function runLiveSyncJob() {
  return withPredictionAutomation(
    Promise.resolve(createPlaceholderSummary("live-sync")),
  );
}

export async function runEnrichmentSyncJob() {
  return createPlaceholderSummary("enrichment-sync");
}

export async function runFinalizationSyncJob() {
  return withPredictionAutomation(
    Promise.resolve(createPlaceholderSummary("finalization-sync")),
  );
}

export async function runMissingDataBackfillJob() {
  return createPlaceholderSummary("missing-data-backfill");
}

export async function runFullSyncJob() {
  return withPredictionAutomation(runApiFootballFullIngestSync());
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

export async function runMatchContextSync1Job() {
  return runApiFootballMatchContextChunkSync({
    offset: 0,
    limit: 12,
    jobName: "match-context-sync-1",
  });
}

export async function runMatchContextSync2Job() {
  return runApiFootballMatchContextChunkSync({
    offset: 12,
    limit: 12,
    jobName: "match-context-sync-2",
  });
}

export async function runMatchContextSync3Job() {
  return runApiFootballMatchContextChunkSync({
    offset: 24,
    limit: 12,
    jobName: "match-context-sync-3",
  });
}

export async function runMatchContextSync4Job() {
  return runApiFootballMatchContextChunkSync({
    offset: 36,
    limit: 12,
    jobName: "match-context-sync-4",
  });
}

export async function runMatchContextSync5Job() {
  return runApiFootballMatchContextChunkSync({
    offset: 48,
    limit: 12,
    jobName: "match-context-sync-5",
  });
}

export async function runMatchContextSync6Job() {
  return runApiFootballMatchContextChunkSync({
    offset: 60,
    limit: 12,
    jobName: "match-context-sync-6",
  });
}

export async function runMatchdayDataSync1Job() {
  return withPredictionAutomation(
    runApiFootballMatchdayDataChunkSync({
      offset: 0,
      limit: 12,
      jobName: "matchday-data-sync-1",
    }),
  );
}

export async function runMatchdayDataSync2Job() {
  return withPredictionAutomation(
    runApiFootballMatchdayDataChunkSync({
      offset: 12,
      limit: 12,
      jobName: "matchday-data-sync-2",
    }),
  );
}

export async function runMatchdayDataSync3Job() {
  return withPredictionAutomation(
    runApiFootballMatchdayDataChunkSync({
      offset: 24,
      limit: 12,
      jobName: "matchday-data-sync-3",
    }),
  );
}

export async function runMatchdayDataSync4Job() {
  return withPredictionAutomation(
    runApiFootballMatchdayDataChunkSync({
      offset: 36,
      limit: 12,
      jobName: "matchday-data-sync-4",
    }),
  );
}

export async function runMatchdayDataSync5Job() {
  return withPredictionAutomation(
    runApiFootballMatchdayDataChunkSync({
      offset: 48,
      limit: 12,
      jobName: "matchday-data-sync-5",
    }),
  );
}

export async function runMatchdayDataSync6Job() {
  return withPredictionAutomation(
    runApiFootballMatchdayDataChunkSync({
      offset: 60,
      limit: 12,
      jobName: "matchday-data-sync-6",
    }),
  );
}

export async function runTopStatsSyncJob() {
  return withPredictionAutomation(runApiFootballTopStatsSync());
}
