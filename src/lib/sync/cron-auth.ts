import "server-only";

import { NextResponse } from "next/server";

export function isAuthorizedCronRequest(request: Request) {
  const expectedSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization") || "";

  if (expectedSecret && authorization === `Bearer ${expectedSecret}`) {
    return true;
  }

  // Legacy compatibility for older sync callers. Prefer Authorization: Bearer
  // CRON_SECRET for all cron/admin routes.
  const legacySecret = process.env.SYNC_SECRET;
  const legacyHeader = request.headers.get("x-sync-secret");

  return Boolean(
    legacySecret && legacyHeader && legacyHeader.trim() === legacySecret.trim()
  );
}

export function unauthorizedCronResponse() {
  return NextResponse.json(
    {
      ok: false,
      error: "Unauthorized",
    },
    {
      status: 401,
    }
  );
}
