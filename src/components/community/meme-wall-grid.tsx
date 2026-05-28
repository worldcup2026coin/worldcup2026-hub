import type { CommunityMeme } from "@/lib/community/types";
import { MemeCard } from "@/components/community/meme-card";

export function MemeWallGrid({
  memes,
  signedIn,
}: {
  memes: CommunityMeme[];
  signedIn: boolean;
}) {
  if (memes.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.035] p-8 text-center">
        <h2 className="text-2xl font-black uppercase text-white">
          Approved community memes will appear here
        </h2>
        <p className="mt-2 text-sm font-semibold text-slate-300">
          Submit fan-made memes for review.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {memes.map((meme) => (
        <MemeCard key={meme.id} meme={meme} signedIn={signedIn} />
      ))}
    </div>
  );
}
