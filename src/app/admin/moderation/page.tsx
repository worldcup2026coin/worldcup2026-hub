import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { isCommunityModerator } from "@/lib/community/data";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ModerationIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isCommunityModerator(user.id))) {
    notFound();
  }

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.25rem] p-6 sm:p-10">
          <p className="neon-kicker">Admin moderation</p>
          <h1 className="neon-title glow-text mt-4 text-5xl font-black uppercase leading-[0.9] text-white sm:text-7xl">
            Community control room
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300">
            Review pending memes, handle reported chat, and keep the WC26 layer
            football-first.
          </p>
        </section>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            {
              href: "/admin/moderation/memes",
              title: "Meme moderation",
              copy: "Approve, reject or hide submitted memes.",
            },
            {
              href: "/admin/moderation/chat",
              title: "Chat moderation",
              copy: "Hide messages, flag posts, mute users or ban spam.",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="neon-card rounded-[2rem] p-6 transition hover:border-lime-300/50"
            >
              <h2 className="text-2xl font-black uppercase text-white">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.copy}</p>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
