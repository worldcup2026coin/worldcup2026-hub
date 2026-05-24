import type { Fixture } from "@/lib/data/worldcup";

type MatchPreviewBlockProps = {
  fixture: Fixture;
};

export function MatchPreviewBlock({ fixture }: MatchPreviewBlockProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/30">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
        Fan preview
      </p>
      <h2 className="mt-3 text-2xl font-black text-white">
        {fixture.home_team_name ?? "Home"} vs {fixture.away_team_name ?? "Away"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        This is a placeholder preview area. Later, an admin/content system can
        add match storylines, team news, tactical notes, form context and fan
        talking points without changing the match page structure.
      </p>
    </section>
  );
}
