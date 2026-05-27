import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | $WC26 Predictions",
  description: "Sign in to submit $WC26 fan predictions and appear on the community leaderboard.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="hero-panel rounded-[2.25rem] p-6 sm:p-8">
        <p className="neon-kicker">$WC26 prediction login</p>

        <h1 className="neon-title glow-text mt-5 text-4xl font-black uppercase leading-[0.9] text-white sm:text-6xl">
          Sign in to make your picks
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
          Enter your email and we’ll send a secure sign-in link. No wallet,
          token holding or payment required.
        </p>

        <LoginForm />

        <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
          <Link href="/prediction-leaderboard" className="text-lime-200 hover:text-white">
            Back to leaderboard
          </Link>
          <Link href="/predictions" className="text-cyan-200 hover:text-white">
            View official predictions
          </Link>
        </div>
      </section>
    </main>
  );
}
