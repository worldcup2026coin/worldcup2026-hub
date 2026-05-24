export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.055] p-8">
        <div className="h-4 w-40 rounded-full bg-white/10" />
        <div className="mt-5 h-10 w-3/4 rounded-full bg-white/10" />
        <div className="mt-4 h-4 w-2/3 rounded-full bg-white/10" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="h-40 rounded-3xl bg-white/10" />
          <div className="h-40 rounded-3xl bg-white/10" />
          <div className="h-40 rounded-3xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}
