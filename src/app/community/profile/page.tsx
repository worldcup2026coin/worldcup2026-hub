import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CommunityRulesPanel } from "@/components/community/community-rules-panel";
import { Container } from "@/components/ui/container";
import {
  ensureCommunityProfile,
  getUserMemes,
} from "@/lib/community/data";
import { cleanCommunityText, validateProfileInput } from "@/lib/community/safety";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community Profile",
  description: "Manage your WC26 community display profile.",
};

async function updateCommunityProfile(formData: FormData) {
  "use server";

  const displayName = cleanCommunityText(formData.get("displayName"), 32);
  const handle = cleanCommunityText(formData.get("handle"), 24)
    .replace(/^@/, "")
    .toLowerCase();
  const bio = cleanCommunityText(formData.get("bio"), 240);
  const validationError = validateProfileInput({ displayName, handle, bio });

  if (validationError) {
    redirect("/community/profile?error=profile");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const existing = await ensureCommunityProfile(user.id, user.email);
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("community_profiles").upsert({
    id: user.id,
    display_name: displayName,
    handle: handle || null,
    bio: bio || null,
    avatar_url: existing.avatar_url,
    role: existing.role,
    status: existing.status,
  });

  if (error) {
    redirect("/community/profile?error=save");
  }

  revalidatePath("/community/profile");
  revalidatePath("/community/chat");
  redirect("/community/profile?saved=1");
}

export default async function CommunityProfilePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await ensureCommunityProfile(user.id, user.email);
  const memes = await getUserMemes(user.id).catch(() => []);

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.25rem] p-6 sm:p-10">
          <p className="neon-kicker">Community profile</p>
          <h1 className="neon-title glow-text mt-4 text-5xl font-black uppercase leading-[0.9] text-white sm:text-7xl">
            Your fan signal
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300">
            This is the public name shown beside chat messages and approved
            memes. Your email stays private.
          </p>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_22rem]">
          <section className="neon-card rounded-[2rem] p-6">
            {params.saved === "1" ? (
              <p className="rounded-2xl border border-lime-300/25 bg-lime-300/10 px-4 py-3 text-sm font-bold text-lime-100">
                Community profile saved.
              </p>
            ) : null}
            {params.error ? (
              <p className="rounded-2xl border border-fuchsia-300/25 bg-fuchsia-400/10 px-4 py-3 text-sm font-bold text-fuchsia-100">
                Could not save that profile. Check your display name and handle.
              </p>
            ) : null}

            <form action={updateCommunityProfile} className="mt-5 grid gap-5">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-lime-200">
                  Display name
                </span>
                <input
                  name="displayName"
                  required
                  minLength={2}
                  maxLength={32}
                  defaultValue={profile.display_name}
                  className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-bold text-white outline-none focus:border-lime-300/70"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
                  Handle
                </span>
                <input
                  name="handle"
                  maxLength={24}
                  defaultValue={profile.handle ?? ""}
                  placeholder="matchday_maniac"
                  className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-bold text-white outline-none focus:border-cyan-300/70"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-fuchsia-200">
                  Bio
                </span>
                <textarea
                  name="bio"
                  maxLength={240}
                  rows={4}
                  defaultValue={profile.bio ?? ""}
                  className="resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-bold text-white outline-none focus:border-fuchsia-300/70"
                />
              </label>

              <button type="submit" className="glow-button-primary">
                Save community profile
              </button>
            </form>
          </section>

          <aside className="grid content-start gap-6">
            <section className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="neon-kicker">Account status</p>
              <p className="mt-3 text-2xl font-black uppercase text-white">
                {profile.status}
              </p>
              <p className="mt-2 text-sm text-slate-300">Role: {profile.role}</p>
            </section>
            <CommunityRulesPanel />
          </aside>
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <p className="neon-kicker">Your memes</p>
          <h2 className="mt-3 text-2xl font-black uppercase text-white">
            Submitted meme status
          </h2>
          {memes.length === 0 ? (
            <p className="mt-4 text-sm text-slate-300">
              No meme submissions yet.
            </p>
          ) : (
            <div className="mt-5 grid gap-3">
              {memes.map((meme) => (
                <div
                  key={meme.id}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/25 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-black text-white">{meme.title}</p>
                    <p className="text-sm text-slate-400">
                      {meme.rejection_reason ?? "No moderation note"}
                    </p>
                  </div>
                  <span className="w-fit rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-lime-100">
                    {meme.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
