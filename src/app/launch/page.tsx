import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import {
  LaunchMechanicsPanel,
  OfficialLaunchLinks,
  Wc26RiskWarning,
} from "@/components/wc26/official-launch-links";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "$WC26 Launch",
  description:
    "Official $WC26 launch status page. Contract address and pump.fun link published here at launch. Crypto-assets are high risk.",
  path: "/launch",
  image: "/og-wc26-launch.png",
});

const launchSteps = [
  "Confirm the contract only from this website.",
  "Use the official pump.fun link once published.",
  "Join the official community channels from this page.",
  "Ignore fake contracts, impersonators and private messages.",
];

export default function LaunchPage() {
  const first72Missions = [
    {
      title: "Post your launch meme",
      copy: "Create a WC26 meme and tag @WC26_Hub.",
      href: "/community/meme-generator",
      label: "Create your launch meme",
    },
    {
      title: "Vote in the first fan poll",
      copy: "Pick which country owns the opening week.",
      href: "/fan-polls",
      label: "Vote in fan polls",
    },
    {
      title: "Pick your bracket call",
      copy: "Share your WC26 champion before tournament chaos takes over.",
      href: "/predictions/bracket-challenge",
      label: "Build bracket",
    },
    {
      title: "Join Telegram chat",
      copy: "Jump into the community chat for matchday signal.",
      href: "https://t.me/WC26HubChat",
      label: "Join Telegram chat",
      external: true,
    },
    {
      title: "Follow announcements",
      copy: "Use the announcements channel for official launch updates.",
      href: "https://t.me/WC26Hub",
      label: "Open announcements",
      external: true,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Launch"
        title="$WC26 launch status"
        description="The official launch checkpoint for $WC26 links, contract details, community missions and safety warnings."
        meta="Official links only · Beware fake contracts · High-risk crypto"
      />

      <Container className="pb-14">
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="neon-kicker">Launch control</p>
              <h1 className="neon-title glow-text mt-4 text-5xl font-black leading-[0.86] text-white sm:text-7xl">
                $WC26 LAUNCH HUB
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-200">
                Use this page as the single source of truth for $WC26 launch links.
                Contract details and trading links should only be trusted when
                they are published here.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/wc26" className="glow-button-primary">
                  View $WC26
                </Link>
                <Link href="/how-to-buy" className="glow-button-secondary">
                  How to buy
                </Link>
                <Link href="/community" className="glow-button-secondary">
                  Community
                </Link>
              </div>
              <div className="mt-5">
                <Wc26RiskWarning />
              </div>
            </div>

            <OfficialLaunchLinks />
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <LaunchMechanicsPanel />

          <div className="neon-panel rounded-[2rem] p-6">
            <p className="neon-kicker">Launch checklist</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">
              Before buying
            </h2>
            <div className="mt-5 grid gap-3">
              {launchSteps.map((step) => (
                <div
                  key={step}
                  className="rounded-2xl border border-lime-300/15 bg-lime-300/10 p-4 text-sm font-bold leading-6 text-slate-200"
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="neon-panel rounded-[2rem] p-6">
            <p className="neon-kicker">Community mission</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">
              First 72 hours
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The launch mission is simple: keep one official link hub, push daily
              memes, run fan polls, protect newcomers from fake links and turn
              football moments into shareable $WC26 content.
            </p>
            <div className="mt-5 grid gap-3">
              {first72Missions.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="rounded-2xl border border-fuchsia-300/15 bg-fuchsia-400/10 p-4 text-sm font-black uppercase tracking-[0.08em] text-white"
                >
                  <span className="block">{item.title}</span>
                  <span className="mt-2 block text-xs normal-case leading-5 tracking-normal text-slate-300">
                    {item.copy}
                  </span>
                  <span className="mt-3 block text-xs text-lime-200">
                    {item.label} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-red-300/20 bg-red-400/10 p-6">
          <h2 className="text-2xl font-black uppercase text-white">
            Risk warning
          </h2>
          <p className="mt-3 text-sm leading-6 text-red-100/90">
            $WC26 is a high-risk meme token community. It is not an investment
            product, no profit is promised, and crypto tokens can lose all value.
            Only participate if you understand the risks.
          </p>
        </section>
      </Container>
    </>
  );
}

