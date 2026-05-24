export default function Home() {
  const checks = [
    {
      name: 'Supabase URL',
      ready: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    },
    {
      name: 'Supabase publishable key',
      ready: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    },
    {
      name: 'API-Football base URL',
      ready: Boolean(process.env.API_FOOTBALL_BASE_URL),
    },
    {
      name: 'API-Football key',
      ready: Boolean(process.env.API_FOOTBALL_KEY),
    },
  ];

  return (
    <main className='min-h-screen bg-slate-950 text-white'>
      <section className='mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16'>
        <p className='mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400'>
          Phase 0
        </p>

        <h1 className='max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl'>
          World Cup 2026 Fan Hub
        </h1>

        <p className='mt-6 max-w-2xl text-lg text-slate-300'>
          API-first football website foundation using Next.js, Vercel,
          Supabase, Tailwind, and API-Football.
        </p>

        <div className='mt-10 grid gap-4 sm:grid-cols-2'>
          {checks.map((check) => (
            <div
              key={check.name}
              className='rounded-2xl border border-slate-800 bg-slate-900 p-5'
            >
              <p className='text-sm text-slate-400'>{check.name}</p>
              <p className='mt-2 text-xl font-semibold'>
                {check.ready ? 'Configured' : 'Missing'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
