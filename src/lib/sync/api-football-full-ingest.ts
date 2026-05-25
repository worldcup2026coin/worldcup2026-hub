import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  fetchCoachByTeam,
  fetchFixtureHeadToHead,
  fetchFixtureOdds,
  fetchFixturePredictions,
  fetchWorldCupFixtureDetailsByIds,
  fetchWorldCupInjuries,
  fetchWorldCupPlayersPage,
  fetchWorldCupTopAssists,
  fetchWorldCupTopRedCards,
  fetchWorldCupTopScorers,
  fetchWorldCupTopYellowCards,
  type ApiFootballFixtureItem,
  type ApiFootballPlayerItem,
} from "@/lib/api-football/endpoints";
import type { SyncJobSummary } from "./types";
import { runApiFootballBootstrapSync } from "./api-football-bootstrap";
import { normalizeApiFootballResponse } from "./sync-table-utils";

type ApiEnvelope = {
  response?: unknown;
  data?: {
    response?: unknown;
    results?: number;
    paging?: {
      current: number;
      total: number;
    };
  };
  results?: number;
  paging?: {
    current: number;
    total: number;
  };
  apiRequestsUsed?: number;
};

type FixtureRow = {
  api_fixture_id: number;
  home_team_api_id: number | null;
  away_team_api_id: number | null;
};

function getResponse(value: unknown) {
  const envelope = value as ApiEnvelope;
  return envelope.data?.response ?? envelope.response ?? null;
}

function getPaging(value: unknown) {
  const envelope = value as ApiEnvelope;
  return envelope.data?.paging ?? envelope.paging ?? null;
}

function getApiRequestsUsed(value: unknown) {
  const envelope = value as ApiEnvelope;
  return envelope.apiRequestsUsed ?? 1;
}

function cacheKey(endpoint: string, params: Record<string, unknown>) {
  return `${endpoint}:${JSON.stringify(params)}`;
}

async function cacheRaw(
  endpoint: string,
  params: Record<string, unknown>,
  response: unknown
) {
  const supabase = createSupabaseAdminClient();
  const raw = response as ApiEnvelope;
  const responseBody = getResponse(response);

  const count = Array.isArray(responseBody) ? responseBody.length : null;

  await supabase.from("api_raw_cache").upsert(
    {
      endpoint,
      params,
      cache_key: cacheKey(endpoint, params),
      status: "success",
      results_count: count,
      raw: raw,
      error_message: null,
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "cache_key",
    }
  );
}

async function getFixtureRows() {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("fixtures")
    .select("api_fixture_id, home_team_api_id, away_team_api_id")
    .order("match_date", { ascending: true });

  if (error) throw new Error(`Could not read fixtures: ${error.message}`);

  return (data ?? []) as FixtureRow[];
}

async function getTeamApiIds() {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("teams")
    .select("api_team_id")
    .not("api_team_id", "is", null);

  if (error) throw new Error(`Could not read teams: ${error.message}`);

  return Array.from(
    new Set((data ?? []).map((row) => Number(row.api_team_id)).filter(Boolean))
  );
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function buildPlayerRow(item: ApiFootballPlayerItem) {
  const now = new Date().toISOString();

  return {
    api_player_id: item.player.id,
    name: item.player.name,
    firstname: item.player.firstname,
    lastname: item.player.lastname,
    age: item.player.age,
    birth_date: item.player.birth?.date || null,
    birth_place: item.player.birth?.place || null,
    birth_country: item.player.birth?.country || null,
    nationality: item.player.nationality,
    height: item.player.height,
    weight: item.player.weight,
    injured: item.player.injured,
    photo_url: item.player.photo,
    raw: item,
    api_raw_json: item,
    last_synced_at: now,
    updated_at: now,
  };
}

function buildSquadRows(item: ApiFootballPlayerItem) {
  const now = new Date().toISOString();

  return (item.statistics || [])
    .filter((stat) => stat.team?.id)
    .map((stat) => ({
      api_team_id: stat.team?.id,
      api_player_id: item.player.id,
      season: Number(process.env.API_FOOTBALL_SEASON || "2026"),
      player_name: item.player.name,
      team_name: stat.team?.name || null,
      position: stat.games?.position || null,
      number: stat.games?.number ?? null,
      appearances: stat.games?.appearences ?? stat.games?.appearances ?? null,
      lineups: stat.games?.lineups ?? null,
      minutes: stat.games?.minutes ?? null,
      rating: stat.games?.rating ?? null,
      captain: stat.games?.captain ?? null,
      raw: stat,
      api_raw_json: {
        player: item.player,
        statistics: stat,
      },
      last_synced_at: now,
      updated_at: now,
    }));
}

async function syncPlayersAndSquads() {
  const supabase = createSupabaseAdminClient();
  let page = 1;
  let totalPages = 1;
  let apiRequestsUsed = 0;
  let recordsSeen = 0;
  let recordsUpdated = 0;

  do {
    const response = await fetchWorldCupPlayersPage(page);
    apiRequestsUsed += getApiRequestsUsed(response);
    await cacheRaw("/players", { league: 1, season: 2026, page }, response);

    const players = normalizeApiFootballResponse<ApiFootballPlayerItem>(response);
    const paging = getPaging(response);

    totalPages = paging?.total ?? totalPages;
    recordsSeen += players.length;

    const playerRows = players.map(buildPlayerRow);
    const squadRows = players.flatMap(buildSquadRows);

    if (playerRows.length) {
      const { error } = await supabase.from("players").upsert(playerRows, {
        onConflict: "api_player_id",
      });

      if (error) throw new Error(`Players upsert failed: ${error.message}`);

      recordsUpdated += playerRows.length;
    }

    if (squadRows.length) {
      const { error } = await supabase
        .from("team_squad_players")
        .upsert(squadRows, {
          onConflict: "api_team_id,api_player_id,season",
        });

      if (error) throw new Error(`Squad upsert failed: ${error.message}`);
    }

    page += 1;
  } while (page <= totalPages);

  return {
    apiRequestsUsed,
    recordsSeen,
    recordsUpdated,
    message: `Synced ${recordsUpdated} players and squad rows.`,
  };
}

async function syncCoaches() {
  const supabase = createSupabaseAdminClient();
  const teamIds = await getTeamApiIds();

  let apiRequestsUsed = 0;
  let recordsSeen = 0;
  let recordsUpdated = 0;
  const now = new Date().toISOString();

  for (const teamId of teamIds) {
    const response = await fetchCoachByTeam(teamId);
    apiRequestsUsed += getApiRequestsUsed(response);
    await cacheRaw("/coachs", { team: teamId }, response);

    const coaches = normalizeApiFootballResponse<Record<string, unknown>>(response);
    recordsSeen += coaches.length;

    const rows = coaches.map((coach) => {
      const birth = coach.birth as Record<string, unknown> | undefined;
      const team = coach.team as Record<string, unknown> | undefined;

      return {
        api_coach_id: Number(coach.id),
        api_team_id: Number(team?.id ?? teamId),
        name: String(coach.name ?? ""),
        firstname: typeof coach.firstname === "string" ? coach.firstname : null,
        lastname: typeof coach.lastname === "string" ? coach.lastname : null,
        age: typeof coach.age === "number" ? coach.age : null,
        birth_date: typeof birth?.date === "string" ? birth.date : null,
        birth_place: typeof birth?.place === "string" ? birth.place : null,
        birth_country: typeof birth?.country === "string" ? birth.country : null,
        nationality: typeof coach.nationality === "string" ? coach.nationality : null,
        height: typeof coach.height === "string" ? coach.height : null,
        weight: typeof coach.weight === "string" ? coach.weight : null,
        photo_url: typeof coach.photo === "string" ? coach.photo : null,
        team_name: typeof team?.name === "string" ? team.name : null,
        raw: coach,
        api_raw_json: coach,
        last_synced_at: now,
        updated_at: now,
      };
    });

    if (rows.length) {
      const { error } = await supabase.from("coaches").upsert(rows, {
        onConflict: "api_coach_id,api_team_id",
      });

      if (error) throw new Error(`Coaches upsert failed: ${error.message}`);

      recordsUpdated += rows.length;
    }
  }

  return {
    apiRequestsUsed,
    recordsSeen,
    recordsUpdated,
    message: `Synced ${recordsUpdated} coaches.`,
  };
}

async function syncInjuries() {
  const supabase = createSupabaseAdminClient();
  const response = await fetchWorldCupInjuries();

  await cacheRaw("/injuries", { league: 1, season: 2026 }, response);

  const injuries = normalizeApiFootballResponse<Record<string, unknown>>(response);
  const now = new Date().toISOString();

  const rows = injuries.map((item) => {
    const player = item.player as Record<string, unknown> | undefined;
    const team = item.team as Record<string, unknown> | undefined;
    const fixture = item.fixture as Record<string, unknown> | undefined;

    return {
      api_fixture_id: typeof fixture?.id === "number" ? fixture.id : null,
      api_team_id: typeof team?.id === "number" ? team.id : null,
      api_player_id: typeof player?.id === "number" ? player.id : null,
      player_name: typeof player?.name === "string" ? player.name : null,
      team_name: typeof team?.name === "string" ? team.name : null,
      type: typeof item.type === "string" ? item.type : null,
      reason: typeof item.reason === "string" ? item.reason : "unknown",
      fixture_date: typeof fixture?.date === "string" ? fixture.date : null,
      raw: item,
      api_raw_json: item,
      last_synced_at: now,
      updated_at: now,
    };
  });

  if (rows.length) {
    const { error } = await supabase.from("injuries").upsert(rows, {
      onConflict: "api_fixture_id,api_team_id,api_player_id,reason",
    });

    if (error) throw new Error(`Injuries upsert failed: ${error.message}`);
  }

  return {
    apiRequestsUsed: getApiRequestsUsed(response),
    recordsSeen: injuries.length,
    recordsUpdated: rows.length,
    message: `Synced ${rows.length} injuries.`,
  };
}

async function syncFixtureDetails() {
  const supabase = createSupabaseAdminClient();
  const fixtures = await getFixtureRows();
  const fixtureIds = fixtures.map((fixture) => fixture.api_fixture_id);

  let apiRequestsUsed = 0;
  let recordsSeen = 0;
  let recordsUpdated = 0;
  const now = new Date().toISOString();

  for (const batch of chunk(fixtureIds, 20)) {
    const response = await fetchWorldCupFixtureDetailsByIds(batch);
    apiRequestsUsed += getApiRequestsUsed(response);
    await cacheRaw("/fixtures", { ids: batch.join("-") }, response);

    const details = normalizeApiFootballResponse<ApiFootballFixtureItem>(response);
    recordsSeen += details.length;

    for (const fixture of details) {
      const apiFixtureId = fixture.fixture.id;

      const eventRows = (fixture.events || []).map((event) => {
        const item = event as Record<string, unknown>;
        const team = item.team as Record<string, unknown> | undefined;
        const player = item.player as Record<string, unknown> | undefined;
        const assist = item.assist as Record<string, unknown> | undefined;
        const time = item.time as Record<string, unknown> | undefined;

        return {
          api_fixture_id: apiFixtureId,
          elapsed: typeof time?.elapsed === "number" ? time.elapsed : null,
          extra: typeof time?.extra === "number" ? time.extra : null,
          api_team_id: typeof team?.id === "number" ? team.id : null,
          team_name: typeof team?.name === "string" ? team.name : null,
          api_player_id: typeof player?.id === "number" ? player.id : null,
          player_name: typeof player?.name === "string" ? player.name : null,
          api_assist_player_id: typeof assist?.id === "number" ? assist.id : null,
          assist_player_name: typeof assist?.name === "string" ? assist.name : null,
          event_type: typeof item.type === "string" ? item.type : null,
          event_detail: typeof item.detail === "string" ? item.detail : null,
          comments: typeof item.comments === "string" ? item.comments : null,
          raw: item,
          api_raw_json: item,
          last_synced_at: now,
          updated_at: now,
        };
      });

      if (eventRows.length) {
        const { error } = await supabase.from("fixture_events").upsert(eventRows, {
          onConflict: "api_fixture_id,elapsed,extra,api_team_id,api_player_id,event_type,event_detail",
        });

        if (error) throw new Error(`Fixture events upsert failed: ${error.message}`);

        recordsUpdated += eventRows.length;
      }

      const lineupRows = (fixture.lineups || []).map((lineup) => {
        const item = lineup as Record<string, unknown>;
        const team = item.team as Record<string, unknown> | undefined;
        const coach = item.coach as Record<string, unknown> | undefined;

        return {
          api_fixture_id: apiFixtureId,
          api_team_id: Number(team?.id),
          team_name: typeof team?.name === "string" ? team.name : null,
          formation: typeof item.formation === "string" ? item.formation : null,
          coach_api_id: typeof coach?.id === "number" ? coach.id : null,
          coach_name: typeof coach?.name === "string" ? coach.name : null,
          start_xi: Array.isArray(item.startXI) ? item.startXI : [],
          substitutes: Array.isArray(item.substitutes) ? item.substitutes : [],
          raw: item,
          api_raw_json: item,
          last_synced_at: now,
          updated_at: now,
        };
      }).filter((row) => row.api_team_id);

      if (lineupRows.length) {
        const { error } = await supabase.from("fixture_lineups").upsert(lineupRows, {
          onConflict: "api_fixture_id,api_team_id",
        });

        if (error) throw new Error(`Fixture lineups upsert failed: ${error.message}`);

        recordsUpdated += lineupRows.length;
      }

      const statRows = (fixture.statistics || []).map((stat) => {
        const item = stat as Record<string, unknown>;
        const team = item.team as Record<string, unknown> | undefined;

        return {
          api_fixture_id: apiFixtureId,
          api_team_id: Number(team?.id),
          team_name: typeof team?.name === "string" ? team.name : null,
          statistics: Array.isArray(item.statistics) ? item.statistics : [],
          raw: item,
          api_raw_json: item,
          last_synced_at: now,
          updated_at: now,
        };
      }).filter((row) => row.api_team_id);

      if (statRows.length) {
        const { error } = await supabase.from("fixture_statistics").upsert(statRows, {
          onConflict: "api_fixture_id,api_team_id",
        });

        if (error) throw new Error(`Fixture statistics upsert failed: ${error.message}`);

        recordsUpdated += statRows.length;
      }

      const playerRows = (fixture.players || []).flatMap((teamPlayers) => {
        const item = teamPlayers as Record<string, unknown>;
        const team = item.team as Record<string, unknown> | undefined;
        const players = Array.isArray(item.players) ? item.players : [];

        return players.map((playerItem) => {
          const playerBlock = playerItem as Record<string, unknown>;
          const player = playerBlock.player as Record<string, unknown> | undefined;

          return {
            api_fixture_id: apiFixtureId,
            api_team_id: Number(team?.id),
            api_player_id: Number(player?.id),
            team_name: typeof team?.name === "string" ? team.name : null,
            player_name: typeof player?.name === "string" ? player.name : null,
            player_photo_url: typeof player?.photo === "string" ? player.photo : null,
            statistics: Array.isArray(playerBlock.statistics) ? playerBlock.statistics : [],
            raw: playerBlock,
            api_raw_json: playerBlock,
            last_synced_at: now,
            updated_at: now,
          };
        });
      }).filter((row) => row.api_team_id && row.api_player_id);

      if (playerRows.length) {
        const { error } = await supabase
          .from("fixture_player_statistics")
          .upsert(playerRows, {
            onConflict: "api_fixture_id,api_team_id,api_player_id",
          });

        if (error) throw new Error(`Fixture player stats upsert failed: ${error.message}`);

        recordsUpdated += playerRows.length;
      }

      await supabase
        .from("fixtures")
        .update({
          details_last_synced_at: now,
          events_last_synced_at: eventRows.length ? now : null,
          lineups_last_synced_at: lineupRows.length ? now : null,
          stats_last_synced_at: statRows.length ? now : null,
        })
        .eq("api_fixture_id", apiFixtureId);
    }
  }

  return {
    apiRequestsUsed,
    recordsSeen,
    recordsUpdated,
    message: `Synced fixture details for ${recordsSeen} fixtures.`,
  };
}

async function syncPredictionsOddsAndH2h() {
  const supabase = createSupabaseAdminClient();
  const fixtures = await getFixtureRows();

  let apiRequestsUsed = 0;
  let recordsSeen = 0;
  let recordsUpdated = 0;
  const now = new Date().toISOString();

  for (const fixture of fixtures) {
    const predictionResponse = await fetchFixturePredictions(fixture.api_fixture_id);
    apiRequestsUsed += getApiRequestsUsed(predictionResponse);
    await cacheRaw("/predictions", { fixture: fixture.api_fixture_id }, predictionResponse);

    const predictions = normalizeApiFootballResponse<Record<string, unknown>>(predictionResponse);
    recordsSeen += predictions.length;

    if (predictions[0]) {
      const prediction = predictions[0];
      const winner = prediction.winner as Record<string, unknown> | undefined;
      const percent = prediction.percent as Record<string, unknown> | undefined;

      const { error } = await supabase.from("fixture_predictions").upsert(
        {
          api_fixture_id: fixture.api_fixture_id,
          winner_name: typeof winner?.name === "string" ? winner.name : null,
          winner_comment: typeof winner?.comment === "string" ? winner.comment : null,
          advice: typeof prediction.advice === "string" ? prediction.advice : null,
          percent_home: typeof percent?.home === "string" ? percent.home : null,
          percent_draw: typeof percent?.draw === "string" ? percent.draw : null,
          percent_away: typeof percent?.away === "string" ? percent.away : null,
          raw: prediction,
          api_raw_json: prediction,
          last_synced_at: now,
          updated_at: now,
        },
        {
          onConflict: "api_fixture_id",
        }
      );

      if (error) throw new Error(`Predictions upsert failed: ${error.message}`);

      recordsUpdated += 1;
    }

    const oddsResponse = await fetchFixtureOdds(fixture.api_fixture_id);
    apiRequestsUsed += getApiRequestsUsed(oddsResponse);
    await cacheRaw("/odds", { fixture: fixture.api_fixture_id }, oddsResponse);

    const oddsItems = normalizeApiFootballResponse<Record<string, unknown>>(oddsResponse);
    recordsSeen += oddsItems.length;

    for (const oddsItem of oddsItems) {
      const bookmakers = Array.isArray(oddsItem.bookmakers) ? oddsItem.bookmakers : [];

      for (const bookmakerRaw of bookmakers) {
        const bookmaker = bookmakerRaw as Record<string, unknown>;
        const bets = Array.isArray(bookmaker.bets) ? bookmaker.bets : [];

        for (const betRaw of bets) {
          const bet = betRaw as Record<string, unknown>;

          const { error } = await supabase.from("odds_records").upsert(
            {
              api_fixture_id: fixture.api_fixture_id,
              bookmaker_id: typeof bookmaker.id === "number" ? bookmaker.id : null,
              bookmaker_name: typeof bookmaker.name === "string" ? bookmaker.name : null,
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

          if (error) throw new Error(`Odds upsert failed: ${error.message}`);

          recordsUpdated += 1;
        }
      }
    }

    if (fixture.home_team_api_id && fixture.away_team_api_id) {
      const h2hResponse = await fetchFixtureHeadToHead(
        fixture.home_team_api_id,
        fixture.away_team_api_id
      );

      apiRequestsUsed += getApiRequestsUsed(h2hResponse);
      await cacheRaw(
        "/fixtures/headtohead",
        {
          h2h: `${fixture.home_team_api_id}-${fixture.away_team_api_id}`,
        },
        h2hResponse
      );

      const matches = normalizeApiFootballResponse<Record<string, unknown>>(h2hResponse);

      const { error } = await supabase.from("fixture_head_to_head").upsert(
        {
          api_fixture_id: fixture.api_fixture_id,
          home_team_api_id: fixture.home_team_api_id,
          away_team_api_id: fixture.away_team_api_id,
          h2h_key: `${fixture.home_team_api_id}-${fixture.away_team_api_id}`,
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

      if (error) throw new Error(`H2H upsert failed: ${error.message}`);

      recordsSeen += matches.length;
      recordsUpdated += 1;
    }
  }

  return {
    apiRequestsUsed,
    recordsSeen,
    recordsUpdated,
    message: `Synced predictions, odds and H2H for ${fixtures.length} fixtures.`,
  };
}

async function syncTopStats() {
  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();

  const jobs = [
    { type: "scorers", endpoint: "/players/topscorers", fn: fetchWorldCupTopScorers },
    { type: "assists", endpoint: "/players/topassists", fn: fetchWorldCupTopAssists },
    { type: "yellow_cards", endpoint: "/players/topyellowcards", fn: fetchWorldCupTopYellowCards },
    { type: "red_cards", endpoint: "/players/topredcards", fn: fetchWorldCupTopRedCards },
  ];

  let apiRequestsUsed = 0;
  let recordsSeen = 0;
  let recordsUpdated = 0;

  for (const job of jobs) {
    const response = await job.fn();
    apiRequestsUsed += getApiRequestsUsed(response);
    await cacheRaw(job.endpoint, { league: 1, season: 2026 }, response);

    const rows = normalizeApiFootballResponse<Record<string, unknown>>(response);
    recordsSeen += rows.length;

    const upsertRows = rows.map((item) => {
      const player = item.player as Record<string, unknown> | undefined;
      const statistics = Array.isArray(item.statistics)
        ? (item.statistics[0] as Record<string, unknown> | undefined)
        : undefined;
      const team = statistics?.team as Record<string, unknown> | undefined;

      return {
        stat_type: job.type,
        api_league_id: 1,
        season: 2026,
        api_team_id: typeof team?.id === "number" ? team.id : null,
        team_name: typeof team?.name === "string" ? team.name : null,
        api_player_id: Number(player?.id),
        player_name: typeof player?.name === "string" ? player.name : null,
        value_numeric: null,
        raw: item,
        api_raw_json: item,
        last_synced_at: now,
        updated_at: now,
      };
    }).filter((row) => row.api_player_id);

    if (upsertRows.length) {
      const { error } = await supabase.from("top_player_stats").upsert(upsertRows, {
        onConflict: "stat_type,api_league_id,season,api_player_id",
      });

      if (error) throw new Error(`Top stats upsert failed: ${error.message}`);

      recordsUpdated += upsertRows.length;
    }
  }

  return {
    apiRequestsUsed,
    recordsSeen,
    recordsUpdated,
    message: `Synced ${recordsUpdated} top-player-stat rows.`,
  };
}

export async function runApiFootballFullIngestSync(): Promise<
  Omit<SyncJobSummary, "startedAt" | "finishedAt" | "durationMs">
> {
  const results: Array<{
    name: string;
    ok: boolean;
    apiRequestsUsed: number;
    recordsSeen: number;
    recordsUpdated: number;
    message: string;
  }> = [];

  async function runChild(
    name: string,
    job: () => Promise<{
      apiRequestsUsed: number;
      recordsSeen: number;
      recordsUpdated: number;
      message: string;
    }>
  ) {
    try {
      const result = await job();

      results.push({
        name,
        ok: true,
        apiRequestsUsed: result.apiRequestsUsed,
        recordsSeen: result.recordsSeen,
        recordsUpdated: result.recordsUpdated,
        message: result.message,
      });
    } catch (error) {
      results.push({
        name,
        ok: false,
        apiRequestsUsed: 0,
        recordsSeen: 0,
        recordsUpdated: 0,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  await runChild("bootstrap", runApiFootballBootstrapSync);
  await runChild("players-squads", syncPlayersAndSquads);
  await runChild("coaches", syncCoaches);
  await runChild("injuries", syncInjuries);
  await runChild("fixture-details", syncFixtureDetails);
  await runChild("predictions-odds-h2h", syncPredictionsOddsAndH2h);
  await runChild("top-stats", syncTopStats);

  const failed = results.filter((result) => !result.ok);
  const apiRequestsUsed = results.reduce((sum, result) => sum + result.apiRequestsUsed, 0);
  const recordsSeen = results.reduce((sum, result) => sum + result.recordsSeen, 0);
  const recordsUpdated = results.reduce((sum, result) => sum + result.recordsUpdated, 0);

  return {
    jobName: "full-sync",
    status: failed.length ? "partial" : "success",
    apiRequestsUsed,
    recordsSeen,
    recordsInserted: 0,
    recordsUpdated,
    recordsSkipped: 0,
    message: failed.length
      ? `Full ingest completed with ${failed.length} partial failure(s).`
      : "Full ingest completed successfully.",
    details: {
      results,
    },
  };
}
