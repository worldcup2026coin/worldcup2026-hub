import "server-only";

import { randomUUID } from "crypto";
import type {
  BracketChallengeData,
  BracketGroup,
} from "@/lib/bracket-challenge/types";
import type { Standing } from "@/lib/data/worldcup";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const realGroupPattern = /^Group [A-L]$/;

function groupSortValue(name: string) {
  return name.replace("Group ", "").charCodeAt(0);
}

export function buildBracketGroups(standings: Standing[]): BracketGroup[] {
  const groups = new Map<string, BracketGroup>();

  for (const row of standings) {
    if (!realGroupPattern.test(row.group_name)) continue;

    if (!groups.has(row.group_name)) {
      groups.set(row.group_name, { name: row.group_name, teams: [] });
    }

    groups.get(row.group_name)!.teams.push({
      id: String(row.api_team_id),
      apiTeamId: row.api_team_id,
      name: row.team_name,
      code: null,
      country: row.team_name,
      groupName: row.group_name,
    });
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      teams: group.teams
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 4),
    }))
    .filter((group) => group.teams.length === 4)
    .sort((a, b) => groupSortValue(a.name) - groupSortValue(b.name));
}

function asString(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function validateBracketData(value: unknown): {
  ok: boolean;
  data?: BracketChallengeData;
  error?: string;
} {
  if (!value || typeof value !== "object") {
    return { ok: false, error: "Bracket data is missing." };
  }

  const data = value as BracketChallengeData;

  if (data.version !== 1 || data.seedingModel !== "fan") {
    return { ok: false, error: "Unsupported bracket format." };
  }

  if (!Array.isArray(data.groupPicks) || data.groupPicks.length !== 12) {
    return { ok: false, error: "Complete all 12 group picks." };
  }

  for (const pick of data.groupPicks) {
    const ranked = [pick.first, pick.second, pick.third].filter(Boolean);
    if (ranked.length !== 3 || new Set(ranked).size !== 3) {
      return { ok: false, error: "Group rankings cannot contain duplicates." };
    }
  }

  if (
    !Array.isArray(data.bestThirdTeamIds) ||
    data.bestThirdTeamIds.length !== 8
  ) {
    return { ok: false, error: "Choose exactly eight third-place teams." };
  }

  if (new Set(data.bestThirdTeamIds).size !== 8) {
    return { ok: false, error: "Third-place teams cannot contain duplicates." };
  }

  if (!Array.isArray(data.round32Slots) || data.round32Slots.length !== 32) {
    return { ok: false, error: "Round of 32 is incomplete." };
  }

  const slotIds = data.round32Slots.filter(Boolean) as string[];
  if (slotIds.length !== 32 || new Set(slotIds).size !== 32) {
    return { ok: false, error: "Round of 32 teams must be unique." };
  }

  if (!data.championTeamId || !slotIds.includes(data.championTeamId)) {
    return { ok: false, error: "Champion is missing." };
  }

  return { ok: true, data };
}

export function createBracketSlug() {
  return `wc26-${randomUUID().slice(0, 8)}`;
}

export function sanitizeBracketSaveInput(body: Record<string, unknown>) {
  const bracketData = validateBracketData(body.bracketData);
  if (!bracketData.ok || !bracketData.data) {
    return { ok: false as const, error: bracketData.error ?? "Invalid bracket." };
  }

  return {
    ok: true as const,
    displayName: asString(body.displayName, 32) || null,
    title: asString(body.title, 80) || null,
    isPublic: body.isPublic !== false,
    bracketData: bracketData.data,
  };
}

export async function getVisibleBracketBySlug(slug: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("bracket_challenges")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .eq("status", "visible")
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST205" || error.message.includes("schema cache")) {
      return null;
    }

    throw new Error(error.message);
  }

  return data;
}
