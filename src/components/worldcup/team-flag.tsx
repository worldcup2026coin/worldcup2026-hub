import { getTeamFlag } from "@/lib/worldcup/flags";

type TeamFlagProps = {
  code?: string | null;
  name?: string | null;
  country?: string | null;
  label?: string;
  className?: string;
};

export function TeamFlag({
  code,
  name,
  country,
  label,
  className = "",
}: TeamFlagProps) {
  const flag = getTeamFlag({ code, name, country });

  return (
    <span
      aria-label={label ?? `${name ?? country ?? "Team"} flag`}
      className={`inline-flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-xl shadow-[0_0_18px_rgba(34,211,238,0.10)] ${className}`}
    >
      {flag}
    </span>
  );
}
