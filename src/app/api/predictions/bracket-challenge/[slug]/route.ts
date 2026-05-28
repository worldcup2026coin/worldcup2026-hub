import { NextRequest, NextResponse } from "next/server";
import {
  getVisibleBracketBySlug,
  sanitizeBracketSaveInput,
} from "@/lib/bracket-challenge/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteParams,
) {
  const { slug } = await context.params;
  const bracket = await getVisibleBracketBySlug(slug).catch(() => null);

  if (!bracket) {
    return NextResponse.json(
      { status: "error", error: "Bracket not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ status: "ok", bracket });
}

export async function PATCH(
  request: NextRequest,
  context: RouteParams,
) {
  const { slug } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { status: "error", error: "Please sign in to update your bracket." },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const input = sanitizeBracketSaveInput(body ?? {});

  if (!input.ok) {
    return NextResponse.json(
      { status: "error", error: input.error },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();
  const { data: existing } = await admin
    .from("bracket_challenges")
    .select("id, user_id")
    .eq("slug", slug)
    .maybeSingle();

  if (!existing || existing.user_id !== user.id) {
    return NextResponse.json(
      { status: "error", error: "Bracket not found." },
      { status: 404 },
    );
  }

  const { error } = await admin
    .from("bracket_challenges")
    .update({
      display_name: input.displayName,
      title: input.title,
      champion_team_id: input.bracketData.championTeamId,
      finalist_team_id: input.bracketData.finalistTeamId,
      dark_horse_team_id: input.bracketData.darkHorseTeamId,
      bracket_data: input.bracketData,
      is_public: input.isPublic,
    })
    .eq("id", existing.id);

  if (error) {
    return NextResponse.json(
      { status: "error", error: "Unable to update bracket right now." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    status: "ok",
    slug,
    url: `/predictions/bracket-challenge/${slug}`,
  });
}
