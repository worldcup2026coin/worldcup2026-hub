create table if not exists public.match_events (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid references public.fixtures(id) on delete cascade,
  api_fixture_id integer not null,
  api_event_key text not null unique,

  elapsed integer,
  extra integer,
  team_api_id integer,
  team_name text,
  team_logo_url text,

  player_api_id integer,
  player_name text,
  assist_api_id integer,
  assist_name text,

  event_type text,
  event_detail text,
  comments text,

  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.match_statistics (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid references public.fixtures(id) on delete cascade,
  api_fixture_id integer not null,

  team_api_id integer not null,
  team_name text not null,
  team_logo_url text,

  stat_type text not null,
  stat_value text,

  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint match_statistics_unique unique (
    api_fixture_id,
    team_api_id,
    stat_type
  )
);

create table if not exists public.match_lineups (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid references public.fixtures(id) on delete cascade,
  api_fixture_id integer not null,

  team_api_id integer not null,
  team_name text not null,
  team_logo_url text,

  coach_name text,
  formation text,

  starting_xi jsonb not null default '[]'::jsonb,
  substitutes jsonb not null default '[]'::jsonb,

  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint match_lineups_unique unique (
    api_fixture_id,
    team_api_id
  )
);

create index if not exists idx_match_events_api_fixture_id
on public.match_events(api_fixture_id);

create index if not exists idx_match_events_team_api_id
on public.match_events(team_api_id);

create index if not exists idx_match_events_elapsed
on public.match_events(elapsed, extra);

create index if not exists idx_match_statistics_api_fixture_id
on public.match_statistics(api_fixture_id);

create index if not exists idx_match_statistics_team_api_id
on public.match_statistics(team_api_id);

create index if not exists idx_match_lineups_api_fixture_id
on public.match_lineups(api_fixture_id);

create index if not exists idx_match_lineups_team_api_id
on public.match_lineups(team_api_id);

alter table public.match_events enable row level security;
alter table public.match_statistics enable row level security;
alter table public.match_lineups enable row level security;

grant select, insert, update, delete on table public.match_events to service_role;
grant select, insert, update, delete on table public.match_statistics to service_role;
grant select, insert, update, delete on table public.match_lineups to service_role;

grant usage, select on all sequences in schema public to service_role;
