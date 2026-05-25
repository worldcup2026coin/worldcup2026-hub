import { createCronRoute } from "@/lib/sync/create-cron-route";
import { runTeamSquadsSync2Job } from "@/lib/sync/jobs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const GET = createCronRoute({
  jobName: "team-squads-sync-2",
  job: runTeamSquadsSync2Job,
});
