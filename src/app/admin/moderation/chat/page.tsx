import { notFound } from "next/navigation";
import { ModerationChatTable } from "@/components/community/moderation-chat-table";
import { Container } from "@/components/ui/container";
import { getRecentChatMessages, isCommunityModerator } from "@/lib/community/data";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ChatModerationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isCommunityModerator(user.id))) {
    notFound();
  }

  const messages = await getRecentChatMessages(80, true);

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <ModerationChatTable messages={messages.reverse()} />
      </Container>
    </main>
  );
}
