import "server-only";
import type { MetadataRoute } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { absoluteUrl } from "@/lib/seo";
import { fixtureSlug, teamSlug } from "@/lib/worldcup/format";
import { playerSlug } from "@/lib/data/players";
import {
  blogCategories,
  getBlogCategorySlug,
  type BlogCategory,
} from "@/lib/data/blog";
import type { Fixture } from "@/lib/data/matches";
import { hostCities, stadiums } from "@/lib/data/venues";
import { hostNations } from "@/lib/data/authority";

type SitemapTeam = {
  id: string;
  api_team_id: number;
  name: string;
  logo_url: string | null;
  updated_at?: string | null;
};

type SitemapFixture = Fixture & {
  updated_at?: string | null;
};

type SitemapBlogPost = {
  slug: string;
  updated_at: string | null;
  published_at: string | null;
};

type PredictionTipRow = {
  fixture_id: string;
};

type SitemapPlayer = {
  api_player_id: number;
  name: string | null;
};

function asTeams(data: unknown): SitemapTeam[] {
  return (data ?? []) as SitemapTeam[];
}

function asFixtures(data: unknown): SitemapFixture[] {
  return (data ?? []) as SitemapFixture[];
}

function asBlogPosts(data: unknown): SitemapBlogPost[] {
  return (data ?? []) as SitemapBlogPost[];
}

function asPredictionTipRows(data: unknown): PredictionTipRow[] {
  return (data ?? []) as PredictionTipRow[];
}

function asPlayers(data: unknown): SitemapPlayer[] {
  return (data ?? []) as SitemapPlayer[];
}

function page(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: string | null
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency,
    priority,
  };
}

export async function getDynamicSitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseAdminClient();

  const staticPages: MetadataRoute.Sitemap = [
    page("/", "daily", 1),
    page("/fixtures", "hourly", 0.95),
    page("/live", "hourly", 0.95),
    page("/groups", "hourly", 0.9),
    page("/best-third-placed-teams", "hourly", 0.86),
    page("/teams", "weekly", 0.85),
    page("/predictions", "daily", 0.8),
    page("/news", "daily", 0.85),
    page("/stadiums", "weekly", 0.75),
    page("/host-cities", "weekly", 0.75),
    page("/host-nations", "weekly", 0.75),
    page("/world-cup-format", "monthly", 0.74),
    page("/tournament-timeline", "monthly", 0.72),
    page("/world-cup-history", "monthly", 0.7),
    page("/community", "daily", 0.8),
    page("/top-scorers", "hourly", 0.82),
    page("/top-assists", "hourly", 0.82),
    page("/top-cards", "hourly", 0.82),
    page("/privacy", "yearly", 0.2),
    page("/terms", "yearly", 0.2),
  ];

  const [
    teamsResult,
    fixturesResult,
    blogResult,
    predictionTipsResult,
    playersResult,
  ] = await Promise.all([
    supabase.from("teams").select("id, api_team_id, name, logo_url, updated_at"),
    supabase.from("fixtures").select("*"),
    supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("status", "published"),
    supabase.from("predictions_tips").select("fixture_id").eq("status", "published"),
    supabase.from("players").select("api_player_id, name").order("name", { ascending: true }),
  ]);

  const teams = teamsResult.error ? [] : asTeams(teamsResult.data);
  const fixtures = fixturesResult.error ? [] : asFixtures(fixturesResult.data);
  const blogPosts = blogResult.error ? [] : asBlogPosts(blogResult.data);
  const predictionTipRows = predictionTipsResult.error
    ? []
    : asPredictionTipRows(predictionTipsResult.data);
  const players = playersResult.error ? [] : asPlayers(playersResult.data);

  const fixtureMap = new Map(fixtures.map((fixture) => [fixture.id, fixture]));
  const predictionFixtureIds = Array.from(
    new Set(predictionTipRows.map((row) => row.fixture_id))
  );

  const teamPages = teams.map((team) =>
    page(`/teams/${teamSlug(team.name, team.api_team_id)}`, "weekly", 0.75, team.updated_at)
  );

  const playerPages = players.map((player) =>
    page(`/players/${playerSlug(player.name, player.api_player_id)}`, "weekly", 0.65)
  );

  const matchPages = fixtures.map((fixture) =>
    page(
      `/matches/${fixtureSlug({
        api_fixture_id: fixture.api_fixture_id,
        match_date: fixture.match_date,
        home_team_name: fixture.home_team_name,
        away_team_name: fixture.away_team_name,
      })}`,
      "hourly",
      0.85,
      fixture.updated_at ?? fixture.match_date
    )
  );

  const predictionPages = predictionFixtureIds
    .map((fixtureId) => fixtureMap.get(fixtureId))
    .filter((fixture): fixture is SitemapFixture => Boolean(fixture))
    .map((fixture) =>
      page(
        `/predictions/${fixtureSlug({
          api_fixture_id: fixture.api_fixture_id,
          match_date: fixture.match_date,
          home_team_name: fixture.home_team_name,
          away_team_name: fixture.away_team_name,
        })}`,
        "daily",
        0.72,
        fixture.updated_at ?? fixture.match_date
      )
    );

  const newsPages = blogPosts.map((post) =>
    page(`/news/${post.slug}`, "weekly", 0.7, post.updated_at ?? post.published_at)
  );

  const categoryPages = blogCategories.map((category: BlogCategory) =>
    page(`/news/category/${getBlogCategorySlug(category)}`, "weekly", 0.5)
  );

  const hostCityPages = hostCities.map((city) =>
    page(`/host-cities/${city.slug}`, "monthly", 0.6)
  );

  const stadiumPages = stadiums.map((stadium) =>
    page(`/stadiums/${stadium.slug}`, "monthly", 0.6)
  );

  const hostNationPages = hostNations.map((nation) =>
    page(`/host-nations/${nation.slug}`, "monthly", 0.62)
  );

  return [
    ...staticPages,
    ...teamPages,
    ...playerPages,
    ...matchPages,
    ...predictionPages,
    ...newsPages,
    ...categoryPages,
    ...hostCityPages,
    ...stadiumPages,
    ...hostNationPages,
  ];
}
