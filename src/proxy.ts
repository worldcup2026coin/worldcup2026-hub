import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  return response;
}

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/admin/:path*",
    "/debug/:path*",
    "/test/:path*",
  ],
};

