import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  GROUP_PREDICTION_POINTS,
  MATCH_RESULT_POINTS,
  PREDICTION_TYPE_LABELS,
  TOURNAMENT_PREDICTION_POINTS,
} from "@/lib/predictions/scoring";

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
  opens_at: string | null;
  locks_at: string;
  points_result: number;
  points_exact: number;
  sort_order: number | null;
  fixture_api_id: number | null;
  correct_pick?: string | null;
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

const MATCH_TYPES = new Set(["match_result", "exact_score"]);
const LONG_TERM_TYPES = new Set([
  "tournament_winner",
  "runner_up",
  "tournament_runner_up",
  "semi_finalists",
  "quarter_finalists",
  "golden_boot",
  "golden_boot_winner",
  "host_nation_furthest",
  "dark_horse",
  "group_top_two",
  "full_group_standings",
  "best_third_placed_teams",
  "most_clean_sheets",
  "total_tournament_goals",
  "final_penalty_shootout",
  "golden_glove_winner",
]);

async function submitPrediction(formData: FormData) {
  "use server";

  const windowId = String(formData.get("windowId") ?? "");
  const predictionType = String(formData.get("predictionType") ?? "");
  const selectPick = String(formData.get("pick") ?? "").trim();
  const exactScore = String(formData.get("exactScore") ?? "").trim();
  const freePick = String(formData.get("freePick") ?? "").trim();

  const pick =
    predictionType === "exact_score" ? exactScore : selectPick || freePick;

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

  const { data: window, error: windowError } = await supabase
    .from("prediction_windows")
    .select("id, status, locks_at")
    .eq("id", windowId)
    .maybeSingle();

  if (windowError || !window || window.status !== "open") {
    redirect("/prediction-leaderboard?error=window-closed");
  }

  const locksAt = new Date(window.locks_at).getTime();

  if (!Number.isFinite(locksAt) || locksAt <= Date.now()) {
    redirect("/prediction-leaderboard?error=window-closed");
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

function formatLockDate(value: string | null | undefined) {
  if (!value) return "TBC";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatDateGroup(value: string | null | undefined) {
  if (!value) return "Date TBC";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function pointsLabel(window: PredictionWindow) {
  if (window.prediction_type === "exact_score") {
    return `${window.points_exact} pts exact score`;
  }

  return `${window.points_result} pts`;
}

function typeLabel(type: string) {
  return PREDICTION_TYPE_LABELS[type] ?? type.replace(/_/g, " ");
}

function groupByLockDate(windows: PredictionWindow[]) {
  return windows.reduce<Record<string, PredictionWindow[]>>((groups, window) => {
    const key = formatDateGroup(window.locks_at);
    groups[key] = groups[key] ?? [];
    groups[key].push(window);
    return groups;
  }, {});
}

function OptionPreview({
  options,
  compact,
}: {
  options: string[];
  compact: boolean;
}) {
  if (options.length < 2 || options.length > 8) {
    return null;
  }

  return (
    <div
      className={`mt-3 flex flex-wrap gap-2 ${
        compact ? "text-[0.7rem]" : "text-xs"
      }`}
    >
      {options.map((option) => (
        <span
          key={option}
          className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 font-bold text-slate-300"
        >
          {option}
        </span>
      ))}
    </div>
  );
}

function groupWinnerOrder(window: PredictionWindow) {
  const match =
    window.slug.match(/^group-([a-l])-winner$/i) ??
    window.title.match(/^group\s+([a-l])\b/i);

  if (!match) {
    return 999;
  }

  return match[1].toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
}

function WindowCard({
  window,
  existing,
  canSubmit,
  compact = false,
}: {
  window: PredictionWindow;
  existing?: FanPrediction;
  canSubmit: boolean;
  compact?: boolean;
}) {
  const isExactScore = window.prediction_type === "exact_score";
  const hasOptions = window.options.length > 0;
  const isOpen = window.status === "open";

  return (
    <article
      className={`rounded-[1.5rem] border border-white/10 bg-black/25 ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-200">
            {typeLabel(window.prediction_type)} · {pointsLabel(window)}
          </p>
          <h3
            className={`mt-2 font-black uppercase text-white ${
              compact ? "text-lg" : "text-xl"
            }`}
          >
            {window.title}
          </h3>
          {!compact ? (
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {window.description}
            </p>
          ) : null}
        </div>
        <span className="rounded-full border border-cyan-300/20 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
          {isOpen ? "Locks" : window.status} {formatLockDate(window.locks_at)} UTC
        </span>
      </div>

      {existing ? (
        <p className="mt-4 rounded-2xl border border-lime-300/20 bg-lime-300/10 px-4 py-3 text-sm font-bold text-lime-100">
          Current pick: {existing.pick}
        </p>
      ) : null}

      {!canSubmit ? (
        <OptionPreview options={window.options} compact={compact} />
      ) : null}

      {!isOpen ? null : canSubmit ? (
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
          ) : hasOptions ? (
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
          ) : (
            <input
              name="freePick"
              required
              placeholder="Type your pick"
              defaultValue={existing?.pick ?? ""}
              className="rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-4 text-sm font-bold text-white outline-none transition focus:border-lime-300/60"
            />
          )}

          <button type="submit" className="glow-button-secondary">
            {existing ? "Update pick" : "Submit pick"}
          </button>
        </form>
      ) : null}
    </article>
  );
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
      .select(
        "id, slug, title, description, prediction_type, status, options, opens_at, locks_at, points_result, points_exact, sort_order, fixture_api_id, correct_pick",
      )
      .in("status", ["open", "locked", "settled"])
      .order("status", { ascending: true })
      .order("sort_order", { ascending: true })
      .limit(260),
    supabase
      .from("prediction_leaderboard")
      .select(
        "user_id, display_name, avatar_label, total_predictions, total_points, correct_picks, exact_score_hits",
      )
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
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false }),
      ])
    : [{ data: null }, { data: [] }];

  const predictionMap = new Map(
    ((myPredictions ?? []) as FanPrediction[]).map((prediction) => [
      prediction.window_id,
      prediction,
    ]),
  );

  const visibleWindows = ((windows ?? []) as PredictionWindow[]).filter(
    (window) =>
      window.status !== "draft" &&
      window.status !== "archived" &&
      window.slug !== "tournament-winner-2026",
  );
  const openWindows = visibleWindows.filter((window) => window.status === "open");
  const longTermWindows = openWindows
    .filter((window) => LONG_TERM_TYPES.has(window.prediction_type))
    .slice(0, 24);
  const groupWinnerWindows = openWindows
    .filter((window) => window.prediction_type === "group_winner")
    .sort((a, b) => groupWinnerOrder(a) - groupWinnerOrder(b))
    .slice(0, 24);
  const matchWindows = openWindows
    .filter((window) => MATCH_TYPES.has(window.prediction_type))
    .slice(0, 36);
  const groupedMatchWindows = groupByLockDate(matchWindows);
  const recentlyLocked = visibleWindows
    .filter((window) => window.status === "locked")
    .slice(0, 8);
  const recentlySettled = visibleWindows
    .filter((window) => window.status === "settled")
    .slice(0, 8);
  const leaderboardRows = (leaderboard ?? []) as LeaderboardRow[];
  const myRecentPicks = ((myPredictions ?? []) as FanPrediction[]).slice(0, 8);
  const canSubmit = Boolean(user && profile?.display_name);

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
              Make fan predictions, lock them before kick-off and climb the
              community leaderboard. Anyone can view the competition. Logged-in
              fans can submit picks with email auth only.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-lime-300/20 bg-black/35 p-5">
            <p className="neon-kicker">Participation rule</p>
            <p className="mt-4 text-lg font-black text-white">
              Email login only · no wallet · no token holding · no payment
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Old predictions stay in the record forever and continue counting
              toward cumulative leaderboard totals after they leave the active
              view.
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
          Saved. Your prediction is locked in unless you update it before the
          window closes.
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-2xl border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-3 text-sm font-bold text-fuchsia-100">
          Something needs attention. Check your pick, display name, or sign-in
          session.
        </p>
      ) : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="neon-card rounded-[2rem] p-6">
          <p className="neon-kicker">How it works</p>
          <h2 className="mt-4 text-2xl font-black uppercase text-white">
            Open windows
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Prediction windows open before the relevant match or tournament
            deadline. Draft future windows stay hidden from visitors.
          </p>
        </article>
        <article className="neon-card rounded-[2rem] p-6">
          <p className="neon-kicker">Scoring</p>
          <h2 className="mt-4 text-2xl font-black uppercase text-white">
            Points stack up
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Match values rise by round, from group-stage calls to the final.
            Exact-score windows score separately.
          </p>
        </article>
        <article className="neon-card rounded-[2rem] p-6">
          <p className="neon-kicker">Record</p>
          <h2 className="mt-4 text-2xl font-black uppercase text-white">
            Cumulative table
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Settled and archived predictions are hidden from the main action
            list, but their points remain in the community leaderboard.
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-8">
          <section className="neon-panel rounded-[2rem] p-6">
            <p className="neon-kicker">Active windows</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">
              Long-term tournament picks
            </h2>

            {!user ? (
              <div className="mt-6 rounded-[1.5rem] border border-cyan-300/20 bg-black/30 p-5">
                <p className="text-sm leading-6 text-slate-300">
                  Sign in to submit predictions. You can still view every open
                  window and the leaderboard without logging in.
                </p>
                <Link href="/auth/login" className="glow-button-primary mt-5">
                  Sign in
                </Link>
              </div>
            ) : !profile?.display_name ? (
              <form
                action={updateDisplayName}
                className="mt-6 grid gap-4 rounded-[1.5rem] border border-lime-300/20 bg-black/30 p-5"
              >
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
              {longTermWindows.length ? (
                longTermWindows.map((window) => (
                  <WindowCard
                    key={window.id}
                    window={window}
                    existing={predictionMap.get(window.id)}
                    canSubmit={canSubmit}
                  />
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-slate-300">
                  No long-term prediction windows are open right now. They will
                  appear here when the tournament game opens them.
                </p>
              )}
            </div>
          </section>

          <section className="neon-panel rounded-[2rem] p-6">
            <p className="neon-kicker">Group picks</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">
              Group winner picks
            </h2>
            <div className="mt-6 grid gap-4">
              {!canSubmit && groupWinnerWindows.length ? (
                <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-4">
                  <p className="text-sm leading-6 text-cyan-100">
                    Sign in and create a display name once to submit group
                    winner picks.
                  </p>
                  {!user ? (
                    <Link href="/auth/login" className="glow-button-primary mt-4">
                      Sign in
                    </Link>
                  ) : null}
                </div>
              ) : null}

              {groupWinnerWindows.length ? (
                groupWinnerWindows.map((window) => (
                  <WindowCard
                    key={window.id}
                    window={window}
                    existing={predictionMap.get(window.id)}
                    canSubmit={canSubmit}
                    compact
                  />
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-slate-300">
                  Group winner windows will appear here when group/team data is
                  available.
                </p>
              )}
            </div>
          </section>

          <section className="neon-panel rounded-[2rem] p-6">
            <p className="neon-kicker">Match picks</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">
              Open match windows
            </h2>
            <div className="mt-6 grid gap-6">
              {!canSubmit && matchWindows.length ? (
                <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
                  <p className="text-sm leading-6 text-cyan-100">
                    Sign in and create a display name once to submit match
                    picks.
                  </p>
                  {!user ? (
                    <Link href="/auth/login" className="glow-button-primary mt-4">
                      Sign in
                    </Link>
                  ) : null}
                </div>
              ) : null}

              {Object.entries(groupedMatchWindows).length ? (
                Object.entries(groupedMatchWindows).map(([date, dateWindows]) => (
                  <div key={date} className="grid gap-4">
                    <h3 className="text-lg font-black uppercase text-white">
                      {date}
                    </h3>
                    {dateWindows.map((window) => (
                      <WindowCard
                        key={window.id}
                        window={window}
                        existing={predictionMap.get(window.id)}
                        canSubmit={canSubmit}
                      />
                    ))}
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-slate-300">
                  No match windows are open right now. Match result and exact
                  score windows open 72 hours before kick-off.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="grid content-start gap-6">
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
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        {row.avatar_label} · {row.correct_picks} correct ·{" "}
                        {row.exact_score_hits} exact
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
            <p className="neon-kicker">My picks</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">
              Recent picks
            </h2>
            <div className="mt-5 grid gap-3">
              {user && myRecentPicks.length ? (
                myRecentPicks.map((prediction) => (
                  <p
                    key={prediction.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-slate-300"
                  >
                    {prediction.pick} · {prediction.result_status} ·{" "}
                    {prediction.points_awarded} pts
                  </p>
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-slate-300">
                  Your recent picks appear here after you sign in and submit.
                </p>
              )}
            </div>
          </section>

          <section className="neon-card rounded-[2rem] p-6">
            <p className="neon-kicker">Recently locked</p>
            <div className="mt-5 grid gap-3">
              {recentlyLocked.length ? (
                recentlyLocked.map((window) => (
                  <p
                    key={window.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-slate-300"
                  >
                    {window.title} · settling when results are ready
                  </p>
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-slate-300">
                  Locked windows will appear here briefly while they wait for
                  reliable result data.
                </p>
              )}
            </div>
          </section>

          <section className="neon-card rounded-[2rem] p-6">
            <p className="neon-kicker">Recently settled</p>
            <div className="mt-5 grid gap-3">
              {recentlySettled.length ? (
                recentlySettled.map((window) => (
                  <p
                    key={window.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-slate-300"
                  >
                    {window.title} · correct: {window.correct_pick ?? "recorded"}
                  </p>
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm font-bold text-slate-300">
                  Settled windows appear after results have been confirmed.
                </p>
              )}
            </div>
          </section>

          <section className="neon-card rounded-[2rem] p-6">
            <p className="neon-kicker">Scoring rules</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">
              Points
            </h2>
            <ul className="mt-5 grid gap-3 text-sm font-bold leading-6 text-slate-300">
              <li>Match result: {Object.values(MATCH_RESULT_POINTS).slice(0, 6).join(" / ")} pts by round</li>
              <li>Exact score: separate windows, no result double count</li>
              <li>Tournament winner: {TOURNAMENT_PREDICTION_POINTS.champion} pts</li>
              <li>Runner-up: {TOURNAMENT_PREDICTION_POINTS.runnerUp} pts</li>
              <li>Golden Boot: {TOURNAMENT_PREDICTION_POINTS.goldenBoot} pts</li>
              <li>Group winner: {GROUP_PREDICTION_POINTS.winner} pts</li>
              <li>Perfect full-group order bonus: {GROUP_PREDICTION_POINTS.perfectGroupBonus} pts</li>
            </ul>
          </section>

          <section className="neon-card rounded-[2rem] p-6">
            <p className="neon-kicker">Disclaimer</p>
            <p className="mt-4 text-sm font-bold leading-6 text-slate-300">
              Fan predictions are for community entertainment and football
              debate only. They are not betting advice, financial advice,
              official tournament content, or a promise of rewards.
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
}
