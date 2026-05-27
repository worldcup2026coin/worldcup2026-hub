import { NextResponse } from "next/server";
import {
  isAuthorizedCronRequest,
  unauthorizedCronResponse,
} from "@/lib/sync/cron-auth";
import { runAutomatedPredictionSettlement } from "@/lib/predictions/settlement";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return unauthorizedCronResponse();
  }

  const dryRun = new URL(request.url).searchParams.get("dryRun") === "1";

  try {
    const result = await runAutomatedPredictionSettlement({ dryRun });

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
            : "Prediction settlement failed.",
      },
      { status: 500 },
    );
  }
}
