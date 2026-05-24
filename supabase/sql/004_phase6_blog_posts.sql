create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null,

  category text not null check (
    category in (
      'match_previews',
      'team_guides',
      'group_previews',
      'stadium_host_city_guides',
      'what_to_watch_today',
      'fan_culture',
      'crypto_native_football_culture',
      'community_roundups'
    )
  ),

  tags jsonb not null default '[]'::jsonb,
  featured_image_url text,

  seo_title text,
  seo_description text,

  is_featured boolean not null default false,

  status text not null default 'draft' check (
    status in ('draft', 'published')
  ),

  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint blog_posts_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

create index if not exists idx_blog_posts_status
on public.blog_posts(status);

create index if not exists idx_blog_posts_category
on public.blog_posts(category);

create index if not exists idx_blog_posts_published_at
on public.blog_posts(published_at desc);

create index if not exists idx_blog_posts_is_featured
on public.blog_posts(is_featured);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;

create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

grant select, insert, update, delete on table public.blog_posts to service_role;
grant usage, select on all sequences in schema public to service_role;
