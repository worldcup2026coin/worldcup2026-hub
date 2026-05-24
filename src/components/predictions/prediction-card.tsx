import Link from "next/link";
import type { Fixture } from "@/lib/data/matches";
import {
  getPredictionTypeLabel,
  type PredictionTip,
} from "@/lib/data/predictions";
import { formatDateTime } from "@/lib/worldcup/format";
import { RiskBadge } from "@/components/predictions/risk-badge";

type PredictionCardProps = {
  tip: PredictionTip;
  fixture?: Fixture;
  href?: string;
};

function jsonToList(value: unknown) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          return String(record.name ?? record.label ?? record.text ?? "");
        }

        return "";
      })
      .filter(Boolean);
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).map(
      ([key, item]) => `${key}: ${String(item)}`
    );
  }

  return [String(value)];
}

function CardInner({ tip, fixture }: Pick<PredictionCardProps, "tip" | "fixture">) {
  const factors = jsonToList(tip.key_factors).slice(0, 5);
  const players = jsonToList(tip.players_to_watch).slice(0, 5);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            {getPredictionTypeLabel(tip.type)}
          </p>
          <h2 className="mt-2 text-xl font-black text-white">{tip.title}</h2>
          {fixture ? (
            <p className="mt-2 text-sm text-slate-400">
              {fixture.home_team_name ?? "Home"} vs{" "}
              {fixture.away_team_name ?? "Away"} ·{" "}
              {formatDateTime(fixture.match_date)}
            </p>
          ) : null}
        </div>

        <RiskBadge riskLevel={tip.risk_level} />
      </div>

      {tip.summary ? (
        <p className="mt-4 text-sm leading-6 text-slate-300">{tip.summary}</p>
      ) : null}

      {tip.prediction_text ? (
        <div className="mt-4 rounded-2xl bg-slate-950/50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Prediction / fan insight
          </p>
          <p className="mt-2 text-sm leading-6 text-white">
            {tip.prediction_text}
          </p>
        </div>
      ) : null}

      {tip.confidence_score !== null ? (
        <p className="mt-4 text-sm text-slate-300">
          Confidence score:{" "}
          <span className="font-black text-white">
            {Number(tip.confidence_score).toFixed(0)}/100
          </span>
        </p>
      ) : null}

      {factors.length > 0 ? (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Key factors
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-slate-300">
            {factors.map((factor) => (
              <li key={factor} className="rounded-2xl bg-white/[0.04] px-4 py-2">
                {factor}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {players.length > 0 ? (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Players to watch
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {players.map((player) => (
              <span
                key={player}
                className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-200"
              >
                {player}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {tip.type === "betting_style" ? (
        <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
            Betting-style view
          </p>
          <p className="mt-2 text-sm text-amber-50/90">
            {tip.market_label ?? "Market unavailable"}
            {tip.odds_decimal ? ` · Decimal odds ${tip.odds_decimal}` : ""}
            {tip.bookmaker ? ` · ${tip.bookmaker}` : ""}
          </p>
        </div>
      ) : null}
    </>
  );
}

export function PredictionCard({ tip, fixture, href }: PredictionCardProps) {
  const className =
    "block rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-slate-950/30 transition hover:border-emerald-400/30";

  if (href) {
    return (
      <Link href={href} className={className}>
        <CardInner tip={tip} fixture={fixture} />
      </Link>
    );
  }

  return (
    <article className={className}>
      <CardInner tip={tip} fixture={fixture} />
    </article>
  );
}
