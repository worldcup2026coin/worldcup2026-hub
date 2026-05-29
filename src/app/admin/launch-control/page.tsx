import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { isCommunityAdmin } from "@/lib/community/data";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WC26 Launch Control",
  robots: {
    index: false,
    follow: false,
  },
};

type EnvStatus = {
  label: string;
  value: string;
  isSet: boolean;
};

const websiteUrl = "https://www.worldcup2026coin.com";

const publicEnvItems: EnvStatus[] = [
  {
    label: "NEXT_PUBLIC_WC26_LAUNCH_STATUS",
    value: process.env.NEXT_PUBLIC_WC26_LAUNCH_STATUS || "missing",
    isSet: Boolean(process.env.NEXT_PUBLIC_WC26_LAUNCH_STATUS),
  },
  {
    label: "NEXT_PUBLIC_WC26_CONTRACT_ADDRESS",
    value: process.env.NEXT_PUBLIC_WC26_CONTRACT_ADDRESS || "missing",
    isSet: Boolean(process.env.NEXT_PUBLIC_WC26_CONTRACT_ADDRESS),
  },
  {
    label: "NEXT_PUBLIC_WC26_PUMP_FUN_URL",
    value: process.env.NEXT_PUBLIC_WC26_PUMP_FUN_URL || "missing",
    isSet: Boolean(process.env.NEXT_PUBLIC_WC26_PUMP_FUN_URL),
  },
  {
    label: "NEXT_PUBLIC_WC26_DEXSCREENER_URL",
    value: process.env.NEXT_PUBLIC_WC26_DEXSCREENER_URL || "missing",
    isSet: Boolean(process.env.NEXT_PUBLIC_WC26_DEXSCREENER_URL),
  },
  {
    label: "NEXT_PUBLIC_WC26_SOLSCAN_URL",
    value: process.env.NEXT_PUBLIC_WC26_SOLSCAN_URL || "missing",
    isSet: Boolean(process.env.NEXT_PUBLIC_WC26_SOLSCAN_URL),
  },
];

const officialLinks = [
  ["Website", websiteUrl],
  ["Launch page", "/launch"],
  ["How to buy", "/how-to-buy"],
  ["WC26 page", "/wc26"],
  ["X", SOCIAL_LINKS.x],
  ["Telegram announcements", SOCIAL_LINKS.telegramChannel],
  ["Telegram chat", SOCIAL_LINKS.telegramChat],
  ["Bracket challenge", "/predictions/bracket-challenge"],
  ["Meme generator", "/community/meme-generator"],
];

const preLaunchChecklist = [
  "Confirm website is in pre-launch mode",
  "Confirm /launch says Pre-launch",
  "Confirm /how-to-buy has no fake contract",
  "Confirm X profile is ready",
  "Confirm Telegram announcements channel is ready",
  "Confirm Telegram chat rules are pinned",
  "Confirm admin account works",
  "Confirm data health is OK",
  "Confirm mobile sticky CTA does not overlap interactive pages",
  "Confirm only official links are posted",
];

const launchSteps = [
  "Create token on pump.fun.",
  "Copy exact contract address.",
  "Copy exact pump.fun URL.",
  "Set Vercel env vars: NEXT_PUBLIC_WC26_LAUNCH_STATUS=live, NEXT_PUBLIC_WC26_CONTRACT_ADDRESS=REAL_CONTRACT, NEXT_PUBLIC_WC26_PUMP_FUN_URL=REAL_PUMP_FUN_URL, NEXT_PUBLIC_WC26_DEXSCREENER_URL=REAL_DEXSCREENER_URL when available, NEXT_PUBLIC_WC26_SOLSCAN_URL=REAL_SOLSCAN_URL when available.",
  "Redeploy production.",
  "Check /launch, /wc26, /how-to-buy.",
  "Confirm contract copy button works.",
  "Post same contract and links on X.",
  "Post same contract and links in Telegram announcements.",
  "Pin the Telegram announcement.",
  "Watch for fake links and warn users.",
];

const postLaunchChecks = [
  "/launch shows LIVE",
  "Contract appears",
  "pump.fun link works",
  "Chart link appears when set",
  "Solscan link appears when set",
  "X post matches website contract exactly",
  "Telegram announcement matches website contract exactly",
  "No old Coming at launch text where live links should appear",
  "No # links",
  "Mobile page still works",
];

const emergencyNotes = [
  "Never post a contract until it matches the website.",
  "Never share contract from screenshots only.",
  "If wrong contract is posted, delete immediately and post correction from website.",
  "Beware fake Telegram admins and fake X replies.",
  "Only official launch source is the website + @WC26_Hub + Telegram announcements.",
];

const roadmap = [
  [
    "Phase 1 — Launch",
    "pump.fun fair launch, verified links, X/Telegram push, launch meme missions.",
  ],
  [
    "Phase 2 — Community Games",
    "Mascot quiz, meme wall, fan polls, bracket challenge, country factions.",
  ],
  [
    "Phase 3 — World Cup Build-Up",
    "Daily football content, prediction games, matchday memes, community challenges.",
  ],
  [
    "Phase 4 — Tournament Mode",
    "Live match reactions, fan battles, bracket updates, prediction leaderboard, meme campaigns.",
  ],
];

const bannedWording = [
  "staking",
  "passive income",
  "guaranteed rewards",
  "holder profits",
  "official FIFA",
  "official World Cup token",
  "airdrop claim",
  "guaranteed profit",
];

const copyBlocks = [
  {
    title: "X launch post",
    text: `$WC26 is LIVE on pump.fun.

Token: WorldCup2026Coin
Ticker: $WC26
Chain: Solana
Contract: [PASTE CONTRACT]
Official pump.fun link: [PASTE LINK]

Only trust links from worldcup2026coin.com, @WC26_Hub and t.me/WC26Hub.

Fan-made. Unofficial. High risk. Not financial advice.`,
  },
  {
    title: "Telegram announcement",
    text: `$WC26 is LIVE on pump.fun.

Token: WorldCup2026Coin
Ticker: $WC26
Chain: Solana
Contract: [PASTE CONTRACT]
Official pump.fun link: [PASTE LINK]

Only trust links from worldcup2026coin.com, @WC26_Hub and t.me/WC26Hub.

Fan-made. Unofficial. High risk. Not financial advice.`,
  },
  {
    title: "Scam warning post",
    text: `Scammers copy meme coins fast.

Do not buy from replies, DMs, random Telegram posts, screenshots or lookalike links.

Only use the contract and pump.fun link published on worldcup2026coin.com, @WC26_Hub and t.me/WC26Hub.

No admin will ever ask for your seed phrase, recovery phrase or private key.`,
  },
];

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="neon-panel rounded-[2rem] p-6">
      <p className="neon-kicker">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-black uppercase text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm font-bold leading-6 text-slate-200"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function LaunchControlPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!(await isCommunityAdmin(user.id))) {
    notFound();
  }

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
          <p className="neon-kicker">Private admin</p>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black uppercase leading-[0.9] text-white sm:text-7xl">
            WC26 Launch Control
          </h1>
          <p className="mt-5 max-w-3xl text-sm font-semibold leading-6 text-slate-300">
            Admin-only launch-day checklist, public env readiness, copy blocks
            and safety reminders. This page shows public launch values only.
          </p>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <Panel eyebrow="Public env only" title="Launch status">
            <div className="grid gap-3">
              {publicEnvItems.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl border p-4 ${
                    item.isSet
                      ? "border-lime-300/30 bg-lime-300/10"
                      : "border-fuchsia-300/30 bg-fuchsia-400/10"
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="break-all text-xs font-black uppercase tracking-[0.14em] text-slate-300">
                      {item.label}
                    </p>
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase ${
                        item.isSet
                          ? "bg-lime-300/15 text-lime-100"
                          : "bg-fuchsia-400/15 text-fuchsia-100"
                      }`}
                    >
                      {item.isSet ? "Set" : "Missing"}
                    </span>
                  </div>
                  <p className="mt-3 break-all text-sm font-bold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="Link checklist" title="Official links checklist">
            <div className="grid gap-3">
              {officialLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm font-bold text-slate-200 transition hover:border-lime-300/40 hover:text-white"
                >
                  <span className="block text-xs font-black uppercase tracking-[0.16em] text-lime-200">
                    {label}
                  </span>
                  <span className="mt-2 block break-all">{href}</span>
                </Link>
              ))}
            </div>
          </Panel>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <Panel eyebrow="Before launch" title="Pre-launch checklist">
            <Checklist items={preLaunchChecklist} />
          </Panel>

          <Panel eyebrow="Launch day" title="Step-by-step instructions">
            <ol className="grid gap-3">
              {launchSteps.map((step, index) => (
                <li
                  key={step}
                  className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm font-bold leading-6 text-slate-200"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-lime-300/30 bg-lime-300/10 text-lime-100">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel eyebrow="After launch" title="Post-launch checks">
            <Checklist items={postLaunchChecks} />
          </Panel>

          <Panel eyebrow="Emergency" title="Emergency notes">
            <Checklist items={emergencyNotes} />
          </Panel>
        </div>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <Panel eyebrow="Public roadmap" title="Approved roadmap copy">
            <div className="grid gap-4">
              {roadmap.map(([phase, copy]) => (
                <article
                  key={phase}
                  className="rounded-2xl border border-lime-300/15 bg-lime-300/10 p-4"
                >
                  <h3 className="font-black uppercase text-white">{phase}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="Banned copy" title="Banned wording list">
            <div className="flex flex-wrap gap-2">
              {bannedWording.map((word) => (
                <span
                  key={word}
                  className="rounded-full border border-fuchsia-300/25 bg-fuchsia-400/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-fuchsia-100"
                >
                  {word}
                </span>
              ))}
            </div>
          </Panel>
        </section>

        <Panel eyebrow="Copy blocks" title="Launch post templates">
          <div className="grid gap-4 lg:grid-cols-3">
            {copyBlocks.map((block) => (
              <article
                key={block.title}
                className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
              >
                <h3 className="text-lg font-black uppercase text-white">
                  {block.title}
                </h3>
                <textarea
                  readOnly
                  value={block.text}
                  className="mt-4 min-h-72 w-full resize-y rounded-2xl border border-white/10 bg-black/40 p-4 text-sm font-semibold leading-6 text-slate-200 outline-none"
                />
              </article>
            ))}
          </div>
        </Panel>
      </Container>
    </main>
  );
}
