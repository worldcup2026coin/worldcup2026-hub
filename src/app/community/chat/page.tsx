import type { Metadata } from "next";
import { ChatComposer } from "@/components/community/chat-composer";
import { ChatMessageList } from "@/components/community/chat-message-list";
import { CommunityRulesPanel } from "@/components/community/community-rules-panel";
import { SocialLinksPanel } from "@/components/community/social-links-panel";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import {
  ensureCommunityProfile,
  getRecentChatMessages,
} from "@/lib/community/data";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WC26 Chat",
  description:
    "Football-first tournament chat for World Cup 2026 fan chaos.",
};

export default async function CommunityChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user
    ? await ensureCommunityProfile(user.id, user.email).catch(() => null)
    : null;
  const messages = await getRecentChatMessages(40).catch(() => []);

  return (
    <>
      <PageHeader
        eyebrow="Community chat"
        title="WC26 Chat"
        description="Football-first tournament chat for World Cup 2026 fan chaos."
        meta="Plain text only · Rate limited · Moderated"
      />

      <Container className="pb-14">
        <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
          <div className="grid gap-6">
            <ChatMessageList initialMessages={messages} />
            <ChatComposer signedIn={Boolean(user)} profile={profile} />
          </div>

          <aside className="grid content-start gap-6">
            <CommunityRulesPanel />
            <SocialLinksPanel />
            {user ? (
              <a href="/community/profile" className="glow-button-secondary">
                Edit community profile
              </a>
            ) : null}
          </aside>
        </div>
      </Container>
    </>
  );
}
