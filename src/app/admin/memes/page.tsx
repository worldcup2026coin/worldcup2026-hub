import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { approveMemeSubmission, rejectMemeSubmission } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meme Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  searchParams?: Promise<{
    key?: string | string[];
  }>;
};

type MemeSubmissionRow = {
  id: string;
  name: string | null;
  handle: string | null;
  email: string | null;
  meme_url: string;
  caption: string | null;
  status: string;
  consent_to_feature: boolean;
  created_at: string;
};

function getSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  return value;
}

function getServiceRoleKey() {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return value;
}

function getAdminKey() {
  const value = process.env.MEME_ADMIN_KEY;
  if (!value) throw new Error("Missing MEME_ADMIN_KEY");
  return value;
}

function createAdminSupabaseClient() {
  return createClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function getPendingSubmissions() {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("meme_submissions")
    .select("id, name, handle, email, meme_url, caption, status, consent_to_feature, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("getPendingSubmissions error:", error.message);
    return [];
  }

  return (data ?? []) as MemeSubmissionRow[];
}

function getKeyFromSearchParams(searchParams?: { key?: string | string[] }) {
  const value = searchParams?.key;
  return Array.isArray(value) ? value[0] : value || "";
}

export default async function MemeAdminPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const providedKey = getKeyFromSearchParams(resolvedSearchParams);
  const isAuthorized = providedKey === getAdminKey();

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h1 className="text-3xl font-black">Meme Admin</h1>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Enter your private admin key to review pending meme submissions.
          </p>

          <form method="get" className="mt-6 grid gap-3">
            <input
              name="key"
              type="password"
              placeholder="Admin key"
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-lime-300 px-5 py-3 text-sm font-black text-black"
            >
              Open admin
            </button>
          </form>
        </div>
      </main>
    );
  }

  const submissions = await getPendingSubmissions();

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-300">
            Private Admin
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Pending meme submissions
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Approve only memes that fit the football-first community vibe.
            Submissions are never auto-published.
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="font-bold">No pending meme submissions.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {submissions.map((submission) => (
              <article
                key={submission.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="grid gap-5 md:grid-cols-[220px_1fr]">
                  <a
                    href={submission.meme_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-2xl border border-white/10 bg-black/30"
                  >
                    <img
                      src={submission.meme_url}
                      alt={submission.caption || "Submitted meme"}
                      className="h-48 w-full object-cover"
                    />
                  </a>

                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-black">
                        {submission.caption || "Community World Cup meme"}
                      </h2>

                      <div className="mt-2 space-y-1 text-sm text-white/60">
                        <p>Status: {submission.status}</p>
                        <p>
                          Handle:{" "}
                          {submission.handle || submission.name || "Not provided"}
                        </p>
                        <p>Email: {submission.email || "Not provided"}</p>
                        <p>
                          Consent:{" "}
                          {submission.consent_to_feature ? "Yes" : "No"}
                        </p>
                        <p>
                          Submitted:{" "}
                          {new Date(submission.created_at).toLocaleString("en-GB")}
                        </p>
                      </div>
                    </div>

                    <p className="break-all rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-white/60">
                      {submission.meme_url}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <form action={approveMemeSubmission}>
                        <input type="hidden" name="adminKey" value={providedKey} />
                        <input
                          type="hidden"
                          name="submissionId"
                          value={submission.id}
                        />
                        <button
                          type="submit"
                          className="rounded-full bg-lime-300 px-5 py-3 text-sm font-black text-black"
                        >
                          Approve
                        </button>
                      </form>

                      <form action={rejectMemeSubmission}>
                        <input type="hidden" name="adminKey" value={providedKey} />
                        <input
                          type="hidden"
                          name="submissionId"
                          value={submission.id}
                        />
                        <button
                          type="submit"
                          className="rounded-full border border-red-400/50 px-5 py-3 text-sm font-black text-red-200 hover:bg-red-400/10"
                        >
                          Reject
                        </button>
                      </form>

                      <a
                        href={submission.meme_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white hover:bg-white/10"
                      >
                        Open source
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="text-xs leading-6 text-white/45">
          Private moderation page. Do not share this URL or admin key publicly.
        </p>
      </div>
    </main>
  );
}
