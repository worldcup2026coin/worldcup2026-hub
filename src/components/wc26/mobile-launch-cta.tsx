"use client";

import Link from "next/link";
import { useState } from "react";
import { wc26Config } from "@/lib/wc26";

export function MobileLaunchCta() {
  const [copied, setCopied] = useState(false);

  const copyContract = async () => {
    if (!wc26Config.contractAddress) return;
    await navigator.clipboard.writeText(wc26Config.contractAddress);
    setCopied(true);
  };

  if (wc26Config.isLive) {
    return (
      <div
        data-mobile-launch-cta
        className="fixed inset-x-0 bottom-0 z-40 border-t border-lime-300/20 bg-slate-950/95 px-3 py-2 shadow-[0_-12px_34px_rgba(0,0,0,0.35)] backdrop-blur md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          <a
            href={wc26Config.pumpFunUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-lime-300 px-2 py-3 text-center text-[0.68rem] font-black uppercase tracking-[0.08em] text-slate-950"
          >
            Official Link
          </a>
          <button
            type="button"
            onClick={copyContract}
            className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-2 py-3 text-[0.68rem] font-black uppercase tracking-[0.08em] text-cyan-100"
          >
            {copied ? "Copied" : "Contract"}
          </button>
          <a
            href={wc26Config.telegramChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-fuchsia-300/25 bg-fuchsia-400/10 px-2 py-3 text-center text-[0.68rem] font-black uppercase tracking-[0.08em] text-fuchsia-100"
          >
            Chat
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      data-mobile-launch-cta
      className="fixed inset-x-0 bottom-0 z-40 border-t border-lime-300/20 bg-slate-950/95 px-3 py-2 shadow-[0_-12px_34px_rgba(0,0,0,0.35)] backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <Link
          href="/wc26"
          className="rounded-2xl bg-lime-300 px-2 py-3 text-center text-[0.68rem] font-black uppercase tracking-[0.08em] text-slate-950"
        >
          $WC26
        </Link>
        <Link
          href="/predictions"
          className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-2 py-3 text-center text-[0.68rem] font-black uppercase tracking-[0.08em] text-cyan-100"
        >
          Predictions
        </Link>
        <Link
          href="/how-to-buy"
          className="rounded-2xl border border-fuchsia-300/25 bg-fuchsia-400/10 px-2 py-3 text-center text-[0.68rem] font-black uppercase tracking-[0.08em] text-fuchsia-100"
        >
          How to Buy
        </Link>
      </div>
    </div>
  );
}
