-- Review before running in Supabase.
-- Production repair for canonical prediction-game windows.
-- This migration does not delete prediction_windows or fan_predictions.
-- It does not reset historical points.

begin;

alter table if exists public.prediction_windows
  add column if not exists phase text,
  add column if not exists scoring_json jsonb not null default '{}'::jsonb,
  add column if not exists display_group text,
  add column if not exists visibility text not null default 'active',
  add column if not exists archive_after timestamptz,
  add column if not exists settlement_strategy text,
  add column if not exists max_points integer;

-- Keep canonical seeded long-term windows and bring their scoring/metadata
-- into line with the automated game rules.
update public.prediction_windows
set
  title = 'Tournament winner',
  prediction_type = 'tournament_winner',
  status = 'open',
  visibility = 'active',
  display_group = 'tournament',
  settlement_strategy = 'final_result',
  points_result = 60,
  points_exact = 0,
  max_points = 60,
  updated_at = now()
where slug = 'tournament-winner';

update public.prediction_windows
set
  title = 'Golden Boot winner',
  prediction_type = 'golden_boot',
  status = 'open',
  visibility = 'active',
  display_group = 'tournament',
  settlement_strategy = 'top_scorer',
  points_result = 40,
  points_exact = 0,
  max_points = 40,
  updated_at = now()
where slug = 'golden-boot-winner';

update public.prediction_windows
set
  title = 'Host nation furthest',
  prediction_type = 'host_nation_furthest',
  status = 'open',
  visibility = 'active',
  display_group = 'tournament',
  settlement_strategy = 'manual_safe',
  points_result = 30,
  points_exact = 0,
  max_points = 30,
  updated_at = now()
where slug = 'host-nation-furthest';

update public.prediction_windows
set
  title = 'Dark horse pick',
  prediction_type = 'dark_horse',
  status = 'open',
  visibility = 'active',
  display_group = 'tournament',
  settlement_strategy = 'manual_safe',
  points_result = 10,
  points_exact = 0,
  max_points = 10,
  updated_at = now()
where slug = 'dark-horse-pick';

-- Preserve picks from the duplicate tournament-winner-2026 window by moving
-- only users who do not already have a canonical tournament-winner pick.
with canonical as (
  select id from public.prediction_windows where slug = 'tournament-winner'
),
duplicate as (
  select id from public.prediction_windows where slug = 'tournament-winner-2026'
)
update public.fan_predictions fp
set
  window_id = (select id from canonical),
  updated_at = now()
where fp.window_id = (select id from duplicate)
  and exists (select 1 from canonical)
  and exists (select 1 from duplicate)
  and not exists (
    select 1
    from public.fan_predictions existing
    where existing.user_id = fp.user_id
      and existing.window_id = (select id from canonical)
  );

-- Hide/inactivate the duplicate without deleting it. Use status='void' because status='archived' is not allowed by the DB constraint. Any remaining duplicate picks are
-- retained for audit/history but the window is no longer visible or active.
update public.prediction_windows
set
  status = 'void',
  visibility = 'archived',
  display_group = 'tournament',
  settlement_strategy = 'manual_safe',
  archive_after = coalesce(archive_after, now()),
  updated_at = now()
where slug = 'tournament-winner-2026'
  and exists (
    select 1
    from public.prediction_windows canonical
    where canonical.slug = 'tournament-winner'
  );

commit;

