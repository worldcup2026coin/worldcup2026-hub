"use client";

import { useEffect, useState } from "react";

type CountdownTimerProps = {
  targetDate: string;
  label?: string;
  matchLabel?: string;
  badge?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
};

function getTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const difference = Math.max(0, target - now);

  if (!Number.isFinite(target) || difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLive: true,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isLive: false,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function CountdownTimer({
  targetDate,
  label = "Countdown to Kick-Off",
  matchLabel = "Mexico vs South Africa · 11 June 2026",
  badge = "Road to 2026",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => {
      setTimeLeft(getTimeLeft(targetDate));
    };

    const timeout = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [targetDate]);

  return (
    <section className="neon-card neon-card-hot relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-lime-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-8 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="neon-badge neon-badge-lime">{badge}</span>
          <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">
            {label}
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-300">
            {matchLabel}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Mexico vs South Africa opens the biggest World Cup ever.
          </p>
        </div>

        {!timeLeft ? (
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {["DAYS", "HOURS", "MIN", "SEC"].map((unit) => (
              <div
                key={unit}
                className="rounded-2xl border border-white/10 bg-black/40 p-3 text-center"
              >
                <div className="h-8 animate-pulse rounded-xl bg-white/10" />
                <p className="mt-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-500">
                  {unit}
                </p>
              </div>
            ))}
          </div>
        ) : timeLeft.isLive ? (
          <div className="rounded-3xl border border-lime-300/40 bg-lime-300/10 px-6 py-5 text-center shadow-[0_0_35px_rgba(163,230,53,0.2)]">
            <p className="text-2xl font-black uppercase text-lime-100">
              World Cup 2026 is live.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              ["DAYS", timeLeft.days],
              ["HOURS", pad(timeLeft.hours)],
              ["MIN", pad(timeLeft.minutes)],
              ["SEC", pad(timeLeft.seconds)],
            ].map(([unit, value]) => (
              <div
                key={unit}
                className="rounded-2xl border border-lime-300/25 bg-black/50 p-3 text-center shadow-[0_0_24px_rgba(34,211,238,0.13)]"
              >
                <p className="font-mono text-2xl font-black text-lime-200 sm:text-4xl">
                  {value}
                </p>
                <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-cyan-200">
                  {unit}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
