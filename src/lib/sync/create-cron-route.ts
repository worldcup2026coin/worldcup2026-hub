import "server-only";

import { isAuthorizedCronRequest, unauthorizedCronResponse } from "./cron-auth";
import { runSyncJob } from "./sync-runner";
import type { SyncJobName, SyncJobSummary } from "./types";

type JobFunctionResult = Omit<
  SyncJobSummary,
  "startedAt" | "finishedAt" | "durationMs"
>;

type CreateCronRouteArgs = {
  jobName: SyncJobName;
  job: () => Promise<JobFunctionResult>;
};

export function createCronRoute({ jobName, job }: CreateCronRouteArgs) {
  return async function handleCronRequest(request: Request) {
    if (!isAuthorizedCronRequest(request)) {
      return unauthorizedCronResponse();
    }

    return runSyncJob({
      jobName,
      job,
    });
  };
}
