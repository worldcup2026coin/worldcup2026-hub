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
import { getCommunityPagePolls } from "@/lib/data/community";
import { getPublicSiteUrl } from "@/lib/data/matches";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "World Cup 2026 Community",
  description:
    "Join World Cup 2026 Hub community polls, fan updates, social sharing and football-first fan culture.",
};

export default async function CommunityPage() {
  const polls = await getCommunityPagePolls();
  const siteUrl = getPublicSiteUrl();

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="World Cup 2026 fan community"
        description="Polls, social sharing, email updates and football-first fan culture for World Cup 2026."
        meta="Football-first · Social-shareable · No open comments yet"
      />

      <Container className="pb-14">
        <CommunityCTA />

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
