const CHAOS_CARDS = [
  {
    title: "Biggest upset loading?",
    body: "Which match has chaos written all over it?",
  },
  {
    title: "Loudest fanbase today",
    body: "Rep your team before kick-off.",
  },
  {
    title: "VAR disaster watch",
    body: "Every tournament needs one moment everyone argues about.",
  },
  {
    title: "Underdog chaos meter",
    body: "Who is about to ruin someone’s bracket?",
  },
  {
    title: "Most memeable match",
    body: "Some fixtures are born to become screenshots.",
  },
  {
    title: "Today’s main character",
    body: "Hero, villain, keeper, ref, or fan in the crowd?",
  },
];

export function FanChaosBoard() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-300">
          Fan Chaos Board
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
          Match-day chaos prompts
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHAOS_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
          >
            <h3 className="text-lg font-black text-white">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
