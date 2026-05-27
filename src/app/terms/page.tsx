import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";

export const metadata: Metadata = {
  title: "Terms & Disclaimer",
  description:
    "Terms and disclaimer for World Cup 2026 Hub football content, predictions, polls and community features.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms"
        title="Terms & Disclaimer"
        description="Terms and disclaimer for football-first content and community features."
        meta="Last updated: May 2026"
      />

      <Container className="pb-14">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 text-sm leading-7 text-slate-300">
          <h2 className="text-2xl font-black text-white">Football content</h2>
          <p className="mt-4">
            World Cup 2026 Hub provides football information, fixtures, fan content, predictions, polls and community features for entertainment and informational purposes.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Predictions and betting-style content</h2>
          <p className="mt-4">
            Betting-style content is for entertainment and informational purposes only. It is not financial guidance, wagering guidance, or a promise of outcome. Odds and availability may vary by location and provider. Only participate where legal, and never risk money you cannot afford to lose.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">No promised outcomes</h2>
          <p className="mt-4">
            Match outcomes, predictions, statistics, fixtures and live data may change. The site should not be treated as an official tournament source.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Community features</h2>
          <p className="mt-4">
            Polls, email updates and social sharing are provided as football-first community features. Open comments are not enabled.
          </p>
          <h2 className="mt-8 text-2xl font-black text-white">$WC26 meme token and crypto risk</h2>
          <p className="mt-4">
            Any $WC26 token or crypto-related content is provided for community and entertainment purposes only. It is not financial advice, investment advice, a promise of profit, or a recommendation to buy, sell or hold any crypto asset. Meme tokens are highly volatile and can lose all value.
          </p>
          <p className="mt-4">
            $WC26 is fan-made and unofficial. It is not affiliated with FIFA, the FIFA World Cup, national teams, players, sponsors, venues or governing bodies. Users should only trust links published directly on this website and should beware fake contracts, impersonators and private messages.
          </p>

          <h2 className="mt-8 text-2xl font-black text-white">Affiliate links</h2>
          <p className="mt-4">
            No gambling affiliate links are included.
          </p>
        </div>
      </Container>
    </>
  );
}


