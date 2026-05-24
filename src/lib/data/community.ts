import "server-only";
import { createHash } from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type PollContextType =
  | "homepage"
  | "fixture"
  | "team"
  | "community"
  | "general";

export type PollOption = {
  id: string;
  label: string;
};

export type Poll = {
  id: string;
  title: string;
  description: string | null;
  context_type: PollContextType;
  fixture_id: string | null;
  team_id: string | null;
  options: unknown;
  status: "draft" | "published" | "closed";
  is_featured: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PollResult = {
  optionId: string;
  label: string;
  votes: number;
  percentage: number;
};

export type PollWithResults = Poll & {
  parsedOptions: PollOption[];
  results: PollResult[];
  totalVotes: number;
};

export function parsePollOptions(value: unknown): PollOption[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const id = String(record.id ?? "").trim();
      const label = String(record.label ?? "").trim();

      if (!id || !label) {
        return null;
      }

      return { id, label };
    })
    .filter((item): item is PollOption => Boolean(item));
}

function asPolls(data: unknown): Poll[] {
  return (data ?? []) as Poll[];
}

function asVotes(data: unknown): { option_id: string }[] {
  return (data ?? []) as { option_id: string }[];
}

export function hashAnonymousId(anonymousId: string) {
  return createHash("sha256")
    .update(`${anonymousId}:${process.env.SYNC_SECRET ?? "wc26"}`)
    .digest("hex");
}

export async function buildPollWithResults(poll: Poll): Promise<PollWithResults> {
  const supabase = createSupabaseAdminClient();
  const parsedOptions = parsePollOptions(poll.options);

  const { data, error } = await supabase
    .from("poll_votes")
    .select("option_id")
    .eq("poll_id", poll.id);

  if (error) {
    throw new Error(`Failed to load poll votes: ${error.message}`);
  }

  const votes = asVotes(data);
  const totalVotes = votes.length;
  const counts = new Map<string, number>();

  for (const vote of votes) {
    counts.set(vote.option_id, (counts.get(vote.option_id) ?? 0) + 1);
  }

  const results = parsedOptions.map((option) => {
    const voteCount = counts.get(option.id) ?? 0;

    return {
      optionId: option.id,
      label: option.label,
      votes: voteCount,
      percentage: totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100),
    };
  });

  return {
    ...poll,
    parsedOptions,
    results,
    totalVotes,
  };
}

export async function getPublishedPolls({
  contextType,
  fixtureId,
  teamId,
  limit = 6,
}: {
  contextType?: PollContextType;
  fixtureId?: string;
  teamId?: string;
  limit?: number;
}) {
  const supabase = createSupabaseAdminClient();

  let query = supabase
    .from("polls")
    .select("*")
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (contextType) {
    query = query.eq("context_type", contextType);
  }

  if (fixtureId) {
    query = query.eq("fixture_id", fixtureId);
  }

  if (teamId) {
    query = query.eq("team_id", teamId);
  }

  const { data, error } = await query;

  if (error) {
    if (
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      error.message.includes("does not exist")
    ) {
      return [];
    }

    throw new Error(`Failed to load polls: ${error.message}`);
  }

  const polls = asPolls(data);

  return Promise.all(polls.map((poll) => buildPollWithResults(poll)));
}

export async function getCommunityPagePolls() {
  const [communityPolls, homepagePolls] = await Promise.all([
    getPublishedPolls({ contextType: "community", limit: 3 }),
    getPublishedPolls({ contextType: "homepage", limit: 3 }),
  ]);

  return [...communityPolls, ...homepagePolls].slice(0, 6);
}
