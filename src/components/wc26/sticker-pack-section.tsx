import Image from "next/image";
import { SOCIAL_LINKS } from "@/lib/social-links";

const stickerPackUrl = "/wc26/wc26-sticker-pack.png";

export function StickerPackSection() {
  return (
    <section className="neon-panel mt-8 rounded-[2rem] p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-center">
        <div>
          <p className="neon-kicker">Fan-made stickers</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-white">
            Download the WC26 sticker pack
          </h2>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-300">
            Fan-made football chaos for X, Telegram and matchday replies. These
            assets are unofficial community graphics and do not use official
            FIFA, World Cup, federation or sponsor marks.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={stickerPackUrl}
              download
              className="glow-button-primary text-center"
            >
              Download sticker pack
            </a>
            <a
              href={SOCIAL_LINKS.telegramChat}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-button-secondary text-center"
            >
              Join Telegram Chat
            </a>
            <a
              href={SOCIAL_LINKS.x}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-button-secondary text-center"
            >
              Follow on X
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-lime-300/20 bg-black/25 p-3">
          <Image
            src={stickerPackUrl}
            alt="Fan-made WC26 sticker pack preview"
            width={560}
            height={560}
            className="h-auto w-full rounded-[1.5rem] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
