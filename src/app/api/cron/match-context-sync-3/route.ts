import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runMatchContextSync3Job } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const GET = createCronRoute({
  jobName: "match-context-sync-3",
  job: runMatchContextSync3Job,
});
