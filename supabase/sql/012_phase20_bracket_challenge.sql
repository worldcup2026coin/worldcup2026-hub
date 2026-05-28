-- Review before running in Supabase.
-- Phase 20: WC26 Bracket Challenge persistence and public share pages.
-- Additive only: no deletes, truncates, resets, or changes to football sync data.

create table if not exists public.bracket_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  slug text unique not null,
  display_name text,
  title text,
  champion_team_id text not null,
  finalist_team_id text,
  third_place_team_id text,
  dark_horse_team_id text,
  bracket_data jsonb not null,
  is_public boolean not null default true,
  status text not null default 'visible',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bracket_challenges_status_check check (status in ('visible', 'hidden', 'deleted', 'flagged')),
  constraint bracket_challenges_slug_len check (char_length(slug) between 8 and 80),
  constraint bracket_challenges_display_name_len check (display_name is null or char_length(display_name) <= 32),
  constraint bracket_challenges_title_len check (title is null or char_length(title) <= 80)
);

create table if not exists public.bracket_challenge_reactions (
  id uuid primary key default gen_random_uuid(),
  bracket_id uuid not null references public.bracket_challenges(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  reaction_type text not null default 'fire',
  created_at timestamptz not null default now(),
  constraint bracket_challenge_reactions_type_check check (reaction_type in ('fire'))
);

create unique index if not exists idx_bracket_challenge_reactions_user_unique
on public.bracket_challenge_reactions(bracket_id, user_id, reaction_type)
where user_id is not null;

create index if not exists idx_bracket_challenges_public_visible
on public.bracket_challenges(is_public, status, created_at desc);

create index if not exists idx_bracket_challenges_user_created
on public.bracket_challenges(user_id, created_at desc);

create index if not exists idx_bracket_challenge_reactions_bracket
on public.bracket_challenge_reactions(bracket_id);

drop trigger if exists bracket_challenges_set_updated_at on public.bracket_challenges;
create trigger bracket_challenges_set_updated_at
before update on public.bracket_challenges
for each row execute function public.set_updated_at();

alter table public.bracket_challenges enable row level security;
alter table public.bracket_challenge_reactions enable row level security;

drop policy if exists "Public can read visible public bracket challenges" on public.bracket_challenges;
create policy "Public can read visible public bracket challenges"
on public.bracket_challenges
for select
using (is_public = true and status = 'visible');

drop policy if exists "Users can read own bracket challenges" on public.bracket_challenges;
create policy "Users can read own bracket challenges"
on public.bracket_challenges
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own bracket challenges" on public.bracket_challenges;
create policy "Users can create own bracket challenges"
on public.bracket_challenges
for insert
to authenticated
with check (auth.uid() = user_id and status = 'visible');

drop policy if exists "Users can update own bracket challenges" on public.bracket_challenges;
create policy "Users can update own bracket challenges"
on public.bracket_challenges
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Moderators can update bracket challenges" on public.bracket_challenges;
create policy "Moderators can update bracket challenges"
on public.bracket_challenges
for update
to authenticated
using (public.is_community_moderator(auth.uid()))
with check (public.is_community_moderator(auth.uid()));

drop policy if exists "Public can read bracket challenge reactions" on public.bracket_challenge_reactions;
create policy "Public can read bracket challenge reactions"
on public.bracket_challenge_reactions
for select
using (
  exists (
    select 1
    from public.bracket_challenges bc
    where bc.id = bracket_id
      and bc.is_public = true
      and bc.status = 'visible'
  )
);

drop policy if exists "Authenticated users can react to brackets" on public.bracket_challenge_reactions;
create policy "Authenticated users can react to brackets"
on public.bracket_challenge_reactions
for insert
to authenticated
with check (auth.uid() = user_id and reaction_type = 'fire');
