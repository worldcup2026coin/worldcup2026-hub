import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPublishedPolls, type PollWithResults } from "@/lib/data/community";

export type HomeFixture = {
  id: string;
  api_fixture_id: number;
  match_date: string | null;
  status_short: string | null;
  status_long: string | null;
  round: string | null;
  group_name: string | null;
  home_team_name: string | null;
  away_team_name: string | null;
  home_team_logo: string | null;
  away_team_logo: string | null;
  home_goals: number | null;
  away_goals: number | null;
  venue_name: string | null;
  venue_city: string | null;
  updated_at?: string | null;
};

export type HomePrediction = {
  id: string;
  fixture_id: string;
  type: string;
  title: string;
  summary: string | null;
  risk_level: string | null;
  confidence_score: number | null;
  published_at: string | null;
  fixture: HomeFixture | null;
};

export type HomeArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  published_at: string | null;
};

export type HomeTeam = {
  id: string;
  api_team_id: number;
  name: string;
  code: string | null;
  country: string | null;
  logo_url: string | null;
  group_name: string | null;
};

export type HomeSyncLog = {
  id: string;
  scope: string;
  status: string;
  started_at: string | null;
  ended_at: string | null;
  records_received: number | null;
  records_upserted: number | null;
  error_message: string | null;
};

export type HomepagePolishData = {
  liveFixtures: HomeFixture[];
  nextFixtures: HomeFixture[];
  featuredMatch: HomeFixture | null;
  latestPredictions: HomePrediction[];
  latestArticles: HomeArticle[];
  trendingTeams: HomeTeam[];
  polls: PollWithResults[];
  latestSyncLog: HomeSyncLog | null;
};

function asArray<T>(data: unknown): T[] {
  return (data ?? []) as T[];
}

function isLiveStatus(status: string | null | undefined) {
  return ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(
    String(status ?? "").toUpperCase()
  );
}

function isNotStarted(status: string | null | undefined) {
  return ["NS", "TBD", ""].includes(String(status ?? "").toUpperCase());
}

export async function getHomepagePolishData(): Promise<HomepagePolishData> {
  const supabase = createSupabaseAdminClient();
  const nowIso = new Date().toISOString();

  const [
    fixturesResult,
    predictionTipsResult,
    articlesResult,
    teamsResult,
    syncLogResult,
    polls,
  ] = await Promise.all([
    supabase
      .from("fixtures")
      .select("*")
      .order("match_date", { ascending: true })
      .limit(120),

    supabase
      .from("predictions_tips")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(6),

    supabase
      .from("blog_posts")
      .select("id,title,slug,excerpt,category,published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(6),

    supabase
      .from("teams")
      .select("id,api_team_id,name,code,country,logo_url,group_name")
      .order("group_name", { ascending: true })
      .order("name", { ascending: true })
      .limit(8),

    supabase
      .from("api_sync_logs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    getPublishedPolls({ contextType: "homepage", limit: 1 }),
  ]);

  const fixtures = fixturesResult.error
    ? []
    : asArray<HomeFixture>(fixturesResult.data);

  const liveFixtures = fixtures.filter((fixture) =>
    isLiveStatus(fixture.status_short)
  );

  const nextFixtures = fixtures
    .filter((fixture) => {
      if (!fixture.match_date) return false;

      return (
        isNotStarted(fixture.status_short) &&
        new Date(fixture.match_date).getTime() >= new Date(nowIso).getTime()
      );
    })
    .slice(0, 6);

  const predictionTips = predictionTipsResult.error
    ? []
    : asArray<HomePrediction>(predictionTipsResult.data);

  const fixtureMap = new Map(fixtures.map((fixture) => [fixture.id, fixture]));

  const latestPredictions = predictionTips.map((tip) => ({
    ...tip,
    fixture: fixtureMap.get(tip.fixture_id) ?? null,
  }));

  return {
    liveFixtures,
    nextFixtures,
    featuredMatch: liveFixtures[0] ?? nextFixtures[0] ?? null,
    latestPredictions,
    latestArticles: articlesResult.error
      ? []
      : asArray<HomeArticle>(articlesResult.data),
    trendingTeams: teamsResult.error ? [] : asArray<HomeTeam>(teamsResult.data),
    polls,
    latestSyncLog: syncLogResult.error
      ? null
      : ((syncLogResult.data ?? null) as HomeSyncLog | null),
  };
}
