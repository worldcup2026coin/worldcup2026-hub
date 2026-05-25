import "server-only";
import { getRequiredServerEnv } from "@/lib/env";
import type {
  ApiFootballEnvelope,
  ApiFootballErrors,
  ApiFootballPagedResult,
} from "@/lib/api-football/types";

type ApiFootballParams = Record<string, string | number | boolean | undefined>;

function hasApiErrors(errors: ApiFootballErrors | undefined): boolean {
  if (!errors) {
    return false;
  }

  if (Array.isArray(errors)) {
    return errors.length > 0;
  }

  return Object.keys(errors).length > 0;
}

function buildApiFootballUrl(endpoint: string, params: ApiFootballParams) {
  const baseUrl = getRequiredServerEnv("API_FOOTBALL_BASE_URL").replace(
    /\/+$/,
    ""
  );

  const cleanEndpoint = endpoint.replace(/^\/+/, "");
  const url = new URL(`${baseUrl}/${cleanEndpoint}`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

export async function apiFootballGet<T>(
  endpoint: string,
  params: ApiFootballParams = {}
): Promise<ApiFootballEnvelope<T>> {
  const url = buildApiFootballUrl(endpoint, params);
  const apiKey = getRequiredServerEnv("API_FOOTBALL_KEY");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-apisports-key": apiKey,
    },
    cache: "no-store",
  });

  const bodyText = await response.text();

  let data: ApiFootballEnvelope<T>;

  try {
    data = JSON.parse(bodyText) as ApiFootballEnvelope<T>;
  } catch {
    throw new Error(
      `API-Football returned non-JSON response from ${endpoint}: ${bodyText}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `API-Football HTTP ${response.status} from ${endpoint}: ${bodyText}`
    );
  }

  if (hasApiErrors(data.errors)) {
    throw new Error(
      `API-Football error from ${endpoint}: ${JSON.stringify(data.errors)}`
    );
  }

  return data;
}

export async function apiFootballGetAllPages<T>(
  endpoint: string,
  params: ApiFootballParams = {}
): Promise<ApiFootballPagedResult<T>> {
  const firstEnvelope = await apiFootballGet<T>(endpoint, params);
  const totalPages = firstEnvelope.paging?.total ?? 1;

  const allRows = [...firstEnvelope.response];
  let requestCount = 1;

  for (let page = 2; page <= totalPages; page += 1) {
    const pageEnvelope = await apiFootballGet<T>(endpoint, {
      ...params,
      page,
    });

    allRows.push(...pageEnvelope.response);
    requestCount += 1;
  }

  return {
    response: allRows,
    requestCount,
    firstEnvelope,
  };
}

export type ApiFootballResponse<T> = {
  get: string;
  parameters: Record<string, string>;
  errors: unknown[] | Record<string, unknown>;
  results: number;
  paging?: {
    current: number;
    total: number;
  };
  response: T;
};

export type ApiFootballRequestResult<T> = {
  data: ApiFootballResponse<T>;
  apiRequestsUsed: number;
};

export function getWorldCupLeagueId() {
  return Number(process.env.API_FOOTBALL_LEAGUE_ID || "1");
}

export function getWorldCupSeason() {
  return Number(process.env.API_FOOTBALL_SEASON || "2026");
}
