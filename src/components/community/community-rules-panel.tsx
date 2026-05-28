export function CommunityRulesPanel() {
  const rules = [
    "Keep it football-first.",
    "No spam, scams, fake giveaways or financial advice.",
    "No hate, harassment, impersonation, NSFW or illegal content.",
    "No official FIFA, World Cup, team, player, sponsor or federation marks.",
    "Mods can remove content without notice.",
  ];

  return (
    <section className="rounded-[2rem] border border-fuchsia-300/20 bg-fuchsia-400/10 p-5">
      <p className="neon-kicker">Community rules</p>
      <div className="mt-4 grid gap-3">
        {rules.map((rule) => (
          <p key={rule} className="text-sm font-semibold leading-6 text-slate-200">
            {rule}
          </p>
        ))}
      </div>
      <p className="mt-5 text-xs font-semibold leading-5 text-slate-400">
        Community content is user-submitted and fan-made. $WC26 is unofficial
        and not affiliated with FIFA, World Cup, teams, players, sponsors or
        governing bodies. Crypto-assets are high risk. Nothing here is financial
        advice.
      </p>
    </section>
  );
}
