import type { MatchHeadToHead } from "@/lib/data/matches";
import { MatchEmptyState } from "@/components/matches/match-empty-state";

type MatchHeadToHeadCardProps = {
  headToHead: MatchHeadToHead | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
}

function getTeamName(match: Record<string, unknown>, side: "home" | "away") {
  const teams = asRecord(match.teams);
  const team = asRecord(teams?.[side]);

  return typeof team?.name === "string" ? team.name : side;
}

function getGoals(match: Record<string, unknown>, side: "home" | "away") {
  const goals = asRecord(match.goals);
  const value = goals?.[side];

  return typeof value === "number" ? String(value) : "-";
}

function hasRealScore(match: Record<string, unknown>) {
  const goals = asRecord(match.goals);

  return typeof goals?.home === "number" && typeof goals?.away === "number";
}

function getFixtureId(match: Record<string, unknown>) {
  const fixture = asRecord(match.fixture);
  const value = fixture?.id;

  return typeof value === "number" ? value : null;
}

function isFinished(match: Record<string, unknown>) {
  const fixture = asRecord(match.fixture);
  const status = asRecord(fixture?.status);
  const short = typeof status?.short === "string" ? status.short : "";
  const long = typeof status?.long === "string" ? status.long.toLowerCase() : "";

  return (
    ["FT", "AET", "PEN"].includes(short) ||
    long.includes("match finished") ||
    long.includes("finished")
  );
}

function getDate(match: Record<string, unknown>) {
  const fixture = asRecord(match.fixture);
  const value = fixture?.date;

  if (typeof value !== "string") return "Date TBC";

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function MatchHeadToHeadCard({ headToHead }: MatchHeadToHeadCardProps) {
  const matches = Array.isArray(headToHead?.matches)
    ? headToHead.matches
        .map(asRecord)
        .filter((item): item is Record<string, unknown> => Boolean(item))
        .filter((match) => getFixtureId(match) !== headToHead?.api_fixture_id)
        .filter((match) => isFinished(match))
        .filter((match) => hasRealScore(match))
        .slice(0, 5)
    : [];

  if (!headToHead || matches.length === 0) {
    return (
      <MatchEmptyState
        title="No previous meetings found"
        description="Finished head-to-head matches with confirmed scores will appear here automatically when the API provides them."
      />
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
            Head to head
          </p>
          <h2 className="mt-3 text-2xl font-black text-white">
            Previous finished meetings
          </h2>
        </div>

        {headToHead.last_synced_at ? (
          <p className="text-xs text-slate-400">
            Last synced{" "}
            {new Date(headToHead.last_synced_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3">
        {matches.map((match, index) => (
          <article
            key={`${getFixtureId(match) ?? getDate(match)}-${index}`}
            className="rounded-2xl bg-white/[0.04] p-4"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              {getDate(match)}
            </p>

            <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
              <p className="font-bold text-white">{getTeamName(match, "home")}</p>
              <p className="rounded-xl bg-slate-950/50 px-3 py-2 font-black text-white">
                {getGoals(match, "home")} - {getGoals(match, "away")}
              </p>
              <p className="text-right font-bold text-white">
                {getTeamName(match, "away")}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
