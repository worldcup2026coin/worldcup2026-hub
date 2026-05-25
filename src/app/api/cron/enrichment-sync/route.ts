import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runEnrichmentSyncJob } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";

export const GET = createCronRoute({
  jobName: "enrichment-sync",
  job: runEnrichmentSyncJob,
});
