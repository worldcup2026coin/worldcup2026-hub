"use client";

import { useMemo, useState } from "react";
import type { PollWithResults } from "@/lib/data/community";
import { PollResults } from "@/components/community/poll-results";

type PollCardProps = {
  poll: PollWithResults;
  source: string;
};

function getAnonymousId() {
  const key = "wc26_anon_id";

  try {
    const existing = window.localStorage.getItem(key);

    if (existing) {
      return existing;
    }

    const created =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    window.localStorage.setItem(key, created);
    return created;
  } catch {
    return "anonymous-fallback";
  }
}

export function PollCard({ poll, source }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [currentPoll, setCurrentPoll] = useState(poll);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [message, setMessage] = useState("");

  const canVote = useMemo(
    () => currentPoll.parsedOptions.length > 0 && !hasVoted,
    [currentPoll.parsedOptions.length, hasVoted]
  );

  async function submitVote() {
    if (!selectedOption || isVoting) {
      return;
    }

    setIsVoting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/community/polls/${currentPoll.id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionId: selectedOption,
          anonymousId: getAnonymousId(),
          source,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== "ok") {
        setMessage(data.error ?? "Unable to record vote.");
        return;
      }

      setCurrentPoll(data.poll);
      setHasVoted(true);
      setMessage(data.alreadyVoted ? "Vote already recorded." : "Vote recorded.");
    } catch {
      setMessage("Unable to record vote right now.");
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
        Fan poll
      </p>

      <h3 className="mt-3 text-xl font-black text-white">{currentPoll.title}</h3>

      {currentPoll.description ? (
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {currentPoll.description}
        </p>
      ) : null}

      {currentPoll.parsedOptions.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.04] p-4 text-sm text-slate-300">
          No poll options available yet.
        </div>
      ) : hasVoted ? (
        <div className="mt-5">
          <PollResults
            results={currentPoll.results}
            totalVotes={currentPoll.totalVotes}
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {currentPoll.parsedOptions.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                selectedOption === option.id
                  ? "border-emerald-400 bg-emerald-400/10 text-emerald-100"
                  : "border-white/10 bg-white/[0.04] text-white hover:bg-white/10"
              }`}
            >
              <input
                type="radio"
                name={`poll-${currentPoll.id}`}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                className="accent-emerald-400"
              />
              {option.label}
            </label>
          ))}

          <button
            type="button"
            onClick={submitVote}
            disabled={!selectedOption || !canVote || isVoting}
            className="min-h-11 rounded-2xl bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isVoting ? "Recording..." : "Vote"}
          </button>
        </div>
      )}

      {message ? <p className="mt-3 text-xs text-slate-400">{message}</p> : null}
    </article>
  );
}
