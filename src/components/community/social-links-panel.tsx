import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/social-links";

export function SocialLinksPanel() {
  const links = [
    { href: SOCIAL_LINKS.telegramChat, label: "Telegram Chat" },
    { href: SOCIAL_LINKS.telegramChannel, label: "Announcements" },
    { href: SOCIAL_LINKS.x, label: "Follow on X" },
  ];

  return (
    <section className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
      <p className="neon-kicker">Social signal</p>
      <h2 className="mt-3 text-2xl font-black uppercase text-white">
        Join the wider fan loop
      </h2>
      <div className="mt-5 grid gap-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-cyan-100 transition hover:border-lime-300/60 hover:text-lime-100"
          >
            {link.label}
          </a>
        ))}
        <Link
          href="/community"
          className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-200 transition hover:border-lime-300/60 hover:text-lime-100"
        >
          Community home
        </Link>
      </div>
    </section>
  );
}
