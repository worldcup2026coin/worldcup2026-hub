import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/data/blog";
import { tagsToArray } from "@/lib/data/blog";
import { formatDateOnly } from "@/lib/worldcup/format";
import { CategoryBadge } from "@/components/blog/category-badge";

type BlogCardProps = {
  post: BlogPost;
  featured?: boolean;
};

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const tags = tagsToArray(post.tags).slice(0, 3);

  return (
    <article
      className={`overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] shadow-2xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-emerald-400/30 ${
        featured ? "lg:grid lg:grid-cols-[1fr_1.2fr]" : ""
      }`}
    >
      {post.featured_image_url ? (
        <Link href={`/news/${post.slug}`} className="block min-h-56 bg-slate-900">
          <Image
            src={post.featured_image_url}
            alt=""
            width={800}
            height={450}
            className="h-full min-h-56 w-full object-cover"
          />
        </Link>
      ) : (
        <Link
          href={`/news/${post.slug}`}
          className="flex min-h-56 items-center justify-center bg-gradient-to-br from-emerald-400/20 via-sky-400/10 to-slate-950 text-5xl"
        >
          ⚽
        </Link>
      )}

      <div className="p-5">
        <CategoryBadge category={post.category} />

        <Link href={`/news/${post.slug}`}>
          <h2
            className={`mt-4 font-black tracking-tight text-white ${
              featured ? "text-3xl sm:text-4xl" : "text-xl"
            }`}
          >
            {post.title}
          </h2>
        </Link>

        {post.excerpt ? (
          <p className="mt-3 text-sm leading-6 text-slate-300">{post.excerpt}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-xs text-slate-400">
          <span>{formatDateOnly(post.published_at ?? post.created_at)}</span>
          <Link
            href={`/news/${post.slug}`}
            className="font-black uppercase tracking-[0.16em] text-emerald-300"
          >
            Read
          </Link>
        </div>
      </div>
    </article>
  );
}
