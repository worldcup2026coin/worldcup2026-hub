import type { BlogPost } from "@/lib/data/blog";
import { BlogCard } from "@/components/blog/blog-card";
import { PredictionEmptyState } from "@/components/predictions/prediction-empty-state";

type BlogHeroProps = {
  post: BlogPost | null;
};

export function BlogHero({ post }: BlogHeroProps) {
  if (!post) {
    return (
      <PredictionEmptyState
        title="No published posts yet"
        description="Publish blog posts in Supabase and they will appear here automatically."
      />
    );
  }

  return <BlogCard post={post} featured />;
}
