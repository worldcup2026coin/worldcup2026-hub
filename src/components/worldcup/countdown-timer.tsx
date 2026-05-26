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
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
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

function formatLocalKickoff(targetDate: string) {
  const date = new Date(targetDate);

  if (Number.isNaN(date.getTime())) return "Local kick-off time loading";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function CountdownTimer({
  targetDate,
  label = "Countdown to Kick-Off",
  matchLabel = "Mexico vs South Africa · 11 June 2026",
  badge = "Road to 2026",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [localKickoff, setLocalKickoff] = useState("Your local time loading");

  useEffect(() => {
    const update = () => {
      setTimeLeft(getTimeLeft(targetDate));
      setLocalKickoff(formatLocalKickoff(targetDate));
    };

    const timeout = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [targetDate]);

  return (
    <section className="neon-card neon-card-hot relative overflow-hidden rounded-[2rem] p-6 shadow-[0_0_70px_rgba(163,230,53,0.16)] sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-lime-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(163,230,53,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative">
        <div className="flex flex-wrap items-center gap-3">
          <span className="neon-badge neon-badge-lime">{badge}</span>
          <span className="neon-badge neon-badge-pink">Kick-off signal loading</span>
        </div>

        <div className="mt-5 grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-end">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_18px_rgba(163,230,53,0.25)] sm:text-5xl">
              {label}
            </h2>
            <p className="mt-3 text-base font-black text-slate-200">
              {matchLabel}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Mexico vs South Africa opens the biggest World Cup ever.
            </p>

            <div className="mt-4 grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400 sm:grid-cols-3">
              <p className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2">
                Mexico City: 15:00
              </p>
              <p className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2">
                UTC: 21:00
              </p>
              <p
                className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-cyan-100"
                suppressHydrationWarning
              >
                Your local time: {localKickoff}
              </p>
            </div>
          </div>

          {!timeLeft ? (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {["DAYS", "HOURS", "MIN", "SEC"].map((unit) => (
                <div
                  key={unit}
                  className="rounded-2xl border border-white/10 bg-black/50 p-4 text-center"
                >
                  <div className="h-10 animate-pulse rounded-xl bg-white/10" />
                  <p className="mt-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-500">
                    {unit}
                  </p>
                </div>
              ))}
            </div>
          ) : timeLeft.isLive ? (
            <div className="rounded-3xl border border-lime-300/40 bg-lime-300/10 px-6 py-6 text-center shadow-[0_0_45px_rgba(163,230,53,0.25)]">
              <p className="text-3xl font-black uppercase text-lime-100">
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
                  className={`rounded-2xl border bg-black/60 p-4 text-center shadow-[0_0_28px_rgba(34,211,238,0.16)] ${
                    unit === "SEC"
                      ? "border-fuchsia-300/35 shadow-[0_0_34px_rgba(217,70,239,0.22)]"
                      : "border-lime-300/25"
                  }`}
                >
                  <p className="font-mono text-4xl font-black text-lime-200 sm:text-5xl">
                    {value}
                  </p>
                  <p className="mt-2 text-[0.7rem] font-black uppercase tracking-[0.22em] text-cyan-200">
                    {unit}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
