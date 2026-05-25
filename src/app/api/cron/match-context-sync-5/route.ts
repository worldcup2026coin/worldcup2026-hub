import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runMatchContextSync5Job } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const GET = createCronRoute({
  jobName: "match-context-sync-5",
  job: runMatchContextSync5Job,
});
