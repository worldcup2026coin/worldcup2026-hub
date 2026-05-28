"use client";

import Image from "next/image";
import { useState } from "react";
import type { CommunityMeme } from "@/lib/community/types";

const rejectReasons = [
  "official/copyright risk",
  "abusive/hateful",
  "adult/unsafe",
  "spam/scam",
  "low quality/off-topic",
];

export function ModerationMemeTable({ memes }: { memes: CommunityMeme[] }) {
  const [notice, setNotice] = useState<string | null>(null);

  const runAction = async (
    meme: CommunityMeme,
    action: "approve" | "reject" | "hide",
    reason?: string,
  ) => {
    const response = await fetch(`/api/admin/moderation/memes/${meme.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason }),
    });

    setNotice(response.ok ? "Moderation action saved." : "Action failed.");
  };

  return (
    <section className="neon-card rounded-[2rem] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="neon-kicker">Meme moderation</p>
          <h2 className="mt-3 text-3xl font-black uppercase text-white">
            Pending review
          </h2>
        </div>
        {notice ? <p className="text-sm font-bold text-lime-200">{notice}</p> : null}
      </div>

      {memes.length === 0 ? (
        <p className="mt-5 text-sm text-slate-300">No pending memes.</p>
      ) : (
        <div className="mt-5 grid gap-4">
          {memes.map((meme) => (
            <article
              key={meme.id}
              className="grid gap-4 rounded-3xl border border-white/10 bg-black/25 p-4 lg:grid-cols-[14rem_1fr]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/30">
                <Image
                  src={meme.image_url}
                  alt={meme.title}
                  fill
                  sizes="14rem"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-xl font-black uppercase text-white">
                      {meme.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {meme.caption ?? "No caption"}
                    </p>
                    <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                      By {meme.profile?.display_name ?? "WC26 fan"} · {meme.status}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => runAction(meme, "approve")}
                      className="rounded-xl border border-lime-300/25 bg-lime-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-lime-100"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => runAction(meme, "hide", "Hidden by moderation")}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-200"
                    >
                      Hide
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {rejectReasons.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => runAction(meme, "reject", reason)}
                      className="rounded-xl border border-fuchsia-300/25 bg-fuchsia-400/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-fuchsia-100"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
