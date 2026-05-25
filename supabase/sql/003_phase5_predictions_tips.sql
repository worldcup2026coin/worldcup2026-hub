create table if not exists public.predictions_tips (
  id uuid primary key default gen_random_uuid(),

  fixture_id uuid not null references public.fixtures(id) on delete cascade,

  type text not null check (
    type in (
      'fan_preview',
      'fantasy_tip',
      'betting_style'
    )
  ),

  title text not null,
  summary text,
  prediction_text text,

  risk_level text not null default 'no_lean' check (
    risk_level in (
      'low',
      'medium',
      'high',
      'no_lean'
    )
  ),

  confidence_score numeric(5,2) check (
    confidence_score is null
    or (
      confidence_score >= 0
      and confidence_score <= 100
    )
  ),

  key_factors jsonb not null default '[]'::jsonb,
  players_to_watch jsonb,

  market_label text,
  odds_decimal numeric(10,3) check (
    odds_decimal is null
    or odds_decimal > 1
  ),
  bookmaker text,

  disclaimer text not null default 'Betting-style content is for entertainment and informational purposes only. It is not financial advice, gambling advice, or a guarantee of outcome. Odds and availability may vary by location and provider. Only participate where legal, and never risk money you cannot afford to lose.',

  status text not null default 'draft' check (
    status in (
      'draft',
      'published'
    )
  ),

  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint predictions_tips_safe_wording check (
    not (
      (
        coalesce(title, '') || ' ' ||
        coalesce(summary, '') || ' ' ||
        coalesce(prediction_text, '') || ' ' ||
        coalesce(market_label, '')
      ) ~* '(^|[^a-z])(strong pick|lock|sure[[:space:]-]*thing)([^a-z]|$)'
    )
  )
);

create table if not exists public.odds_style_records (
  id uuid primary key default gen_random_uuid(),

  fixture_id uuid not null references public.fixtures(id) on delete cascade,

  market text not null,
  selection text not null,
  odds_decimal numeric(10,3) check (
    odds_decimal is null
    or odds_decimal > 1
  ),
  bookmaker text,
  source text,
  captured_at timestamptz not null default now(),
  is_manual boolean not null default true,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_predictions_tips_fixture_id
on public.predictions_tips(fixture_id);

create index if not exists idx_predictions_tips_status
on public.predictions_tips(status);

create index if not exists idx_predictions_tips_type
on public.predictions_tips(type);

create index if not exists idx_predictions_tips_published_at
on public.predictions_tips(published_at desc);

create index if not exists idx_odds_style_records_fixture_id
on public.odds_style_records(fixture_id);

create index if not exists idx_odds_style_records_captured_at
on public.odds_style_records(captured_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_predictions_tips_updated_at on public.predictions_tips;
create trigger trg_predictions_tips_updated_at
before update on public.predictions_tips
for each row
execute function public.set_updated_at();

drop trigger if exists trg_odds_style_records_updated_at on public.odds_style_records;
create trigger trg_odds_style_records_updated_at
before update on public.odds_style_records
for each row
execute function public.set_updated_at();

alter table public.predictions_tips enable row level security;
alter table public.odds_style_records enable row level security;

grant select, insert, update, delete on table public.predictions_tips to service_role;
grant select, insert, update, delete on table public.odds_style_records to service_role;

grant usage, select on all sequences in schema public to service_role;
