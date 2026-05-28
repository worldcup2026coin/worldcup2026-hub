import { NextRequest, NextResponse } from "next/server";
import { isCommunityModerator } from "@/lib/community/data";
import { cleanCommunityText } from "@/lib/community/safety";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ChatModerationContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: ChatModerationContext) {
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
    userId?: string;
  } | null;

  const admin = createSupabaseAdminClient();
  const reason = cleanCommunityText(body?.reason, 160);

  if (body?.action === "hide" || body?.action === "flag") {
    const { error } = await admin
      .from("community_chat_messages")
      .update({
        status: body.action === "hide" ? "hidden" : "flagged",
        flagged_reason: reason || null,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { status: "error", error: "Unable to update message." },
        { status: 500 },
      );
    }
  } else if (body?.action === "mute" || body?.action === "ban") {
    const targetUserId = cleanCommunityText(body.userId, 80);
    if (!targetUserId) {
      return NextResponse.json(
        { status: "error", error: "Missing user." },
        { status: 400 },
      );
    }

    const { error } = await admin
      .from("community_profiles")
      .update({ status: body.action === "mute" ? "muted" : "banned" })
      .eq("id", targetUserId);

    if (error) {
      return NextResponse.json(
        { status: "error", error: "Unable to update user." },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      { status: "error", error: "Unknown action." },
      { status: 400 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
