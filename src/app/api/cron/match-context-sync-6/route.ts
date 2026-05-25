import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runMatchContextSync6Job } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const GET = createCronRoute({
  jobName: "match-context-sync-6",
  job: runMatchContextSync6Job,
});
