import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    status: "ok",
    app: "worldcup2026-hub",
    timestamp: new Date().toISOString(),
  });
}
