"use client";

import { useState } from "react";

type MatchShareButtonsProps = {
  shareText: string;
  shareUrl: string;
};

export function MatchShareButtons({
  shareText,
  shareUrl,
}: MatchShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
        Share match
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={xShareUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-slate-200"
        >
          Share on X
        </a>

        <button
          type="button"
          onClick={copyLink}
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </section>
  );
}
