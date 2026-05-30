import type { MatchEvent } from "@/lib/data/worldcup";
import { MatchEmptyState } from "@/components/matches/match-empty-state";

type MatchEventsTimelineProps = {
  events: MatchEvent[];
};

function eventIcon(eventType: string | null) {
  const type = eventType?.toLowerCase() ?? "";

  if (type.includes("goal")) return "⚽";
  if (type.includes("card")) return "🟨";
  if (type.includes("subst")) return "🔁";
  if (type.includes("var")) return "📺";

  return "•";
}

export function MatchEventsTimeline({ events }: MatchEventsTimelineProps) {
  if (events.length === 0) {
    return (
      <MatchEmptyState
        title="No match events yet"
        description="Goals, cards, substitutions, VAR and other events will appear here automatically when API-Football releases match events and the matchday sync has run."
      />
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30">
      <h2 className="text-2xl font-black text-white">Match events</h2>

      <div className="mt-5 grid gap-3">
        {events.map((event) => (
          <article
            key={event.id}
            className="flex gap-4 rounded-2xl bg-white/[0.04] p-4"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg">
              {eventIcon(event.event_type)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-black text-white">
                  {event.elapsed ?? "-"}
                  {event.extra ? `+${event.extra}` : ""}&apos;
                </span>
                <span className="text-sm font-bold text-emerald-200">
                  {event.event_type ?? "Event"}
                </span>
                {event.event_detail ? (
                  <span className="text-sm text-slate-400">
                    {event.event_detail}
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-sm font-bold text-white">
                {event.player_name ?? event.team_name ?? "Details TBC"}
              </p>

              {event.assist_name ? (
                <p className="mt-1 text-xs text-slate-400">
                  Assist: {event.assist_name}
                </p>
              ) : null}

              {event.comments ? (
                <p className="mt-2 text-sm text-slate-300">{event.comments}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

