import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ensureCommunityProfile, getApprovedMemes } from "@/lib/community/data";
import { cleanCommunityText, validateMemeInput } from "@/lib/community/safety";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function extensionForType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function GET(request: NextRequest) {
  const sort = request.nextUrl.searchParams.get("sort") === "top" ? "top" : "newest";
  const memes = await getApprovedMemes({ sort });
  return NextResponse.json({ status: "ok", memes });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { status: "error", error: "Please sign in to submit memes." },
        { status: 401 },
      );
    }

    const profile = await ensureCommunityProfile(user.id, user.email);
    if (profile.status === "muted" || profile.status === "banned") {
      return NextResponse.json(
        { status: "error", error: "Your community account cannot submit memes." },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const title = cleanCommunityText(formData.get("title"), 80);
    const caption = cleanCommunityText(formData.get("caption"), 220);
    const confirmed = formData.get("confirm") === "on";
    const fileValue = formData.get("image");
    const file = fileValue instanceof File ? fileValue : null;
    const validationError = validateMemeInput({ title, caption, file, confirmed });

    if (validationError) {
      return NextResponse.json(
        { status: "error", error: validationError },
        { status: 400 },
      );
    }

    const admin = createSupabaseAdminClient();
    const oneHourAgo = new Date(Date.now() - 60 * 60_000).toISOString();
    const { count } = await admin
      .from("community_memes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", oneHourAgo);

    if ((count ?? 0) >= 6) {
      return NextResponse.json(
        { status: "error", error: "Too many meme submissions. Try again later." },
        { status: 429 },
      );
    }

    const storagePath = `${user.id}/${randomUUID()}.${extensionForType(file!.type)}`;
    const bytes = await file!.arrayBuffer();
    const { error: uploadError } = await admin.storage
      .from("community-memes")
      .upload(storagePath, bytes, {
        contentType: file!.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { status: "error", error: "Unable to upload meme right now." },
        { status: 500 },
      );
    }

    const { error } = await admin.from("community_memes").insert({
      user_id: user.id,
      title,
      caption: caption || null,
      image_url: storagePath,
      storage_path: storagePath,
      status: "pending",
    });

    if (error) {
      return NextResponse.json(
        { status: "error", error: "Unable to submit meme right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      status: "ok",
      message: "Meme submitted for review.",
    });
  } catch {
    return NextResponse.json(
      { status: "error", error: "Unable to submit meme right now." },
      { status: 500 },
    );
  }
}
