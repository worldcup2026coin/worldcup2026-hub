import { NextRequest, NextResponse } from "next/server";
import {
  createBracketSlug,
  sanitizeBracketSaveInput,
} from "@/lib/bracket-challenge/server";
import { ensureCommunityProfile } from "@/lib/community/data";
import {
  checkRateLimit,
  getRequestIp,
  rateLimitedResponse,
} from "@/lib/security/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { status: "error", error: "Please sign in to save your bracket." },
        { status: 401 },
      );
    }

    const rateLimit = await checkRateLimit({
      route: "bracket-challenge-save",
      identifier: `${user.id}:${getRequestIp(request.headers)}`,
      limit: 8,
      windowSeconds: 60 * 60,
    });

    if (!rateLimit.allowed) {
      return rateLimitedResponse(rateLimit);
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

    const profile = await ensureCommunityProfile(user.id, user.email).catch(
      () => null,
    );
    const admin = createSupabaseAdminClient();
    const slug = createBracketSlug();
    const { data, error } = await admin
      .from("bracket_challenges")
      .insert({
        user_id: user.id,
        slug,
        display_name: input.displayName ?? profile?.display_name ?? "WC26 fan",
        title: input.title,
        champion_team_id: input.bracketData.championTeamId,
        finalist_team_id: input.bracketData.finalistTeamId,
        dark_horse_team_id: input.bracketData.darkHorseTeamId,
        bracket_data: input.bracketData,
        is_public: input.isPublic,
        status: "visible",
      })
      .select("slug")
      .single();

    if (error) {
      return NextResponse.json(
        { status: "error", error: "Unable to save bracket right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      status: "ok",
      slug: data.slug,
      url: `/predictions/bracket-challenge/${data.slug}`,
    });
  } catch {
    return NextResponse.json(
      { status: "error", error: "Unable to save bracket right now." },
      { status: 500 },
    );
  }
}
