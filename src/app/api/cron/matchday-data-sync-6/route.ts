import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runMatchdayDataSync6Job } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const GET = createCronRoute({
  jobName: "matchday-data-sync-6",
  job: runMatchdayDataSync6Job,
});
