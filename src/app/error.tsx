
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
      <div className="hero-panel rounded-[2.25rem] p-8">
        <p className="neon-kicker mx-auto">Signal error</p>
        <h1 className="neon-title glow-text mt-5 text-5xl font-black text-white sm:text-7xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300">
          The page could not load. Try again, or return to the homepage.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="glow-button-primary"
          >
            Try again
          </button>
          <Link href="/" className="glow-button-secondary">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
