import Link from "next/link";
import type { Standing, Team } from "@/lib/data/worldcup";
import { teamSlug } from "@/lib/worldcup/format";

type TeamCardProps = {
  team: Team;
  standing?: Standing | null;
};

export function TeamCard({ team, standing }: TeamCardProps) {
  return (
    <Link
      href={`/teams/${teamSlug(team.name, team.api_team_id)}`}
      className="group rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-emerald-400/30"
    >
      <div className="flex items-center gap-4">
        {team.logo_url ? (
          <img
            src={team.logo_url}
            alt={`${team.name} logo`}
            className="h-14 w-14 rounded-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-black text-white">
            {team.name.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="min-w-0">
          <h2 className="truncate text-lg font-black text-white group-hover:text-emerald-200">
            {team.name}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {team.code ?? team.country ?? "Code TBC"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
          {team.country ?? "Country TBC"}
        </span>
        {standing ? (
          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            {standing.group_name} · Rank {standing.rank ?? "-"}
          </span>
        ) : (
          <span className="rounded-full bg-slate-400/10 px-3 py-1 text-xs font-semibold text-slate-300">
            Group TBC
          </span>
        )}
      </div>
    </Link>
  );
}
