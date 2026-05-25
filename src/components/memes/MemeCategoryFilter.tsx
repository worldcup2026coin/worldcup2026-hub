import Link from "next/link";
import { MEME_CATEGORIES } from "@/lib/memes/constants";

type Props = {
  activeCategory?: string;
};

export function MemeCategoryFilter({ activeCategory }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Link
        href="/memes"
        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
          !activeCategory
            ? "border-white bg-white text-black"
            : "border-white/15 text-white/75 hover:bg-white/10"
        }`}
      >
        All memes
      </Link>

      {MEME_CATEGORIES.map((category) => (
        <Link
          key={category.value}
          href={`/memes?category=${category.value}`}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
            activeCategory === category.value
              ? "border-white bg-white text-black"
              : "border-white/15 text-white/75 hover:bg-white/10"
          }`}
        >
          {category.label}
        </Link>
      ))}
    </div>
  );
}
