
export function EmailSignupCard() {
  return (
    <section className="neon-panel rounded-[2rem] p-6">
      <p className="neon-kicker">Email signal</p>

      <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white">
        Get matchday updates
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        Get World Cup 2026 updates when signup is available.
        fan segmentation, and tournament updates when ready.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          disabled
          aria-label="Email address placeholder"
          placeholder="Email updates unavailable"
          className="min-h-12 rounded-2xl border px-4 text-sm text-slate-300 outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          disabled
          className="glow-button-primary opacity-70 disabled:cursor-not-allowed"
        >
          Updates unavailable
        </button>
      </div>
    </section>
  );
}



