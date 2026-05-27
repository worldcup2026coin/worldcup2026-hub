import Link from "next/link";
import type { BlogPost } from "@/lib/data/blog";
import { tagsToArray } from "@/lib/data/blog";
import { formatDateOnly } from "@/lib/worldcup/format";
import { ArticleBody, getArticleHeadings } from "@/components/blog/article-body";
import { CategoryBadge } from "@/components/blog/category-badge";
import { TableOfContents } from "@/components/blog/table-of-contents";

type ArticleLayoutProps = {
  post: BlogPost;
};

export function ArticleLayout({ post }: ArticleLayoutProps) {
  const tags = tagsToArray(post.tags);
  const headings = getArticleHeadings(post.body);
  const isSourced = post.content_origin === "rss" && post.source_name;

  return (
    <article>
      <header className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-slate-950/40 sm:p-10">
        <CategoryBadge category={post.category} />

        <h1 className="mt-5 max-w-5xl text-4xl font-black tracking-tight text-white sm:text-6xl">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Published {formatDateOnly(post.published_at ?? post.created_at)}
        </p>

        {isSourced ? (
          <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
            <p className="text-sm font-bold leading-6 text-cyan-100">
              Sourced update from {post.source_name}. This page contains a short
              attributed summary and links to the original publisher.
            </p>
            {post.external_url ? (
              <Link
                href={post.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-black uppercase tracking-[0.16em] text-emerald-300"
              >
                Read original source
              </Link>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_18rem]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <ArticleBody body={post.body} />
        </div>

        <aside className="grid content-start gap-5">
          <TableOfContents headings={headings} />

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Explore
            </p>
            <div className="mt-4 grid gap-2">
              <Link href="/fixtures" className="text-sm text-slate-300 hover:text-emerald-300">
                Fixtures
              </Link>
              <Link href="/teams" className="text-sm text-slate-300 hover:text-emerald-300">
                Teams
              </Link>
              <Link href="/groups" className="text-sm text-slate-300 hover:text-emerald-300">
                Groups
              </Link>
              <Link href="/stadiums" className="text-sm text-slate-300 hover:text-emerald-300">
                Stadiums
              </Link>
              <Link href="/predictions" className="text-sm text-slate-300 hover:text-emerald-300">
                Predictions
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
