import { PlaceholderCard } from "@/components/cards/placeholder-card";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import type { RouteContent } from "@/lib/placeholder-data";

type RouteShellProps = {
  content: RouteContent;
};

export function RouteShell({ content }: RouteShellProps) {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-slate-950/50 sm:p-10">
          <Badge>{content.eyebrow}</Badge>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
                {content.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {content.description}
              </p>
            </div>

            <aside className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm leading-6 text-emerald-100">
              {content.heroNote}
            </aside>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {content.cards.map((card) => (
            <PlaceholderCard key={card.title} {...card} />
          ))}
        </section>
      </Container>
    </div>
  );
}
