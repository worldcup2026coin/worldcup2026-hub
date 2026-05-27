import type { MetadataRoute } from "next";
import { getDynamicSitemap } from "@/lib/data/seo-sitemap";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries = await getDynamicSitemap();
  const baseUrl = getSiteUrl().replace(/\/$/, "");
  const now = new Date();

  const wc26Entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/wc26`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/launch`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-to-buy`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const existingUrls = new Set(sitemapEntries.map((entry) => entry.url));

  return [
    ...sitemapEntries,
    ...wc26Entries.filter((entry) => !existingUrls.has(entry.url)),
  ];
}
