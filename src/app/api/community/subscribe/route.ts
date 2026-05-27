import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  checkRateLimit,
  getRequestIp,
  rateLimitedResponse,
} from "@/lib/security/rate-limit";

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

    const ip = getRequestIp(request.headers);
    const ipLimit = await checkRateLimit({
      route: "community-subscribe:ip",
      identifier: ip,
      limit: 5,
      windowSeconds: 10 * 60,
    });

    if (!ipLimit.allowed) {
      return rateLimitedResponse(ipLimit);
    }

    const emailLimit = await checkRateLimit({
      route: "community-subscribe:email",
      identifier: email,
      limit: 3,
      windowSeconds: 60 * 60,
    });

    if (!emailLimit.allowed) {
      return rateLimitedResponse(emailLimit);
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
        { status: "error", error: "Unable to subscribe right now." },
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
