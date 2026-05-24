import type { MetadataRoute } from "next";
import { getDynamicSitemap } from "@/lib/data/seo-sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getDynamicSitemap();
}
