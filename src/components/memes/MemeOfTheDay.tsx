import type { Meme } from "@/lib/memes/types";
import { MemeCard } from "./MemeCard";

type Props = {
  meme: Meme | null;
};

export function MemeOfTheDay({ meme }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-300">
          Featured
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
          Meme of the Day
        </h2>
      </div>

      {meme ? (
        <div className="max-w-xl">
          <MemeCard meme={meme} />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-6">
          <p className="font-bold text-white">
            Meme of the Day has not been picked yet.
          </p>
          <p className="mt-2 text-sm text-white/60">
            The wall is warming up. Tag us on X to get featured.
          </p>
        </div>
      )}
    </section>
  );
}
