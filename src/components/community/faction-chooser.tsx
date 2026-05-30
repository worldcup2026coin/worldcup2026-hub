"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TeamFlag } from "@/components/worldcup/team-flag";
import type { Team } from "@/lib/data/worldcup";

type FactionChooserProps = {
  teams: Team[];
  signedIn: boolean;
};

export function FactionChooser({ teams, signedIn }: FactionChooserProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = window.localStorage.getItem("wc26_faction_team_id");
    return saved ? Number(saved) : null;
  });
  const [query, setQuery] = useState("");

  const visibleTeams = useMemo(() => {
    const value = query.trim().toLowerCase();

    return teams
      .filter((team) => {
        if (!value) return true;
        return [team.name, team.country, team.code]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(value);
      })
      .slice(0, 48);
  }, [query, teams]);

  function chooseFaction(teamId: number) {
    setSelectedTeamId(teamId);
    window.localStorage.setItem("wc26_faction_team_id", String(teamId));
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] border border-lime-300/20 bg-lime-300/10 p-5">
        <p className="neon-kicker">Country factions</p>
        <h2 className="mt-3 text-3xl font-black uppercase text-white">
          Choose your side
        </h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-300">
          Choose your side for fan banter, predictions and community identity.
          No wallet required, no token holding required, and no financial
          rewards.
        </p>
        <p className="mt-3 text-xs font-semibold leading-5 text-slate-400">
          Phase 19 MVP saves your faction on this device only. Sign-in faction
          saving can be connected later if a small profile field is added.
        </p>
        {!signedIn ? (
          <Link href="/auth/login" className="glow-button-secondary mt-5">
            Sign in for future profile saving
          </Link>
        ) : null}
      </section>

      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">
          Search teams
        </span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search country or team..."
          className="min-h-12 rounded-2xl border border-lime-300/20 bg-slate-950 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-500 focus:border-lime-300/70"
        />
      </label>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleTeams.map((team) => {
          const selected = selectedTeamId === team.api_team_id;

          return (
            <button
              key={team.id}
              type="button"
              onClick={() => chooseFaction(team.api_team_id)}
              className={`min-w-0 rounded-[2rem] border p-4 text-left transition ${
                selected
                  ? "border-lime-300/60 bg-lime-300/15 shadow-[0_0_28px_rgba(163,255,18,0.16)]"
                  : "border-white/10 bg-white/[0.04] hover:border-fuchsia-300/35 hover:bg-fuchsia-400/10"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <TeamFlag
                  code={team.code}
                  name={team.name}
                  country={team.country}
                  className="shrink-0"
                />
                <div className="min-w-0">
                  <p className="truncate text-base font-black uppercase text-white">
                    {team.name}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {selected ? "Your faction" : "Choose faction"}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}
