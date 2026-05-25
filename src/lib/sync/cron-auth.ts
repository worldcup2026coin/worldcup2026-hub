import "server-only";

import { NextResponse } from "next/server";

export function isAuthorizedCronRequest(request: Request) {
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    return false;
  }

  const authorization = request.headers.get("authorization") || "";
  return authorization === `Bearer ${expectedSecret}`;
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
