import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type SyncColumnCheck = {
  column_name: string;
  data_type?: string;
  udt_name?: string;
};

export type SyncColumnInfo = {
  names: Set<string>;
  types: Map<string, string>;
};

export async function getTableColumnInfo(tableName: string): Promise<SyncColumnInfo> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase.rpc("get_table_columns_for_sync", {
    target_schema: "public",
    target_table: tableName,
  });

  if (error || !Array.isArray(data)) {
    throw new Error(
      `Could not read ${tableName} table columns: ${error?.message || "No data"}`
    );
  }

  const rows = data as SyncColumnCheck[];

  return {
    names: new Set(rows.map((row) => row.column_name)),
    types: new Map(
      rows.map((row) => [
        row.column_name,
        row.udt_name || row.data_type || "",
      ])
    ),
  };
}

export function isUuid(value: unknown) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

export function filterRowToExistingColumns(
  row: Record<string, unknown>,
  columnInfo: SyncColumnInfo,
  blockedColumns: string[] = []
) {
  const blocked = new Set(blockedColumns);

  return Object.fromEntries(
    Object.entries(row).filter(([key, value]) => {
      if (blocked.has(key)) return false;
      if (!columnInfo.names.has(key)) return false;

      const columnType = columnInfo.types.get(key);

      if (columnType === "uuid" && value !== null && value !== undefined) {
        return isUuid(value);
      }

      return true;
    })
  );
}

export function pickConflictColumn(
  columnInfo: SyncColumnInfo,
  candidates: string[],
  fallback = "id"
) {
  for (const candidate of candidates) {
    if (columnInfo.names.has(candidate) && columnInfo.types.get(candidate) !== "uuid") {
      return candidate;
    }
  }

  return fallback;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function normalizeApiFootballResponse<T>(value: unknown): T[] {
  const envelope = value as {
    data?: { response?: T[] | T[][] };
    response?: T[] | T[][];
  };

  const response = envelope.data?.response ?? envelope.response;

  if (!Array.isArray(response)) return [];

  if (Array.isArray(response[0])) {
    return (response as T[][]).flat();
  }

  return response as T[];
}
