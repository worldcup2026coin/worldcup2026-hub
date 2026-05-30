"use client";

import { useState } from "react";
import Link from "next/link";
import type { CommunityProfile } from "@/lib/community/types";

export function ChatComposer({
  profile,
  signedIn,
}: {
  profile: CommunityProfile | null;
  signedIn: boolean;
}) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!signedIn) {
    return (
      <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <h2 className="text-xl font-black uppercase text-white">
          Sign in to post
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Everyone can read the chat. Sign in to join the football debate.
        </p>
        <Link href="/auth/login" className="glow-button-primary mt-5">
          Sign in
        </Link>
      </div>
    );
  }

  if (profile?.status === "muted" || profile?.status === "banned") {
    return (
      <div className="rounded-[2rem] border border-fuchsia-300/25 bg-fuchsia-400/10 p-5">
        <h2 className="text-xl font-black uppercase text-white">
          Chat disabled
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Your account is {profile.status}. You can still read the public chat.
        </p>
      </div>
    );
  }

  const submitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setStatus(null);

    const response = await fetch("/api/community/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    setPending(false);
    if (!response.ok) {
      setStatus(payload?.error ?? "Message did not send.");
      return;
    }

    setMessage("");
    setStatus("Message sent. The chat refreshes automatically.");
  };

  return (
    <form
      onSubmit={submitMessage}
      className="rounded-[2rem] border border-lime-300/20 bg-lime-300/10 p-5"
    >
      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-lime-200">
          Message
        </span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={280}
          rows={4}
          placeholder="Drop a football-first matchday thought..."
          className="resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-lime-300/70"
        />
      </label>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-bold text-slate-400">
          {message.length}/280 · 5 messages per minute
        </p>
        <button
          type="submit"
          disabled={pending || message.trim().length === 0}
          className="glow-button-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Sending..." : "Send message"}
        </button>
      </div>

      {status ? (
        <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-slate-200">
          {status}
        </p>
      ) : null}
    </form>
  );
}
