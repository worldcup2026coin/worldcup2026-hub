import { NextRequest, NextResponse } from "next/server";
import { getVisibleBracketBySlug } from "@/lib/bracket-challenge/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function POST(
  _request: NextRequest,
  context: RouteParams,
) {
  const { slug } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { status: "error", error: "Please sign in to react." },
      { status: 401 },
    );
  }

  const bracket = await getVisibleBracketBySlug(slug).catch(() => null);

  if (!bracket) {
    return NextResponse.json(
      { status: "error", error: "Bracket not found." },
      { status: 404 },
    );
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("bracket_challenge_reactions").insert({
    bracket_id: bracket.id,
    user_id: user.id,
    reaction_type: "fire",
  });

  if (error && error.code !== "23505") {
    return NextResponse.json(
      { status: "error", error: "Unable to react right now." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
