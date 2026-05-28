import { notFound } from "next/navigation";
import { ModerationMemeTable } from "@/components/community/moderation-meme-table";
import { Container } from "@/components/ui/container";
import { getModerationMemes, isCommunityModerator } from "@/lib/community/data";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MemeModerationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isCommunityModerator(user.id))) {
    notFound();
  }

  const memes = await getModerationMemes("pending");

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <ModerationMemeTable memes={memes} />
      </Container>
    </main>
  );
}
