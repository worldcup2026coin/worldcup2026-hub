
import Link from "next/link";
import Image from "next/image";
import type { Standing, Team } from "@/lib/data/worldcup";
import { teamSlug } from "@/lib/worldcup/format";
import { TeamFlag } from "@/components/worldcup/team-flag";

type TeamCardProps = {
  team: Team;
  standing?: Standing | null;
};

export function TeamCard({ team, standing }: TeamCardProps) {
  return (
    <Link
      href={`/teams/${teamSlug(team.name, team.api_team_id)}`}
      className="neon-card group w-full max-w-full rounded-[2rem] p-5"
    >
      <div className="flex items-center gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-[1.35rem] border border-lime-300/25 bg-white/10 p-2 shadow-[0_0_24px_rgba(163,255,18,0.10)]">
          {team.logo_url ? (
            <Image
              src={team.logo_url}
              alt={`${team.name} logo`}
              width={64}
              height={64}
              className="size-full rounded-xl object-contain"
            />
          ) : (
            <TeamFlag code={team.code} name={team.name} country={team.country} />
          )}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="neon-badge neon-badge-cyan">
              {standing?.group_name ?? "Group TBC"}
            </p>
          </div>
          <h2 className="mt-2 whitespace-normal break-normal text-lg font-black uppercase leading-tight tracking-tight text-white [overflow-wrap:normal] [text-wrap:balance] [word-break:normal] group-hover:text-lime-200 sm:text-xl">
            {team.name}
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-400">
            {team.code ?? team.country ?? "Code TBC"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid min-w-0 grid-cols-2 gap-3">
        <span className="min-w-0 whitespace-normal break-normal rounded-2xl border border-white/10 bg-slate-950/45 px-3 py-2 text-xs font-black uppercase tracking-[0.06em] text-slate-300 [overflow-wrap:normal] [word-break:normal] sm:tracking-[0.1em]">
          {team.country ?? "Country TBC"}
        </span>
        {standing ? (
          <span className="min-w-0 break-words rounded-2xl border border-lime-300/25 bg-lime-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-lime-100">
            {standing.points ?? 0} pts
          </span>
        ) : (
          <span className="min-w-0 break-words rounded-2xl border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-fuchsia-100">
            Signal TBC
          </span>
        )}
      </div>
    </Link>
  );
}
