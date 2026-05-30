import type { Metadata } from "next";
import Link from "next/link";
import { CommunityRulesPanel } from "@/components/community/community-rules-panel";
import { MemeSubmitForm } from "@/components/community/meme-submit-form";
import { MemeWallGrid } from "@/components/community/meme-wall-grid";
import { SocialLinksPanel } from "@/components/community/social-links-panel";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import { getApprovedMemes } from "@/lib/community/data";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Meme Wall",
  description:
    "Fan-made World Cup 2026 meme wall. Submit football memes for review and share approved chaos with the WC26 community.",
  path: "/community/memes",
});

export default async function MemeWallPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const sort = params.sort === "top" ? "top" : "newest";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const memes = await getApprovedMemes({ sort, userId: user?.id }).catch(
    () => [],
  );

  return (
    <>
      <PageHeader
        eyebrow="Community memes"
        title="Meme Wall"
        description="Fan-made World Cup 2026 chaos. Approved community memes only."
        meta="Moderated uploads · No official marks · Fan-made only"
      />

      <Container className="pb-14">
        <div className="grid gap-6 xl:grid-cols-[1fr_23rem]">
          <div className="grid gap-6">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/community/meme-generator"
                className="rounded-full border border-lime-300/50 bg-lime-300 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-950"
              >
                Create meme
              </Link>
              <Link
                href="/community/memes?sort=newest"
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${
                  sort === "newest"
                    ? "border-lime-300/60 bg-lime-300/15 text-lime-100"
                    : "border-white/10 bg-white/[0.04] text-slate-300"
                }`}
              >
                Newest
              </Link>
              <Link
                href="/community/memes?sort=top"
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${
                  sort === "top"
                    ? "border-lime-300/60 bg-lime-300/15 text-lime-100"
                    : "border-white/10 bg-white/[0.04] text-slate-300"
                }`}
              >
                Most upvoted
              </Link>
            </div>
            <MemeWallGrid memes={memes} signedIn={Boolean(user)} />
          </div>

          <aside className="grid content-start gap-6">
            <MemeSubmitForm signedIn={Boolean(user)} />
            <CommunityRulesPanel />
            <SocialLinksPanel />
          </aside>
        </div>
      </Container>
    </>
  );
}
