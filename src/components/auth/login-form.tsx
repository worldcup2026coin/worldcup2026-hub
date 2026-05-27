"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      const supabase = createClient();
      const origin = window.location.origin;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Check your email for the sign-in link.");
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
          Email address
        </span>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-4 text-base font-bold text-white outline-none transition focus:border-lime-300/60"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="glow-button-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send sign-in link"}
      </button>

      {message ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-200">
          {message}
        </p>
      ) : null}
    </form>
  );
}
