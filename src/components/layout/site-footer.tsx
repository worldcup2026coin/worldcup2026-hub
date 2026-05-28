import { SocialLinksRow } from "@/components/layout/social-links-row";
import { SOCIAL_LINKS } from "@/lib/social-links";
import Link from "next/link";
import { Container } from "@/components/ui/container";

const tournamentLinks = [
  { href: "/fixtures", label: "Fixtures" },
  { href: "/live", label: "Live" },
  { href: "/groups", label: "Groups" },
  { href: "/teams", label: "Teams" },
  { href: "/predictions", label: "Predictions" },
  { href: "/tournament-simulation", label: "Simulation" },
  { href: "/fan-polls", label: "Fan Polls" },
  { href: "/prediction-leaderboard", label: "Prediction Leaderboard" },
  { href: "/news", label: "News" },
];

const exploreLinks = [
  { href: "/host-cities", label: "Host Cities" },
  { href: "/stadiums", label: "Stadiums" },
  { href: "/host-nations", label: "Host Nations" },
  { href: "/world-cup-format", label: "Format Guide" },
  { href: "/tournament-timeline", label: "Timeline" },
  { href: "/world-cup-history", label: "History" },
  { href: "/guides", label: "Guides" },
  { href: "/injuries", label: "Injuries" },
  { href: "/suspensions", label: "Suspensions" },
  { href: "/best-third-placed-teams", label: "Third Place" },
  { href: "/top-scorers", label: "Top Scorers" },
  { href: "/top-assists", label: "Top Assists" },
  { href: "/top-cards", label: "Top Cards" },
];

const wc26Links = [
  { href: "/wc26", label: "$WC26" },
  { href: "/launch", label: "Launch" },
  { href: "/how-to-buy", label: "How to Buy" },
  { href: "/community", label: "Community" },
  { href: "/community/chat", label: "Chat" },
  { href: "/community/memes", label: "Meme Wall" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan-300/15 bg-[#02030a]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_0%,rgba(163,255,18,0.12),transparent_28rem),radial-gradient(circle_at_80%_20%,rgba(255,43,214,0.12),transparent_26rem)]" />
      <Container className="relative py-8">
        <div className="grid gap-8 rounded-[2rem] border border-cyan-300/15 bg-white/[0.035] p-6 shadow-[0_0_42px_rgba(34,211,238,0.08)] md:grid-cols-[1.2fr_0.85fr_0.85fr_0.85fr]">
          <div>
            <span className="neon-badge">Tournament pulse</span>
            <p className="mt-4 text-2xl font-black uppercase tracking-tight text-white">
              World Cup 2026 Hub
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              104 matches. 48 teams. 16 host cities. 3 nations. 1 trophy.
              Follow every fixture, group table, goal, prediction and knockout race
              from opening match to the final.
            </p>
            <p className="mt-4 text-xs font-semibold leading-5 text-slate-500">
              $WC26 is a fan-made community layer and is not affiliated with FIFA,
              World Cup, teams, players, sponsors or governing bodies.
            </p>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-200">
              $WC26
            </p>
            <div className="mt-4 grid gap-2">
              {wc26Links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-slate-400 transition hover:text-lime-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
              Tournament
            </p>
            <div className="mt-4 grid gap-2">
              {tournamentLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-slate-400 transition hover:text-cyan-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-fuchsia-200">
              Explore
            </p>
            <div className="mt-4 grid gap-2">
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-slate-400 transition hover:text-fuchsia-200"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/privacy" className="text-sm font-semibold text-slate-400 transition hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm font-semibold text-slate-400 transition hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 World Cup 2026 Hub · built for tournament mode.</p>
          <p>Only trust $WC26 links published on this website.</p><div className="mt-5"><SocialLinksRow /></div><p className="sr-only"></p>
        </div>
      </Container>
    </footer>
  );
}



<div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
  <a
    href={SOCIAL_LINKS.x}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 font-black uppercase tracking-[0.18em] text-cyan-100 transition hover:border-lime-300/70 hover:bg-lime-300/15 hover:text-lime-100"
  >
    Follow @WC26_Hub on X
  </a>
</div>


