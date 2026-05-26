"use client";

import { useEffect, useState } from "react";

type MatchCountdownProps = {
  matchDate: string | null | undefined;
  label?: string;
};

function getTimeLeft(matchDate: string | null | undefined) {
  if (!matchDate) return null;

  const target = new Date(matchDate).getTime();

  if (!Number.isFinite(target)) return null;

  const diff = target - Date.now();

  if (diff <= 0) {
    return { live: true, days: 0, hours: 0, minutes: 0 };
  }

  return {
    live: false,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
  };
}

export function MatchCountdown({
  matchDate,
  label = "Starts in",
}: MatchCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(matchDate));

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft(matchDate));
    update();
    const interval = window.setInterval(update, 60000);

    return () => window.clearInterval(interval);
  }, [matchDate]);

  if (!matchDate) {
    return null;
  }

  if (!timeLeft) {
    return null;
  }

  if (timeLeft.live) {
    return (
      <div className="rounded-2xl border border-lime-300/25 bg-lime-300/10 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">
          Match signal
        </p>
        <p className="mt-2 text-2xl font-black text-white">Live or finished</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
        {label}
      </p>
      <div data-countdown-grid className="mt-4 grid grid-cols-3 gap-2 max-[430px]:gap-1 max-[430px]:gap-1">
        {[
          ["Days", timeLeft.days],
          ["Hours", timeLeft.hours],
          ["Minutes", timeLeft.minutes],
        ].map(([unit, value]) => (
          <div
            key={unit}
            data-countdown-unit className="min-w-0 rounded-xl border border-white/10 bg-slate-950/45 p-3 text-center max-[430px]:p-2"
          >
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="mt-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-slate-400">
              {unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

