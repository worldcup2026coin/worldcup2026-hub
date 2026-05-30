import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Account | $WC26",
  description: "Manage your $WC26 prediction profile.",
};

async function updateProfile(formData: FormData) {
  "use server";

  const displayName = String(formData.get("displayName") ?? "").trim();
  const avatarLabel = String(formData.get("avatarLabel") ?? "Rookie").trim();

  if (displayName.length < 2 || displayName.length > 32) {
    redirect("/account?error=display-name");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("prediction_profiles")
    .upsert({
      user_id: user.id,
      display_name: displayName,
      avatar_label: avatarLabel || "Rookie",
    });

  if (error) {
    redirect("/account?error=save");
  }

  revalidatePath("/account");
  revalidatePath("/prediction-leaderboard");
  redirect("/account?saved=1");
}

export default async function AccountPage({
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

  const { data: profile } = await supabase
    .from("prediction_profiles")
    .select("display_name, avatar_label")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: communityProfile } = await supabase
    .from("community_profiles")
    .select("display_name, handle, role, status")
    .eq("id", user.id)
    .maybeSingle();

  const saved = params.saved === "1";
  const error = params.error;
  const role = communityProfile?.role ?? "user";
  const status = communityProfile?.status ?? "active";
  const isAdmin = role === "admin" && status === "active";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-6 rounded-[2rem] border border-lime-300/20 bg-lime-300/10 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="neon-kicker">Account status</p>
            <h1 className="mt-3 text-3xl font-black uppercase text-white">
              Signed in
            </h1>
            <p className="mt-3 break-all text-sm font-bold text-slate-300">
              {user.email ?? "Email unavailable"}
            </p>
          </div>
          <span className="w-fit rounded-full border border-lime-300/30 bg-lime-300/15 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-lime-100">
            {isAdmin ? "Admin" : role}
          </span>
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["Display name", communityProfile?.display_name ?? profile?.display_name ?? "Not set"],
            ["Community handle", communityProfile?.handle ? `@${communityProfile.handle}` : "Not set"],
            ["Community role", role],
            ["Community status", status],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
            >
              <dt className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                {label}
              </dt>
              <dd className="mt-2 break-words text-sm font-black text-white">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {isAdmin ? (
        <section className="mb-6 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <p className="neon-kicker">Admin tools</p>
          <h2 className="mt-3 text-2xl font-black uppercase text-white">
            Admin access confirmed
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["/admin/launch-control", "Launch Control"],
              ["/admin/moderation", "Moderation Hub"],
              ["/admin/moderation/chat", "Chat Moderation"],
              ["/admin/moderation/memes", "Meme Moderation"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="glow-button-secondary">
                {label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="neon-panel rounded-[2.25rem] p-6 sm:p-8">
        <p className="neon-kicker">$WC26 account</p>

        <h1 className="mt-5 text-4xl font-black uppercase leading-[0.9] text-white sm:text-6xl">
          Prediction profile
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300">
          Set the display name that appears on the community prediction
          leaderboard. Your email is only used for login and is not shown.
        </p>

        {saved ? (
          <p className="mt-5 rounded-2xl border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-sm font-bold text-lime-100">
            Profile saved.
          </p>
        ) : null}

        {error ? (
          <p className="mt-5 rounded-2xl border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-3 text-sm font-bold text-fuchsia-100">
            Could not save profile. Display name must be 2–32 characters.
          </p>
        ) : null}

        <form action={updateProfile} className="mt-7 grid gap-5">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.28em] text-lime-200">
              Display name
            </span>
            <input
              name="displayName"
              required
              minLength={2}
              maxLength={32}
              defaultValue={profile?.display_name ?? ""}
              placeholder="Mystery Fan"
              className="rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-4 text-base font-bold text-white outline-none transition focus:border-lime-300/60"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
              Fan label
            </span>
            <select
              name="avatarLabel"
              defaultValue={profile?.avatar_label ?? "Rookie"}
              className="rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-4 text-base font-bold text-white outline-none transition focus:border-lime-300/60"
            >
              <option>Rookie</option>
              <option>Dark Horse Hunter</option>
              <option>Golden Boot Scout</option>
              <option>Group Chaos Expert</option>
              <option>Upset Caller</option>
              <option>Host Nation Loyalist</option>
            </select>
          </label>

          <button type="submit" className="glow-button-primary">
            Save profile
          </button>
        </form>

        <form action="/auth/logout" method="post" className="mt-4">
          <button type="submit" className="glow-button-secondary">
            Sign out
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
        <p className="neon-kicker">Community profile</p>
        <h2 className="mt-3 text-2xl font-black uppercase text-white">
          Chat and meme wall identity
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Manage the display name, handle and bio shown beside community chat
          messages and approved memes.
        </p>
        <Link href="/community/profile" className="glow-button-secondary mt-5">
          Edit community profile
        </Link>
      </section>
    </main>
  );
}
