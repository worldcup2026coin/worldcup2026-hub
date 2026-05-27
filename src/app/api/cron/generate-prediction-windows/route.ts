import { NextResponse } from "next/server";
import {
  isAuthorizedCronRequest,
  unauthorizedCronResponse,
} from "@/lib/sync/cron-auth";
import { runAutomatedPredictionWindowGeneration } from "@/lib/predictions/window-generator";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return unauthorizedCronResponse();
  }

  const requestUrl = new URL(request.url);
  const dryRun = requestUrl.searchParams.get("dryRun") === "1";
  const horizonHours = Number(requestUrl.searchParams.get("horizonHours") ?? "72");

  try {
    const result = await runAutomatedPredictionWindowGeneration({
      dryRun,
      horizonHours: Number.isFinite(horizonHours) ? horizonHours : 72,
    });

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Prediction window generation failed.",
      },
      { status: 500 },
    );
  }
}
