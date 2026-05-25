import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runMissingDataBackfillJob } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";

export const GET = createCronRoute({
  jobName: "missing-data-backfill",
  job: runMissingDataBackfillJob,
});
