import type { MemeCategory } from "./constants";

export type MemeSourcePlatform = "x" | "telegram" | "manual" | "user_submission";

export type MemeStatus = "draft" | "published" | "rejected";

export type Meme = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  external_url: string | null;
  source_platform: MemeSourcePlatform | null;
  source_handle: string | null;
  category: MemeCategory;
  team_id: string | null;
  fixture_id: string | null;
  status: MemeStatus;
  featured: boolean;
  meme_of_the_day: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  team?: {
    id: string;
    name: string | null;
    slug: string | null;
  } | null;
  fixture?: {
    id: string;
    slug: string | null;
  } | null;
};

export type MemeSubmissionInput = {
  name?: string | null;
  handle?: string | null;
  email?: string | null;
  meme_url: string;
  caption?: string | null;
  team_id?: string | null;
  fixture_id?: string | null;
  consent_to_feature: boolean;
};

export type SelectOption = {
  id: string;
  label: string;
};
