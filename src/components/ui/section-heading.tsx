
type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-4xl">
      <p className="neon-kicker">{eyebrow}</p>
      <h2 className="neon-title glow-text mt-4 text-3xl font-black leading-[0.95] text-white sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          {description}
        </p>
      ) : null}
    </div>
  );
}
