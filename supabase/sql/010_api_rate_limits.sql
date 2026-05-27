-- Review before running in Supabase.
-- Additive API rate limit storage for public POST endpoints.
-- This migration does not delete, truncate, or reset existing data.

create table if not exists public.api_rate_limits (
  id uuid primary key default gen_random_uuid(),
  route text not null,
  identifier_hash text not null,
  window_start timestamptz not null,
  count integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(route, identifier_hash, window_start)
);

alter table public.api_rate_limits enable row level security;

revoke all on table public.api_rate_limits from anon;
revoke all on table public.api_rate_limits from authenticated;

create index if not exists idx_api_rate_limits_route_window_start
on public.api_rate_limits(route, window_start);

create index if not exists idx_api_rate_limits_updated_at
on public.api_rate_limits(updated_at);

create or replace function public.increment_api_rate_limit(
  route_input text,
  identifier_hash_input text,
  window_start_input timestamptz
)
returns table(current_count integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  insert into public.api_rate_limits (
    route,
    identifier_hash,
    window_start,
    count,
    created_at,
    updated_at
  )
  values (
    route_input,
    identifier_hash_input,
    window_start_input,
    1,
    now(),
    now()
  )
  on conflict (route, identifier_hash, window_start)
  do update set
    count = public.api_rate_limits.count + 1,
    updated_at = now()
  returning public.api_rate_limits.count;
end;
$$;

revoke all on function public.increment_api_rate_limit(text, text, timestamptz) from public;
revoke all on function public.increment_api_rate_limit(text, text, timestamptz) from anon;
revoke all on function public.increment_api_rate_limit(text, text, timestamptz) from authenticated;

grant execute on function public.increment_api_rate_limit(text, text, timestamptz)
to service_role;
