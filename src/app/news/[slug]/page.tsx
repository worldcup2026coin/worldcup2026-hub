import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/blog/article-layout";
import { RelatedPosts } from "@/components/blog/related-posts";
import { Container } from "@/components/ui/container";
import {
  getBlogPostBySlug,
  getBlogPostUrl,
  getBlogSeoDescription,
  getBlogSeoTitle,
  getRelatedBlogPosts,
} from "@/lib/data/blog";
import { getPublicSiteUrl } from "@/lib/data/matches";

export const dynamic = "force-dynamic";

type NewsPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const siteUrl = getPublicSiteUrl();

  if (!post) {
    return {
      title: "Post not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = getBlogSeoTitle(post);
  const description = getBlogSeoDescription(post);
  const image = post.featured_image_url ?? undefined;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: `/news/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/news/${post.slug}`,
      siteName: "World Cup 2026 Hub",
      type: "article",
      images: image ? [{ url: image }] : undefined,
      publishedTime: post.published_at ?? post.created_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(post, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: getBlogSeoDescription(post),
    image: post.featured_image_url ? [post.featured_image_url] : undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    mainEntityOfPage: getBlogPostUrl(post),
    publisher: {
      "@type": "Organization",
      name: "World Cup 2026 Hub",
      url: getPublicSiteUrl(),
    },
  };

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <ArticleLayout post={post} />
        <RelatedPosts posts={relatedPosts} />
      </Container>
    </div>
  );
}