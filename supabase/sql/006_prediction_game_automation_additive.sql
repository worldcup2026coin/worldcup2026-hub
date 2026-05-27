-- Review before running in Supabase.
-- Additive metadata for the automated fan prediction game.
-- This migration does not delete or reset prediction history.

alter table if exists public.prediction_windows
  add column if not exists phase text,
  add column if not exists scoring_json jsonb not null default '{}'::jsonb,
  add column if not exists display_group text,
  add column if not exists visibility text not null default 'active',
  add column if not exists archive_after timestamptz,
  add column if not exists settlement_strategy text,
  add column if not exists max_points integer;

alter table if exists public.fan_predictions
  add column if not exists pick_json jsonb not null default '{}'::jsonb;

create index if not exists idx_prediction_windows_status_locks
  on public.prediction_windows(status, locks_at);

create index if not exists idx_prediction_windows_type_status
  on public.prediction_windows(prediction_type, status);

create index if not exists idx_prediction_windows_visibility
  on public.prediction_windows(visibility);

create index if not exists idx_fan_predictions_window_status
  on public.fan_predictions(window_id, result_status);

comment on column public.prediction_windows.visibility is
  'UI visibility hint. Archived/hidden windows should still count through fan_predictions totals.';

comment on column public.prediction_windows.settlement_strategy is
  'Automation hint such as fixture_result, group_standings, final_result, top_scorer, or manual_safe.';

comment on column public.fan_predictions.pick_json is
  'Optional structured pick payload for richer future prediction types; simple text pick remains supported.';
