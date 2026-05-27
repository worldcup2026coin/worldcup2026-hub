import "server-only";

import { createHash } from "crypto";
import { XMLParser } from "fast-xml-parser";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { newsSources, type NewsSource } from "@/lib/news/news-sources";

type ParsedFeedItem = {
  title: string;
  link: string;
  summary: string;
  publishedAt: string | null;
  imageUrl: string | null;
};

type PlannedPost = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  featured_image_url: string | null;
  seo_title: string;
  seo_description: string;
  is_featured: false;
  status: "draft" | "published";
  published_at: string | null;
  source_name: string;
  source_url: string;
  external_url: string;
  source_published_at: string | null;
  content_origin: "rss";
  ingestion_hash: string;
  last_seen_at: string;
  news_confidence: "high" | "medium" | "low";
  language: "en";
};

export type NewsIngestResult = {
  dryRun: boolean;
  sourcesSeen: number;
  itemsSeen: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: Array<{
    sourceId: string;
    sourceName: string;
    error: string;
  }>;
  planned?: Array<{
    sourceName: string;
    title: string;
    externalUrl: string;
    status: string;
  }>;
};

const ITEMS_PER_SOURCE = 8;
const TOTAL_ITEMS_PER_RUN = 30;
const FETCH_TIMEOUT_MS = 12000;

const TEAM_KEYWORDS = [
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "Colombia",
  "England",
  "France",
  "Germany",
  "Iran",
  "Japan",
  "Mexico",
  "Morocco",
  "Portugal",
  "South Africa",
  "South Korea",
  "Spain",
  "United States",
  "USA",
];

const SKIP_TERMS = [
  "presale",
  "airdrop",
  "staking",
  "token price",
  "price prediction",
  "crypto price",
  "casino",
  "odds boost",
];

const WORLD_CUP_TERMS = [
  "world cup",
  "world cup 2026",
  "2026 world cup",
  "fifa",
  "qualifier",
  "qualifying",
  "host city",
  "ticket",
  "draw",
  "group stage",
];

function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return "";
}

function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3).trim()}...`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/g, "");
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function safeDate(value: string) {
  const date = new Date(value);

  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

function normalizeUrl(value: string, baseUrl: string) {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return "";
  }
}

function getItemLink(item: Record<string, unknown>, source: NewsSource) {
  const link = item.link;

  if (typeof link === "string") {
    return normalizeUrl(link, source.url);
  }

  const linkRecord = asRecord(link);
  const href = firstString(linkRecord.href, linkRecord["@_href"]);

  return href ? normalizeUrl(href, source.url) : "";
}

function getItemImage(item: Record<string, unknown>) {
  const mediaContent = asRecord(item["media:content"]);
  const mediaThumbnail = asRecord(item["media:thumbnail"]);
  const enclosure = asRecord(item.enclosure);

  return (
    firstString(
      mediaContent.url,
      mediaContent["@_url"],
      mediaThumbnail.url,
      mediaThumbnail["@_url"],
      enclosure.url,
      enclosure["@_url"],
    ) || null
  );
}

function parseFeed(xml: string, source: NewsSource): ParsedFeedItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true,
  });
  const parsed = parser.parse(xml);
  const root = asRecord(parsed);
  const rss = asRecord(root.rss);
  const channel = asRecord(rss.channel);
  const feed = asRecord(root.feed);
  const rssItems = toArray(channel.item).map(asRecord);
  const atomItems = toArray(feed.entry).map(asRecord);
  const items = rssItems.length ? rssItems : atomItems;

  return items.map((item) => {
    const title = stripHtml(firstString(item.title));
    const summary = stripHtml(
      firstString(item.description, item.summary, item.content, item["content:encoded"]),
    );
    const link = getItemLink(item, source);
    const publishedAt = safeDate(
      firstString(item.pubDate, item.published, item.updated, item["dc:date"]),
    );

    return {
      title,
      link,
      summary,
      publishedAt,
      imageUrl: getItemImage(item),
    };
  });
}

function classifyCategory(source: NewsSource, item: ParsedFeedItem) {
  const text = `${item.title} ${item.summary}`.toLowerCase();

  if (text.includes("injury") || text.includes("injured")) return "injury_updates";
  if (text.includes("preview") || text.includes("fixture")) return "match_previews";
  if (text.includes("stadium") || text.includes("host city")) return "host_city_news";
  if (text.includes("group")) return "group_previews";
  if (TEAM_KEYWORDS.some((team) => text.includes(team.toLowerCase()))) {
    return "team_news";
  }

  return source.category;
}

function detectTags(source: NewsSource, item: ParsedFeedItem) {
  const text = `${item.title} ${item.summary}`.toLowerCase();
  const detectedTeams = TEAM_KEYWORDS.filter((team) =>
    text.includes(team.toLowerCase()),
  );

  return Array.from(new Set([...source.tags, ...detectedTeams])).slice(0, 8);
}

function isRelevantSafeItem(item: ParsedFeedItem) {
  const text = `${item.title} ${item.summary}`.toLowerCase();
  const title = item.title.toLowerCase();
  const summary = item.summary.toLowerCase();

  if (!item.title || !item.link) return false;
  if (
    !WORLD_CUP_TERMS.some((term) => title.includes(term)) &&
    !summary.includes("world cup 2026") &&
    !summary.includes("2026 world cup")
  ) {
    return false;
  }

  return !SKIP_TERMS.some((term) => text.includes(term));
}

function confidenceFor(source: NewsSource, item: ParsedFeedItem) {
  if (!item.title || !item.link) return "low";
  if (!item.summary) return source.trustLevel === "high" ? "medium" : "low";

  return source.trustLevel;
}

function buildBody(item: ParsedFeedItem, source: NewsSource) {
  const summary = item.summary
    ? truncate(item.summary, 420)
    : "A sourced football update is available from the original publisher.";

  return [
    "## Sourced update",
    summary,
    "",
    `This is an attributed RSS summary from ${source.name}. World Cup 2026 Hub has not republished the full article text.`,
    "",
    `[Read the full story at ${source.name}](${item.link})`,
  ].join("\n");
}

function planPost(source: NewsSource, item: ParsedFeedItem, now: string): PlannedPost {
  const ingestionHash = hashValue(`${source.id}:${item.link}:${item.title}`);
  const slugBase = slugify(item.title) || "sourced-football-update";
  const slug = `${slugBase}-${ingestionHash.slice(0, 8)}`;
  const confidence = confidenceFor(source, item);
  const excerpt = truncate(
    item.summary || `Sourced football update from ${source.name}.`,
    240,
  );

  return {
    title: item.title,
    slug,
    excerpt,
    body: buildBody(item, source),
    category: classifyCategory(source, item),
    tags: detectTags(source, item),
    featured_image_url: item.imageUrl,
    seo_title: `${item.title} | Sourced World Cup 2026 update`,
    seo_description: excerpt,
    is_featured: false,
    status:
      confidence !== "low" && item.title && item.link && source.name
        ? "published"
        : "draft",
    published_at: item.publishedAt ?? now,
    source_name: source.name,
    source_url: source.url,
    external_url: item.link,
    source_published_at: item.publishedAt,
    content_origin: "rss",
    ingestion_hash: ingestionHash,
    last_seen_at: now,
    news_confidence: confidence,
    language: "en",
  };
}

async function fetchFeed(source: NewsSource) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "user-agent": "WorldCup2026HubBot/1.0 (+https://worldcup2026hub.com)",
        accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

export async function runNewsIngest({
  dryRun = false,
  sources = newsSources,
}: {
  dryRun?: boolean;
  sources?: NewsSource[];
} = {}): Promise<NewsIngestResult> {
  const enabledSources = sources.filter((source) => source.enabled);
  const now = new Date().toISOString();
  const supabase = dryRun ? null : createSupabaseAdminClient();
  const errors: NewsIngestResult["errors"] = [];
  const planned: NonNullable<NewsIngestResult["planned"]> = [];
  let itemsSeen = 0;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let totalPlanned = 0;

  for (const source of enabledSources) {
    if (totalPlanned >= TOTAL_ITEMS_PER_RUN) {
      break;
    }

    try {
      const xml = await fetchFeed(source);
      const items = parseFeed(xml, source).slice(0, ITEMS_PER_SOURCE);
      itemsSeen += items.length;

      for (const item of items) {
        if (totalPlanned >= TOTAL_ITEMS_PER_RUN) {
          break;
        }

        if (!isRelevantSafeItem(item)) {
          skipped += 1;
          continue;
        }

        const post = planPost(source, item, now);
        planned.push({
          sourceName: source.name,
          title: post.title,
          externalUrl: post.external_url,
          status: post.status,
        });
        totalPlanned += 1;

        if (dryRun) {
          inserted += 1;
          continue;
        }

        const { data: existingByUrl, error: urlError } = await supabase!
          .from("blog_posts")
          .select("id, content_origin")
          .eq("external_url", post.external_url)
          .limit(1);

        if (urlError) {
          throw new Error(urlError.message);
        }

        const { data: existingByHash, error: hashError } = existingByUrl?.length
          ? { data: [], error: null }
          : await supabase!
              .from("blog_posts")
              .select("id, content_origin")
              .eq("ingestion_hash", post.ingestion_hash)
              .limit(1);

        if (hashError) {
          throw new Error(hashError.message);
        }

        const existingPost = (existingByUrl?.[0] ?? existingByHash?.[0]) as
          | { id: string; content_origin: string | null }
          | undefined;

        if (existingPost) {
          if (existingPost.content_origin === "rss") {
            const { error: updateError } = await supabase!
              .from("blog_posts")
              .update({
                last_seen_at: now,
                source_published_at: post.source_published_at,
                news_confidence: post.news_confidence,
              })
              .eq("id", existingPost.id);

            if (updateError) {
              throw new Error(updateError.message);
            }

            updated += 1;
          } else {
            skipped += 1;
          }

          continue;
        }

        const { error: insertError } = await supabase!
          .from("blog_posts")
          .insert(post);

        if (insertError) {
          throw new Error(insertError.message);
        }

        inserted += 1;
      }
    } catch (error) {
      errors.push({
        sourceId: source.id,
        sourceName: source.name,
        error: error instanceof Error ? error.message : "Unknown feed error",
      });
    }
  }

  return {
    dryRun,
    sourcesSeen: enabledSources.length,
    itemsSeen,
    inserted,
    updated,
    skipped,
    errors,
    planned: dryRun ? planned.slice(0, 10) : undefined,
  };
}
