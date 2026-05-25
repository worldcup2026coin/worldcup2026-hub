import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runMatchdayDataSync4Job } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const GET = createCronRoute({
  jobName: "matchday-data-sync-4",
  job: runMatchdayDataSync4Job,
});
