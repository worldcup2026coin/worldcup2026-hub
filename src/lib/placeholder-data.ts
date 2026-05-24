export type CardTone =
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose"
  | "slate";

export type PlaceholderCardData = {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  tone?: CardTone;
};

export type RouteContent = {
  eyebrow: string;
  title: string;
  description: string;
  heroNote: string;
  cards: PlaceholderCardData[];
};

export const homeHighlights: PlaceholderCardData[] = [
  {
    eyebrow: "Fixtures",
    title: "Next matches",
    description:
      "A clean match calendar will sit here once API-Football is connected.",
    meta: "API data later",
    tone: "emerald",
  },
  {
    eyebrow: "Live",
    title: "Live score centre",
    description:
      "Real-time score cards, match status, and major events will be added in a later phase.",
    meta: "No live calls yet",
    tone: "sky",
  },
  {
    eyebrow: "Groups",
    title: "Group standings",
    description:
      "Group tables, points, goal difference, and qualification status will be wired later.",
    meta: "Placeholder only",
    tone: "violet",
  },
];

export const homepagePlaceholders: Record<
  "nextMatches" | "liveScores" | "groupStandings" | "fanPolls" | "memeCommunity",
  PlaceholderCardData[]
> = {
  nextMatches: [
    {
      eyebrow: "Matchday",
      title: "Opening fixture",
      description:
        "Kickoff time, venue, teams, and live status will appear here once the fixtures endpoint is connected.",
      meta: "Coming in data phase",
      tone: "emerald",
    },
    {
      eyebrow: "Matchday",
      title: "Featured match",
      description:
        "This card will highlight the biggest upcoming game with team form and fan context.",
      meta: "Coming in data phase",
      tone: "sky",
    },
    {
      eyebrow: "Matchday",
      title: "Today at a glance",
      description:
        "A compact summary of today's World Cup schedule will live here.",
      meta: "Coming in data phase",
      tone: "amber",
    },
  ],
  liveScores: [
    {
      eyebrow: "Live",
      title: "No live matches yet",
      description:
        "When the tournament starts, this area will show live scorelines, match clocks, and key events.",
      meta: "API-Football later",
      tone: "rose",
    },
    {
      eyebrow: "Timeline",
      title: "Goals, cards, VAR",
      description:
        "Future live timelines will show goals, substitutions, cards, and major match moments.",
      meta: "Future module",
      tone: "sky",
    },
  ],
  groupStandings: [
    {
      eyebrow: "Group A",
      title: "Standings preview",
      description:
        "Team rankings, played, won, drawn, lost, goals, goal difference, and points will be shown here.",
      meta: "Tables later",
      tone: "violet",
    },
    {
      eyebrow: "Qualification",
      title: "Knockout path",
      description:
        "A simple qualification tracker can later show who is through, at risk, or eliminated.",
      meta: "Rules later",
      tone: "emerald",
    },
  ],
  fanPolls: [
    {
      eyebrow: "Poll",
      title: "Who wins the tournament?",
      description:
        "Fan polls will be connected later through Supabase or another lightweight voting store.",
      meta: "Supabase later",
      tone: "amber",
    },
    {
      eyebrow: "Poll",
      title: "Biggest dark horse?",
      description:
        "Community voting can help drive repeat visits and social sharing.",
      meta: "Community phase",
      tone: "violet",
    },
  ],
  memeCommunity: [
    {
      eyebrow: "Community",
      title: "Telegram and X hub",
      description:
        "This block will point fans toward Telegram, X, and shareable matchday content.",
      meta: "Links later",
      tone: "sky",
    },
    {
      eyebrow: "Meme culture",
      title: "World Cup meme board",
      description:
        "A teaser area for football memes, viral moments, and future community-led campaigns.",
      meta: "No token logic here",
      tone: "rose",
    },
  ],
};

export const routeContent: Record<string, RouteContent> = {
  fixtures: {
    eyebrow: "Fixtures",
    title: "World Cup 2026 fixtures",
    description:
      "The future home for every World Cup 2026 fixture, kickoff time, venue, team, and match status.",
    heroNote:
      "Phase 1 keeps this as a static shell. API-Football fixture data comes later.",
    cards: [
      {
        eyebrow: "Calendar",
        title: "Full match schedule",
        description:
          "This section will list every match by date, group, team, venue, and kickoff time.",
        meta: "Fixture endpoint later",
        tone: "emerald",
      },
      {
        eyebrow: "Filters",
        title: "Browse by team or group",
        description:
          "Fans will be able to filter fixtures by country, group, round, venue, and date.",
        meta: "UI first",
        tone: "sky",
      },
      {
        eyebrow: "Match cards",
        title: "Preview-ready cards",
        description:
          "Each fixture can later expand into match previews, odds context, prediction notes, and fan content.",
        meta: "Future detail pages",
        tone: "violet",
      },
    ],
  },
  live: {
    eyebrow: "Live",
    title: "Live scores centre",
    description:
      "A matchday-first page for live scores, match clocks, events, and quick status updates.",
    heroNote:
      "No live API calls yet. This page is prepared for the future live module.",
    cards: [
      {
        eyebrow: "Scoreboard",
        title: "Live match cards",
        description:
          "Future cards will show scoreline, match minute, status, half-time score, and full-time result.",
        meta: "Live endpoint later",
        tone: "rose",
      },
      {
        eyebrow: "Events",
        title: "Goals and major moments",
        description:
          "This will later show goals, cards, substitutions, penalties, and VAR moments.",
        meta: "Events later",
        tone: "amber",
      },
      {
        eyebrow: "Matchday",
        title: "Currently playing",
        description:
          "When matches are active, this page should become one of the highest-traffic areas of the app.",
        meta: "Tournament mode",
        tone: "sky",
      },
    ],
  },
  groups: {
    eyebrow: "Groups",
    title: "Groups and standings",
    description:
      "The future standings hub for group tables, points, goal difference, and qualification status.",
    heroNote:
      "Static placeholders only. Standings calculations and API data come later.",
    cards: [
      {
        eyebrow: "Tables",
        title: "Group standings",
        description:
          "Each group will show played, wins, draws, losses, goals for, goals against, goal difference, and points.",
        meta: "Standings later",
        tone: "violet",
      },
      {
        eyebrow: "Progress",
        title: "Qualification tracker",
        description:
          "Fans will be able to see who has qualified, who is at risk, and who is eliminated.",
        meta: "Rules later",
        tone: "emerald",
      },
      {
        eyebrow: "Context",
        title: "Group storylines",
        description:
          "Short notes can highlight surprise teams, must-win matches, and qualification scenarios.",
        meta: "Editorial layer",
        tone: "amber",
      },
    ],
  },
  teams: {
    eyebrow: "Teams",
    title: "Team hub",
    description:
      "A directory for every qualified country, with future squad, form, fixture, and prediction pages.",
    heroNote:
      "Team pages are not connected yet. This is the routing and layout foundation.",
    cards: [
      {
        eyebrow: "Directory",
        title: "All teams",
        description:
          "A searchable country directory will later show badges, groups, fixtures, and squad links.",
        meta: "Teams endpoint later",
        tone: "emerald",
      },
      {
        eyebrow: "Squads",
        title: "Player lists",
        description:
          "Squads, star players, managers, and team profiles can be added once the data model is ready.",
        meta: "Future phase",
        tone: "sky",
      },
      {
        eyebrow: "Form",
        title: "Team form snapshot",
        description:
          "Recent results, attacking trends, defensive record, and tournament readiness can sit here.",
        meta: "Analysis later",
        tone: "violet",
      },
    ],
  },
  predictions: {
    eyebrow: "Predictions",
    title: "Predictions and match insights",
    description:
      "A future home for prediction-style previews, betting-style notes, confidence levels, and match context.",
    heroNote:
      "No prediction engine yet. This page is only the shell and content structure.",
    cards: [
      {
        eyebrow: "Preview",
        title: "Match prediction cards",
        description:
          "Later phases can add predicted result, goal angles, confidence, and reasoning snippets.",
        meta: "Model later",
        tone: "amber",
      },
      {
        eyebrow: "Markets",
        title: "Betting-style sections",
        description:
          "This area can eventually support match winner, goals, team goals, and value notes.",
        meta: "Responsible UI later",
        tone: "rose",
      },
      {
        eyebrow: "Confidence",
        title: "Clear confidence labels",
        description:
          "Each prediction should clearly separate strong reads from watchlist-only opinions.",
        meta: "Rules later",
        tone: "emerald",
      },
    ],
  },
  news: {
    eyebrow: "News",
    title: "World Cup news feed",
    description:
      "A future content hub for tournament news, official updates, previews, injuries, and fan storylines.",
    heroNote:
      "No news feed is connected yet. This is a static editorial shell.",
    cards: [
      {
        eyebrow: "Latest",
        title: "Tournament headlines",
        description:
          "Latest World Cup updates, team news, and matchday stories can be displayed here.",
        meta: "CMS or feed later",
        tone: "sky",
      },
      {
        eyebrow: "Editorial",
        title: "Preview articles",
        description:
          "Short previews can support SEO and give fans reasons to visit before kickoff.",
        meta: "Content phase",
        tone: "violet",
      },
      {
        eyebrow: "Social",
        title: "Viral moments",
        description:
          "This can later blend football news with meme culture, reactions, and community moments.",
        meta: "Community layer",
        tone: "rose",
      },
    ],
  },
  stadiums: {
    eyebrow: "Stadiums",
    title: "Stadiums and host cities",
    description:
      "A future guide to World Cup 2026 stadiums, host cities, capacities, and match allocations.",
    heroNote:
      "Static shell only. Venue data and maps can be added later.",
    cards: [
      {
        eyebrow: "Venues",
        title: "Stadium directory",
        description:
          "Each stadium card can show city, capacity, country, fixtures, and local context.",
        meta: "Venue data later",
        tone: "emerald",
      },
      {
        eyebrow: "Travel",
        title: "Host city notes",
        description:
          "Travel tips, time zones, and local fan information can be layered in later.",
        meta: "Guide later",
        tone: "amber",
      },
      {
        eyebrow: "Matches",
        title: "Games by venue",
        description:
          "Fans will be able to see which matches are played in each stadium.",
        meta: "Fixture link later",
        tone: "sky",
      },
    ],
  },
  community: {
    eyebrow: "Community",
    title: "Fan community",
    description:
      "A social-first area for polls, Telegram and X calls-to-action, email signup, and meme culture.",
    heroNote:
      "No community integrations yet. This page prepares the structure.",
    cards: [
      {
        eyebrow: "Telegram",
        title: "Join the matchday chat",
        description:
          "Telegram can become the fast-moving community hub during the tournament.",
        meta: "Link later",
        tone: "sky",
      },
      {
        eyebrow: "X",
        title: "Follow and share",
        description:
          "X can drive viral posts, match reactions, predictions, and meme-led growth.",
        meta: "Handle later",
        tone: "slate",
      },
      {
        eyebrow: "Meme teaser",
        title: "Football culture layer",
        description:
          "A dedicated teaser for memes, fan jokes, and community campaigns without adding token mechanics yet.",
        meta: "Future community phase",
        tone: "rose",
      },
    ],
  },
};

