import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runBootstrapSyncJob } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";

export const GET = createCronRoute({
  jobName: "bootstrap-sync",
  job: runBootstrapSyncJob,
});
