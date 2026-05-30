
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FixtureCard } from "@/components/worldcup/fixture-card";
import { getPlayerProfileBySlug } from "@/lib/data/players";
import { teamSlug } from "@/lib/worldcup/format";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayerProfileBySlug(slug);

  return {
    title: `${player.name ?? "Player"} | World Cup 2026 Hub`,
    description: `World Cup 2026 profile for ${player.name ?? "player"}, including squad role, injury status and tournament rankings.`,
  };
}

function labelStat(type: string) {
  if (type === "scorers") return "Goals";
  if (type === "assists") return "Assists";
  if (type === "yellow_cards") return "Yellow cards";
  if (type === "red_cards") return "Red cards";
  return type;
}

function roleSummary(player: Awaited<ReturnType<typeof getPlayerProfileBySlug>>) {
  if (player.captain) return "Captain and senior squad reference point.";
  if ((player.lineups ?? 0) > 0) return "Starter profile based on synced lineup data.";
  if ((player.appearances ?? 0) > 0) return "Squad rotation option with tournament minutes.";
  return "Squad role will sharpen when more match data is synced.";
}

export default async function PlayerPage({ params }: Props) {
  const { slug } = await params;
  const player = await getPlayerProfileBySlug(slug);

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <section className="hero-panel rounded-[2.25rem] p-6 sm:p-10">
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">
            {player.photo_url ? (
              <Image
                src={player.photo_url}
                alt={player.name ?? "Player"}
                width={112}
                height={112}
                className="size-28 rounded-[2rem] border border-lime-300/25 object-cover shadow-[0_0_28px_rgba(163,255,18,0.14)]"
              />
            ) : (
              <div className="flex size-28 items-center justify-center rounded-[2rem] border border-lime-300/25 bg-lime-300/10 text-4xl">
                ⚽
              </div>
            )}

            <div>
              <p className="neon-kicker">Player signal</p>
              <h1 className="neon-title glow-text mt-4 text-5xl font-black leading-[0.9] text-white sm:text-7xl">
                {player.name ?? "Player TBC"}
              </h1>
              <p className="mt-4 text-base font-semibold text-slate-300">
                {player.team_name ?? "Team TBC"}
                {player.position ? ` · ${player.position}` : ""}
                {player.number ? ` · #${player.number}` : ""}
                {player.age ? ` · Age ${player.age}` : ""}
              </p>
            </div>
          </div>
        </section>

        <nav className="sticky top-3 z-20 mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/85 p-2 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <div className="flex min-w-max gap-2">
            {[
              ["Overview", "overview"],
              ["Role", "role"],
              ["Availability", "availability"],
              ["Rankings", "rankings"],
              ["Fixtures", "fixtures"],
            ].map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        <section
          id="overview"
          className="mt-6 scroll-mt-24 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Team
            </p>
            {player.team_name && player.api_team_id ? (
              <Link
                href={`/teams/${teamSlug(player.team_name, player.api_team_id)}`}
                className="mt-2 block text-lg font-black text-lime-200 hover:text-white"
              >
                {player.team_name}
              </Link>
            ) : (
              <p className="mt-2 text-lg font-black text-white">Team TBC</p>
            )}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Position role
            </p>
            <p className="mt-2 text-lg font-black text-white">
              {player.position ?? "Position TBC"}
            </p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Availability
            </p>
            <p className="mt-2 text-lg font-black text-white">
              {player.injuries.length > 0 ? "Injury note" : "No listed injury"}
            </p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Squad signal
            </p>
            <p className="mt-2 text-lg font-black text-white">
              {player.captain ? "Captain" : player.lineups ? "Starter" : "Squad"}
            </p>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section id="rankings" className="neon-card scroll-mt-24 rounded-[2rem] p-6">
            <p className="neon-kicker">Leaderboard context</p>
            <h2 className="mt-4 text-2xl font-black uppercase text-white">Tournament rankings</h2>

            {player.rankings.length === 0 ? (
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Ranking data will appear once API-Football publishes tournament stats.
              </p>
            ) : (
              <div className="mt-5 grid gap-3">
                {player.rankings.map((row) => (
                  <div
                    key={`${row.stat_type}-${row.value_numeric}`}
                    className="flex items-center justify-between rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4"
                  >
                    <span className="font-black uppercase tracking-[0.08em] text-slate-200">
                      {labelStat(row.stat_type)}
                    </span>
                    <span className="text-3xl font-black text-lime-200">
                      {row.value_numeric ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section id="availability" className="neon-card scroll-mt-24 rounded-[2rem] p-6">
            <p className="neon-kicker">Availability</p>
            <h2 className="mt-4 text-2xl font-black uppercase text-white">Injury status</h2>

            {player.injuries.length === 0 ? (
              <p className="mt-4 text-sm leading-6 text-slate-300">
                No injury records currently available for this player.
              </p>
            ) : (
              <div className="mt-5 grid gap-3">
                {player.injuries.map((injury, index) => (
                  <div
                    key={`${injury.reason}-${index}`}
                    className="rounded-2xl border border-fuchsia-300/25 bg-fuchsia-400/10 p-4"
                  >
                    <p className="font-black text-fuchsia-100">
                      {injury.type ?? "Injury"}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      {injury.reason ?? "Reason TBC"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section
          id="role"
          className="neon-panel mt-6 scroll-mt-24 rounded-[2rem] p-6"
        >
          <p className="neon-kicker">Player role</p>
          <h2 className="mt-4 text-2xl font-black uppercase text-white">
            What this profile says
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {roleSummary(player)} Synced squad fields show{" "}
            {player.appearances ?? 0} appearances, {player.lineups ?? 0} starts
            and {player.minutes ?? 0} minutes where provider data is available.
          </p>
        </section>

        <section id="fixtures" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-black uppercase text-white">
            Team fixtures
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Matches involving {player.team_name ?? "this player's team"}.
          </p>
          {player.teamFixtures.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-center">
              <h3 className="font-black text-white">Fixtures updating</h3>
              <p className="mt-2 text-sm text-slate-300">
                Team fixture links will appear when the fixture feed is linked to
                this squad row.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {player.teamFixtures.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}
