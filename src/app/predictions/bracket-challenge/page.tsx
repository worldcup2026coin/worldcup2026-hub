import Link from "next/link";
import { BracketChallengeBuilder } from "@/components/predictions/bracket-challenge-builder";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/worldcup/empty-state";
import { buildBracketGroups } from "@/lib/bracket-challenge/server";
import { getGroupsPageData } from "@/lib/data/worldcup";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "WC26 Bracket Challenge",
  description:
    "Pick your group qualifiers, build the knockouts and share your World Cup 2026 champion call in the free WC26 fan bracket challenge.",
  path: "/predictions/bracket-challenge",
});

export default async function BracketChallengePage() {
  const [{ standings }, supabase] = await Promise.all([
    getGroupsPageData(),
    createClient(),
  ]);
  const groups = buildBracketGroups(standings);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      <Container className="py-10 pb-16">
        {groups.length === 12 ? (
          <BracketChallengeBuilder groups={groups} signedIn={Boolean(user)} />
        ) : (
          <EmptyState
            title="Bracket Challenge is waiting for group data"
            description="The builder needs all 12 World Cup 2026 groups with four teams each. Once standings data is synced, the full bracket challenge will unlock here."
            action={
              <Link href="/groups" className="glow-button-primary">
                View groups
              </Link>
            }
          />
        )}
      </Container>
    </main>
  );
}
