import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/worldcup/empty-state";
import { TeamFlag } from "@/components/worldcup/team-flag";
import type { BracketChallengeData } from "@/lib/bracket-challenge/types";
import { buildBracketGroups, getVisibleBracketBySlug } from "@/lib/bracket-challenge/server";
import { getGroupsPageData } from "@/lib/data/worldcup";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";
import { SOCIAL_LINKS } from "@/lib/social-links";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type PublicBracket = {
  slug: string;
  display_name: string | null;
  title: string | null;
  champion_team_id: string;
  finalist_team_id: string | null;
  dark_horse_team_id: string | null;
  bracket_data: BracketChallengeData;
  created_at: string;
};

function shareText({
  champion,
  finalist,
  darkHorse,
  url,
}: {
  champion: string;
  finalist: string;
  darkHorse: string;
  url: string;
}) {
  return [
    "My WC26 World Cup 2026 bracket call:",
    "",
    `Champion: ${champion}`,
    `Finalist: ${finalist}`,
    `Dark horse: ${darkHorse}`,
    "",
    `Build yours: ${url}`,
  ].join("\n");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const bracket = (await getVisibleBracketBySlug(slug)) as PublicBracket | null;

  if (!bracket) {
    return createPageMetadata({
      title: "WC26 Bracket Challenge",
      description:
        "Build and share your World Cup 2026 champion call in the free WC26 fan bracket challenge.",
      path: `/predictions/bracket-challenge/${slug}`,
    });
  }

  return createPageMetadata({
    title: bracket.title || `${bracket.display_name || "Fan"}'s WC26 Bracket Call`,
    description:
      "View this fan-made World Cup 2026 bracket call, then build and share your own WC26 champion prediction.",
    path: `/predictions/bracket-challenge/${slug}`,
  });
}

function getTeamName(teamMap: Map<string, string>, id: string | null | undefined) {
  if (!id) return "TBC";
  return teamMap.get(id) ?? "TBC";
}

function TeamChip({
  teamId,
  teamMap,
  label,
}: {
  teamId: string | null | undefined;
  teamMap: Map<string, string>;
  label: string;
}) {
  const name = getTeamName(teamMap, teamId);

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <TeamFlag name={name} className="size-10" />
        <p className="text-lg font-black text-white">{name}</p>
      </div>
    </div>
  );
}

export default async function PublicBracketPage({ params }: PageProps) {
  const { slug } = await params;
  const [{ standings }, bracket] = await Promise.all([
    getGroupsPageData(),
    getVisibleBracketBySlug(slug) as Promise<PublicBracket | null>,
  ]);
  const groups = buildBracketGroups(standings);
  const teamMap = new Map(
    groups.flatMap((group) => group.teams.map((team) => [team.id, team.name])),
  );

  if (!bracket) {
    return (
      <Container className="py-10 pb-16">
        <EmptyState
          title="Bracket not found"
          description="This shared bracket is not public, has been hidden, or does not exist."
          action={
            <Link
              href="/predictions/bracket-challenge"
              className="glow-button-primary"
            >
              Build your bracket
            </Link>
          }
        />
      </Container>
    );
  }

  const data = bracket.bracket_data;
  const champion = getTeamName(teamMap, bracket.champion_team_id);
  const finalist = getTeamName(teamMap, bracket.finalist_team_id);
  const darkHorse = getTeamName(teamMap, bracket.dark_horse_team_id);
  const shareUrl = absoluteUrl(`/predictions/bracket-challenge/${slug}`);
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText({ champion, finalist, darkHorse, url: shareUrl }),
  )}`;

  return (
    <main>
      <Container className="py-10 pb-16">
        <section className="hero-panel rounded-[2.25rem] p-6 sm:p-8">
          <p className="neon-kicker">Shared fan bracket</p>
          <h1 className="neon-title glow-text mt-5 text-4xl font-black uppercase leading-[0.9] text-white sm:text-6xl">
            {bracket.title || `${bracket.display_name || "Fan"}'s WC26 Bracket Call`}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            Fan-made prediction for fun. Unofficial and not affiliated with
            FIFA, World Cup, teams, players, sponsors or governing bodies.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/predictions/bracket-challenge"
              className="glow-button-primary"
            >
              Build Your Bracket
            </Link>
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-button-secondary"
            >
              Share on X
            </a>
            <a
              href={SOCIAL_LINKS.telegramChat}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-button-secondary"
            >
              Join Telegram Chat
            </a>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TeamChip teamId={bracket.champion_team_id} teamMap={teamMap} label="Champion" />
          <TeamChip teamId={bracket.finalist_team_id} teamMap={teamMap} label="Finalist" />
          <TeamChip teamId={bracket.dark_horse_team_id} teamMap={teamMap} label="Dark horse" />
          <div className="rounded-[1.5rem] border border-lime-300/20 bg-lime-300/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-100">
              Format
            </p>
            <p className="mt-3 text-sm font-bold leading-6 text-slate-200">
              Fan seeding layout. Final knockout pairings may update when
              tournament data is confirmed.
            </p>
          </div>
        </section>

        <section className="neon-panel mt-8 rounded-[2rem] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="neon-kicker">Bracket preview</p>
              <h2 className="mt-3 text-3xl font-black uppercase text-white">
                Knockout path
              </h2>
            </div>
            <Link href="/wc26" className="glow-button-secondary">
              WC26 Hub
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              ["Semi-finalists", data.semiFinalistTeamIds],
              ["Best third-place picks", data.bestThirdTeamIds],
              ["Round of 32 field", data.round32Slots.filter(Boolean)],
            ].map(([title, teamIds]) => (
              <article
                key={String(title)}
                className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4"
              >
                <h3 className="text-lg font-black uppercase text-white">
                  {String(title)}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(teamIds as string[]).map((teamId) => (
                    <span
                      key={`${title}-${teamId}`}
                      className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-xs font-bold text-slate-200"
                    >
                      {getTeamName(teamMap, teamId)}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
