"use client";

import { useState } from "react";

export function MemeSubmitForm({ signedIn }: { signedIn: boolean }) {
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!signedIn) {
    return (
      <section className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <h2 className="text-xl font-black uppercase text-white">
          Sign in to submit
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Meme uploads go to moderation first. Approved memes appear publicly.
        </p>
        <a href="/auth/login" className="glow-button-primary mt-5">
          Sign in
        </a>
      </section>
    );
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setNotice(null);

    const form = event.currentTarget;
    const response = await fetch("/api/community/memes", {
      method: "POST",
      body: new FormData(form),
    });
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      message?: string;
    } | null;

    setPending(false);
    if (!response.ok) {
      setNotice(payload?.error ?? "Submission failed.");
      return;
    }

    form.reset();
    setNotice(payload?.message ?? "Meme submitted for review.");
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-[2rem] border border-lime-300/20 bg-lime-300/10 p-5"
    >
      <p className="neon-kicker">Submit meme</p>
      <h2 className="mt-3 text-2xl font-black uppercase text-white">
        Submit for review
      </h2>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">
            Title
          </span>
          <input
            name="title"
            required
            minLength={2}
            maxLength={80}
            className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-bold text-white outline-none focus:border-lime-300/70"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
            Caption
          </span>
          <textarea
            name="caption"
            maxLength={220}
            rows={3}
            className="resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-bold text-white outline-none focus:border-cyan-300/70"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-200">
            Image
          </span>
          <input
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            required
            className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-slate-200"
          />
        </label>

        <label className="flex gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-300">
          <input name="confirm" type="checkbox" required className="mt-1" />
          <span>
            I confirm this is fan-made content and does not use official FIFA
            logos, official World Cup marks, official mascots, team crests,
            sponsor marks, or copyrighted images I do not have rights to use.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="glow-button-primary mt-5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Submitting..." : "Submit for review"}
      </button>

      {notice ? (
        <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-slate-200">
          {notice}
        </p>
      ) : null}
    </form>
  );
}
