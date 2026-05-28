-- Review before running in Supabase.
-- Phase 16: safe community chat, profiles, meme wall, and moderation.
-- Additive only: no deletes, truncates, resets, or changes to existing football data.

create table if not exists public.community_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  handle text unique,
  avatar_url text,
  bio text,
  role text not null default 'member',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_profiles_role_check check (role in ('member', 'moderator', 'admin')),
  constraint community_profiles_status_check check (status in ('active', 'muted', 'banned')),
  constraint community_profiles_display_name_len check (char_length(display_name) between 2 and 32),
  constraint community_profiles_handle_len check (handle is null or char_length(handle) between 3 and 24),
  constraint community_profiles_bio_len check (bio is null or char_length(bio) <= 240)
);

create table if not exists public.community_chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  status text not null default 'visible',
  flagged_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_chat_status_check check (status in ('visible', 'hidden', 'deleted', 'flagged')),
  constraint community_chat_message_len check (char_length(message) between 1 and 280)
);

create table if not exists public.community_memes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  caption text,
  image_url text not null,
  storage_path text not null,
  status text not null default 'pending',
  rejection_reason text,
  upvotes_count integer not null default 0,
  comments_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id),
  constraint community_memes_status_check check (status in ('pending', 'approved', 'rejected', 'hidden')),
  constraint community_memes_title_len check (char_length(title) between 2 and 80),
  constraint community_memes_caption_len check (caption is null or char_length(caption) <= 220),
  constraint community_memes_upvotes_nonnegative check (upvotes_count >= 0),
  constraint community_memes_comments_nonnegative check (comments_count >= 0)
);

create table if not exists public.community_meme_votes (
  id uuid primary key default gen_random_uuid(),
  meme_id uuid not null references public.community_memes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  vote_type text not null default 'upvote',
  created_at timestamptz not null default now(),
  unique(meme_id, user_id),
  constraint community_meme_votes_type_check check (vote_type in ('upvote'))
);

create index if not exists idx_community_profiles_role_status
on public.community_profiles(role, status);

create index if not exists idx_community_chat_messages_status_created
on public.community_chat_messages(status, created_at desc);

create index if not exists idx_community_chat_messages_user_created
on public.community_chat_messages(user_id, created_at desc);

create index if not exists idx_community_memes_status_created
on public.community_memes(status, created_at desc);

create index if not exists idx_community_memes_status_upvotes
on public.community_memes(status, upvotes_count desc, created_at desc);

create index if not exists idx_community_memes_user_created
on public.community_memes(user_id, created_at desc);

create index if not exists idx_community_meme_votes_user
on public.community_meme_votes(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists community_profiles_set_updated_at on public.community_profiles;
create trigger community_profiles_set_updated_at
before update on public.community_profiles
for each row execute function public.set_updated_at();

drop trigger if exists community_chat_messages_set_updated_at on public.community_chat_messages;
create trigger community_chat_messages_set_updated_at
before update on public.community_chat_messages
for each row execute function public.set_updated_at();

drop trigger if exists community_memes_set_updated_at on public.community_memes;
create trigger community_memes_set_updated_at
before update on public.community_memes
for each row execute function public.set_updated_at();

create or replace function public.is_community_moderator(check_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.community_profiles
    where id = check_user_id
      and role in ('admin', 'moderator')
      and status = 'active'
  );
$$;

create or replace function public.prevent_self_moderation_field_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id
    and not public.is_community_moderator(auth.uid())
    and (new.role <> old.role or new.status <> old.status)
  then
    raise exception 'Community role and status can only be changed by moderators';
  end if;

  return new;
end;
$$;

drop trigger if exists community_profiles_prevent_self_moderation_changes on public.community_profiles;
create trigger community_profiles_prevent_self_moderation_changes
before update on public.community_profiles
for each row execute function public.prevent_self_moderation_field_changes();

create or replace function public.increment_meme_upvote(meme_id_input uuid, user_id_input uuid)
returns table(upvotes_count integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.community_meme_votes (meme_id, user_id, vote_type)
  values (meme_id_input, user_id_input, 'upvote')
  on conflict (meme_id, user_id) do nothing;

  update public.community_memes
  set upvotes_count = (
    select count(*)::integer
    from public.community_meme_votes
    where meme_id = meme_id_input
  )
  where id = meme_id_input
    and status = 'approved';

  return query
  select public.community_memes.upvotes_count
  from public.community_memes
  where id = meme_id_input;
end;
$$;

grant execute on function public.is_community_moderator(uuid) to authenticated, service_role;
grant execute on function public.increment_meme_upvote(uuid, uuid) to service_role;

alter table public.community_profiles enable row level security;
alter table public.community_chat_messages enable row level security;
alter table public.community_memes enable row level security;
alter table public.community_meme_votes enable row level security;

drop policy if exists "Public can read active community profiles" on public.community_profiles;
create policy "Public can read active community profiles"
on public.community_profiles
for select
using (status = 'active');

drop policy if exists "Users can create own community profile" on public.community_profiles;
create policy "Users can create own community profile"
on public.community_profiles
for insert
to authenticated
with check (auth.uid() = id and role = 'member' and status = 'active');

drop policy if exists "Users can update own public profile fields" on public.community_profiles;
create policy "Users can update own public profile fields"
on public.community_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id and role = 'member');

drop policy if exists "Moderators can update profile moderation fields" on public.community_profiles;
create policy "Moderators can update profile moderation fields"
on public.community_profiles
for update
to authenticated
using (public.is_community_moderator(auth.uid()))
with check (public.is_community_moderator(auth.uid()));

drop policy if exists "Public can read visible chat" on public.community_chat_messages;
create policy "Public can read visible chat"
on public.community_chat_messages
for select
using (status = 'visible');

drop policy if exists "Users can insert own visible chat" on public.community_chat_messages;
create policy "Users can insert own visible chat"
on public.community_chat_messages
for insert
to authenticated
with check (auth.uid() = user_id and status = 'visible');

drop policy if exists "Moderators can update chat moderation status" on public.community_chat_messages;
create policy "Moderators can update chat moderation status"
on public.community_chat_messages
for update
to authenticated
using (public.is_community_moderator(auth.uid()))
with check (public.is_community_moderator(auth.uid()));

drop policy if exists "Public can read approved memes" on public.community_memes;
create policy "Public can read approved memes"
on public.community_memes
for select
using (status = 'approved');

drop policy if exists "Users can read own memes" on public.community_memes;
create policy "Users can read own memes"
on public.community_memes
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can submit own pending memes" on public.community_memes;
create policy "Users can submit own pending memes"
on public.community_memes
for insert
to authenticated
with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "Moderators can read all memes" on public.community_memes;
create policy "Moderators can read all memes"
on public.community_memes
for select
to authenticated
using (public.is_community_moderator(auth.uid()));

drop policy if exists "Moderators can update meme moderation status" on public.community_memes;
create policy "Moderators can update meme moderation status"
on public.community_memes
for update
to authenticated
using (public.is_community_moderator(auth.uid()))
with check (public.is_community_moderator(auth.uid()));

drop policy if exists "Users can read own meme votes" on public.community_meme_votes;
create policy "Users can read own meme votes"
on public.community_meme_votes
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own meme votes" on public.community_meme_votes;
create policy "Users can insert own meme votes"
on public.community_meme_votes
for insert
to authenticated
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community-memes',
  'community-memes',
  false,
  3145728,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 3145728,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp'];

drop policy if exists "Users can upload own meme files" on storage.objects;
create policy "Users can upload own meme files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'community-memes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can read own meme files" on storage.objects;
create policy "Users can read own meme files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'community-memes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Moderators can read meme files" on storage.objects;
create policy "Moderators can read meme files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'community-memes'
  and public.is_community_moderator(auth.uid())
);
