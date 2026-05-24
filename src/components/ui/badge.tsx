type BadgeProps = {
  children: React.ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
      {children}
    </span>
  );
}
