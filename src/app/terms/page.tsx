import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";

export const metadata: Metadata = {
  title: "Terms & Disclaimer",
  description:
    "Terms and disclaimer placeholder for World Cup 2026 Hub football content, predictions, polls and community features.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms"
        title="Terms & Disclaimer"
        description="MVP terms and disclaimer for football-first content and community features."
        meta="Placeholder for launch readiness"
      />

      <Container className="pb-14">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 text-sm leading-7 text-slate-300">
          <h2 className="text-2xl font-black text-white">Football content</h2>
          <p className="mt-4">
            World Cup 2026 Hub provides football information, fixtures, fan content, predictions, polls and community features for entertainment and informational purposes.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Predictions and betting-style content</h2>
          <p className="mt-4">
            Betting-style content is for entertainment and informational purposes only. It is not financial guidance, wagering guidance, or a certainty of outcome. Odds and availability may vary by location and provider. Only participate where legal, and never risk money you cannot afford to lose.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">No certaintys</h2>
          <p className="mt-4">
            Match outcomes, predictions, statistics, fixtures and live data may change. The site should not be treated as an official tournament source.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Community features</h2>
          <p className="mt-4">
            Polls, email updates, social sharing and community placeholders are provided as MVP features. Open comments are not enabled yet.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Affiliate links</h2>
          <p className="mt-4">
            No gambling affiliate links are included in this phase.
          </p>
        </div>
      </Container>
    </>
  );
}
