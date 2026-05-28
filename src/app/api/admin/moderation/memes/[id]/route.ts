import { NextRequest, NextResponse } from "next/server";
import { isCommunityModerator } from "@/lib/community/data";
import { cleanCommunityText } from "@/lib/community/safety";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type MemeModerationContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: MemeModerationContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isCommunityModerator(user.id))) {
    return NextResponse.json(
      { status: "error", error: "Unauthorized" },
      { status: 403 },
    );
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    action?: string;
    reason?: string;
  } | null;
  const reason = cleanCommunityText(body?.reason, 160);

  const update =
    body?.action === "approve"
      ? {
          status: "approved",
          rejection_reason: null,
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        }
      : body?.action === "reject"
        ? {
            status: "rejected",
            rejection_reason: reason || "Rejected by moderation.",
          }
        : body?.action === "hide"
          ? {
              status: "hidden",
              rejection_reason: reason || "Hidden by moderation.",
            }
          : null;

  if (!update) {
    return NextResponse.json(
      { status: "error", error: "Unknown action." },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("community_memes")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { status: "error", error: "Unable to update meme." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
