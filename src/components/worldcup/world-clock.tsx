type WorldClockProps = {
  matchDate: string | null | undefined;
  venueLabel?: string | null;
  venueTimeZone?: string | null;
};

const clockZones = [
  ["Mexico City", "America/Mexico_City"],
  ["New York", "America/New_York"],
  ["London", "Europe/London"],
  ["Tokyo", "Asia/Tokyo"],
] as const;

function formatClock(value: string | null | undefined, timeZone: string) {
  if (!value) return "TBC";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "TBC";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
  }).format(date);
}

export function WorldClock({
  matchDate,
  venueLabel = "Venue",
  venueTimeZone,
}: WorldClockProps) {
  const rows = venueTimeZone
    ? [[venueLabel ?? "Venue", venueTimeZone] as const, ...clockZones]
    : clockZones;

  return (
    <section className="rounded-[2rem] border border-cyan-300/15 bg-cyan-300/[0.06] p-5">
      <p className="neon-kicker">World clock</p>
      <h2 className="mt-4 text-2xl font-black uppercase text-white">
        Kickoff around the world
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {rows.slice(0, 5).map(([label, zone]) => (
          <div
            key={`${label}-${zone}`}
            className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
          >
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-xl font-black text-white">
              {formatClock(matchDate, zone)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
