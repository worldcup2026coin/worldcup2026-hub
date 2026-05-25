
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
        <section className="hero-panel rounded-[2.25rem] p-6 sm:p-10">
          <Badge>{content.eyebrow}</Badge>

          <div className="relative z-10 mt-6 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <h1 className="neon-title glow-text max-w-4xl text-4xl font-black leading-[0.9] text-white sm:text-6xl">
                {content.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {content.description}
              </p>
            </div>

            <aside className="rounded-3xl border border-lime-300/20 bg-lime-300/10 p-5 text-sm leading-6 text-lime-100">
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
