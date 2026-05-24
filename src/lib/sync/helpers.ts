import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApiFootballVenue } from "@/lib/api-football/types";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getTeamIdMap(
  supabase: SupabaseClient,
  apiTeamIds: number[]
): Promise<Map<number, string>> {
  const uniqueIds = Array.from(new Set(apiTeamIds)).filter(Boolean);

  if (uniqueIds.length === 0) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("teams")
    .select("id, api_team_id")
    .in("api_team_id", uniqueIds);

  if (error) {
    throw new Error(`Failed to load team ID map: ${error.message}`);
  }

  const map = new Map<number, string>();

  for (const row of data ?? []) {
    map.set(Number(row.api_team_id), String(row.id));
  }

  return map;
}

export async function upsertHostCity(
  supabase: SupabaseClient,
  cityName: string | null | undefined,
  country: string | null | undefined
): Promise<string | null> {
  const cleanCity = cityName?.trim();

  if (!cleanCity) {
    return null;
  }

  const cleanCountry = country?.trim() || null;
  const slug = slugify(`${cleanCity}-${cleanCountry ?? "unknown"}`);

  const { data, error } = await supabase
    .from("host_cities")
    .upsert(
      {
        slug,
        name: cleanCity,
        country: cleanCountry,
        raw: {
          source: "api-football",
        },
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "slug",
      }
    )
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to upsert host city ${cleanCity}: ${error.message}`);
  }

  return data.id as string;
}

export async function upsertStadiumFromVenue(
  supabase: SupabaseClient,
  venue: ApiFootballVenue | null | undefined,
  country: string | null | undefined
): Promise<string | null> {
  if (!venue || (!venue.id && !venue.name)) {
    return null;
  }

  const cleanCountry =
    country && country.toLowerCase() !== "world" ? country : null;

  const hostCityId = await upsertHostCity(supabase, venue.city, cleanCountry);

  const stadiumKey = venue.id
    ? `api:${venue.id}`
    : `manual:${slugify(`${venue.name ?? "unknown"}-${venue.city ?? "unknown"}`)}`;

  const { data, error } = await supabase
    .from("stadiums")
    .upsert(
      {
        stadium_key: stadiumKey,
        api_venue_id: venue.id ?? null,
        host_city_id: hostCityId,
        name: venue.name ?? `Venue ${venue.id}`,
        city: venue.city ?? null,
        country: cleanCountry,
        capacity: venue.capacity ?? null,
        surface: venue.surface ?? null,
        image_url: venue.image ?? null,
        raw: venue,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "stadium_key",
      }
    )
    .select("id")
    .single();

  if (error) {
    throw new Error(
      `Failed to upsert stadium ${venue.name ?? venue.id}: ${error.message}`
    );
  }

  return data.id as string;
}
