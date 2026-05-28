import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import {
  OfficialLaunchLinks,
  Wc26RiskWarning,
} from "@/components/wc26/official-launch-links";
import { wc26Config } from "@/lib/wc26";

export const metadata: Metadata = {
  title: "How to Buy $WC26",
  description:
    "Beginner-friendly $WC26 buying guide with risk warnings and official-link safety notes.",
};

const checklist = [
  {
    title: "Start here only",
    text: "Use this website and the official launch page as your starting point.",
  },
  {
    title: "Confirm status is live",
    text: "Do not act on pre-launch rumors, reply links or screenshots.",
  },
  {
    title: "Copy contract here",
    text: "Copy the contract from this site once the official launch block is live.",
  },
  {
    title: "Open official pump.fun",
    text: "Use the official pump.fun link from this site, not search results or DMs.",
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
    title: "Save official links",
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

export default function HowToBuyPage() {
  return (
    <>
      <PageHeader
        eyebrow="How to buy"
        title="How to buy $WC26 safely"
        description="A beginner-friendly guide for checking official links, avoiding fake contracts and understanding the risks before touching any token."
        meta="Beginner guide · Official links only · High-risk crypto"
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
                Official launch page
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

        <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-400/10 p-6">
          <h2 className="text-2xl font-black uppercase text-white">
            High-risk warning
          </h2>
          <p className="mt-3 text-sm leading-6 text-red-100/90">
            {wc26Config.ticker} is not an investment product. No profit is promised
            or implied. Meme tokens are extremely volatile and can lose all value.
            Only participate if you understand the risk.
          </p>
        </section>
      </Container>
    </>
  );
}

