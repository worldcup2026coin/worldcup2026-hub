import { SOCIAL_LINKS } from "@/lib/social-links";

export function SocialLinksRow() {
  const links = [
    {
      href: SOCIAL_LINKS.x,
      label: "X",
      text: "Follow @WC26_Hub",
    },
    {
      href: SOCIAL_LINKS.telegramChannel,
      label: "Telegram",
      text: "Announcements",
    },
    {
      href: SOCIAL_LINKS.telegramChat,
      label: "Telegram",
      text: "Join Chat",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100 transition hover:border-lime-300/70 hover:bg-lime-300/15 hover:text-lime-100"
        >
          <span className="sr-only">{link.label}: </span>
          {link.text}
        </a>
      ))}
    </div>
  );
}
