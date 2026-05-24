import Link from "next/link";
import { slugify } from "@/lib/worldcup/format";

type ArticleBodyProps = {
  body: string;
};

export type ArticleHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function getArticleHeadings(body: string): ArticleHeading[] {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const level = line.startsWith("### ") ? 3 : 2;
      const text = line.replace(/^#{2,3}\s+/, "");

      return {
        id: slugify(text),
        text,
        level,
      };
    });
}

function InlineText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const [full, label, href] = match;

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const safeHref =
      href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://")
        ? href
        : "#";

    parts.push(
      <Link
        key={`${label}-${match.index}`}
        href={safeHref}
        className="font-bold text-emerald-300 underline decoration-emerald-300/30 underline-offset-4"
      >
        {label}
      </Link>
    );

    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

export function ArticleBody({ body }: ArticleBodyProps) {
  const lines = body.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (listItems.length > 0) {
      const items = listItems;
      listItems = [];

      blocks.push(
        <ul key={`list-${blocks.length}`} className="my-6 grid gap-3">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-300"
            >
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      );
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      const text = line.replace(/^###\s+/, "");
      blocks.push(
        <h3
          key={`h3-${blocks.length}`}
          id={slugify(text)}
          className="mt-8 scroll-mt-24 text-2xl font-black text-white"
        >
          {text}
        </h3>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      const text = line.replace(/^##\s+/, "");
      blocks.push(
        <h2
          key={`h2-${blocks.length}`}
          id={slugify(text)}
          className="mt-10 scroll-mt-24 text-3xl font-black text-white"
        >
          {text}
        </h2>
      );
      continue;
    }

    if (line.startsWith("- ")) {
      listItems.push(line.replace(/^-+\s*/, ""));
      continue;
    }

    flushList();

    blocks.push(
      <p key={`p-${blocks.length}`} className="my-5 text-base leading-8 text-slate-300">
        <InlineText text={line} />
      </p>
    );
  }

  flushList();

  return <div>{blocks}</div>;
}
