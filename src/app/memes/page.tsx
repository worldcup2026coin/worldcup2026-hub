import type { Metadata } from "next";
import { FanChaosBoard } from "@/components/memes/FanChaosBoard";
import { MemeCategoryFilter } from "@/components/memes/MemeCategoryFilter";
import { MemeGrid } from "@/components/memes/MemeGrid";
import { MemeOfTheDay } from "@/components/memes/MemeOfTheDay";
import { MemeSubmissionForm } from "@/components/memes/MemeSubmissionForm";
import { MemeWallHero } from "@/components/memes/MemeWallHero";
import { OpenCommunityCTA } from "@/components/memes/OpenCommunityCTA";
import {
  getFixtureOptions,
  getMemeOfTheDay,
  getPublishedMemes,
  getTeamOptions,
} from "@/lib/memes/queries";

export const metadata: Metadata = {
  title: "World Cup 2026 Memes | Fan Reactions, Match Chaos & Football Meme Wall",
  description:
    "Explore World Cup 2026 memes, fan reactions, match-day chaos, team banter and community posts from the open football meme community.",
  alternates: {
    canonical: "/memes",
  },
  openGraph: {
    title: "World Cup 2026 Memes | Fan Reactions, Match Chaos & Football Meme Wall",
    description:
      "Explore World Cup 2026 memes, fan reactions, match-day chaos, team banter and community posts from the open football meme community.",
    url: "/memes",
    type: "website",
    images: [
      {
        url: "/og/memes.png",
        width: 1200,
        height: 630,
        alt: "World Cup 2026 Meme Wall",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "World Cup 2026 Memes",
    description:
      "Fan reactions, match chaos, team banter and community memes for World Cup 2026.",
    images: ["/og/memes.png"],
  },
};

type MemesPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
  }>;
};

export default async function MemesPage({ searchParams }: MemesPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const categoryParam = resolvedSearchParams.category;
  const activeCategory = Array.isArray(categoryParam)
    ? categoryParam[0]
    : categoryParam;

  const [memes, memeOfTheDay, teams, fixtures] = await Promise.all([
    getPublishedMemes({ category: activeCategory, limit: 48 }),
    getMemeOfTheDay(),
    getTeamOptions(),
    getFixtureOptions(),
  ]);

  return (
    <main className="bg-black text-white">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 md:px-6 md:py-12">
        <MemeWallHero />

        <MemeOfTheDay meme={memeOfTheDay} />

        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-300">
                Meme Wall
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                Latest World Cup 2026 memes
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                Fan reactions, team banter, match chaos, underdog moments, VAR drama,
                host city vibes and crypto football culture.
              </p>
            </div>
          </div>

          <MemeCategoryFilter activeCategory={activeCategory} />
          <MemeGrid memes={memes} />
        </section>

        <FanChaosBoard />

        <MemeSubmissionForm teams={teams} fixtures={fixtures} />

        <OpenCommunityCTA />

        <section className="grid gap-4 md:grid-cols-2">
          <a
            href="https://twitter.com/intent/tweet?text=Football.%20Chaos.%20Memes.%20World%20Cup%202026."
            target="_blank"
            rel="noreferrer"
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:bg-white/[0.07]"
          >
            <h3 className="text-xl font-black text-white">Tag us on X</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Post your match-day reaction and tag us to get featured.
            </p>
          </a>

          <a
            href="/community"
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:bg-white/[0.07]"
          >
            <h3 className="text-xl font-black text-white">
              Join the Telegram chaos room
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Live fan reactions, tournament banter and meme culture in one place.
            </p>
          </a>
        </section>

        <p className="text-xs leading-6 text-white/45">
          This is an open fan community for football memes, discussion and
          entertainment. Content is moderated where possible. No financial advice,
          no betting advice, and no guarantees are provided.
        </p>
      </div>
    </main>
  );
}
