import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type VoteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: VoteContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { status: "error", error: "Please sign in to upvote." },
      { status: 401 },
    );
  }

  const { id } = await params;
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.rpc("increment_meme_upvote", {
    meme_id_input: id,
    user_id_input: user.id,
  });

  if (error) {
    return NextResponse.json(
      { status: "error", error: "Unable to upvote right now." },
      { status: 500 },
    );
  }

  const upvotes = Array.isArray(data)
    ? Number(data[0]?.upvotes_count ?? 0)
    : 0;

  return NextResponse.json({ status: "ok", upvotes });
}
