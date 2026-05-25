
import { responsibleUseText } from "@/lib/data/predictions";

export function ResponsibleUseDisclaimer() {
  return (
    <div className="rounded-3xl border border-amber-300/25 bg-amber-300/10 p-5 text-sm leading-6 text-amber-50/90 shadow-[0_0_24px_rgba(255,209,102,0.08)]">
      <p className="font-black uppercase tracking-[0.18em] text-amber-200">
        Responsible use
      </p>
      <p className="mt-3">{responsibleUseText}</p>
    </div>
  );
}
