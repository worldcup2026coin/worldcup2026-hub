import type { Metadata } from "next";
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

  const saved = params.saved === "1";
  const error = params.error;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
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
    </main>
  );
}
