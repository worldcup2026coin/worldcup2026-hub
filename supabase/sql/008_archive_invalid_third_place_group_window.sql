-- Review before running in Supabase.
-- Archive the invalid third-place ranking table prediction window without
-- deleting the window or any fan_predictions.

alter table if exists public.prediction_windows
  add column if not exists visibility text not null default 'active',
  add column if not exists archive_after timestamptz,
  add column if not exists settlement_strategy text;

update public.prediction_windows
set
  status = 'void',
  visibility = 'archived',
  settlement_strategy = 'manual_safe',
  archive_after = coalesce(archive_after, now()),
  updated_at = now()
where slug = 'group-ranking-of-third-placed-teams-winner';
