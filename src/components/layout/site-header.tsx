"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-lime-300/15 bg-[#02030a]/90 shadow-[0_0_38px_rgba(34,211,238,0.08)] backdrop-blur-2xl">
      <Container>
        <div className="flex min-h-[4.75rem] min-w-0 items-center justify-between gap-3 sm:gap-4">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-lime-300/45 bg-lime-300 text-lg font-black text-slate-950 shadow-[0_0_26px_rgba(163,255,18,0.32)]">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.75),transparent_32%)]" />
              <span className="relative">26</span>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black uppercase leading-none tracking-[0.18em] text-white group-hover:text-lime-200">
                $WC26 HUB
              </span>
              <span className="mt-1 block truncate text-[0.68rem] font-bold uppercase tracking-[0.12em] text-cyan-200/80">
                Football signal - fan chaos
              </span>
            </span>
          </Link>

          <nav
            className="hidden rounded-full border border-cyan-300/15 bg-white/[0.045] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:flex"
            aria-label="Main"
          >
            {siteConfig.navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-3.5 py-2 text-xs font-black uppercase tracking-[0.13em] transition ${
                    active
                      ? "bg-lime-300 text-slate-950 shadow-[0_0_20px_rgba(163,255,18,0.36)]"
                      : "text-slate-300 hover:bg-fuchsia-400/10 hover:text-white hover:shadow-[0_0_18px_rgba(255,43,214,0.14)]"
                  }`}
                >
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-1 h-px bg-lime-200 shadow-[0_0_14px_rgba(163,255,18,0.75)]" />
                  ) : null}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <Link href="/wc26" className="glow-button-primary px-4 py-2 text-xs">
              $WC26
            </Link>
            <Link href="/launch" className="glow-button-secondary px-4 py-2 text-xs">
              Launch
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-white/[0.06] text-2xl font-black text-white shadow-[0_0_20px_rgba(34,211,238,0.12)] lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <span aria-hidden="true">&times;</span>
            ) : (
              <span aria-hidden="true">&#9776;</span>
            )}
          </button>
        </div>

        {isOpen ? (
          <nav
            className="grid gap-2 border-t border-cyan-300/15 py-4 lg:hidden"
            aria-label="Mobile"
          >
            <div className="mb-3 rounded-[1.5rem] border border-lime-300/20 bg-lime-300/10 p-3">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-lime-200">
                $WC26 launch path
              </p>
              <div className="grid gap-2">
                {siteConfig.wc26Links.map((link) => {
                  const active = isActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-black uppercase tracking-[0.12em] transition ${
                        active
                          ? "border-lime-300/50 bg-lime-300 text-slate-950 shadow-[0_0_20px_rgba(163,255,18,0.28)]"
                          : "border-lime-300/20 bg-black/30 text-lime-100 hover:border-lime-300/50 hover:bg-lime-300/10"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mb-2 flex flex-wrap gap-2">
              <span className="neon-badge neon-badge-cyan">Fan signal</span>
              <span className="neon-badge">Live data</span>
            </div>

            {siteConfig.navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-black uppercase tracking-[0.12em] transition ${
                    active
                      ? "border-lime-300/50 bg-lime-300 text-slate-950 shadow-[0_0_20px_rgba(163,255,18,0.28)]"
                      : "border-white/10 bg-white/[0.055] text-slate-200 hover:border-fuchsia-300/40 hover:bg-fuchsia-400/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </Container>
    </header>
  );
}

