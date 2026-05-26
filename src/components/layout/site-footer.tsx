
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan-300/15 bg-[#02030a]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_0%,rgba(163,255,18,0.12),transparent_28rem),radial-gradient(circle_at_80%_20%,rgba(255,43,214,0.12),transparent_26rem)]" />
      <Container className="relative py-12">
        <div className="grid gap-8 rounded-[2rem] border border-cyan-300/15 bg-white/[0.035] p-6 shadow-[0_0_42px_rgba(34,211,238,0.08)] md:grid-cols-[1.35fr_1fr]">
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
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-200">
              Sections
            </p>
            <div className="mt-4 grid gap-2">
              <Link href="/best-third-placed-teams" className="text-sm font-semibold text-slate-400 transition hover:text-lime-200">
                3rd place signal
              </Link>
              {siteConfig.navLinks.slice(1, 7).map((link) => (
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
        </div>

        <div className="mt-8 flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 World Cup 2026 Hub · built for tournament mode.</p>
          <p>Supabase + API-Football sync · no wallet, no buy flow, just football signal.</p>
        </div>
      </Container>
    </footer>
  );
}


