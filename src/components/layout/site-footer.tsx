import Link from "next/link";
import { SocialLinksRow } from "@/components/layout/social-links-row";
import { Container } from "@/components/ui/container";
import { SOCIAL_LINKS } from "@/lib/social-links";

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

const footerGroups: Array<{ title: string; tone: string; links: FooterLink[] }> = [
  {
    title: "Football Hub",
    tone: "text-cyan-200 hover:text-cyan-100",
    links: [
      { href: "/fixtures", label: "Fixtures" },
      { href: "/live", label: "Live" },
      { href: "/groups", label: "Groups" },
      { href: "/teams", label: "Teams" },
      { href: "/predictions", label: "Predictions" },
      { href: "/prediction-leaderboard", label: "Prediction Leaderboard" },
      { href: "/news", label: "News" },
      { href: "/host-cities", label: "Host Cities" },
      { href: "/stadiums", label: "Stadiums" },
      { href: "/host-nations", label: "Host Nations" },
      { href: "/guides", label: "Guides" },
      { href: "/injuries", label: "Injuries" },
      { href: "/suspensions", label: "Suspensions" },
      { href: "/best-third-placed-teams", label: "Third Place" },
      { href: "/top-scorers", label: "Top Scorers" },
      { href: "/top-assists", label: "Top Assists" },
      { href: "/top-cards", label: "Top Cards" },
      { href: "/tournament-simulation", label: "Simulation" },
      { href: "/world-cup-format", label: "Format Guide" },
      { href: "/tournament-timeline", label: "Timeline" },
      { href: "/world-cup-history", label: "History" },
    ],
  },
  {
    title: "$WC26 Safety",
    tone: "text-lime-200 hover:text-lime-100",
    links: [
      { href: "/wc26", label: "$WC26" },
      { href: "/launch", label: "Launch" },
      { href: "/how-to-buy", label: "How to Buy" },
    ],
  },
  {
    title: "Community",
    tone: "text-fuchsia-200 hover:text-fuchsia-100",
    links: [
      { href: "/community", label: "Community" },
      { href: "/community/chat", label: "Chat" },
      { href: "/community/memes", label: "Meme Wall" },
      { href: "/fan-polls", label: "Fan Polls" },
      { href: SOCIAL_LINKS.x, label: "X", external: true },
      {
        href: SOCIAL_LINKS.telegramChannel,
        label: "Telegram Announcements",
        external: true,
      },
      {
        href: SOCIAL_LINKS.telegramChat,
        label: "Telegram Chat",
        external: true,
      },
    ],
  },
  {
    title: "Legal",
    tone: "text-slate-200 hover:text-white",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

function FooterNavLink({ link, tone }: { link: FooterLink; tone: string }) {
  const className = `text-sm font-semibold text-slate-400 transition ${tone}`;

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan-300/15 bg-[#02030a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(163,255,18,0.12),transparent_28rem),radial-gradient(circle_at_80%_20%,rgba(255,43,214,0.12),transparent_26rem)]" />
      <Container className="relative py-8">
        <div className="grid gap-8 rounded-[2rem] border border-cyan-300/15 bg-white/[0.035] p-6 shadow-[0_0_42px_rgba(34,211,238,0.08)] lg:grid-cols-[1.1fr_2fr]">
          <div>
            <span className="neon-badge">Tournament pulse</span>
            <p className="mt-4 text-2xl font-black uppercase tracking-tight text-white">
              World Cup 2026 Hub
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              104 matches. 48 teams. 16 host cities. 3 nations. 1 trophy.
              Follow every fixture, group table, goal, prediction and knockout
              race from opening match to the final.
            </p>
            <p className="mt-4 text-xs font-semibold leading-5 text-slate-500">
              $WC26 is a fan-made community layer and is not affiliated with
              FIFA, World Cup, teams, players, sponsors or governing bodies.
            </p>
            <div className="mt-5">
              <SocialLinksRow />
            </div>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className={`text-xs font-black uppercase tracking-[0.22em] ${group.tone}`}>
                  {group.title}
                </p>
                <div className="mt-4 grid gap-2">
                  {group.links.map((link) => (
                    <FooterNavLink
                      key={`${group.title}-${link.href}-${link.label}`}
                      link={link}
                      tone={group.tone}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 World Cup 2026 Hub · built for tournament mode.</p>
          <p>Only trust $WC26 links published on this website.</p>
        </div>
      </Container>
    </footer>
  );
}
