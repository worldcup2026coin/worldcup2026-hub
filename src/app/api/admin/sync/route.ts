import { NextRequest, NextResponse } from "next/server";
import { runSync } from "@/lib/sync";
import {
  isAuthorizedCronRequest,
  unauthorizedCronResponse,
} from "@/lib/sync/cron-auth";
import { getErrorMessage } from "@/lib/sync/logs";
import type { SyncScope } from "@/lib/sync/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const allowedScopes: SyncScope[] = ["teams", "fixtures", "standings", "all"];

function getScope(request: NextRequest): SyncScope {
  const rawScope = request.nextUrl.searchParams.get("scope") ?? "all";

  if (allowedScopes.includes(rawScope as SyncScope)) {
    return rawScope as SyncScope;
  }

  return "all";
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return unauthorizedCronResponse();
  }

  const scope = getScope(request);

  try {
    const results = await runSync(scope);

    return NextResponse.json({
      status: "ok",
      scope,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        scope,
        error: getErrorMessage(error),
      },
      {
        status: 500,
      }
    );
  }
}
