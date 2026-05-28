"use client";

import { useEffect, useState } from "react";
import type { CommunityChatMessage } from "@/lib/community/types";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export function ChatMessageList({
  initialMessages,
}: {
  initialMessages: CommunityChatMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    const loadMessages = async () => {
      const response = await fetch("/api/community/chat", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as {
        messages?: CommunityChatMessage[];
      } | null;

      if (response.ok && payload?.messages) {
        setMessages(payload.messages);
      }
    };

    const timer = window.setInterval(loadMessages, 12_000);
    return () => window.clearInterval(timer);
  }, []);

  if (messages.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.035] p-8 text-center">
        <h2 className="text-2xl font-black uppercase text-white">
          No messages yet
        </h2>
        <p className="mt-2 text-sm font-semibold text-slate-300">
          Start the fan signal.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {messages.map((message) => (
        <article
          key={message.id}
          className="rounded-3xl border border-white/10 bg-white/[0.045] p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-black text-white">
              {message.profile?.display_name ?? "WC26 fan"}
              {message.profile?.handle ? (
                <span className="ml-2 text-xs font-bold text-cyan-200">
                  @{message.profile.handle}
                </span>
              ) : null}
            </p>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
              {formatTime(message.created_at)}
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-200">{message.message}</p>
        </article>
      ))}
    </div>
  );
}
