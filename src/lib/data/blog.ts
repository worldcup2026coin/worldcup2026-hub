import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPublicSiteUrl } from "@/lib/data/matches";

export type BlogCategory =
  | "match_previews"
  | "team_guides"
  | "group_previews"
  | "stadium_host_city_guides"
  | "what_to_watch_today"
  | "fan_culture"
  | "crypto_native_football_culture"
  | "community_roundups";

export type BlogPostStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  category: BlogCategory;
  tags: unknown;
  featured_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
  status: BlogPostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const blogCategoryLabels: Record<BlogCategory, string> = {
  match_previews: "Match previews",
  team_guides: "Team guides",
  group_previews: "Group previews",
  stadium_host_city_guides: "Stadium & host city guides",
  what_to_watch_today: "What to watch today",
  fan_culture: "Fan culture",
  crypto_native_football_culture: "Digital football culture",
  community_roundups: "Community roundups",
};

export const blogCategories = Object.keys(
  blogCategoryLabels
) as BlogCategory[];

function asBlogPosts(data: unknown): BlogPost[] {
  return (data ?? []) as BlogPost[];
}

function asBlogPost(data: unknown): BlogPost | null {
  return (data ?? null) as BlogPost | null;
}

function isMissingOptionalTableError(error: { code?: string; message?: string }) {
  const message = error.message ?? "";

  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    message.includes("does not exist") ||
    message.includes("Could not find the table")
  );
}

export function getBlogCategoryLabel(category: BlogCategory) {
  return blogCategoryLabels[category] ?? "World Cup 2026";
}

export function getBlogCategorySlug(category: BlogCategory) {
  return category.replaceAll("_", "-");
}

export function getBlogCategoryFromSlug(slug: string) {
  const category = slug.replaceAll("-", "_") as BlogCategory;

  if (blogCategories.includes(category)) {
    return category;
  }

  return null;
}

export function tagsToArray(tags: unknown) {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags.map(String).filter(Boolean);
  }

  return [];
}

export async function getPublishedBlogPosts(limit?: number) {
  const supabase = createSupabaseAdminClient();

  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    if (isMissingOptionalTableError(error)) {
      return [];
    }

    throw new Error(`Failed to load blog posts: ${error.message}`);
  }

  return asBlogPosts(data);
}

export async function getFeaturedBlogPosts(limit = 3) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (isMissingOptionalTableError(error)) {
      return [];
    }

    throw new Error(`Failed to load featured blog posts: ${error.message}`);
  }

  return asBlogPosts(data);
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    if (isMissingOptionalTableError(error)) {
      return null;
    }

    throw new Error(`Failed to load blog post: ${error.message}`);
  }

  return asBlogPost(data);
}

export async function getBlogPostsByCategory(category: BlogCategory) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingOptionalTableError(error)) {
      return [];
    }

    throw new Error(`Failed to load category blog posts: ${error.message}`);
  }

  return asBlogPosts(data);
}

export async function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("category", post.category)
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (isMissingOptionalTableError(error)) {
      return [];
    }

    throw new Error(`Failed to load related blog posts: ${error.message}`);
  }

  return asBlogPosts(data);
}

export function getBlogPostUrl(post: BlogPost) {
  return `${getPublicSiteUrl()}/news/${post.slug}`;
}

export function getBlogSeoTitle(post: BlogPost) {
  return post.seo_title || `${post.title} | World Cup 2026 Hub`;
}

export function getBlogSeoDescription(post: BlogPost) {
  return (
    post.seo_description ||
    post.excerpt ||
    "Read World Cup 2026 football stories, previews, guides and fan culture updates."
  );
}
