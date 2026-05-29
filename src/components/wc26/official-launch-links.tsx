"use client";

import { useState } from "react";
import {
  formatLaunchStatus,
  isExternalLinkReady,
  wc26Config,
} from "@/lib/wc26";

type OfficialLaunchLinksProps = {
  compact?: boolean;
};

const riskCopy =
  "Crypto-assets are high risk. You could lose all money you put in. Nothing on this site is financial advice.";

export function OfficialLaunchLinks({ compact = false }: OfficialLaunchLinksProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle"
  );
  const isLive = wc26Config.isLive;
  const contract = wc26Config.contractAddress || "Coming at launch";
  const pumpReady = isExternalLinkReady(wc26Config.pumpFunUrl);
  const chartReady = isExternalLinkReady(wc26Config.links.chart);
  const solscanReady = isExternalLinkReady(wc26Config.links.solscan);

  const copyContract = async () => {
    if (!isLive || !wc26Config.contractAddress || !navigator.clipboard) {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(wc26Config.contractAddress);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }

    window.setTimeout(() => setCopyStatus("idle"), 2000);
  };

  return (
    <section
      className={`rounded-[2rem] border border-lime-300/20 bg-lime-300/10 ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="neon-kicker">Verified $WC26 launch links</p>
          <h2 className="mt-3 text-2xl font-black uppercase text-white sm:text-3xl">
            Status: {formatLaunchStatus(wc26Config.launchStatus)}
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
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Blockchain", "Solana"],
            ["Launch platform", "Official launch page"],
            ["Launch model", "Public launch / no early sale"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-slate-400">
                {label}
              </p>
              <p className="mt-2 text-sm font-black text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">
            Verified $WC26 contract
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
              {copyStatus === "copied"
                ? "Copied"
                : copyStatus === "failed"
                  ? "Copy failed — select manually"
                  : "Copy contract"}
            </button>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-slate-400">
              Chart
            </p>
            {chartReady ? (
              <a
                href={wc26Config.links.chart}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-black text-lime-200 transition hover:text-white"
              >
                View Chart
              </a>
            ) : (
              <p className="mt-2 text-sm font-black text-white">
                Available after launch
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-slate-400">
              Solscan
            </p>
            {solscanReady ? (
              <a
                href={wc26Config.links.solscan}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-black text-lime-200 transition hover:text-white"
              >
                View on Solscan
              </a>
            ) : (
              <p className="mt-2 text-sm font-black text-white">
                Available after launch
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {pumpReady ? (
            <a
              href={wc26Config.pumpFunUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-button-primary text-center"
            >
              Verified launch link
            </a>
          ) : (
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-center text-sm font-black uppercase tracking-[0.12em] text-cyan-100">
              Verified $WC26 link: Coming at launch
            </div>
          )}
          <a
            href={wc26Config.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-button-secondary text-center"
          >
            X
          </a>
          <a
            href={wc26Config.telegramChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-button-secondary text-center"
          >
            Telegram announcements
          </a>
          <a
            href={wc26Config.telegramChatUrl}
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

export function LaunchMechanicsPanel() {
  return (
    <section className="neon-panel rounded-[2rem] p-6">
      <p className="neon-kicker">Launch mechanics</p>
      <h2 className="mt-4 text-3xl font-black uppercase text-white">
        Public launch, verified $WC26 links only
      </h2>
      <p className="mt-4 text-sm leading-6 text-slate-300">
        $WC26 is planned as a public Solana launch with no early sale.
        The verified $WC26 contract address, official launch link, chart link and Solscan
        link will be published on this website, X and Telegram announcements at
        launch. Always verify the contract before interacting with any token.
      </p>
      <p className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-bold leading-6 text-cyan-100">
        Chart and liquidity information will update after launch.
      </p>
    </section>
  );
}
