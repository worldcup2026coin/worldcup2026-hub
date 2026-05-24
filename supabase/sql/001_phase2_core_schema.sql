create extension if not exists pgcrypto;

create table if not exists public.host_cities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  country text,
  timezone text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stadiums (
  id uuid primary key default gen_random_uuid(),
  stadium_key text not null unique,
  api_venue_id integer unique,
  host_city_id uuid references public.host_cities(id) on delete set null,
  name text not null,
  city text,
  country text,
  capacity integer,
  surface text,
  image_url text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  api_team_id integer not null unique,
  home_stadium_id uuid references public.stadiums(id) on delete set null,
  name text not null,
  code text,
  country text,
  founded integer,
  national boolean not null default false,
  logo_url text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  api_league_id integer not null,
  season integer not null,
  name text not null,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint groups_api_unique unique (api_league_id, season, name)
);

create table if not exists public.fixtures (
  id uuid primary key default gen_random_uuid(),
  api_fixture_id integer not null unique,
  api_league_id integer not null,
  season integer not null,
  round text,
  group_name text,
  match_date timestamptz,
  api_timestamp bigint,
  timezone text,
  referee text,

  stadium_id uuid references public.stadiums(id) on delete set null,
  venue_api_id integer,
  venue_name text,
  venue_city text,

  home_team_id uuid references public.teams(id) on delete set null,
  away_team_id uuid references public.teams(id) on delete set null,
  home_team_api_id integer,
  away_team_api_id integer,
  home_team_name text,
  away_team_name text,
  home_team_logo_url text,
  away_team_logo_url text,

  status_long text,
  status_short text,
  elapsed integer,
  extra integer,

  home_goals integer,
  away_goals integer,
  ht_home_goals integer,
  ht_away_goals integer,
  ft_home_goals integer,
  ft_away_goals integer,
  et_home_goals integer,
  et_away_goals integer,
  pen_home_goals integer,
  pen_away_goals integer,

  winner_api_team_id integer,
  raw jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.standings (
  id uuid primary key default gen_random_uuid(),
  api_league_id integer not null,
  season integer not null,
  group_id uuid references public.groups(id) on delete set null,
  group_name text not null,

  team_id uuid references public.teams(id) on delete set null,
  api_team_id integer not null,
  team_name text not null,
  team_logo_url text,

  rank integer,
  points integer,
  goals_diff integer,
  form text,
  status text,
  description text,

  played integer,
  wins integer,
  draws integer,
  losses integer,
  goals_for integer,
  goals_against integer,

  home_played integer,
  home_wins integer,
  home_draws integer,
  home_losses integer,
  home_goals_for integer,
  home_goals_against integer,

  away_played integer,
  away_wins integer,
  away_draws integer,
  away_losses integer,
  away_goals_for integer,
  away_goals_against integer,

  api_updated_at timestamptz,
  raw jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint standings_api_unique unique (
    api_league_id,
    season,
    group_name,
    api_team_id
  )
);

create table if not exists public.api_sync_logs (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  status text not null check (status in ('running', 'success', 'error')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_ms integer,
  request_count integer not null default 0,
  records_received integer not null default 0,
  records_upserted integer not null default 0,
  error_message text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_host_cities_slug on public.host_cities(slug);

create index if not exists idx_stadiums_api_venue_id on public.stadiums(api_venue_id);
create index if not exists idx_stadiums_city on public.stadiums(city);

create index if not exists idx_teams_api_team_id on public.teams(api_team_id);
create index if not exists idx_teams_country on public.teams(country);

create index if not exists idx_fixtures_match_date on public.fixtures(match_date);
create index if not exists idx_fixtures_status_short on public.fixtures(status_short);
create index if not exists idx_fixtures_home_team_api_id on public.fixtures(home_team_api_id);
create index if not exists idx_fixtures_away_team_api_id on public.fixtures(away_team_api_id);
create index if not exists idx_fixtures_league_season on public.fixtures(api_league_id, season);

create index if not exists idx_groups_league_season on public.groups(api_league_id, season);

create index if not exists idx_standings_league_season_group on public.standings(api_league_id, season, group_name);
create index if not exists idx_standings_api_team_id on public.standings(api_team_id);
create index if not exists idx_standings_rank on public.standings(rank);

create index if not exists idx_api_sync_logs_scope on public.api_sync_logs(scope);
create index if not exists idx_api_sync_logs_status on public.api_sync_logs(status);
create index if not exists idx_api_sync_logs_started_at on public.api_sync_logs(started_at desc);

alter table public.host_cities enable row level security;
alter table public.stadiums enable row level security;
alter table public.teams enable row level security;
alter table public.groups enable row level security;
alter table public.fixtures enable row level security;
alter table public.standings enable row level security;
alter table public.api_sync_logs enable row level security;
