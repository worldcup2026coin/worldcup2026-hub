"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { TeamFlag } from "@/components/worldcup/team-flag";
import type {
  BracketChallengeData,
  BracketGroup,
  BracketTeam,
  GroupPick,
  KnockoutRound,
} from "@/lib/bracket-challenge/types";

type BuilderProps = {
  groups: BracketGroup[];
  signedIn: boolean;
};

type Draft = {
  step: number;
  groupPicks: Record<string, Partial<GroupPick>>;
  bestThirdTeamIds: string[];
  round32Slots: Array<string | null>;
  locked: boolean;
  picks: Record<KnockoutRound, Array<string | null>>;
  darkHorseTeamId: string | null;
  title: string;
  displayName: string;
  savedUrl: string | null;
};

const draftKey = "wc26_bracket_challenge_draft_v1";
const rounds: Array<{ key: KnockoutRound; label: string }> = [
  { key: "round32", label: "Round of 32" },
  { key: "round16", label: "Round of 16" },
  { key: "quarterFinals", label: "Quarter-finals" },
  { key: "semiFinals", label: "Semi-finals" },
  { key: "final", label: "Final" },
];

const emptyPicks: Record<KnockoutRound, Array<string | null>> = {
  round32: Array(16).fill(null),
  round16: Array(8).fill(null),
  quarterFinals: Array(4).fill(null),
  semiFinals: Array(2).fill(null),
  final: Array(1).fill(null),
};

function createInitialDraft(): Draft {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem(draftKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Draft;
        return {
          ...parsed,
          picks: { ...emptyPicks, ...parsed.picks },
          savedUrl: null,
        };
      } catch {
        window.localStorage.removeItem(draftKey);
      }
    }
  }

  return {
    step: 0,
    groupPicks: {},
    bestThirdTeamIds: [],
    round32Slots: [],
    locked: false,
    picks: emptyPicks,
    darkHorseTeamId: null,
    title: "",
    displayName: "",
    savedUrl: null,
  };
}

function roundSize(round: KnockoutRound) {
  return {
    round32: 16,
    round16: 8,
    quarterFinals: 4,
    semiFinals: 2,
    final: 1,
  }[round];
}

function nextRounds(round: KnockoutRound) {
  const index = rounds.findIndex((item) => item.key === round);
  return rounds.slice(index + 1).map((item) => item.key);
}

function getTeamMap(groups: BracketGroup[]) {
  return new Map(groups.flatMap((group) => group.teams.map((team) => [team.id, team])));
}

function getGroupPick(groupName: string, draft: Draft): GroupPick | null {
  const pick = draft.groupPicks[groupName];
  if (!pick?.first || !pick.second || !pick.third) return null;
  const ranked = [pick.first, pick.second, pick.third];
  if (new Set(ranked).size !== 3) return null;

  return {
    groupName,
    first: pick.first,
    second: pick.second,
    third: pick.third,
    fourth: pick.fourth,
  };
}

function getCompleteGroupPicks(groups: BracketGroup[], draft: Draft) {
  return groups
    .map((group) => getGroupPick(group.name, draft))
    .filter((pick): pick is GroupPick => Boolean(pick));
}

function buildRound32Slots(groupPicks: GroupPick[], bestThirdTeamIds: string[]) {
  const winners = groupPicks.map((pick) => ({ id: pick.first, groupName: pick.groupName }));
  const runners = groupPicks.map((pick) => ({ id: pick.second, groupName: pick.groupName }));
  const thirds = groupPicks
    .filter((pick) => bestThirdTeamIds.includes(pick.third))
    .map((pick) => ({ id: pick.third, groupName: pick.groupName }));
  const pool = [...runners, ...thirds];
  const slots: string[] = [];

  for (const winner of winners) {
    const opponentIndex = pool.findIndex((team) => team.groupName !== winner.groupName);
    const opponent = pool.splice(opponentIndex >= 0 ? opponentIndex : 0, 1)[0];
    slots.push(winner.id, opponent.id);
  }

  while (pool.length >= 2) {
    const first = pool.shift()!;
    const opponentIndex = pool.findIndex((team) => team.groupName !== first.groupName);
    const second = pool.splice(opponentIndex >= 0 ? opponentIndex : 0, 1)[0];
    slots.push(first.id, second.id);
  }

  return slots.slice(0, 32);
}

function getRoundTeams(round: KnockoutRound, draft: Draft) {
  if (round === "round32") return draft.round32Slots;

  const previousRound = rounds[rounds.findIndex((item) => item.key === round) - 1].key;
  return draft.picks[previousRound];
}

function getMatches(round: KnockoutRound, draft: Draft) {
  const teams = getRoundTeams(round, draft);
  return Array.from({ length: roundSize(round) }, (_, index) => ({
    teamAId: teams[index * 2] ?? null,
    teamBId: teams[index * 2 + 1] ?? null,
    winnerId: draft.picks[round][index] ?? null,
  }));
}

function getFinalist(draft: Draft) {
  const finalMatch = getMatches("final", draft)[0];
  if (!finalMatch?.winnerId) return null;
  return finalMatch.teamAId === finalMatch.winnerId
    ? finalMatch.teamBId
    : finalMatch.teamAId;
}

function getSemiFinalists(draft: Draft) {
  return getMatches("semiFinals", draft)
    .flatMap((match) => [match.teamAId, match.teamBId])
    .filter((id): id is string => Boolean(id));
}

function TeamName({ team }: { team: BracketTeam | null }) {
  if (!team) {
    return <span className="text-slate-500">TBD</span>;
  }

  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <TeamFlag
        name={team.name}
        country={team.country}
        code={team.code}
        className="size-7 shrink-0 text-base"
      />
      <span className="truncate">{team.name}</span>
    </span>
  );
}

export function BracketChallengeBuilder({ groups, signedIn }: BuilderProps) {
  const [draft, setDraft] = useState<Draft>(createInitialDraft);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLCanvasElement>(null);
  const completePanelRef = useRef<HTMLDivElement>(null);
  const teamMap = useMemo(() => getTeamMap(groups), [groups]);
  const groupPicks = getCompleteGroupPicks(groups, draft);
  const thirdCandidates = groupPicks.map((pick) => pick.third);
  const championId = draft.picks.final[0];
  const champion = championId ? teamMap.get(championId) ?? null : null;
  const finalistId = getFinalist(draft);
  const finalist = finalistId ? teamMap.get(finalistId) ?? null : null;
  const semiFinalists = getSemiFinalists(draft)
    .map((id) => teamMap.get(id))
    .filter((team): team is BracketTeam => Boolean(team));
  const darkHorse = draft.darkHorseTeamId
    ? teamMap.get(draft.darkHorseTeamId) ?? null
    : null;
  const shareUrl =
    typeof window === "undefined"
      ? "https://www.worldcup2026coin.com/predictions/bracket-challenge"
      : draft.savedUrl
        ? `${window.location.origin}${draft.savedUrl}`
        : `${window.location.origin}/predictions/bracket-challenge`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `My WC26 World Cup 2026 bracket call:\n\n🏆 Champion: ${champion?.name ?? "TBD"}\n🥈 Finalist: ${finalist?.name ?? "TBD"}\n🔥 Dark horse: ${darkHorse?.name ?? "TBD"}\n\nBuild yours:`,
  )}&url=${encodeURIComponent(shareUrl)}`;

  useEffect(() => {
    window.localStorage.setItem(draftKey, JSON.stringify({ ...draft, savedUrl: null }));
  }, [draft]);

  useEffect(() => {
    const canvas = cardRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "#02030a";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#a3ff12";
    context.fillRect(0, 0, canvas.width, 18);
    context.fillStyle = "#ff2bd6";
    context.fillRect(0, canvas.height - 18, canvas.width, 18);
    context.fillStyle = "#ffffff";
    context.font = "900 54px Arial";
    context.fillText("My WC26 Bracket Call", 64, 120);
    context.font = "900 36px Arial";
    context.fillStyle = "#a3ff12";
    context.fillText(`Champion: ${champion?.name ?? "TBD"}`, 64, 230);
    context.fillStyle = "#ffffff";
    context.fillText(`Finalist: ${finalist?.name ?? "TBD"}`, 64, 300);
    context.fillText(`Dark Horse: ${darkHorse?.name ?? "TBD"}`, 64, 370);
    context.font = "800 28px Arial";
    context.fillStyle = "#cbd5e1";
    context.fillText("Semi-finalists", 64, 470);
    context.font = "900 34px Arial";
    semiFinalists.slice(0, 4).forEach((team, index) => {
      context.fillText(team.name, 64, 535 + index * 58);
    });
    context.font = "800 24px Arial";
    context.fillStyle = "#22d3ee";
    context.fillText("worldcup2026coin.com", 64, 1185);
    context.fillStyle = "#94a3b8";
    context.fillText("Fan-made prediction / unofficial / for fun", 64, 1230);
  }, [champion?.name, darkHorse?.name, finalist?.name, semiFinalists]);

  function updateGroupPick(groupName: string, rank: keyof GroupPick, teamId: string) {
    setDraft((current) => {
      const nextPick = { ...(current.groupPicks[groupName] ?? {}), groupName, [rank]: teamId };
      return {
        ...current,
        groupPicks: { ...current.groupPicks, [groupName]: nextPick },
        bestThirdTeamIds: [],
        round32Slots: [],
        locked: false,
        picks: emptyPicks,
        savedUrl: null,
      };
    });
  }

  function toggleThird(teamId: string) {
    setDraft((current) => {
      const selected = current.bestThirdTeamIds.includes(teamId);
      if (!selected && current.bestThirdTeamIds.length >= 8) return current;
      return {
        ...current,
        bestThirdTeamIds: selected
          ? current.bestThirdTeamIds.filter((id) => id !== teamId)
          : [...current.bestThirdTeamIds, teamId],
        round32Slots: [],
        locked: false,
        picks: emptyPicks,
        darkHorseTeamId:
          current.darkHorseTeamId === teamId ? null : current.darkHorseTeamId,
        savedUrl: null,
      };
    });
  }

  function generateRound32() {
    setDraft((current) => ({
      ...current,
      round32Slots: buildRound32Slots(groupPicks, current.bestThirdTeamIds),
      locked: false,
      picks: emptyPicks,
      step: 2,
      savedUrl: null,
    }));
  }

  function updateSlot(index: number, teamId: string) {
    setDraft((current) => ({
      ...current,
      round32Slots: current.round32Slots.map((slot, slotIndex) =>
        slotIndex === index ? teamId : slot,
      ),
      locked: false,
      picks: emptyPicks,
      savedUrl: null,
    }));
  }

  function pickWinner(round: KnockoutRound, index: number, teamId: string) {
    setDraft((current) => {
      const reset = nextRounds(round).reduce(
        (acc, nextRound) => ({ ...acc, [nextRound]: Array(roundSize(nextRound)).fill(null) }),
        {},
      );
      return {
        ...current,
        picks: {
          ...current.picks,
          [round]: current.picks[round].map((pick, pickIndex) =>
            pickIndex === index ? teamId : pick,
          ),
          ...reset,
        },
        step: 3,
        savedUrl: null,
      };
    });
  }

  function buildPayload(): BracketChallengeData | null {
    if (!championId) return null;

    return {
      version: 1,
      seedingModel: "fan",
      groupPicks,
      bestThirdTeamIds: draft.bestThirdTeamIds,
      round32Slots: draft.round32Slots,
      picks: draft.picks,
      championTeamId: championId,
      finalistTeamId: finalistId,
      semiFinalistTeamIds: getSemiFinalists(draft),
      darkHorseTeamId: draft.darkHorseTeamId,
      generatedAt: new Date().toISOString(),
    };
  }

  async function saveBracket() {
    setNotice("");

    if (!signedIn) {
      setNotice("Please sign in to save a public bracket. You can still build and download a card without logging in.");
      return;
    }

    const payload = buildPayload();
    if (!payload) {
      setNotice("Finish the knockout picks before saving.");
      return;
    }

    setSaving(true);
    const response = await fetch("/api/predictions/bracket-challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: draft.title,
        displayName: draft.displayName,
        isPublic: true,
        bracketData: payload,
      }),
    });
    const result = (await response.json().catch(() => null)) as {
      error?: string;
      url?: string;
    } | null;
    setSaving(false);

    if (!response.ok || !result?.url) {
      setNotice(result?.error ?? "Could not save bracket. Please try again.");
      return;
    }

    setDraft((current) => ({ ...current, savedUrl: result.url ?? null }));
    setNotice("Bracket saved. Your public share page is ready.");
  }

  function downloadCard() {
    const canvas = cardRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "wc26-bracket-call.png";
    link.click();
  }

  async function copyShareLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  }

  function clearDraft() {
    window.localStorage.removeItem(draftKey);
    setDraft(createInitialDraft());
    setNotice("Draft cleared.");
  }

  function renderActionButtons(compact = false) {
    const buttonClass = compact
      ? "w-full justify-center sm:w-auto"
      : "";

    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {signedIn ? (
          <button
            type="button"
            onClick={saveBracket}
            disabled={saving}
            className={`glow-button-primary disabled:cursor-not-allowed disabled:opacity-50 ${buttonClass}`}
          >
            {saving ? "Saving..." : "Save Bracket"}
          </button>
        ) : (
          <Link href="/auth/login" className={`glow-button-primary ${buttonClass}`}>
            Sign in to save
          </Link>
        )}
        <button
          type="button"
          onClick={downloadCard}
          className={`glow-button-secondary ${buttonClass}`}
        >
          Download Card
        </button>
        <a
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`glow-button-secondary text-center ${buttonClass}`}
        >
          Share on X
        </a>
        <button
          type="button"
          onClick={copyShareLink}
          className={`glow-button-secondary ${buttonClass}`}
        >
          {copied ? "Copied" : "Copy Link"}
        </button>
        <button
          type="button"
          onClick={clearDraft}
          className={`glow-button-secondary ${buttonClass}`}
        >
          Reset
        </button>
      </div>
    );
  }

  function renderBracketCompletePanel() {
    if (!champion) return null;

    return (
      <div
        ref={completePanelRef}
        className="rounded-[2rem] border border-lime-300/35 bg-lime-300/10 p-5 shadow-[0_0_42px_rgba(163,255,18,0.12)]"
      >
        <p className="neon-kicker">Bracket complete</p>
        <h2 className="mt-4 text-3xl font-black uppercase text-white">
          Bracket complete
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Your WC26 bracket is complete. Save it, download your card, or share
          your champion call.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <p className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4 text-base font-black text-white">
            Champion: {champion.name}
          </p>
          <p className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-base font-black text-cyan-100">
            Finalist: {finalist?.name ?? "TBD"}
          </p>
          {darkHorse ? (
            <p className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-4 text-sm font-bold text-fuchsia-100 md:col-span-2">
              Dark horse: {darkHorse.name}
            </p>
          ) : null}
          {semiFinalists.length ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-bold leading-6 text-slate-200 md:col-span-2">
              Semi-finalists:{" "}
              {semiFinalists.map((team) => team.name).join(" · ")}
            </p>
          ) : null}
        </div>

        {!signedIn ? (
          <p className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-bold leading-6 text-cyan-100">
            Sign in to save a public bracket link. You can still download or
            share your card without signing in.
          </p>
        ) : null}

        <div className="mt-6">
          {renderActionButtons(true)}
        </div>

        {draft.savedUrl ? (
          <a
            href={draft.savedUrl}
            className="mt-5 block text-sm font-black text-lime-200"
          >
            View public share page
          </a>
        ) : null}
        {notice ? (
          <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-slate-200">
            {notice}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
        <p className="neon-kicker">Free fan prediction game</p>
        <h1 className="neon-title glow-text mt-4 text-5xl font-black uppercase leading-[0.9] text-white sm:text-7xl">
          WC26 Bracket Challenge
        </h1>
        <p className="mt-5 max-w-4xl text-base font-semibold leading-7 text-slate-200">
          Pick your group qualifiers, build the knockouts and share your World
          Cup 2026 champion call.
        </p>
        <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-400">
          This is a fan-made prediction game for fun. It is unofficial and not
          affiliated with FIFA, World Cup, teams, players, sponsors or governing
          bodies. No wallet, token holding or prize promise.
        </p>
      </section>

      <nav className="grid gap-2 sm:grid-cols-5">
        {["Groups", "Third-place", "Round of 32", "Knockouts", "Share"].map(
          (label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setDraft((current) => ({ ...current, step: index }))}
              className={`rounded-2xl border px-3 py-3 text-xs font-black uppercase tracking-[0.12em] ${
                draft.step === index
                  ? "border-lime-300/60 bg-lime-300 text-slate-950"
                  : "border-white/10 bg-white/[0.04] text-slate-300"
              }`}
            >
              {label}
            </button>
          ),
        )}
      </nav>

      {draft.step === 0 ? (
        <section className="grid gap-5">
          {groups.map((group) => {
            const pick = draft.groupPicks[group.name] ?? {};
            const selected = new Set([pick.first, pick.second, pick.third].filter(Boolean));

            return (
              <article key={group.name} className="neon-panel rounded-[2rem] p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-black uppercase text-white">
                    {group.name}
                  </h2>
                  <span className="neon-badge">Top 2 + third-place candidate</span>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {(["first", "second", "third"] as const).map((rank) => (
                    <label key={rank} className="grid gap-2">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">
                        {rank === "first" ? "1st" : rank === "second" ? "2nd" : "3rd candidate"}
                      </span>
                      <select
                        value={String(pick[rank] ?? "")}
                        onChange={(event) =>
                          updateGroupPick(group.name, rank, event.target.value)
                        }
                        className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm font-bold text-white"
                      >
                        <option value="">Select team</option>
                        {group.teams.map((team) => (
                          <option
                            key={team.id}
                            value={team.id}
                            disabled={selected.has(team.id) && pick[rank] !== team.id}
                          >
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </article>
            );
          })}
        </section>
      ) : null}

      {draft.step === 1 ? (
        <section className="neon-panel rounded-[2rem] p-5">
          <p className="neon-kicker">Best third-placed teams</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-white">
            Choose your eight best third-placed teams
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Choose your eight best third-placed teams to complete the Round of
            32. Selected: {draft.bestThirdTeamIds.length}/8
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {thirdCandidates.map((teamId) => {
              const team = teamMap.get(teamId) ?? null;
              const selected = draft.bestThirdTeamIds.includes(teamId);
              return (
                <button
                  key={teamId}
                  type="button"
                  onClick={() => toggleThird(teamId)}
                  className={`rounded-2xl border p-4 text-left text-sm font-black ${
                    selected
                      ? "border-lime-300/60 bg-lime-300/15 text-lime-100"
                      : "border-white/10 bg-white/[0.04] text-white"
                  }`}
                >
                  <TeamName team={team} />
                </button>
              );
            })}
          </div>
          <button
            type="button"
            disabled={draft.bestThirdTeamIds.length !== 8}
            onClick={generateRound32}
            className="glow-button-primary mt-6 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate Round of 32
          </button>
        </section>
      ) : null}

      {draft.step === 2 ? (
        <section className="neon-panel rounded-[2rem] p-5">
          <p className="neon-kicker">Fan seeding layout</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-white">
            Round of 32 slots
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Fan seeding layout — final official knockout pairings may update
            once tournament rules/data are confirmed. You can edit slots before
            locking.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {Array.from({ length: 16 }, (_, matchIndex) => (
              <div
                key={matchIndex}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Match {matchIndex + 1}
                </p>
                {[0, 1].map((side) => {
                  const slotIndex = matchIndex * 2 + side;
                  return (
                    <select
                      key={slotIndex}
                      value={draft.round32Slots[slotIndex] ?? ""}
                      disabled={draft.locked}
                      onChange={(event) => updateSlot(slotIndex, event.target.value)}
                      className="mt-3 min-h-11 w-full rounded-2xl border border-white/10 bg-slate-950 px-3 text-sm font-bold text-white"
                    >
                      <option value="">Select team</option>
                      {draft.round32Slots.map((teamId) => {
                        const team = teamId ? teamMap.get(teamId) : null;
                        if (!team) return null;
                        const usedElsewhere = draft.round32Slots.some(
                          (id, index) => id === team.id && index !== slotIndex,
                        );
                        return (
                          <option
                            key={`${slotIndex}-${team.id}`}
                            value={team.id}
                            disabled={usedElsewhere}
                          >
                            {team.name}
                          </option>
                        );
                      })}
                    </select>
                  );
                })}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setDraft((current) => ({ ...current, locked: true, step: 3 }))
            }
            disabled={new Set(draft.round32Slots.filter(Boolean)).size !== 32}
            className="glow-button-primary mt-6 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Lock bracket
          </button>
        </section>
      ) : null}

      {draft.step === 3 ? (
        <section className="grid gap-6">
          {rounds.map((round) => (
            <div key={round.key} className="neon-panel rounded-[2rem] p-5">
              <h2 className="text-2xl font-black uppercase text-white">
                {round.label}
              </h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {getMatches(round.key, draft).map((match, index) => (
                  <article
                    key={`${round.key}-${index}`}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    {[match.teamAId, match.teamBId].map((teamId) => {
                      const team = teamId ? teamMap.get(teamId) ?? null : null;
                      const selected = Boolean(teamId && match.winnerId === teamId);
                      return (
                        <button
                          key={`${round.key}-${index}-${teamId ?? "tbd"}`}
                          type="button"
                          disabled={!teamId}
                          onClick={() => teamId && pickWinner(round.key, index, teamId)}
                          className={`mt-2 flex min-h-12 w-full items-center rounded-2xl border px-3 text-left text-sm font-black ${
                            selected
                              ? "border-lime-300/60 bg-lime-300/15 text-lime-100"
                              : "border-white/10 bg-white/[0.04] text-white"
                          }`}
                        >
                          <TeamName team={team} />
                        </button>
                      );
                    })}
                  </article>
                ))}
              </div>
            </div>
          ))}
          {championId ? renderBracketCompletePanel() : null}
        </section>
      ) : null}

      {draft.step === 4 ? (
        <section className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="neon-panel rounded-[2rem] p-5">
            <p className="neon-kicker">Share</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">
              Your bracket call
            </h2>
            <div className="mt-5 grid gap-3">
              <p className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4 text-lg font-black text-white">
                Champion: {champion?.name ?? "Finish the final"}
              </p>
              <p className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm font-bold text-cyan-100">
                Finalist: {finalist?.name ?? "TBD"}
              </p>
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-fuchsia-100">
                  Dark horse
                </span>
                <select
                  value={draft.darkHorseTeamId ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      darkHorseTeamId: event.target.value || null,
                      savedUrl: null,
                    }))
                  }
                  className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm font-bold text-white"
                >
                  <option value="">Select dark horse</option>
                  {draft.bestThirdTeamIds.map((teamId) => {
                    const team = teamMap.get(teamId);
                    return team ? (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ) : null;
                  })}
                </select>
              </label>
              <input
                value={draft.displayName}
                aria-label="Bracket display name"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    displayName: event.target.value,
                  }))
                }
                maxLength={32}
                placeholder="Display name"
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm font-bold text-white"
              />
              <input
                value={draft.title}
                aria-label="Bracket title"
                onChange={(event) =>
                  setDraft((current) => ({ ...current, title: event.target.value }))
                }
                maxLength={80}
                placeholder="Bracket title"
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm font-bold text-white"
              />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={saveBracket}
                disabled={saving}
                className="glow-button-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save bracket"}
              </button>
              <button type="button" onClick={downloadCard} className="glow-button-secondary">
                Download PNG
              </button>
              <a href={xShareUrl} target="_blank" rel="noopener noreferrer" className="glow-button-secondary text-center">
                Share on X
              </a>
              <a href="https://t.me/WC26HubChat" target="_blank" rel="noopener noreferrer" className="glow-button-secondary text-center">
                Telegram
              </a>
              <button type="button" onClick={copyShareLink} className="glow-button-secondary">
                {copied ? "Copied" : "Copy share link"}
              </button>
              <button type="button" onClick={clearDraft} className="glow-button-secondary">
                Clear draft
              </button>
            </div>
            {draft.savedUrl ? (
              <a href={draft.savedUrl} className="mt-5 block text-sm font-black text-lime-200">
                View public share page
              </a>
            ) : null}
            {notice ? (
              <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-slate-200">
                {notice}
              </p>
            ) : null}
          </div>
          <div className="neon-card rounded-[2rem] p-4">
            <canvas
              ref={cardRef}
              width={1080}
              height={1350}
              className="aspect-[4/5] h-auto w-full rounded-[1.5rem] border border-white/10 bg-slate-950"
            />
          </div>
        </section>
      ) : null}

      <section className="rounded-[2rem] border border-red-300/20 bg-red-400/10 p-5">
        <p className="text-sm font-bold leading-6 text-red-100/90">
          Free fan prediction game. No staking, no prize promise. $WC26 is a
          fan-made community layer and is not affiliated with FIFA, World Cup,
          teams, players, sponsors or governing bodies.
        </p>
      </section>
    </div>
  );
}
