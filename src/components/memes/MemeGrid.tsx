import type { Meme } from "@/lib/memes/types";
import { MEME_WALL_EMPTY_STATE } from "@/lib/memes/constants";
import { MemeCard } from "./MemeCard";

type Props = {
  memes: Meme[];
};

export function MemeGrid({ memes }: Props) {
  if (!memes.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
        <p className="text-lg font-bold text-white">{MEME_WALL_EMPTY_STATE}</p>
        <p className="mt-2 text-sm text-white/60">
          Tag us on X, join the Telegram chaos room, or submit your World Cup meme.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {memes.map((meme) => (
        <MemeCard key={meme.id} meme={meme} />
      ))}
    </div>
  );
}
