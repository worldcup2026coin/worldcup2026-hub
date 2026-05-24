import { Container } from "@/components/ui/container";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
}: PageHeaderProps) {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-slate-950/50 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-5xl text-4xl font-black tracking-tight text-white sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            {description}
          </p>
          {meta ? (
            <p className="mt-6 inline-flex rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              {meta}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
