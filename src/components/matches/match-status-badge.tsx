type MatchStatusBadgeProps = {
  statusShort: string | null | undefined;
  statusLong?: string | null;
};

function getLabel(statusShort: string | null | undefined, statusLong?: string | null) {
  const status = statusShort?.toUpperCase();

  if (!status) return statusLong ?? "Unknown";

  if (status === "NS") return "Not started";
  if (status === "1H") return "Live · 1st half";
  if (status === "HT") return "Half-time";
  if (status === "2H") return "Live · 2nd half";
  if (status === "ET") return "Extra time";
  if (status === "BT") return "Break";
  if (status === "P") return "Penalties";
  if (status === "FT") return "Finished";
  if (status === "AET") return "Finished after extra time";
  if (status === "PEN") return "Finished on penalties";
  if (status === "PST") return "Postponed";
  if (status === "CANC") return "Cancelled";
  if (status === "ABD") return "Abandoned";
  if (status === "SUSP") return "Suspended";
  if (status === "INT") return "Interrupted";
  if (status === "TBD") return "Time TBC";

  return statusLong ?? status;
}

function getClasses(statusShort: string | null | undefined) {
  const status = statusShort?.toUpperCase();

  if (["1H", "HT", "2H", "ET", "BT", "P"].includes(status ?? "")) {
    return "border-rose-400/40 bg-rose-400/15 text-rose-200";
  }

  if (["FT", "AET", "PEN"].includes(status ?? "")) {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }

  if (["PST", "CANC", "ABD", "SUSP", "INT"].includes(status ?? "")) {
    return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  }

  if (["NS", "TBD"].includes(status ?? "")) {
    return "border-sky-400/30 bg-sky-400/10 text-sky-200";
  }

  return "border-white/10 bg-white/10 text-slate-200";
}

export function MatchStatusBadge({
  statusShort,
  statusLong,
}: MatchStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${getClasses(statusShort)}`}
      title={statusLong ?? statusShort ?? undefined}
    >
      {getLabel(statusShort, statusLong)}
    </span>
  );
}
