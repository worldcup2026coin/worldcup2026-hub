import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body.email ?? "").trim().toLowerCase();
    const consent = Boolean(body.consent);
    const source = String(body.source ?? "unknown").slice(0, 100);
    const sourceUrl = String(body.sourceUrl ?? "").slice(0, 500);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { status: "error", error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { status: "error", error: "Please confirm consent before joining." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { error } = await supabase
      .from("subscribers")
      .upsert(
        {
          email,
          consent,
          source,
          source_url: sourceUrl,
          status: "active",
          metadata: {
            userAgent: request.headers.get("user-agent") ?? null,
          },
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "email",
        }
      );

    if (error) {
      return NextResponse.json(
        { status: "error", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "ok",
      message: "You are on the list.",
    });
  } catch {
    return NextResponse.json(
      { status: "error", error: "Unable to subscribe right now." },
      { status: 500 }
    );
  }
}
