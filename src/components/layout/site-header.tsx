"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/container";

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400 text-lg font-black text-slate-950 shadow-lg shadow-emerald-950/40">
              26
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.18em] text-white">
                {siteConfig.shortName}
              </span>
              <span className="block text-xs text-slate-400">
                API-first fan hub
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-emerald-400 text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span className="text-xl">{isOpen ? "×" : "☰"}</span>
          </button>
        </div>

        {isOpen ? (
          <nav
            className="grid gap-2 border-t border-white/10 py-4 lg:hidden"
            aria-label="Mobile"
          >
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-emerald-400 text-slate-950"
                    : "bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </Container>
    </header>
  );
}
