
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

function tuneDescription(description: string) {
  const value = description.toLowerCase();

  if (value.includes("live")) {
    return "Calm before the next kick-off. The live signal lights up as soon as the feed marks a match in play.";
  }

  if (value.includes("lineup")) {
    return "Lineups are still in the tunnel. They will drop here when the feed updates.";
  }

  if (value.includes("stat")) {
    return "Stats will light up when the feed updates. No fake certainty, just clean signal.";
  }

  if (value.includes("assist")) {
    return "The assist chart is waiting for the playmakers to cook.";
  }

  if (value.includes("prediction")) {
    return "No prediction signal published for this match yet.";
  }

  return description;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="neon-panel rounded-[2rem] border-dashed p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-300/35 bg-lime-300/10 text-3xl shadow-[0_0_24px_rgba(163,255,18,0.14)]">
        ⚡
      </div>
      <p className="neon-kicker mx-auto mt-5">Waiting on signal</p>
      <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-white">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">
        {tuneDescription(description)}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
