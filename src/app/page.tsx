import { HomepageCommunitySection } from "@/components/community/homepage-community-section";
import Link from "next/link";
import { EmailSignupCard } from "@/components/cards/email-signup-card";
import { PlaceholderCard } from "@/components/cards/placeholder-card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { homeHighlights, homepagePlaceholders } from "@/lib/placeholder-data";

const featureLinks = [
  {
    href: "/fixtures",
    label: "Explore fixtures",
    description: "Schedule shell",
  },
  {
    href: "/live",
    label: "Open live centre",
    description: "Score hub shell",
  },
  {
    href: "/community",
    label: "Build community",
    description: "Fan growth shell",
  },
];

export default function Home() {
  return (
    <div>
      <section className="py-10 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <Badge>Phase 1 Foundation</Badge>

              <h1 className="mt-6 max-w-5xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                The API-first World Cup 2026 fan hub.
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                A mobile-first football site foundation for fixtures, live
                scores, groups, teams, predictions, news, stadiums, and
                community features. This phase is UI-only, with no live API data
                connected yet.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/fixtures"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                >
                  View fixture shell
                </Link>
                <Link
                  href="/community"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Community preview
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-slate-950/50">
              <div className="rounded-[1.5rem] border border-emerald-400/20 bg-slate-950/80 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  Tournament mode
                </p>
                <h2 className="mt-4 text-2xl font-black text-white">
                  Ready for data modules
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  The layout, navigation, cards, and route structure are ready.
                  Later phases can plug in API-Football, Supabase, predictions,
                  and community tools without rebuilding the shell.
                </p>

                <div className="mt-6 grid gap-3">
                  {featureLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.08]"
                    >
                      <span className="block text-sm font-bold text-white">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-slate-500">
                        {item.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {homeHighlights.map((card) => (
              <PlaceholderCard key={card.title} {...card} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Match centre"
            title="Next matches and live score placeholders"
            description="These cards are static for now. In later phases they will be fed by API-Football."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {homepagePlaceholders.nextMatches.map((card) => (
              <PlaceholderCard key={card.title} {...card} />
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {homepagePlaceholders.liveScores.map((card) => (
              <PlaceholderCard key={card.title} {...card} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Tournament structure"
            title="Groups, standings, polls, and community hooks"
            description="The homepage now has the key modules needed for a one-stop World Cup fan hub."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {homepagePlaceholders.groupStandings.map((card) => (
              <PlaceholderCard key={card.title} {...card} />
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {homepagePlaceholders.fanPolls.map((card) => (
              <PlaceholderCard key={card.title} {...card} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-16">
        <Container>
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <EmailSignupCard />

            <div className="grid gap-4">
              {homepagePlaceholders.memeCommunity.map((card) => (
                <PlaceholderCard key={card.title} {...card} />
              ))}
            </div>
          </div>
                <HomepageCommunitySection />
</Container>
      </section>
    </div>
  );
}
