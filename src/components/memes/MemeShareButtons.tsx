"use client";

import { useState } from "react";
import { DEFAULT_MEME_SHARE_TEXT } from "@/lib/memes/constants";

type Props = {
  title: string;
  url: string;
  externalUrl?: string | null;
  shareText?: string;
};

export function MemeShareButtons({
  title,
  url,
  externalUrl,
  shareText = DEFAULT_MEME_SHARE_TEXT,
}: Props) {
  const [copied, setCopied] = useState(false);

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${shareText} ${title}`
  )}&url=${encodeURIComponent(url)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={xShareUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:border-white/35 hover:bg-white/10"
      >
        Share on X
      </a>

      <button
        type="button"
        onClick={copyLink}
        className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:border-white/35 hover:bg-white/10"
      >
        {copied ? "Copied" : "Copy link"}
      </button>

      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:border-white/35 hover:bg-white/10"
        >
          View source
        </a>
      ) : null}
    </div>
  );
}
