import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runMatchdayDataSync5Job } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const GET = createCronRoute({
  jobName: "matchday-data-sync-5",
  job: runMatchdayDataSync5Job,
});
