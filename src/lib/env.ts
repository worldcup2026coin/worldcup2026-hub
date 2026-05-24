export function getRequiredServerEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function getOptionalNumberEnv(name: string, fallback: number): number {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number.`);
  }

  return parsed;
}

export function getWorldCupApiConfig() {
  return {
    leagueId: getOptionalNumberEnv("API_FOOTBALL_WORLD_CUP_LEAGUE_ID", 1),
    season: getOptionalNumberEnv("API_FOOTBALL_SEASON", 2026),
    timezone: process.env.API_FOOTBALL_TIMEZONE || "Europe/Dublin",
  };
}
