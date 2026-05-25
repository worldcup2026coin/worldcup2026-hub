import Link from "next/link";
import type { Meme } from "@/lib/memes/types";
import { MEME_CATEGORY_LABELS } from "@/lib/memes/constants";
import { MemeShareButtons } from "./MemeShareButtons";

type Props = {
  meme: Meme;
  compact?: boolean;
};

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.worldcup2026coin.com";
}

export function MemeCard({ meme, compact = false }: Props) {
  const memeUrl = `${getSiteUrl()}/memes/${meme.slug}`;
  const categoryLabel = MEME_CATEGORY_LABELS[meme.category] || meme.category;

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20">
      <Link href={`/memes/${meme.slug}`} className="block">
        {meme.image_url ? (
          <div className="aspect-[4/3] w-full overflow-hidden bg-black/30">
            <img
              src={meme.image_url}
              alt={meme.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-white/10 to-white/[0.02] p-6 text-center">
            <p className="text-xl font-black uppercase tracking-tight text-white">
              Football. Chaos. Memes.
            </p>
          </div>
        )}
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/80">
            {categoryLabel}
          </span>

          {meme.featured ? (
            <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-wide text-black">
              Featured
            </span>
          ) : null}

          {meme.meme_of_the_day ? (
            <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-black uppercase tracking-wide text-black">
              Meme of the Day
            </span>
          ) : null}
        </div>

        <div>
          <Link href={`/memes/${meme.slug}`}>
            <h3 className="text-lg font-black leading-tight text-white hover:text-white/80">
              {meme.title}
            </h3>
          </Link>

          {meme.description && !compact ? (
            <p className="mt-2 text-sm leading-6 text-white/65">
              {meme.description}
            </p>
          ) : null}
        </div>

        <div className="space-y-1 text-xs text-white/55">
          {meme.source_handle ? <p>Source: {meme.source_handle}</p> : null}
          {meme.team?.slug ? <p>Team: {meme.team.name || meme.team.slug}</p> : null}
          {meme.fixture?.slug ? <p>Match: {meme.fixture.slug}</p> : null}
        </div>

        <MemeShareButtons
          title={meme.title}
          url={memeUrl}
          externalUrl={meme.external_url}
        />
      </div>
    </article>
  );
}
