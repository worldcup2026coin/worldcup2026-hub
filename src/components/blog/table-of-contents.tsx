import type { ArticleHeading } from "@/components/blog/article-body";

type TableOfContentsProps = {
  headings: ArticleHeading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        On this page
      </p>
      <div className="mt-4 grid gap-2">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`text-sm transition hover:text-emerald-300 ${
              heading.level === 3 ? "pl-3 text-slate-500" : "text-slate-300"
            }`}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
