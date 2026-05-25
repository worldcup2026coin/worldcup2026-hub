
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="neon-panel animate-pulse rounded-[2.25rem] p-8">
        <div className="h-4 w-40 rounded-full bg-lime-300/20" />
        <div className="mt-5 h-12 w-3/4 rounded-full bg-white/10" />
        <div className="mt-4 h-4 w-2/3 rounded-full bg-cyan-300/10" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="h-40 rounded-3xl border border-lime-300/15 bg-lime-300/10" />
          <div className="h-40 rounded-3xl border border-cyan-300/15 bg-cyan-300/10" />
          <div className="h-40 rounded-3xl border border-fuchsia-300/15 bg-fuchsia-400/10" />
        </div>
      </div>
    </div>
  );
}
