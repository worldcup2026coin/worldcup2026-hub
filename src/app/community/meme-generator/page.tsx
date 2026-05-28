import type { Metadata } from "next";
import { MemeGenerator } from "@/components/community/meme-generator";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "WC26 Meme Generator",
  description:
    "Create simple fan-made WC26 meme images with unofficial community templates, then download or submit for moderation.",
  path: "/community/meme-generator",
});

export default async function CommunityMemeGeneratorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <PageHeader
        eyebrow="Meme generator"
        title="WC26 Meme Generator"
        description="Create simple fan-made WC26 memes with safe community templates. Download your PNG or submit it for moderated review."
        meta="Fan-made templates · No official marks · Moderated submissions"
      />

      <Container className="pb-14">
        <MemeGenerator signedIn={Boolean(user)} />
      </Container>
    </>
  );
}
