import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import { wc26Config } from "@/lib/wc26";
import { MascotShowcase } from "@/components/wc26/mascot-showcase";
import { StickerPackSection } from "@/components/wc26/sticker-pack-section";
import {
  LaunchMechanicsPanel,
  OfficialLaunchLinks,
  Wc26RiskWarning,
} from "@/components/wc26/official-launch-links";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "$WC26 Community",
  description:
    "$WC26 is the fan-made football meme community layer for World Cup 2026 — memes, fan chaos, launch alerts and matchday signal.",
  path: "/wc26",
  image: "/og-wc26.png",
});

const pillars = [
  {
    title: "Matchday memes",
    text: "Daily football chaos, fan reactions, VAR drama, upsets and tournament moments turned into shareable meme fuel.",
  },
  {
    title: "Fan battles",
    text: "Country-vs-country polls, community debates, rival banter and social prompts built around the 48-team tournament cycle.",
  },
  {
    title: "Launch coordination",
    text: "One verified $WC26 place for launch status, contract details, community links and high-risk token warnings.",
  },
];

export default function $WC26Page() {
  return (
    <>
      <PageHeader
        eyebrow="$WC26"
        title="$WC26 football meme community"
        description={wc26Config.description}
        meta="Fan-made · Unofficial · High-risk crypto"
      />

      <Container className="pb-14">
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="neon-kicker">World Cup chaos layer</p>
              <h1 className="neon-title glow-text mt-4 text-5xl font-black leading-[0.86] text-white sm:text-7xl">
                FOOTBALL. MEMES. $WC26.
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-200">
                $WC26 is the fan-made community layer for the 2026 football cycle:
                memes, predictions, fan battles, launch alerts and matchday energy
                in one place.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/launch" className="glow-button-primary">
                  Launch status
                </Link>
                <Link href="/how-to-buy" className="glow-button-secondary">
                  How to buy
                </Link>
                <Link href="/community" className="glow-button-secondary">
                  Join community
                </Link>
                <Link
                  href="/community/meme-generator"
                  className="glow-button-secondary"
                >
                  Create your launch meme
                </Link>
              </div>

              <div className="mt-5">
                <Wc26RiskWarning />
              </div>

              <p className="mt-5 max-w-3xl text-xs font-semibold leading-5 text-slate-400">
                $WC26 is unofficial and not affiliated with FIFA, World Cup, national
                teams, players, sponsors or governing bodies. Crypto tokens are
                volatile and high risk. No profit is promised or implied.
              </p>
            </div>

            <OfficialLaunchLinks />
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="neon-card rounded-[2rem] p-6">
              <p className="neon-kicker">$WC26 pillar</p>
              <h2 className="mt-4 text-2xl font-black uppercase text-white">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {pillar.text}
              </p>
            </div>
          ))}
        </section>

        <div className="mt-8">
          <LaunchMechanicsPanel />
        </div>

        <section className="neon-panel mt-8 rounded-[2rem] p-6">
          <p className="neon-kicker">Community missions</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-white">
            What the community does
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Post matchday memes",
              "Vote in fan polls",
              "Share country banter",
              "Track launch links",
              "Join daily missions",
              "React to upsets",
              "Predict chaos matches",
              "Protect against fake links",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-fuchsia-300/15 bg-fuchsia-400/10 p-4 text-sm font-black uppercase tracking-[0.08em] text-white"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
        <StickerPackSection />
        <MascotShowcase />
      </Container>
    </>
  );
}


