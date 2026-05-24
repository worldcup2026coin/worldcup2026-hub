"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 shadow-2xl shadow-slate-950/30">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-300">
          Error
        </p>
        <h1 className="mt-4 text-4xl font-black text-white">
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300">
          The page could not load. Try again, or return to the homepage.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-400 px-5 text-sm font-black text-slate-950"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
