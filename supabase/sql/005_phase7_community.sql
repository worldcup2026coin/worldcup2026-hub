create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  description text,
  context_type text not null default 'general' check (
    context_type in ('homepage', 'fixture', 'team', 'community', 'general')
  ),

  fixture_id uuid references public.fixtures(id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,

  options jsonb not null default '[]'::jsonb,

  status text not null default 'draft' check (
    status in ('draft', 'published', 'closed')
  ),

  is_featured boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint polls_context_fixture_check check (
    context_type <> 'fixture' or fixture_id is not null
  ),

  constraint polls_context_team_check check (
    context_type <> 'team' or team_id is not null
  )
);

create table if not exists public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_id text not null,
  anonymous_hash text not null,
  source text,
  created_at timestamptz not null default now(),
  constraint poll_votes_unique_anonymous_vote unique (poll_id, anonymous_hash)
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  consent boolean not null default false,
  source text,
  source_url text,
  status text not null default 'active' check (
    status in ('active', 'unsubscribed', 'bounced')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscribers_email_format check (
    email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  )
);

create index if not exists idx_polls_context_type on public.polls(context_type);
create index if not exists idx_polls_fixture_id on public.polls(fixture_id);
create index if not exists idx_polls_team_id on public.polls(team_id);
create index if not exists idx_polls_status on public.polls(status);
create index if not exists idx_poll_votes_poll_id on public.poll_votes(poll_id);
create index if not exists idx_subscribers_status on public.subscribers(status);
create index if not exists idx_subscribers_source on public.subscribers(source);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_polls_updated_at on public.polls;
create trigger trg_polls_updated_at
before update on public.polls
for each row
execute function public.set_updated_at();

drop trigger if exists trg_subscribers_updated_at on public.subscribers;
create trigger trg_subscribers_updated_at
before update on public.subscribers
for each row
execute function public.set_updated_at();

alter table public.polls enable row level security;
alter table public.poll_votes enable row level security;
alter table public.subscribers enable row level security;

grant select, insert, update, delete on table public.polls to service_role;
grant select, insert, update, delete on table public.poll_votes to service_role;
grant select, insert, update, delete on table public.subscribers to service_role;

grant usage, select on all sequences in schema public to service_role;
