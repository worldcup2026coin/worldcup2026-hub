
import { Container } from "@/components/ui/container";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  titleClassName?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  titleClassName = "",
}: PageHeaderProps) {
  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="hero-panel rounded-[2.25rem] p-6 sm:p-10">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="neon-kicker">{eyebrow}</p>
              <h1
                className={`neon-title glow-text mt-5 max-w-5xl whitespace-normal break-normal text-3xl font-black leading-[0.95] text-white [overflow-wrap:normal] [text-wrap:balance] [word-break:normal] min-[420px]:text-4xl sm:text-6xl sm:leading-[0.9] lg:text-7xl ${titleClassName}`}
              >
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {description}
              </p>
            </div>

            <div className="grid gap-3 sm:min-w-72">
              <div className="rounded-3xl border border-lime-300/20 bg-lime-300/10 p-4 shadow-[0_0_24px_rgba(163,255,18,0.10)]">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-lime-200">
                  Live signal
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                  {meta ?? "World Cup data hub · fan energy online"}
                </p>
              </div>
              <div className="h-1 rounded-full bg-gradient-to-r from-lime-300 via-cyan-300 to-fuchsia-400 shadow-[0_0_22px_rgba(163,255,18,0.35)]" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
