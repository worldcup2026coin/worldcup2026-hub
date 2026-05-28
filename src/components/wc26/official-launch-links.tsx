"use client";

import { useState } from "react";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { isExternalLinkReady, wc26Config } from "@/lib/wc26";

type OfficialLaunchLinksProps = {
  compact?: boolean;
};

const riskCopy =
  "Crypto-assets are high risk. You could lose all money you put in. Nothing on this site is financial advice.";

export function OfficialLaunchLinks({ compact = false }: OfficialLaunchLinksProps) {
  const [copied, setCopied] = useState(false);
  const isLive = wc26Config.isLive;
  const contract = wc26Config.contractAddress;
  const pumpReady = isExternalLinkReady(wc26Config.links.pumpFun);

  const copyContract = async () => {
    if (!isLive) return;
    await navigator.clipboard.writeText(contract);
    setCopied(true);
  };

  return (
    <section
      className={`rounded-[2rem] border border-lime-300/20 bg-lime-300/10 ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="neon-kicker">Official launch links</p>
          <h2 className="mt-3 text-2xl font-black uppercase text-white sm:text-3xl">
            Status: {wc26Config.launchStatus}
          </h2>
        </div>
        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${
            isLive
              ? "border-lime-300/40 bg-lime-300/15 text-lime-100"
              : "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
          }`}
        >
          {isLive ? "Live" : "Pre-launch"}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">
            Official contract
          </p>
          <p className="mt-2 break-all text-sm font-black text-white">
            {contract}
          </p>
          {isLive ? (
            <button
              type="button"
              onClick={copyContract}
              className="mt-3 rounded-xl border border-lime-300/30 bg-lime-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-lime-100"
            >
              {copied ? "Copied" : "Copy contract"}
            </button>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {pumpReady ? (
            <a
              href={wc26Config.links.pumpFun}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-button-primary text-center"
            >
              Official pump.fun
            </a>
          ) : (
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-center text-sm font-black uppercase tracking-[0.12em] text-cyan-100">
              Official pump.fun: Coming at launch
            </div>
          )}
          <a
            href={SOCIAL_LINKS.x}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-button-secondary text-center"
          >
            X
          </a>
          <a
            href={SOCIAL_LINKS.telegramChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-button-secondary text-center"
          >
            Telegram announcements
          </a>
          <a
            href={SOCIAL_LINKS.telegramChat}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-button-secondary text-center"
          >
            Telegram chat
          </a>
        </div>
      </div>

      <p className="mt-5 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-bold leading-6 text-red-100/90">
        {riskCopy}
      </p>
      <p className="mt-3 text-xs font-bold leading-5 text-slate-400">
        Only trust links published on this website, X, and Telegram
        announcements.
      </p>
    </section>
  );
}

export function Wc26RiskWarning() {
  return (
    <p className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-bold leading-6 text-red-100/90">
      {riskCopy}
    </p>
  );
}
