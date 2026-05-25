import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-lg font-black tracking-tight text-white">
              {siteConfig.name}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">A mobile-first, API-powered World Cup 2026 football hub for fixtures, live scores, teams, players, stats, predictions, polls and tournament updates.</p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">
              Sections
            </p>
            <div className="mt-4 grid gap-2">
              <Link
                href="/best-third-placed-teams"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Best third-placed teams
              </Link>
              {siteConfig.navLinks.slice(1, 6).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">
              Community
            </p>
            <div className="mt-4 grid gap-2">
              {siteConfig.socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 World Cup 2026 Hub. Built for tournament mode.</p>
          <p>Live World Cup data powered by Supabase and API-Football sync.</p>
        </div>
      </Container>
    </footer>
  );
}

