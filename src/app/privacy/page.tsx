import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for World Cup 2026 Hub covering email signup, polls, analytics and community features.",
};

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
          <h2 className="text-2xl font-black text-white">What we collect</h2>
          <p className="mt-4">
            World Cup 2026 Hub may collect email addresses submitted through signup forms, anonymous poll votes, basic analytics events, and technical information needed to operate the site.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">How we use it</h2>
          <p className="mt-4">
            We use this information to send updates where consent is provided, improve site content, understand community interest, and protect the site from abuse.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Analytics</h2>
          <p className="mt-4">
            The site may use privacy-conscious analytics to understand page views and basic interaction patterns. If additional tracking tools are added later, this policy should be updated.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Email updates</h2>
          <p className="mt-4">
            Email signup is optional. Users should only be contacted for World Cup 2026 Hub updates and related community features. An unsubscribe process should be added before sending regular campaigns.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Contact</h2>
          <p className="mt-4">
            For privacy or site questions, contact the World Cup 2026 Hub team through the published site contact channels.
          </p>
        </div>
      </Container>
    </>
  );
}
