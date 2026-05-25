import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runTeamSquadsSync4Job } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const GET = createCronRoute({
  jobName: "team-squads-sync-4",
  job: runTeamSquadsSync4Job,
});
