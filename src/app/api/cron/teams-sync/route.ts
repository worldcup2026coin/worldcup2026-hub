import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runTeamsSyncJob } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";

export const GET = createCronRoute({
  jobName: "teams-sync",
  job: runTeamsSyncJob,
});
