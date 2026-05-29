import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import {
  OfficialLaunchLinks,
  Wc26RiskWarning,
} from "@/components/wc26/official-launch-links";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "How to Buy $WC26",
  description:
    "Safer buying guide for $WC26. Verify the $WC26 contract here. Never trust DMs, screenshots or search results.",
  path: "/how-to-buy",
  image: "/og-wc26-launch.png",
});

const checklist = [
  {
    title: "Start here only",
    text: "Use this website and the verified $WC26 launch page as your starting point.",
  },
  {
    title: "Confirm status is live",
    text: "Do not act on pre-launch rumors, reply links or screenshots.",
  },
  {
    title: "Copy contract here",
    text: "Copy the contract from this site once the verified $WC26 launch block is live.",
  },
  {
    title: "Open verified pump.fun",
    text: "Use the verified pump.fun link from this site, not search results or DMs.",
  },
  {
    title: "Compare ticker and contract",
    text: "Check the ticker, contract and page details before confirming anything.",
  },
  {
    title: "Trade only what you can lose",
    text: "Meme tokens are volatile and can lose all value.",
  },
  {
    title: "Save verified links",
    text: "Bookmark the website, X and Telegram announcements before launch day noise hits.",
  },
  {
    title: "Watch for clones",
    text: "Ignore fake links, clone tokens, impersonators and replies claiming to be official.",
  },
  {
    title: "Never share your seed phrase",
    text: "No admin, support account or website should ever ask for your recovery phrase.",
  },
];

const buyingSteps = [
  {
    title: "Start from this website only",
    text: "Begin at https://www.worldcup2026coin.com/launch. Do not use random search results, DMs, screenshots, replies, quote tweets, fake Telegram admins or copied links from strangers.",
  },
  {
    title: "Confirm launch status is LIVE",
    text: "$WC26 is not live unless the launch block says LIVE and shows the contract plus the verified pump.fun link.",
  },
  {
    title: "Copy the verified contract",
    text: "Copy the contract address from this website. After pasting it anywhere, check the first and last characters before you continue.",
  },
  {
    title: "Open the verified pump.fun link",
    text: "Use the pump.fun button from this website. Compare the contract address on pump.fun with the contract shown here before connecting.",
  },
  {
    title: "Use a Solana wallet",
    text: "Phantom, Backpack and Solflare are common Solana wallet options. Your wallet needs SOL for the buy amount and network or platform fees.",
  },
  {
    title: "Connect carefully",
    text: "Connect only on the verified pump.fun page. Never share your seed phrase, recovery phrase or private key. No real admin will ever ask for it.",
  },
  {
    title: "Choose amount",
    text: "Start small if you are unsure and only use money you can afford to lose.",
  },
  {
    title: "Review before confirming",
    text: "Pause before approving the transaction and verify every detail.",
    checks: [
      "Token name: WorldCupCoin2026",
      "Ticker: $WC26",
      "Chain: Solana",
      "Contract matches the website",
      "You are on the verified pump.fun page",
      "You understand the SOL amount",
      "You understand transactions cannot be reversed",
    ],
  },
  {
    title: "Confirm in wallet",
    text: "Approve only if everything matches. If the transaction fails, do not panic-click repeated approvals.",
  },
  {
    title: "After buying",
    text: "Save verified links. Join Telegram announcements and chat. Use chart and Solscan links from the website once available. Do not trust DMs about support, bonus allocation, claim, airdrop, migration or wallet verification.",
  },
];

export default function HowToBuyPage() {
  return (
    <>
      <PageHeader
        eyebrow="How to buy"
        title="How to buy $WC26 safely"
        description="A beginner-friendly guide for checking verified $WC26 links, avoiding fake contracts and understanding the risks before touching any token."
        meta="Beginner guide · Verified $WC26 links only · High-risk crypto"
      />

      <Container className="pb-14">
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <div className="relative z-10">
            <p className="neon-kicker">Safety first · Do not ape blind</p>
            <h1 className="neon-title glow-text mt-4 text-5xl font-black leading-[0.86] text-white sm:text-7xl">
              CHECK $WC26 SAFELY
            </h1>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-200">
              $WC26 is a fan-made meme token community. This guide exists to reduce
              beginner mistakes: fake contracts, wrong links, rushed buys and
              over-risking.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/launch" className="glow-button-primary">
                Verified $WC26 launch page
              </Link>
              <Link href="/wc26" className="glow-button-secondary">
                Back to $WC26
              </Link>
            </div>
            <div className="mt-5">
              <Wc26RiskWarning />
            </div>
          </div>
        </section>

        <div className="mt-8">
          <OfficialLaunchLinks />
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {checklist.map((step, index) => (
            <div key={step.title} className="neon-card rounded-[2rem] p-6">
              <p className="neon-badge neon-badge-cyan">Check {index + 1}</p>
              <h2 className="mt-4 text-2xl font-black uppercase text-white">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {step.text}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-fuchsia-300/30 bg-fuchsia-400/10 p-6 shadow-[0_0_30px_rgba(217,70,239,0.12)] sm:p-8">
          <p className="neon-badge neon-badge-pink">Scam warning</p>
          <h2 className="mt-4 text-2xl font-black uppercase text-white">
            Clones move fast
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-fuchsia-100/90">
            Scammers copy meme coins fast. Do not buy from replies, DMs,
            random Telegram posts, screenshots or lookalike links. Only use the
            contract and pump.fun link published on this website.
          </p>
        </section>

        <section className="mt-8 rounded-[2.5rem] border border-lime-300/20 bg-slate-950/70 p-6 sm:p-8">
          <div className="max-w-4xl">
            <p className="neon-kicker">Beginner Solana guide</p>
            <h2 className="mt-3 text-3xl font-black uppercase text-white sm:text-4xl">
              How to buy $WC26 when live
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Use this flow only after the verified $WC26 launch status says LIVE. If
              the contract or pump.fun link is still marked as coming at launch,
              there is nothing verified to buy yet.
            </p>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {buyingSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lime-300/40 bg-lime-300/10 text-sm font-black text-lime-100">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-black uppercase text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {step.text}
                    </p>
                    {step.checks ? (
                      <ul className="mt-4 grid gap-2 text-sm text-slate-200">
                        {step.checks.map((check) => (
                          <li
                            key={check}
                            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                          >
                            {check}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-400/10 p-6">
          <h2 className="text-2xl font-black uppercase text-white">
            High-risk warning
          </h2>
          <p className="mt-3 text-sm leading-6 text-red-100/90">
            $WC26 is fan-made and unofficial. It is not affiliated with FIFA,
            the FIFA World Cup, teams, players, sponsors or governing bodies.
            Crypto-assets are high risk. You could lose all money you put in.
            Nothing here is financial advice.
          </p>
        </section>
      </Container>
    </>
  );
}

