import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runFullSyncJob } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const GET = createCronRoute({
  jobName: "full-sync",
  job: runFullSyncJob,
});
