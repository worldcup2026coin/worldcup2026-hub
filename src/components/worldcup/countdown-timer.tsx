"use client";

import { useEffect, useState } from "react";

type CountdownTimerProps = {
  targetDate: string;
  label?: string;
  matchLabel?: string;
  badge?: string;
  venueTimeLabel?: string;
  utcTimeLabel?: string;
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
  const difference = Math.max(0, target - Date.now());

  if (!Number.isFinite(target) || difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }

  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isLive: false,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatKickoff(targetDate: string, timeZone?: string) {
  const date = new Date(targetDate);

  if (Number.isNaN(date.getTime())) {
    return "Time TBC";
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };

  if (timeZone) {
    options.timeZone = timeZone;
  }

  return new Intl.DateTimeFormat(undefined, options).format(date);
}

export function CountdownTimer({
  targetDate,
  label = "Countdown to Kick-Off",
  matchLabel = "Mexico vs South Africa - 11 June 2026",
  badge = "Road to 2026",
  venueTimeLabel = "Venue time TBC",
  utcTimeLabel,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [localKickoff, setLocalKickoff] = useState("Loading");
  const [clientUtcKickoff, setClientUtcKickoff] = useState("Loading");

  useEffect(() => {
    const update = () => {
      setTimeLeft(getTimeLeft(targetDate));
      setLocalKickoff(formatKickoff(targetDate));
      setClientUtcKickoff(formatKickoff(targetDate, "UTC"));
    };

    const timeout = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [targetDate]);

  return (
    <section
      data-match-countdown
      className="neon-card neon-card-hot relative w-full max-w-full overflow-hidden rounded-[2rem] p-4 shadow-[0_0_60px_rgba(163,230,53,0.18)] sm:p-5"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-lime-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-6 size-32 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(163,230,53,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[size:38px_38px]" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="neon-badge neon-badge-lime">{badge}</span>
            <span className="neon-badge neon-badge-pink">Kick-off signal loading</span>
          </div>
          <p className="hidden text-xs font-black uppercase tracking-[0.18em] text-lime-200 xl:block">
            48 teams - 104 matches - one trophy
          </p>
        </div>

        <div className="mt-3 grid gap-4 xl:grid-cols-[0.68fr_1.32fr] xl:items-center">
          <div data-countdown-copy className="min-w-0">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_18px_rgba(163,230,53,0.25)] sm:text-3xl">
              {label}
            </h2>
            <p className="mt-1 text-sm font-black text-lime-100">
              {matchLabel}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              48 nations. 104 matches. Three host countries. One month that stops the world.
            </p>
          </div>

          {!timeLeft ? (
            <div
              data-countdown-timer-grid
              className="grid w-full max-w-full grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
            >
              {["DAYS", "HRS", "MIN", "SEC"].map((unit) => (
                <div
                  key={unit}
                  className="min-w-0 rounded-2xl border border-white/10 bg-black/50 p-3 text-center max-[380px]:p-2"
                >
                  <div className="h-9 animate-pulse rounded-xl bg-white/10" />
                  <p className="mt-2 text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-500">
                    {unit}
                  </p>
                </div>
              ))}
            </div>
          ) : timeLeft.isLive ? (
            <div className="rounded-3xl border border-lime-300/40 bg-lime-300/10 px-6 py-5 text-center">
              <p className="text-2xl font-black uppercase text-lime-100">
                World Cup 2026 is live.
              </p>
            </div>
          ) : (
            <div
              data-countdown-timer-grid
              className="grid w-full max-w-full grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
            >
              {[
                ["DAYS", timeLeft.days],
                ["HRS", pad(timeLeft.hours)],
                ["MIN", pad(timeLeft.minutes)],
                ["SEC", pad(timeLeft.seconds)],
              ].map(([unit, value]) => (
                <div
                  key={unit}
                  className={`min-w-0 rounded-[1.4rem] border bg-black/70 px-3 py-3 text-center max-[380px]:px-2 ${
                    unit === "SEC"
                      ? "border-fuchsia-300/35 shadow-[0_0_28px_rgba(217,70,239,0.2)]"
                      : "border-lime-300/25 shadow-[0_0_22px_rgba(34,211,238,0.13)]"
                  }`}
                >
                  <p className="font-mono text-3xl font-black tracking-tight text-lime-200 max-[380px]:text-2xl sm:text-5xl">
                    {value}
                  </p>
                  <p className="mt-1 text-[0.6rem] font-black uppercase tracking-[0.14em] text-cyan-200">
                    {unit}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 grid gap-2 text-[0.6rem] font-black uppercase tracking-[0.14em] text-slate-400 sm:grid-cols-[1fr_1fr_1fr]">
          <p className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2">
            <span className="text-lime-200">Venue time</span>{" "}
            {venueTimeLabel}
          </p>
          <p className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2">
            <span className="text-cyan-200">UTC</span>{" "}
            {utcTimeLabel ?? clientUtcKickoff}
          </p>
          <p
            className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-cyan-100"
            suppressHydrationWarning
          >
            <span>Your time</span>{" "}
            {localKickoff}
          </p>
        </div>
      </div>
    </section>
  );
}
