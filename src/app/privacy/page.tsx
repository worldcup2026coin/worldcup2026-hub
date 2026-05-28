import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for World Cup 2026 Hub covering email signup, polls, analytics and community features.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        description="A plain-English privacy policy for World Cup 2026 Hub users."
        meta="Last updated: May 2026"
      />

      <Container className="pb-14">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 text-sm leading-7 text-slate-300">
          <h2 className="text-2xl font-black text-white">Data controller and contact</h2>
          <p className="mt-4">
            World Cup 2026 Hub is responsible for the data collected through
            this website. For privacy requests, account deletion, community data
            questions or marketing unsubscribe help, contact{" "}
            <a
              href="mailto:privacy@worldcup2026hub.com"
              className="font-bold text-lime-200 underline decoration-lime-200/40 underline-offset-4"
            >
              privacy@worldcup2026hub.com
            </a>
            .
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">What we collect</h2>
          <p className="mt-4">
            We may collect email addresses submitted through signup forms,
            account and community profile details, chat messages, meme
            submissions, moderation records, poll votes, basic analytics events
            and technical information needed to operate and protect the site.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Account and community data</h2>
          <p className="mt-4">
            Account login and community data are handled through Supabase,
            including authentication, profiles, chat messages, meme submissions
            and moderation status. Community content may be visible publicly when
            it is approved or marked visible.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Email updates</h2>
          <p className="mt-4">
            Email signup is optional. We use signup data to send World Cup 2026
            Hub updates, community notices and launch-related alerts where
            consent is provided. Every marketing email will include an
            unsubscribe link.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Analytics</h2>
          <p className="mt-4">
            The site uses Vercel Analytics to understand page views and basic
            interaction patterns. Analytics are used to improve site performance,
            content and launch readiness, not to sell personal data.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">How we use data</h2>
          <p className="mt-4">
            We use data to operate login, community features, moderation,
            newsletters, polls, abuse prevention, rate limiting, site analytics
            and support requests. We do not use community or email data to make
            financial promises or token eligibility claims.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Requests and deletion</h2>
          <p className="mt-4">
            You can request access, correction or deletion of your account,
            community profile, email signup record or other personal data by
            emailing privacy@worldcup2026hub.com. Some moderation or security
            records may be retained where needed to protect the community.
          </p>
        </div>
      </Container>
    </>
  );
}
