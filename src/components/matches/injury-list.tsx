import type { Injury } from "@/lib/data/injuries";

type InjuryListProps = {
  title: string;
  injuries: Injury[];
};

export function InjuryList({ title, injuries }: InjuryListProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/30">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
        Injuries
      </p>
      <h2 className="mt-3 text-2xl font-black text-white">{title}</h2>

      {injuries.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-slate-300">
          No injury data is available yet. This section will update automatically when API-Football provides injury records.
        </p>
      ) : (
        <div className="mt-5 grid gap-3">
          {injuries.map((injury) => (
            <article
              key={`${injury.api_fixture_id}-${injury.api_team_id}-${injury.api_player_id}-${injury.reason}`}
              className="rounded-2xl bg-white/[0.04] p-4"
            >
              <p className="font-black text-white">
                {injury.player_name ?? "Player TBC"}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {injury.team_name ?? "Team TBC"}
              </p>
              <p className="mt-2 text-sm text-rose-200">
                {injury.type ?? "Unavailable"}
                {injury.reason ? ` · ${injury.reason}` : ""}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
