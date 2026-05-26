$ErrorActionPreference = "Stop"

$Root = Get-Location
Write-Host "Adding World Cup countdown timer..." -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = Join-Path $Root "countdown-timer-backup-$timestamp"
New-Item -ItemType Directory -Path $backup | Out-Null

$filesToBackup = @(
  "src/app/page.tsx",
  "src/components/layout/site-footer.tsx"
)

foreach ($file in $filesToBackup) {
  if (Test-Path -LiteralPath $file) {
    $dest = Join-Path $backup $file
    New-Item -ItemType Directory -Path (Split-Path $dest) -Force | Out-Null
    Copy-Item -LiteralPath $file -Destination $dest -Force
  }
}

New-Item -ItemType Directory -Path "src/components/worldcup" -Force | Out-Null
New-Item -ItemType Directory -Path "src/lib/data" -Force | Out-Null

@'
"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownTimerProps = {
  targetDate: string;
  className?: string;
  compact?: boolean;
};

type TimeLeft = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate).getTime();
  const now = Date.now();

  if (!Number.isFinite(target)) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const total = Math.max(0, target - now);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function CountdownTimer({
  targetDate,
  className = "",
  compact = false,
}: CountdownTimerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => ({
    total: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }));

  useEffect(() => {
    setIsMounted(true);
    setTimeLeft(getTimeLeft(targetDate));

    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  const localKickoff = useMemo(() => {
    if (!isMounted) return "Local time loading";

    try {
      return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(new Date(targetDate));
    } catch {
      return "Kick-off time confirmed";
    }
  }, [isMounted, targetDate]);

  const units = isMounted
    ? [
        { label: "Days", value: String(timeLeft.days) },
        { label: "Hours", value: pad(timeLeft.hours) },
        { label: "Min", value: pad(timeLeft.minutes) },
        { label: "Sec", value: pad(timeLeft.seconds) },
      ]
    : [
        { label: "Days", value: "--" },
        { label: "Hours", value: "--" },
        { label: "Min", value: "--" },
        { label: "Sec", value: "--" },
      ];

  if (isMounted && timeLeft.total <= 0) {
    return (
      <section
        className={`relative overflow-hidden rounded-[2rem] border border-lime-300/40 bg-black/70 p-5 shadow-[0_0_60px_rgba(163,230,53,0.22)] ${className}`}
        aria-live="polite"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(163,230,53,0.25),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.2),transparent_34%)]" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-lime-200">
            Kick-off signal live
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            World Cup 2026 is live.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Mexico vs South Africa has kicked off. Matchday chaos is officially on.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-slate-950/80 p-5 shadow-[0_0_70px_rgba(34,211,238,0.16)] backdrop-blur-xl sm:p-6 ${className}`}
      aria-label="Countdown to World Cup 2026 kick-off"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(163,230,53,0.14),transparent_25%,rgba(34,211,238,0.14)_55%,rgba(236,72,153,0.16)),radial-gradient(circle_at_top_right,rgba(236,72,153,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(163,230,53,0.20),transparent_32%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-300 to-transparent" />
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-lime-400/20 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-lime-300/40 bg-lime-300/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.24em] text-lime-200 shadow-[0_0_22px_rgba(163,230,53,0.18)]">
              Road to 2026
            </span>
            <h2
              className={`mt-3 font-black uppercase tracking-tight text-white ${
                compact ? "text-2xl" : "text-3xl sm:text-5xl"
              }`}
            >
              Countdown to Kick-Off
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Mexico vs South Africa opens the biggest World Cup ever.
            </p>
          </div>

          <div className="rounded-2xl border border-fuchsia-300/30 bg-fuchsia-400/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100 shadow-[0_0_30px_rgba(236,72,153,0.14)]">
            Kick-off signal loading
          </div>
        </div>

        <div
          className={`mt-5 grid gap-3 ${
            compact ? "grid-cols-4" : "grid-cols-2 sm:grid-cols-4"
          }`}
        >
          {units.map((unit) => (
            <div
              key={unit.label}
              className="rounded-2xl border border-white/10 bg-black/45 p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            >
              <div
                className={`font-black tabular-nums tracking-tight text-lime-200 drop-shadow-[0_0_14px_rgba(163,230,53,0.35)] ${
                  compact ? "text-2xl" : "text-4xl sm:text-6xl"
                }`}
              >
                {unit.value}
              </div>
              <div className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.22em] text-slate-400">
                {unit.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-bold text-slate-200">
            Mexico vs South Africa · 11 June 2026
          </span>
          <span>Browser local time: {localKickoff}</span>
        </div>
      </div>
    </section>
  );
}
'@ | Set-Content -LiteralPath "src/components/worldcup/countdown-timer.tsx" -Encoding UTF8

@'
import { getFixturesPageData } from "@/lib/data/worldcup";

export const OPENING_FIXTURE_FALLBACK_UTC = "2026-06-11T21:00:00Z";

function isValidDate(value: string | null | undefined) {
  if (!value) return false;
  return Number.isFinite(new Date(value).getTime());
}

function normaliseTeamName(value: string | null | undefined) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isMexicoSouthAfricaFixture(fixture: {
  home_team_name?: string | null;
  away_team_name?: string | null;
  match_date?: string | null;
}) {
  const home = normaliseTeamName(fixture.home_team_name);
  const away = normaliseTeamName(fixture.away_team_name);

  const isOpeningPair =
    (home.includes("mexico") && away.includes("south africa")) ||
    (home.includes("south africa") && away.includes("mexico"));

  if (!isOpeningPair) return false;

  if (!fixture.match_date) return true;

  return fixture.match_date.startsWith("2026-06-11");
}

export async function getOpeningFixtureCountdownTarget() {
  try {
    const { fixtures } = await getFixturesPageData();
    const openingFixture = fixtures.find(isMexicoSouthAfricaFixture);

    const kickoff =
      (openingFixture as { kickoff_at?: string | null } | undefined)
        ?.kickoff_at ??
      openingFixture?.match_date ??
      null;

    if (isValidDate(kickoff)) {
      return new Date(kickoff as string).toISOString();
    }
  } catch {
    // Keep the homepage resilient if Supabase is unavailable during rendering.
  }

  return OPENING_FIXTURE_FALLBACK_UTC;
}
'@ | Set-Content -LiteralPath "src/lib/data/countdown.ts" -Encoding UTF8

$pagePath = "src/app/page.tsx"
if (!(Test-Path -LiteralPath $pagePath)) {
  throw "Missing $pagePath"
}

$page = Get-Content -LiteralPath $pagePath -Raw

if ($page -notmatch 'countdown-timer') {
  $page = $page -replace 'import Link from "next/link";', "import Link from `"next/link`";`r`nimport { CountdownTimer } from `"@/components/worldcup/countdown-timer`";"
}

if ($page -notmatch 'getOpeningFixtureCountdownTarget') {
  $page = $page -replace 'import \{ createPageMetadata \} from "@/lib/seo";', "import { createPageMetadata } from `"@/lib/seo`";`r`nimport { getOpeningFixtureCountdownTarget } from `"@/lib/data/countdown`";"
}

if ($page -notmatch 'const countdownTarget = await getOpeningFixtureCountdownTarget\(\);') {
  $page = $page -replace 'const data = await getHomepagePolishData\(\);\s+const featuredMatch = data\.featuredMatch;', "const data = await getHomepagePolishData();`r`n  const countdownTarget = await getOpeningFixtureCountdownTarget();`r`n  const featuredMatch = data.featuredMatch;"
}

if ($page -notmatch '<CountdownTimer targetDate=\{countdownTarget\}') {
  $pattern = '(<Container className="[^"]*py-[^"]*"[^>]*>\s*)'
  $replacement = "`$1`r`n          <CountdownTimer targetDate={countdownTarget} className=`"mb-8`" />`r`n"
  $page = [regex]::Replace($page, $pattern, $replacement, 1)
}

Set-Content -LiteralPath $pagePath -Value $page -Encoding UTF8

Write-Host "Countdown timer patch applied." -ForegroundColor Green
Write-Host ""
Write-Host "Now run:"
Write-Host "  npm run typecheck"
Write-Host "  npm run lint"
Write-Host "  npm run build"
Write-Host ""
Write-Host "Manual QA:"
Write-Host "  /"
Write-Host "  Check countdown updates every second"
Write-Host "  Check mobile layout"
Write-Host "  Confirm no hydration errors in browser console"
