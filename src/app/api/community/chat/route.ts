import { NextRequest, NextResponse } from "next/server";
import { ensureCommunityProfile, getRecentChatMessages } from "@/lib/community/data";
import { cleanCommunityText, validateChatMessage } from "@/lib/community/safety";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const messages = await getRecentChatMessages(40);
    return NextResponse.json({ status: "ok", messages });
  } catch {
    return NextResponse.json(
      { status: "error", error: "Unable to load chat right now." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { status: "error", error: "Please sign in to chat." },
        { status: 401 },
      );
    }

    const body = (await request.json().catch(() => null)) as {
      message?: unknown;
    } | null;
    const message = cleanCommunityText(body?.message, 280);
    const validationError = validateChatMessage(message);

    if (validationError) {
      return NextResponse.json(
        { status: "error", error: validationError },
        { status: 400 },
      );
    }

    const profile = await ensureCommunityProfile(user.id, user.email);
    if (profile.status === "muted" || profile.status === "banned") {
      return NextResponse.json(
        {
          status: "error",
          error:
            profile.status === "banned"
              ? "Your community account is banned."
              : "Your community account is muted.",
        },
        { status: 403 },
      );
    }

    const admin = createSupabaseAdminClient();
    const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
    const { count: recentCount } = await admin
      .from("community_chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", oneMinuteAgo);

    if ((recentCount ?? 0) >= 5) {
      return NextResponse.json(
        { status: "error", error: "Slow down a touch. Try again in a minute." },
        { status: 429 },
      );
    }

    const { data: lastMessage } = await admin
      .from("community_chat_messages")
      .select("message")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (
      lastMessage?.message &&
      String(lastMessage.message).toLowerCase() === message.toLowerCase()
    ) {
      return NextResponse.json(
        { status: "error", error: "Please avoid repeating the same message." },
        { status: 400 },
      );
    }

    const { error } = await admin.from("community_chat_messages").insert({
      user_id: user.id,
      message,
      status: "visible",
    });

    if (error) {
      return NextResponse.json(
        { status: "error", error: "Unable to post chat right now." },
        { status: 500 },
      );
    }

    const messages = await getRecentChatMessages(40);
    return NextResponse.json({ status: "ok", messages });
  } catch {
    return NextResponse.json(
      { status: "error", error: "Unable to post chat right now." },
      { status: 500 },
    );
  }
}
