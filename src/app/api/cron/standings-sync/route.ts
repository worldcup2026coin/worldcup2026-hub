import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runStandingsSyncJob } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";

export const GET = createCronRoute({
  jobName: "standings-sync",
  job: runStandingsSyncJob,
});
