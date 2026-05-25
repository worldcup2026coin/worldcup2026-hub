import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runTeamSquadsSync1Job } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const GET = createCronRoute({
  jobName: "team-squads-sync-1",
  job: runTeamSquadsSync1Job,
});
