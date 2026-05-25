export const MEME_CATEGORIES = [
  { value: "match_memes", label: "Match memes" },
  { value: "team_memes", label: "Team memes" },
  { value: "fan_reactions", label: "Fan reactions" },
  { value: "underdog_chaos", label: "Underdog chaos" },
  { value: "ref_var_chaos", label: "Ref/VAR chaos" },
  { value: "daily_best_memes", label: "Daily best memes" },
  { value: "group_stage_chaos", label: "Group stage chaos" },
  { value: "knockout_drama", label: "Knockout drama" },
  { value: "host_city_vibes", label: "Host city vibes" },
  { value: "crypto_football_culture", label: "Crypto football culture" },
] as const;

export type MemeCategory = (typeof MEME_CATEGORIES)[number]["value"];

export const MEME_CATEGORY_LABELS: Record<MemeCategory, string> =
  MEME_CATEGORIES.reduce(
    (acc, category) => {
      acc[category.value] = category.label;
      return acc;
    },
    {} as Record<MemeCategory, string>
  );

export const DEFAULT_MEME_SHARE_TEXT =
  "Football. Chaos. Memes. World Cup 2026.";

export const MEME_WALL_EMPTY_STATE =
  "Meme wall warming up before kick-off. Tag us on X to get featured.";
