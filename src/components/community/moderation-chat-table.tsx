"use client";

import { useState } from "react";
import type { CommunityChatMessage } from "@/lib/community/types";

export function ModerationChatTable({
  messages,
}: {
  messages: CommunityChatMessage[];
}) {
  const [notice, setNotice] = useState<string | null>(null);

  const runAction = async (
    message: CommunityChatMessage,
    action: "hide" | "flag" | "mute" | "ban",
  ) => {
    const response = await fetch(`/api/admin/moderation/chat/${message.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        userId: message.user_id,
        reason: action,
      }),
    });

    setNotice(response.ok ? "Moderation action saved." : "Action failed.");
  };

  return (
    <section className="neon-card rounded-[2rem] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="neon-kicker">Chat moderation</p>
          <h2 className="mt-3 text-3xl font-black uppercase text-white">
            Recent messages
          </h2>
        </div>
        {notice ? <p className="text-sm font-bold text-lime-200">{notice}</p> : null}
      </div>

      <div className="mt-5 grid gap-3">
        {messages.map((message) => (
          <article
            key={message.id}
            className="rounded-3xl border border-white/10 bg-black/25 p-4"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-black text-white">
                  {message.profile?.display_name ?? "WC26 fan"}
                  <span className="ml-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                    {message.status}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {message.message}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["hide", "flag", "mute", "ban"] as const).map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => runAction(message, action)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-200 transition hover:border-fuchsia-300/60 hover:text-fuchsia-100"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
