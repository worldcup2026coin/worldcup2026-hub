import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { MemeCategory } from "./constants";
import type { Meme, MemeSubmissionInput, SelectOption } from "./types";

function getSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  return value;
}

function getSupabaseAnonKey() {
  const value =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!value) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }

  return value;
}

export function createPublicSupabaseClient() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

const MEME_SELECT = `
  id,
  title,
  slug,
  description,
  image_url,
  external_url,
  source_platform,
  source_handle,
  category,
  team_id,
  fixture_id,
  status,
  featured,
  meme_of_the_day,
  sort_order,
  published_at,
  created_at,
  updated_at
`;

function mapMeme(row: unknown): Meme {
  return row as Meme;
}

export async function getPublishedMemes(params?: {
  category?: MemeCategory | string;
  limit?: number;
}) {
  const supabase = createPublicSupabaseClient();

  let query = supabase
    .from("memes")
    .select(MEME_SELECT)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (params?.category) {
    query = query.eq("category", params.category);
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getPublishedMemes error:", error.message);
    return [];
  }

  return (data ?? []).map(mapMeme);
}

export async function getLatestMemes(limit = 6) {
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("memes")
    .select(MEME_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getLatestMemes error:", error.message);
    return [];
  }

  return (data ?? []).map(mapMeme);
}

export async function getFeaturedMemes(limit = 6) {
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("memes")
    .select(MEME_SELECT)
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedMemes error:", error.message);
    return [];
  }

  return (data ?? []).map(mapMeme);
}

export async function getMemeOfTheDay() {
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("memes")
    .select(MEME_SELECT)
    .eq("status", "published")
    .eq("meme_of_the_day", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getMemeOfTheDay error:", error.message);
    return null;
  }

  return data ? mapMeme(data) : null;
}

export async function getMemesByCategory(category: MemeCategory | string, limit = 24) {
  return getPublishedMemes({ category, limit });
}

export async function getMemesByTeam(teamId: string, limit = 6) {
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("memes")
    .select(MEME_SELECT)
    .eq("status", "published")
    .eq("team_id", teamId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getMemesByTeam error:", error.message);
    return [];
  }

  return (data ?? []).map(mapMeme);
}

export async function getMemesByFixture(fixtureId: string, limit = 6) {
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("memes")
    .select(MEME_SELECT)
    .eq("status", "published")
    .eq("fixture_id", fixtureId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getMemesByFixture error:", error.message);
    return [];
  }

  return (data ?? []).map(mapMeme);
}

export async function getMemeBySlug(slug: string) {
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("memes")
    .select(MEME_SELECT)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getMemeBySlug error:", error.message);
    return null;
  }

  return data ? mapMeme(data) : null;
}

export async function submitMeme(input: MemeSubmissionInput) {
  const supabase = createPublicSupabaseClient();

  const { error } = await supabase.from("meme_submissions").insert({
    name: input.name || null,
    handle: input.handle || null,
    email: input.email || null,
    meme_url: input.meme_url,
    caption: input.caption || null,
    team_id: input.team_id || null,
    fixture_id: input.fixture_id || null,
    source: "website",
    status: "pending",
    consent_to_feature: input.consent_to_feature,
  });

  if (error) {
    console.error("submitMeme error:", error.message);
    throw new Error("Could not submit meme");
  }
}

export async function getTeamOptions(): Promise<SelectOption[]> {
  return [];
}

export async function getFixtureOptions(): Promise<SelectOption[]> {
  return [];
}
