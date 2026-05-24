import "server-only";
import type { MetadataRoute } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { absoluteUrl } from "@/lib/seo";
import { fixtureSlug, teamSlug } from "@/lib/worldcup/format";
import {
  blogCategories,
  getBlogCategorySlug,
  type BlogCategory,
} from "@/lib/data/blog";
import type { Fixture } from "@/lib/data/matches";

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
    page("/teams", "weekly", 0.85),
    page("/predictions", "daily", 0.8),
    page("/news", "daily", 0.85),
    page("/stadiums", "weekly", 0.75),
    page("/community", "daily", 0.8),
    page("/privacy", "yearly", 0.2),
    page("/terms", "yearly", 0.2),
  ];

  const [teamsResult, fixturesResult, blogResult, predictionTipsResult] =
    await Promise.all([
      supabase.from("teams").select("id, api_team_id, name, logo_url, updated_at"),
      supabase.from("fixtures").select("*"),
      supabase
        .from("blog_posts")
        .select("slug, updated_at, published_at")
        .eq("status", "published"),
      supabase.from("predictions_tips").select("fixture_id").eq("status", "published"),
    ]);

  const teams = teamsResult.error ? [] : asTeams(teamsResult.data);
  const fixtures = fixturesResult.error ? [] : asFixtures(fixturesResult.data);
  const blogPosts = blogResult.error ? [] : asBlogPosts(blogResult.data);
  const predictionTipRows = predictionTipsResult.error
    ? []
    : asPredictionTipRows(predictionTipsResult.data);

  const fixtureMap = new Map(fixtures.map((fixture) => [fixture.id, fixture]));
  const predictionFixtureIds = Array.from(
    new Set(predictionTipRows.map((row) => row.fixture_id))
  );

  const teamPages = teams.map((team) =>
    page(`/teams/${teamSlug(team.name, team.api_team_id)}`, "weekly", 0.75, team.updated_at)
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

  return [
    ...staticPages,
    ...teamPages,
    ...matchPages,
    ...predictionPages,
    ...newsPages,
    ...categoryPages,
  ];
}
