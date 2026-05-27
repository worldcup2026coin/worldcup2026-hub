import "server-only";

export type NewsSource = {
  id: string;
  name: string;
  url: string;
  category:
    | "latest_news"
    | "team_news"
    | "match_previews"
    | "injury_updates"
    | "group_previews"
    | "host_city_news"
    | "fan_culture"
    | "guides";
  enabled: boolean;
  trustLevel: "high" | "medium" | "low";
  tags: string[];
};

/*
 * Keep this list small and editorially reviewed.
 * To add a source, prefer established football/news outlets with RSS feeds,
 * avoid feeds that republish full article bodies, and test with dryRun=1 first.
 */
export const newsSources: NewsSource[] = [
  {
    id: "bbc-football",
    name: "BBC Sport Football",
    url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
    category: "latest_news",
    enabled: true,
    trustLevel: "high",
    tags: ["football", "world cup"],
  },
  {
    id: "espn-soccer",
    name: "ESPN Soccer",
    url: "https://www.espn.com/espn/rss/soccer/news",
    category: "latest_news",
    enabled: true,
    trustLevel: "medium",
    tags: ["football", "soccer"],
  },
  {
    id: "ap-soccer",
    name: "AP Soccer",
    url: "https://apnews.com/hub/soccer?output=rss",
    category: "latest_news",
    enabled: false,
    trustLevel: "high",
    tags: ["football", "soccer"],
  },
];
