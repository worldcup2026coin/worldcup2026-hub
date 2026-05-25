import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runFixturesSyncJob } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";

export const GET = createCronRoute({
  jobName: "fixtures-sync",
  job: runFixturesSyncJob,
});
