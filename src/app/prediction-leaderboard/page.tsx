import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Prediction Leaderboard | $WC26",
  description:
    "Join the $WC26 fan prediction game, submit your World Cup picks and climb the community leaderboard.",
};

type PredictionWindow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  prediction_type: string;
  status: string;
  options: string[];
  locks_at: string;
  points_result: number;
  points_exact: number;
};

type FanPrediction = {
  id: string;
  window_id: string;
  pick: string;
  exact_score: string | null;
  points_awarded: number;
  result_status: string;
};

type LeaderboardRow = {
  user_id: string;
  display_name: string;
  avatar_label: string;
  total_predictions: number;
  total_points: number;
  correct_picks: number;
  exact_score_hits: number;
};

async function submitPrediction(formData: FormData) {
  "use server";

  const windowId = String(formData.get("windowId") ?? "");
  const predictionType = String(formData.get("predictionType") ?? "");
  const selectPick = String(formData.get("pick") ?? "").trim();
  const exactScore = String(formData.get("exactScore") ?? "").trim();

  const pick = predictionType === "exact_score" ? exactScore : selectPick;

  if (!windowId || !pick) {
    redirect("/prediction-leaderboard?error=missing-pick");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { error } = await supabase.from("fan_predictions").upsert(
    {
      user_id: user.id,
      window_id: windowId,
      pick,
      exact_score: predictionType === "exact_score" ? exactScore : null,
      result_status: "pending",
    },
    {
      onConflict: "user_id,window_id",
    },
  );

  if (error) {
    redirect("/prediction-leaderboard?error=submit");
  }

  revalidatePath("/prediction-leaderboard");
  redirect("/prediction-leaderboard?saved=1");
}

async function updateDisplayName(formData: FormData) {
  "use server";

  const displayName = String(formData.get("displayName") ?? "").trim();

  if (displayName.length < 2 || displayName.length > 32) {
    redirect("/prediction-leaderboard?error=display-name");
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
    .upsert({ user_id: user.id, display_name: displayName, avatar_label: "Rookie" });

  if (error) {
    redirect("/prediction-leaderboard?error=profile");
  }

  revalidatePath("/prediction-leaderboard");
  redirect("/prediction-leaderboard?saved=1");
}

function formatLockDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function pointsLabel(window: PredictionWindow) {
  if (window.prediction_type === "exact_score") {
    return `${window.points_exact} pts exact score`;
  }

  if (window.points_exact > 0) {
    return `${window.points_result} pts result · ${window.points_exact} pts exact`;
  }

  return `${window.points_result} pts`;
}

export default async function PredictionLeaderboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: windows }, { data: leaderboard }] = await Promise.all([
    supabase
      .from("prediction_windows")
      .select("id, slug, title, description, prediction_type, status, options, locks_at, points_result, points_exact")
      .eq("status", "open")
      .order("sort_order"),
    supabase
      .from("prediction_leaderboard")
      .select("user_id, display_name, avatar_label, total_predictions, total_points, correct_picks, exact_score_hits")
      .limit(25),
  ]);

  const [{ data: profile }, { data: myPredictions }] = user
    ? await Promise.all([
        supabase
          .from("prediction_profiles")
          .select("display_name, avatar_label")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("fan_predictions")
          .select("id, window_id, pick, exact_score, points_awarded, result_status")
          .eq("user_id", user.id),
      ])
    : [{ data: null }, { data: [] }];

  const predictionMap = new Map(
    ((myPredictions ?? []) as FanPrediction[]).map((prediction) => [
      prediction.window_id,
      prediction,
    ]),
  );

  const openWindows = (windows ?? []) as PredictionWindow[];
  const leaderboardRows = (leaderboard ?? []) as LeaderboardRow[];

  const saved = params.saved === "1";
  const error = params.error;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="hero-panel rounded-[2.25rem] p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="neon-kicker">$WC26 fan prediction game</p>
            <h1 className="neon-title glow-text mt-5 text-4xl font-black uppercase leading-[0.9] text-white sm:text-6xl lg:text-7xl">
              Prediction leaderboard
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
              Make your World Cup picks, lock them before kick-off and climb
              the community table. Anyone can view. Only logged-in fans can
              submit predictions.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-lime-300/20 bg-black/35 p-5">
            <p className="neon-kicker">Participation rule</p>
            <p className="mt-4 text-lg font-black text-white">
              Email login only · no wallet · no token holding · no payment
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {user ? (
                <Link href="/account" className="glow-button-primary">
                  Manage profile
                </Link>
              ) : (
                <Link href="/auth/login" className="glow-button-primary">
                  Sign in to make picks
                </Link>
              )}
              <Link href="/predictions" className="glow-button-secondary">
                Official $WC26 AI reads
              </Link>
            </div>
          </div>
        </div>
      </section>

      {saved ? (
        <p className="mt-6 rounded-2xl border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-sm font-bold text-lime-100">
          Saved. Your prediction is locked in unless you update it before the window closes.
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-2xl border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-3 text-sm font-bold text-fuchsia-100">
          Something needs attention. Check your pick, display name, or sign-in session.
        </p>
      ) : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="neon-card rounded-[2rem] p-6">
          <p className="neon-kicker">Step 1</p>
          <h2 className="mt-4 text-2xl font-black uppercase text-white">Sign in</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Use email magic link login. Your email is not shown publicly.
          </p>
        </article>
        <article className="neon-card rounded-[2rem] p-6">
          <p className="neon-kicker">Step 2</p>
          <h2 className="mt-4 text-2xl font-black uppercase text-white">Make picks</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Submit tournament and match predictions before each window locks.
          </p>
        </article>
        <article className="neon-card rounded-[2rem] p-6">
          <p className="neon-kicker">Step 3</p>
          <h2 className="mt-4 text-2xl font-black uppercase text-white">Score points</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Correct calls earn points after results are settled.
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="neon-panel rounded-[2rem] p-6">
          <p className="neon-kicker">Active windows</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-white">
            Make your picks
          </h2>

          {!user ? (
            <div className="mt-6 rounded-[1.5rem] border border-cyan-300/20 bg-black/30 p-5">
              <p className="text-sm leading-6 text-slate-300">
                Sign in to submit predictions. You can still view the windows
                and leaderboard without logging in.
              </p>
              <Link href="/auth/login" className="glow-button-primary mt-5">
                Sign in
              </Link>
            </div>
          ) : !profile?.display_name ? (
            <form action={updateDisplayName} className="mt-6 grid gap-4 rounded-[1.5rem] border border-lime-300/20 bg-black/30 p-5">
              <p className="text-sm leading-6 text-slate-300">
                Choose a display name before making picks.
              </p>
              <input
                name="displayName"
                required
                minLength={2}
                maxLength={32}
                placeholder="Mystery Fan"
                className="rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-4 text-base font-bold text-white outline-none transition focus:border-lime-300/60"
              />
              <button type="submit" className="glow-button-primary">
                Save display name
              </button>
            </form>
          ) : null}

          <div className="mt-6 grid gap-5">
            {openWindows.map((window) => {
              const existing = predictionMap.get(window.id);
              const isExactScore = window.prediction_type === "exact_score";

              return (
                <article
                  key={window.id}
                  className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-lime-200">
                        {pointsLabel(window)}
                      </p>
                      <h3 className="mt-2 text-xl font-black uppercase text-white">
                        {window.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {window.description}
                      </p>
                    </div>
                    <span className="rounded-full border border-cyan-300/20 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                      Locks {formatLockDate(window.locks_at)} UTC
                    </span>
                  </div>

                  {existing ? (
                    <p className="mt-4 rounded-2xl border border-lime-300/20 bg-lime-300/10 px-4 py-3 text-sm font-bold text-lime-100">
                      Current pick: {existing.pick}
                    </p>
                  ) : null}

                  {user && profile?.display_name ? (
                    <form action={submitPrediction} className="mt-4 grid gap-3">
                      <input type="hidden" name="windowId" value={window.id} />
                      <input type="hidden" name="predictionType" value={window.prediction_type} />

                      {isExactScore ? (
                        <input
                          name="exactScore"
                          required
                          placeholder="Example: Mexico 2-1 South Africa"
                          defaultValue={existing?.exact_score ?? ""}
                          className="rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-4 text-sm font-bold text-white outline-none transition focus:border-lime-300/60"
                        />
                      ) : (
                        <select
                          name="pick"
                          required
                          defaultValue={existing?.pick ?? ""}
                          className="rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-4 text-sm font-bold text-white outline-none transition focus:border-lime-300/60"
                        >
                          <option value="" disabled>
                            Choose your pick
                          </option>
                          {window.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      <button type="submit" className="glow-button-secondary">
                        {existing ? "Update pick" : "Submit pick"}
                      </button>
                    </form>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>

        <aside className="grid gap-6">
          <section className="neon-panel rounded-[2rem] p-6">
            <p className="neon-kicker">Community table</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">
              Leaderboard
            </h2>

            <div className="mt-6 grid gap-3">
              {leaderboardRows.length ? (
                leaderboardRows.map((row, index) => (
                  <div
                    key={row.user_id}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                  >
                    <span className="text-lg font-black text-lime-200">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-black text-white">{row.display_name}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        {row.avatar_label} · {row.correct_picks} correct · {row.exact_score_hits} exact
                      </p>
                    </div>
                    <span className="text-2xl font-black text-white">
                      {row.total_points}
                    </span>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-slate-300">
                  No fan predictions yet. First signed-in picks will appear here
                  after profiles are created.
                </p>
              )}
            </div>
          </section>

          <section className="neon-card rounded-[2rem] p-6">
            <p className="neon-kicker">Scoring</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">
              Points rules
            </h2>
            <ul className="mt-5 grid gap-3 text-sm font-bold leading-6 text-slate-300">
              <li>Correct match result: 3 points</li>
              <li>Exact opening score: 8 points</li>
              <li>Tournament winner: 25 points</li>
              <li>Golden Boot winner: 15 points</li>
              <li>Dark horse pick: 10 points</li>
              <li>Host nation furthest: 10 points</li>
            </ul>
          </section>

          <section className="neon-card rounded-[2rem] p-6">
            <p className="neon-kicker">Disclaimer</p>
            <p className="mt-4 text-sm font-bold leading-6 text-slate-300">
              Fan predictions are for community entertainment and tournament
              debate only. They are not betting advice, financial advice or a
              promise of rewards.
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
}
