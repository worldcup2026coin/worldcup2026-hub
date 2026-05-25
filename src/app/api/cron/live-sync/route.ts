import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runLiveSyncJob } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";

export const GET = createCronRoute({
  jobName: "live-sync",
  job: runLiveSyncJob,
});
