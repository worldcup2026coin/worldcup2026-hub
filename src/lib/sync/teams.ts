import { apiFootballGetAllPages } from "@/lib/api-football/client";
import type { ApiFootballTeamItem } from "@/lib/api-football/types";
import { getWorldCupApiConfig } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  createSyncLog,
  finishSyncLog,
  getErrorMessage,
} from "@/lib/sync/logs";
import type { SyncResult } from "@/lib/sync/types";

export async function syncTeams(): Promise<SyncResult> {
  const supabase = createSupabaseAdminClient();
  const config = getWorldCupApiConfig();
  const startedAtMs = Date.now();
  const logId = await createSyncLog(supabase, "teams", config, startedAtMs);

  try {
    const apiResult = await apiFootballGetAllPages<ApiFootballTeamItem>(
      "teams",
      {
        league: config.leagueId,
        season: config.season,
      }
    );

    const rows = apiResult.response.map((item) => ({
      api_team_id: item.team.id,
      home_stadium_id: null,
      name: item.team.name,
      code: item.team.code,
      country: item.team.country,
      founded: item.team.founded,
      national: item.team.national,
      logo_url: item.team.logo,
      raw: item,
      updated_at: new Date().toISOString(),
    }));

    if (rows.length > 0) {
      const { error } = await supabase.from("teams").upsert(rows, {
        onConflict: "api_team_id",
      });

      if (error) {
        throw new Error(`Failed to upsert teams: ${error.message}`);
      }
    }

    const durationMs = Date.now() - startedAtMs;

    await finishSyncLog(supabase, logId, {
      status: "success",
      startedAtMs,
      requestCount: apiResult.requestCount,
      recordsReceived: apiResult.response.length,
      recordsUpserted: rows.length,
      metadata: config,
    });

    return {
      scope: "teams",
      status: "success",
      logId,
      requestCount: apiResult.requestCount,
      recordsReceived: apiResult.response.length,
      recordsUpserted: rows.length,
      durationMs,
    };
  } catch (error) {
    await finishSyncLog(supabase, logId, {
      status: "error",
      startedAtMs,
      requestCount: 0,
      recordsReceived: 0,
      recordsUpserted: 0,
      errorMessage: getErrorMessage(error),
      metadata: config,
    });

    throw error;
  }
}
