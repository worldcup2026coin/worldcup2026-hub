"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

type MemeSubmissionRow = {
  id: string;
  name: string | null;
  handle: string | null;
  email: string | null;
  meme_url: string;
  caption: string | null;
  team_id: string | null;
  fixture_id: string | null;
  status: "pending" | "approved" | "rejected";
};

function getSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  return value;
}

function getServiceRoleKey() {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return value;
}

function getAdminKey() {
  const value = process.env.MEME_ADMIN_KEY;
  if (!value) throw new Error("Missing MEME_ADMIN_KEY");
  return value;
}

function createAdminSupabaseClient() {
  return createClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function requireAdminKey(value: string) {
  if (!value || value !== getAdminKey()) {
    throw new Error("Unauthorized");
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function isDirectImageUrl(value: string) {
  return /\.(jpg|jpeg|png|gif|webp|avif)(\?.*)?$/i.test(value);
}

export async function approveMemeSubmission(formData: FormData) {
  const adminKey = String(formData.get("adminKey") || "");
  const submissionId = String(formData.get("submissionId") || "");

  requireAdminKey(adminKey);

  if (!submissionId) {
    throw new Error("Missing submission ID");
  }

  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("meme_submissions")
    .select("id, name, handle, email, meme_url, caption, team_id, fixture_id, status")
    .eq("id", submissionId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Submission not found");
  }

  const submission = data as MemeSubmissionRow;

  if (submission.status !== "pending") {
    throw new Error("Only pending submissions can be approved");
  }

  const title = submission.caption?.trim() || "Community World Cup meme";
  const baseSlug = slugify(title) || "community-world-cup-meme";
  const slug = `${baseSlug}-${submission.id.slice(0, 8)}`;

  const { error: insertError } = await supabase.from("memes").insert({
    title,
    slug,
    description: submission.caption,
    image_url: isDirectImageUrl(submission.meme_url) ? submission.meme_url : null,
    external_url: submission.meme_url,
    source_platform: "user_submission",
    source_handle: submission.handle || submission.name,
    category: "fan_reactions",
    team_id: submission.team_id,
    fixture_id: submission.fixture_id,
    status: "published",
    featured: false,
    meme_of_the_day: false,
    published_at: new Date().toISOString(),
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  const { error: updateError } = await supabase
    .from("meme_submissions")
    .update({
      status: "approved",
      moderation_notes: "Approved from admin meme moderation page.",
      updated_at: new Date().toISOString(),
    })
    .eq("id", submission.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath("/memes");
  revalidatePath("/admin/memes");
}

export async function rejectMemeSubmission(formData: FormData) {
  const adminKey = String(formData.get("adminKey") || "");
  const submissionId = String(formData.get("submissionId") || "");

  requireAdminKey(adminKey);

  if (!submissionId) {
    throw new Error("Missing submission ID");
  }

  const supabase = createAdminSupabaseClient();

  const { error } = await supabase
    .from("meme_submissions")
    .update({
      status: "rejected",
      moderation_notes: "Rejected from admin meme moderation page.",
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .eq("status", "pending");

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/memes");
}

