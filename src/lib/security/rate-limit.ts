import "server-only";

import { createHash } from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type RateLimitResult = {
  allowed: boolean;
  currentCount: number;
  limit: number;
  resetAt: string;
  warning?: string;
};

type RateLimitOptions = {
  route: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
};

export function getRequestIp(headers: Headers) {
  const cfIp = headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwardedFor) return forwardedFor;

  return "unknown";
}

function hashIdentifier(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getWindowStart(nowMs: number, windowSeconds: number) {
  return new Date(
    Math.floor(nowMs / (windowSeconds * 1000)) * windowSeconds * 1000,
  );
}

export async function checkRateLimit({
  route,
  identifier,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<RateLimitResult> {
  const nowMs = Date.now();
  const windowStart = getWindowStart(nowMs, windowSeconds);
  const resetAt = new Date(windowStart.getTime() + windowSeconds * 1000).toISOString();

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.rpc("increment_api_rate_limit", {
      route_input: route,
      identifier_hash_input: hashIdentifier(`${route}:${identifier}`),
      window_start_input: windowStart.toISOString(),
    });

    if (error) {
      console.warn(`Rate limit failed open for ${route}: ${error.message}`);

      return {
        allowed: true,
        currentCount: 0,
        limit,
        resetAt,
        warning: "rate_limit_unavailable",
      };
    }

    const currentCount = Array.isArray(data)
      ? Number(data[0]?.current_count ?? data[0]?.count ?? 1)
      : Number(data ?? 1);

    return {
      allowed: currentCount <= limit,
      currentCount,
      limit,
      resetAt,
    };
  } catch (error) {
    console.warn(
      `Rate limit failed open for ${route}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );

    return {
      allowed: true,
      currentCount: 0,
      limit,
      resetAt,
      warning: "rate_limit_unavailable",
    };
  }
}

export function rateLimitedResponse(result: RateLimitResult) {
  return Response.json(
    {
      status: "error",
      error: "Too many attempts. Please try again later.",
      resetAt: result.resetAt,
    },
    { status: 429 },
  );
}
