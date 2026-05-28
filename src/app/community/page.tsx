import type { Metadata } from "next";
import { CommunityCTA } from "@/components/community/community-cta";
import { CommunityRules } from "@/components/community/community-rules";
import { EmailSignupForm } from "@/components/community/email-signup-form";
import { FanCulturePanel } from "@/components/community/fan-culture-panel";
import { PollCard } from "@/components/community/poll-card";
import { PredictionGameTeaser } from "@/components/community/prediction-game-teaser";
import { SocialShareButtons } from "@/components/community/social-share-buttons";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import { StickerPackSection } from "@/components/wc26/sticker-pack-section";
import { getCommunityPagePolls } from "@/lib/data/community";
import { getPublicSiteUrl } from "@/lib/data/matches";
import { createPageMetadata } from "@/lib/seo";
import { SOCIAL_LINKS } from "@/lib/social-links";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "World Cup 2026 Community",
  description:
    "Join the WC26 Hub community for World Cup 2026 chat, fan predictions, memes, polls and matchday chaos.",
  path: "/community",
});

export default async function CommunityPage() {
  const polls = await getCommunityPagePolls();
  const siteUrl = getPublicSiteUrl();

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="WC26 Community"
        description="Football-first fan chaos for World Cup 2026 — chat, memes, polls, predictions and matchday signal."
        meta="Fan-made · Moderated · Unofficial"
      />

      <Container className="pb-14">
        <CommunityCTA />

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              href: "/community/chat",
              title: "Join Chat",
              copy: "Live football-first tournament chat.",
            },
            {
              href: "/community/memes",
              title: "Meme Wall",
              copy: "Approved fan-made World Cup 2026 memes.",
            },
            {
              href: "/community/meme-generator",
              title: "Meme Generator",
              copy: "Create simple WC26 fan memes.",
            },
            {
              href: "/community/factions",
              title: "Country Factions",
              copy: "Choose your side for fan banter.",
            },
            {
              href: SOCIAL_LINKS.telegramChat,
              title: "Telegram Chat",
              copy: "Jump into the wider WC26 fan chat.",
              external: true,
            },
            {
              href: SOCIAL_LINKS.telegramChannel,
              title: "Announcements",
              copy: "Follow launch and community updates.",
              external: true,
            },
            {
              href: SOCIAL_LINKS.x,
              title: "Follow on X",
              copy: "Matchday posts and community signal.",
              external: true,
            },
            {
              href: "/fan-polls",
              title: "Fan Polls",
              copy: "Vote on tournament storylines.",
            },
            {
              href: "/prediction-leaderboard",
              title: "Prediction Leaderboard",
              copy: "Track community prediction points.",
            },
          ].map((card) =>
            card.external ? (
              <a
                key={card.href}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="neon-card rounded-[2rem] p-5 transition hover:border-lime-300/50"
              >
                <h2 className="text-2xl font-black uppercase text-white">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{card.copy}</p>
              </a>
            ) : (
              <a
                key={card.href}
                href={card.href}
                className="neon-card rounded-[2rem] p-5 transition hover:border-lime-300/50"
              >
                <h2 className="text-2xl font-black uppercase text-white">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{card.copy}</p>
              </a>
            ),
          )}
        </section>
        <StickerPackSection />

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
                Fan polls
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Have your say
              </h2>

              {polls.length === 0 ? (
                <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-center">
                  <h3 className="text-lg font-black text-white">
                    No polls published yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Publish polls in Supabase and they will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {polls.map((poll) => (
                    <PollCard key={poll.id} poll={poll} source="community_page" />
                  ))}
                </div>
              )}
            </section>

            <PredictionGameTeaser />
            <FanCulturePanel />
            <CommunityRules />
          </div>

          <aside className="grid content-start gap-6">
            <EmailSignupForm source="community_page" />

            <SocialShareButtons
              shareText="Join the World Cup 2026 Hub fan community"
              shareUrl={`${siteUrl}/community`}
            />
          </aside>
        </div>
      </Container>
    </>
  );
}
