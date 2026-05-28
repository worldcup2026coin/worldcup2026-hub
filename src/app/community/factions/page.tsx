import type { Metadata } from "next";
import { FactionChooser } from "@/components/community/faction-chooser";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import { getTeams } from "@/lib/data/worldcup";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "WC26 Country Factions",
  description:
    "Choose a World Cup 2026 country faction for fan banter, predictions and WC26 community identity. No wallet required.",
  path: "/community/factions",
});

export default async function CommunityFactionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const teams = await getTeams().catch(() => []);

  return (
    <>
      <PageHeader
        eyebrow="Community factions"
        title="Country factions"
        description="Choose your side for fan banter, predictions and community identity. No wallet required."
        meta="No token gate · No rewards · Fan identity only"
      />

      <Container className="pb-14">
        <FactionChooser teams={teams} signedIn={Boolean(user)} />
      </Container>
    </>
  );
}
