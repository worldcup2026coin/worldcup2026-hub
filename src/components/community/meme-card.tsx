"use client";

import Image from "next/image";
import { useState } from "react";
import type { CommunityMeme } from "@/lib/community/types";

export function MemeCard({
  meme,
  signedIn,
  showStatus = false,
}: {
  meme: CommunityMeme;
  signedIn: boolean;
  showStatus?: boolean;
}) {
  const [upvotes, setUpvotes] = useState(meme.upvotes_count);
  const [voted, setVoted] = useState(Boolean(meme.viewer_has_upvoted));
  const [notice, setNotice] = useState<string | null>(null);

  const upvote = async () => {
    if (!signedIn) {
      setNotice("Sign in to upvote.");
      return;
    }

    const response = await fetch(`/api/community/memes/${meme.id}/vote`, {
      method: "POST",
    });
    const payload = (await response.json().catch(() => null)) as {
      upvotes?: number;
      error?: string;
    } | null;

    if (!response.ok) {
      setNotice(payload?.error ?? "Upvote failed.");
      return;
    }

    setVoted(true);
    setUpvotes(payload?.upvotes ?? upvotes);
    setNotice("Upvote locked.");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/community/memes`);
    setNotice("Meme wall link copied.");
  };

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045]">
      <div className="relative aspect-[4/3] bg-black/30">
        <Image
          src={meme.image_url}
          alt={meme.title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black uppercase text-white">{meme.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {meme.caption ?? "Fan-made WC26 meme."}
            </p>
          </div>
          {showStatus ? (
            <span className="rounded-full border border-lime-300/25 bg-lime-300/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-lime-100">
              {meme.status}
            </span>
          ) : null}
        </div>

        <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
          By {meme.profile?.display_name ?? "WC26 fan"}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={upvote}
            disabled={voted}
            className="rounded-xl border border-lime-300/25 bg-lime-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-lime-100 transition hover:border-lime-300/70 disabled:opacity-60"
          >
            {upvotes} upvotes
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `${meme.title} on WC26 Meme Wall`,
            )}&url=${encodeURIComponent("/community/memes")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-300/70"
          >
            Share to X
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-200 transition hover:border-white/30"
          >
            Copy link
          </button>
        </div>

        {notice ? (
          <p className="mt-4 text-sm font-semibold text-slate-300">{notice}</p>
        ) : null}
      </div>
    </article>
  );
}
