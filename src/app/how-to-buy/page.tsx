import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import { wc26Config } from "@/lib/wc26";

export const metadata: Metadata = {
  title: "How to Buy $WC26",
  description:
    "Beginner-friendly $WC26 buying guide with risk warnings and official-link safety notes.",
};

const steps = [
  {
    title: "Use official links only",
    text: "Start from the $WC26 launch page and never trust contract addresses sent by strangers or posted in replies.",
  },
  {
    title: "Set up a Solana wallet",
    text: "Use a wallet you control, keep your recovery phrase private and never share private keys with anyone.",
  },
  {
    title: "Fund carefully",
    text: "Only use money you can afford to lose. Meme tokens are volatile and can go to zero.",
  },
  {
    title: "Check before confirming",
    text: "Confirm ticker, contract, link source and transaction details before buying.",
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
            <p className="neon-kicker">Safety first</p>
            <h1 className="neon-title glow-text mt-4 text-5xl font-black leading-[0.86] text-white sm:text-7xl">
              DO NOT APE BLIND
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
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {steps.map((step, index) => (
            <div key={step.title} className="neon-card rounded-[2rem] p-6">
              <p className="neon-badge neon-badge-cyan">Step {index + 1}</p>
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

