import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runFinalizationSyncJob } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";

export const GET = createCronRoute({
  jobName: "finalization-sync",
  job: runFinalizationSyncJob,
});
