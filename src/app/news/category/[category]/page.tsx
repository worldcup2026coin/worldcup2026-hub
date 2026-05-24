import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/blog-card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import {
  getBlogCategoryFromSlug,
  getBlogCategoryLabel,
  getBlogPostsByCategory,
} from "@/lib/data/blog";

export const dynamic = "force-dynamic";

type NewsCategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({
  params,
}: NewsCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getBlogCategoryFromSlug(categorySlug);

  if (!category) {
    return {
      title: "Category not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const label = getBlogCategoryLabel(category);

  return {
    title: `${label} | World Cup 2026 Hub`,
    description: `Read ${label.toLowerCase()} for World Cup 2026, including football-first guides, previews and fan-friendly articles.`,
  };
}

export default async function NewsCategoryPage({
  params,
}: NewsCategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getBlogCategoryFromSlug(categorySlug);

  if (!category) {
    notFound();
  }

  const label = getBlogCategoryLabel(category);
  const posts = await getBlogPostsByCategory(category);

  return (
    <>
      <PageHeader
        eyebrow="News category"
        title={label}
        description={`Browse ${label.toLowerCase()} published through the Supabase content system.`}
        meta={`${posts.length} published post${posts.length === 1 ? "" : "s"}`}
      />

      <Container className="pb-14">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
            <h2 className="text-xl font-black text-white">
              No posts in this category yet
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Publish a post in Supabase with this category and it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}