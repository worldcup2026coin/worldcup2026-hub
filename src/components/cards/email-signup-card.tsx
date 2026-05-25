export function EmailSignupCard() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-slate-950/40">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
        Email signup
      </p>

      <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
        Get matchday updates
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        This is a placeholder signup block. In a future update, this can connect
        to Supabase for email capture, fan segmentation, and tournament updates.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          disabled
          aria-label="Email address placeholder"
          placeholder="Email signup coming soon"
          className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm text-slate-300 outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          disabled
          className="min-h-12 rounded-2xl bg-emerald-400 px-5 text-sm font-bold text-slate-950 opacity-70 disabled:cursor-not-allowed"
        >
          Coming soon
        </button>
      </div>
    </section>
  );
}
