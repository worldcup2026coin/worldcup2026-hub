import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  fetchFixtureHeadToHead,
  fetchFixtureOdds,
  fetchFixturePredictions,
} from "@/lib/api-football/endpoints";
import type { SyncJobSummary } from "./types";
import { normalizeApiFootballResponse } from "./sync-table-utils";

type FixtureRow = {
  api_fixture_id: number;
  home_team_api_id: number | null;
  away_team_api_id: number | null;
};

type MatchContextChunkOptions = {
  offset: number;
  limit: number;
  jobName: SyncJobSummary["jobName"];
};

function getApiRequestsUsed(value: unknown) {
  const envelope = value as { apiRequestsUsed?: number };
  return envelope.apiRequestsUsed ?? 1;
}

async function getFixtureRows(offset: number, limit: number) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("fixtures")
    .select("api_fixture_id, home_team_api_id, away_team_api_id")
    .order("match_date", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Could not read fixture chunk: ${error.message}`);
  }

  return (data ?? []) as FixtureRow[];
}

async function cacheRaw(
  endpoint: string,
  params: Record<string, unknown>,
  response: unknown
) {
  const supabase = createSupabaseAdminClient();
  const envelope = response as {
    response?: unknown;
    data?: { response?: unknown };
  };

  const body = envelope.data?.response ?? envelope.response;
  const count = Array.isArray(body) ? body.length : null;
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;

  const { error } = await supabase.from("api_raw_cache").upsert(
    {
      endpoint,
      params,
      cache_key: cacheKey,
      status: "success",
      results_count: count,
      raw: response,
      error_message: null,
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "cache_key",
    }
  );

  if (error) {
    throw new Error(`Raw cache upsert failed: ${error.message}`);
  }
}

export async function runApiFootballMatchContextChunkSync({
  offset,
  limit,
  jobName,
}: MatchContextChunkOptions): Promise<
  Omit<SyncJobSummary, "startedAt" | "finishedAt" | "durationMs">
> {
  const supabase = createSupabaseAdminClient();
  const fixtures = await getFixtureRows(offset, limit);
  const now = new Date().toISOString();

  let apiRequestsUsed = 0;
  let recordsSeen = 0;
  let recordsUpdated = 0;
  let recordsSkipped = 0;

  for (const fixture of fixtures) {
    const predictionResponse = await fetchFixturePredictions(fixture.api_fixture_id);
    apiRequestsUsed += getApiRequestsUsed(predictionResponse);

    await cacheRaw(
      "/predictions",
      { fixture: fixture.api_fixture_id },
      predictionResponse
    );

    const predictions =
      normalizeApiFootballResponse<Record<string, unknown>>(predictionResponse);

    recordsSeen += predictions.length;

    if (predictions[0]) {
      const predictionItem = predictions[0];
      const predictionBlock =
        (predictionItem.predictions as Record<string, unknown> | undefined) ??
        predictionItem;

      const winner = predictionBlock.winner as
        | Record<string, unknown>
        | undefined;
      const percent = predictionBlock.percent as
        | Record<string, unknown>
        | undefined;

      const { error } = await supabase.from("fixture_predictions").upsert(
        {
          api_fixture_id: fixture.api_fixture_id,
          winner_name: typeof winner?.name === "string" ? winner.name : null,
          winner_comment:
            typeof winner?.comment === "string" ? winner.comment : null,
          advice:
            typeof predictionBlock.advice === "string"
              ? predictionBlock.advice
              : null,
          percent_home:
            typeof percent?.home === "string" ? percent.home : null,
          percent_draw:
            typeof percent?.draw === "string" ? percent.draw : null,
          percent_away:
            typeof percent?.away === "string" ? percent.away : null,
          raw: predictionItem,
          api_raw_json: predictionItem,
          last_synced_at: now,
          updated_at: now,
        },
        {
          onConflict: "api_fixture_id",
        }
      );

      if (error) {
        throw new Error(`Predictions upsert failed: ${error.message}`);
      }

      recordsUpdated += 1;
    }

    const oddsResponse = await fetchFixtureOdds(fixture.api_fixture_id);
    apiRequestsUsed += getApiRequestsUsed(oddsResponse);

    await cacheRaw("/odds", { fixture: fixture.api_fixture_id }, oddsResponse);

    const oddsItems =
      normalizeApiFootballResponse<Record<string, unknown>>(oddsResponse);

    recordsSeen += oddsItems.length;

    for (const oddsItem of oddsItems) {
      const bookmakers = Array.isArray(oddsItem.bookmakers)
        ? oddsItem.bookmakers
        : [];

      for (const bookmakerRaw of bookmakers) {
        const bookmaker = bookmakerRaw as Record<string, unknown>;
        const bets = Array.isArray(bookmaker.bets) ? bookmaker.bets : [];

        for (const betRaw of bets) {
          const bet = betRaw as Record<string, unknown>;

          const { error } = await supabase.from("odds_records").upsert(
            {
              api_fixture_id: fixture.api_fixture_id,
              bookmaker_id:
                typeof bookmaker.id === "number" ? bookmaker.id : null,
              bookmaker_name:
                typeof bookmaker.name === "string" ? bookmaker.name : null,
              bet_id: typeof bet.id === "number" ? bet.id : null,
              bet_name: typeof bet.name === "string" ? bet.name : null,
              values: Array.isArray(bet.values) ? bet.values : [],
              raw: {
                fixture: oddsItem.fixture,
                bookmaker,
                bet,
              },
              api_raw_json: {
                fixture: oddsItem.fixture,
                bookmaker,
                bet,
              },
              last_synced_at: now,
              updated_at: now,
            },
            {
              onConflict: "api_fixture_id,bookmaker_id,bet_id",
            }
          );

          if (error) {
            throw new Error(`Odds upsert failed: ${error.message}`);
          }

          recordsUpdated += 1;
        }
      }
    }

    if (fixture.home_team_api_id && fixture.away_team_api_id) {
      const h2hKey = `${fixture.home_team_api_id}-${fixture.away_team_api_id}`;

      const h2hResponse = await fetchFixtureHeadToHead(
        fixture.home_team_api_id,
        fixture.away_team_api_id
      );

      apiRequestsUsed += getApiRequestsUsed(h2hResponse);

      await cacheRaw("/fixtures/headtohead", { h2h: h2hKey }, h2hResponse);

      const matches =
        normalizeApiFootballResponse<Record<string, unknown>>(h2hResponse);

      const { error } = await supabase.from("fixture_head_to_head").upsert(
        {
          api_fixture_id: fixture.api_fixture_id,
          home_team_api_id: fixture.home_team_api_id,
          away_team_api_id: fixture.away_team_api_id,
          h2h_key: h2hKey,
          matches,
          raw: matches,
          api_raw_json: matches,
          last_synced_at: now,
          updated_at: now,
        },
        {
          onConflict: "api_fixture_id",
        }
      );

      if (error) {
        throw new Error(`H2H upsert failed: ${error.message}`);
      }

      recordsSeen += matches.length;
      recordsUpdated += 1;
    } else {
      recordsSkipped += 1;
    }
  }

  return {
    jobName,
    status: "success",
    apiRequestsUsed,
    recordsSeen,
    recordsInserted: 0,
    recordsUpdated,
    recordsSkipped,
    message: `Synced match-context chunk offset ${offset}, limit ${limit}.`,
    details: {
      offset,
      limit,
      fixturesProcessed: fixtures.length,
    },
  };
}
