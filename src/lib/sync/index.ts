import { syncFixtures } from "@/lib/sync/fixtures";
import { syncStandings } from "@/lib/sync/standings";
import { syncTeams } from "@/lib/sync/teams";
import type { SyncResult, SyncScope } from "@/lib/sync/types";

export async function runSync(scope: SyncScope): Promise<SyncResult[]> {
  if (scope === "teams") {
    return [await syncTeams()];
  }

  if (scope === "fixtures") {
    return [await syncFixtures()];
  }

  if (scope === "standings") {
    return [await syncStandings()];
  }

  return [await syncTeams(), await syncFixtures(), await syncStandings()];
}
