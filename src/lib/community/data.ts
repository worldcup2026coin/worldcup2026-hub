import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  CommunityChatMessage,
  CommunityMeme,
  CommunityProfile,
} from "@/lib/community/types";

type ProfileLite = Pick<
  CommunityProfile,
  "id" | "display_name" | "handle" | "avatar_url" | "role" | "status"
>;

function profileFallback(userId: string): ProfileLite {
  return {
    id: userId,
    display_name: "WC26 fan",
    handle: null,
    avatar_url: null,
    role: "member",
    status: "active",
  };
}

async function attachProfiles<T extends { user_id: string }>(rows: T[]) {
  if (rows.length === 0) return rows.map((row) => ({ ...row, profile: null }));

  const supabase = createSupabaseAdminClient();
  const ids = [...new Set(rows.map((row) => row.user_id))];
  const { data: profiles } = await supabase
    .from("community_profiles")
    .select("id, display_name, handle, avatar_url, role, status")
    .in("id", ids);

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile as ProfileLite]),
  );

  return rows.map((row) => ({
    ...row,
    profile: profileMap.get(row.user_id) ?? profileFallback(row.user_id),
  }));
}

async function attachSignedMemeUrls(rows: CommunityMeme[]) {
  if (rows.length === 0) return rows;

  const supabase = createSupabaseAdminClient();
  return Promise.all(
    rows.map(async (row) => {
      const { data } = await supabase.storage
        .from("community-memes")
        .createSignedUrl(row.storage_path, 60 * 60);

      return {
        ...row,
        image_url: data?.signedUrl ?? row.image_url,
      };
    }),
  );
}

export async function getCommunityProfile(userId: string) {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("community_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return (data as CommunityProfile | null) ?? null;
}

export async function ensureCommunityProfile(userId: string, email?: string | null) {
  const existing = await getCommunityProfile(userId);
  if (existing) return existing;

  const baseName = email?.split("@")[0]?.replace(/[^a-zA-Z0-9_ -]/g, "") || "WC26 fan";
  const displayName = baseName.slice(0, 32) || "WC26 fan";
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("community_profiles")
    .insert({
      id: userId,
      display_name: displayName.length >= 2 ? displayName : "WC26 fan",
      role: "member",
      status: "active",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CommunityProfile;
}

export async function isCommunityModerator(userId: string) {
  const profile = await getCommunityProfile(userId);
  return Boolean(
    profile && profile.status === "active" && ["admin", "moderator"].includes(profile.role),
  );
}

export async function getRecentChatMessages(limit = 40, includeModerated = false) {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("community_chat_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!includeModerated) {
    query = query.eq("status", "visible");
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const withProfiles = await attachProfiles((data ?? []) as CommunityChatMessage[]);
  return withProfiles.reverse() as CommunityChatMessage[];
}

export async function getApprovedMemes({
  sort = "newest",
  userId,
}: {
  sort?: "newest" | "top";
  userId?: string | null;
}) {
  const supabase = createSupabaseAdminClient();
  const query = supabase
    .from("community_memes")
    .select("*")
    .eq("status", "approved")
    .order(sort === "top" ? "upvotes_count" : "created_at", { ascending: false })
    .limit(60);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = await attachSignedMemeUrls(
    (await attachProfiles((data ?? []) as CommunityMeme[])) as CommunityMeme[],
  );

  if (!userId || rows.length === 0) return rows;

  const { data: votes } = await supabase
    .from("community_meme_votes")
    .select("meme_id")
    .eq("user_id", userId)
    .in(
      "meme_id",
      rows.map((row) => row.id),
    );

  const voted = new Set((votes ?? []).map((vote) => vote.meme_id));
  return rows.map((row) => ({ ...row, viewer_has_upvoted: voted.has(row.id) }));
}

export async function getUserMemes(userId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("community_memes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) throw new Error(error.message);
  return attachSignedMemeUrls(
    (await attachProfiles((data ?? []) as CommunityMeme[])) as CommunityMeme[],
  );
}

export async function getModerationMemes(status = "pending") {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("community_memes")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(80);

  if (error) throw new Error(error.message);
  return attachSignedMemeUrls(
    (await attachProfiles((data ?? []) as CommunityMeme[])) as CommunityMeme[],
  );
}
