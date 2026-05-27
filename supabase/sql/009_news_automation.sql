-- Review before running in Supabase.
-- Additive RSS/news automation metadata for public.blog_posts.
-- This migration does not delete, truncate, or reset existing posts.

alter table if exists public.blog_posts
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists external_url text,
  add column if not exists source_published_at timestamptz,
  add column if not exists content_origin text not null default 'manual',
  add column if not exists ingestion_hash text,
  add column if not exists last_seen_at timestamptz,
  add column if not exists reviewed_at timestamptz,
  add column if not exists news_confidence text,
  add column if not exists language text not null default 'en';

alter table if exists public.blog_posts
  drop constraint if exists blog_posts_category_check;

alter table if exists public.blog_posts
  add constraint blog_posts_category_check check (
    category in (
      'latest_news',
      'team_news',
      'match_previews',
      'injury_updates',
      'group_previews',
      'host_city_news',
      'fan_culture',
      'guides',
      'team_guides',
      'stadium_host_city_guides',
      'what_to_watch_today',
      'crypto_native_football_culture',
      'community_roundups'
    )
  );

create unique index if not exists idx_blog_posts_external_url_unique
on public.blog_posts(external_url)
where external_url is not null;

create index if not exists idx_blog_posts_content_origin
on public.blog_posts(content_origin);

create index if not exists idx_blog_posts_source_published_at
on public.blog_posts(source_published_at desc);

create index if not exists idx_blog_posts_status
on public.blog_posts(status);

create index if not exists idx_blog_posts_category
on public.blog_posts(category);

create index if not exists idx_blog_posts_ingestion_hash
on public.blog_posts(ingestion_hash)
where ingestion_hash is not null;
