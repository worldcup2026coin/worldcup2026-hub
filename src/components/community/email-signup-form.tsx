"use client";

import { track } from "@vercel/analytics";

import { useState } from "react";

type EmailSignupFormProps = {
  source: string;
  title?: string;
  description?: string;
};

export function EmailSignupForm({
  source,
  title = "Join the World Cup fan list",
  description = "Get tournament updates, community notes and new feature announcements.",
}: EmailSignupFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/community/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          consent,
          source,
          sourceUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== "ok") {
        setStatus("error");
        track("email_signup_error", { source });
        setMessage(data.error ?? "Unable to subscribe.");
        return;
      }

      setStatus("ok");
      track("email_signup", { source });
      setMessage("You are on the list.");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
      track("email_signup_error", { source });
      setMessage("Unable to subscribe right now.");
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
        Email updates
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>

      <form onSubmit={submitForm} className="mt-5 grid gap-3">
        <input
          type="email"
          aria-label="Email address"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
        />

        <label className="flex gap-3 text-xs leading-5 text-slate-300">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 accent-emerald-400"
          />
          I agree to receive World Cup 2026 Hub updates. Every marketing email will include an unsubscribe link.
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="min-h-11 rounded-2xl bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Joining..." : "Join list"}
        </button>

        {message ? (
          <p
            className={`text-sm ${
              status === "error" ? "text-rose-300" : "text-emerald-300"
            }`}
          >
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}

