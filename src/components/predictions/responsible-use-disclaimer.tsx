import { responsibleUseText } from "@/lib/data/predictions";

export function ResponsibleUseDisclaimer() {
  return (
    <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-50/90">
      <p className="font-black uppercase tracking-[0.18em] text-amber-200">
        Responsible use
      </p>
      <p className="mt-3">{responsibleUseText}</p>
    </div>
  );
}
