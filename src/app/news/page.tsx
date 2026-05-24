import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogHero } from "@/components/blog/blog-hero";
import { CategoryBadge } from "@/components/blog/category-badge";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import {
  blogCategories,
  getBlogCategorySlug,
  getFeaturedBlogPosts,
  getPublishedBlogPosts,
} from "@/lib/data/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "World Cup 2026 News, Guides & Fan Culture",
  description:
    "Read World Cup 2026 match previews, team guides, group previews, stadium guides, fan culture posts and community roundups.",
  openGraph: {
    title: "World Cup 2026 News, Guides & Fan Culture",
    description:
      "Football-first World Cup 2026 content including previews, team guides, stadium guides and fan culture.",
    type: "website",
  },
};

export default async function NewsPage() {
  const [featuredPosts, latestPosts] = await Promise.all([
    getFeaturedBlogPosts(3),
    getPublishedBlogPosts(12),
  ]);

  const heroPost = featuredPosts[0] ?? latestPosts[0] ?? null;
  const heroId = heroPost?.id;
  const remainingPosts = latestPosts.filter((post) => post.id !== heroId);

  return (
    <>
      <PageHeader
        eyebrow="News"
        title="World Cup 2026 news, guides and fan culture"
        description="Football-first articles, explainers and social-shareable guides powered by Supabase."
        meta="Match previews · Team guides · Fan culture"
      />

      <Container className="pb-14">
        <BlogHero post={heroPost} />

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                Categories
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Browse content by topic
              </h2>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {blogCategories.map((category) => (
              <CategoryBadge key={category} category={category} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                Latest posts
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Fresh from the hub
              </h2>
            </div>
            <Link
              href={`/news/category/${getBlogCategorySlug("match_previews")}`}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Match previews
            </Link>
          </div>

          {remainingPosts.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-center">
              <h3 className="text-lg font-black text-white">No more posts yet</h3>
              <p className="mt-2 text-sm text-slate-300">
                Publish more rows in Supabase and they will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {remainingPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </>
  );
}
