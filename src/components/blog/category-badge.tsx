import Link from "next/link";
import {
  getBlogCategoryLabel,
  getBlogCategorySlug,
  type BlogCategory,
} from "@/lib/data/blog";

type CategoryBadgeProps = {
  category: BlogCategory;
  linked?: boolean;
};

export function CategoryBadge({ category, linked = true }: CategoryBadgeProps) {
  const label = getBlogCategoryLabel(category);
  const className =
    "inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-200";

  if (!linked) {
    return <span className={className}>{label}</span>;
  }

  return (
    <Link href={`/news/category/${getBlogCategorySlug(category)}`} className={className}>
      {label}
    </Link>
  );
}
