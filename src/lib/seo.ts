import type { Metadata } from "next";

export const siteName = "World Cup 2026 Hub";

export const defaultDescription =
  "A mobile-first, API-first World Cup 2026 football hub for fixtures, live scores, groups, teams, match pages, predictions, news, polls and fan community.";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/^/, "https://") ||
    "https://worldcup2026-hub.vercel.app"
  ).replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${cleanPath}`;
}

export function createPageMetadata({
  title,
  description = defaultDescription,
  path = "/",
  image,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  noIndex?: boolean;
}): Metadata {
  const imageUrl = image || `${getSiteUrl()}/og-default.png`;

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: path,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName,
      type: "website",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: getSiteUrl(),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: getSiteUrl(),
  };
}

export function breadcrumbJsonLd(
  items: {
    name: string;
    path: string;
  }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function sportsEventJsonLd({
  name,
  startDate,
  locationName,
  locationCity,
  homeTeam,
  awayTeam,
  path,
}: {
  name: string;
  startDate: string | null;
  locationName?: string | null;
  locationCity?: string | null;
  homeTeam?: string | null;
  awayTeam?: string | null;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name,
    sport: "Football",
    startDate: startDate ?? undefined,
    url: absoluteUrl(path),
    location: locationName
      ? {
          "@type": "Place",
          name: locationName,
          address: locationCity ?? undefined,
        }
      : undefined,
    homeTeam: homeTeam
      ? {
          "@type": "SportsTeam",
          name: homeTeam,
        }
      : undefined,
    awayTeam: awayTeam
      ? {
          "@type": "SportsTeam",
          name: awayTeam,
        }
      : undefined,
  };
}

export function sportsTeamJsonLd({
  name,
  path,
  logo,
}: {
  name: string;
  path: string;
  logo?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name,
    sport: "Football",
    url: absoluteUrl(path),
    logo: logo ?? undefined,
  };
}
