export type CommunityRole = "member" | "moderator" | "admin";
export type CommunityStatus = "active" | "muted" | "banned";
export type ChatStatus = "visible" | "hidden" | "deleted" | "flagged";
export type MemeStatus = "pending" | "approved" | "rejected" | "hidden";

export type CommunityProfile = {
  id: string;
  display_name: string;
  handle: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: CommunityRole;
  status: CommunityStatus;
  created_at: string;
  updated_at: string;
};

export type CommunityChatMessage = {
  id: string;
  user_id: string;
  message: string;
  status: ChatStatus;
  flagged_reason: string | null;
  created_at: string;
  updated_at: string;
  profile?: Pick<
    CommunityProfile,
    "id" | "display_name" | "handle" | "avatar_url" | "role" | "status"
  > | null;
};

export type CommunityMeme = {
  id: string;
  user_id: string;
  title: string;
  caption: string | null;
  image_url: string;
  storage_path: string;
  status: MemeStatus;
  rejection_reason: string | null;
  upvotes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  approved_by: string | null;
  profile?: Pick<
    CommunityProfile,
    "id" | "display_name" | "handle" | "avatar_url" | "role" | "status"
  > | null;
  viewer_has_upvoted?: boolean;
};
