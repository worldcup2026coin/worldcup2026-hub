import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  buildPollWithResults,
  hashAnonymousId,
  parsePollOptions,
  type Poll,
} from "@/lib/data/community";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type VoteRouteProps = {
  params: Promise<{
    pollId: string;
  }>;
};

export async function POST(request: NextRequest, { params }: VoteRouteProps) {
  try {
    const { pollId } = await params;
    const body = await request.json();

    const optionId = String(body.optionId ?? "").trim();
    const anonymousId = String(body.anonymousId ?? "").trim();
    const source = String(body.source ?? "unknown").slice(0, 100);

    if (!optionId || !anonymousId) {
      return NextResponse.json(
        { status: "error", error: "Missing vote details." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data: pollData, error: pollError } = await supabase
      .from("polls")
      .select("*")
      .eq("id", pollId)
      .eq("status", "published")
      .maybeSingle();

    if (pollError) {
      return NextResponse.json(
        { status: "error", error: pollError.message },
        { status: 500 }
      );
    }

    if (!pollData) {
      return NextResponse.json(
        { status: "error", error: "Poll not found." },
        { status: 404 }
      );
    }

    const poll = pollData as Poll;
    const options = parsePollOptions(poll.options);
    const optionExists = options.some((option) => option.id === optionId);

    if (!optionExists) {
      return NextResponse.json(
        { status: "error", error: "Invalid poll option." },
        { status: 400 }
      );
    }

    const anonymousHash = hashAnonymousId(anonymousId);

    const { error: voteError } = await supabase.from("poll_votes").insert({
      poll_id: pollId,
      option_id: optionId,
      anonymous_hash: anonymousHash,
      source,
    });

    const updatedPoll = await buildPollWithResults(poll);

    if (voteError) {
      if (voteError.code === "23505") {
        return NextResponse.json({
          status: "ok",
          alreadyVoted: true,
          poll: updatedPoll,
          message: "Vote already recorded.",
        });
      }

      return NextResponse.json(
        { status: "error", error: voteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "ok",
      alreadyVoted: false,
      poll: updatedPoll,
      message: "Vote recorded.",
    });
  } catch {
    return NextResponse.json(
      { status: "error", error: "Unable to record vote right now." },
      { status: 500 }
    );
  }
}