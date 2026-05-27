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
    meta: "API-powered data",
    tone: "emerald",
  },
  {
    eyebrow: "Live",
    title: "Live score centre",
    description:
      "Real-time score cards, match status, and major events will appear when available.",
    meta: "Live data pending",
    tone: "sky",
  },
  {
    eyebrow: "Groups",
    title: "Group standings",
    description:
      "Group tables, points, goal difference, and qualification status will update when available.",
    meta: "Live section",
    tone: "violet",
  },
];

export const homepagePlaceholders: Record<
  "nextMatches" | "liveScores" | "groupStandings" | "fanPolls" | "fanCommunity",
  PlaceholderCardData[]
> = {
  nextMatches: [
    {
      eyebrow: "Matchday",
      title: "Opening fixture",
      description:
        "Kickoff time, venue, teams, and live status will appear here once the fixtures endpoint is connected.",
      meta: "Updates when available",
      tone: "emerald",
    },
    {
      eyebrow: "Matchday",
      title: "Featured match",
      description:
        "This card will highlight the biggest upcoming game with team form and fan context.",
      meta: "Updates when available",
      tone: "sky",
    },
    {
      eyebrow: "Matchday",
      title: "Today at a glance",
      description:
        "A compact summary of today's World Cup schedule will live here.",
      meta: "Updates when available",
      tone: "amber",
    },
  ],
  liveScores: [
    {
      eyebrow: "Live",
      title: "No live matches yet",
      description:
        "When the tournament starts, this area will show live scorelines, match clocks, and key events.",
      meta: "API-Football data",
      tone: "rose",
    },
    {
      eyebrow: "Timeline",
      title: "Goals, cards, VAR",
      description:
        "Live timelines will show goals, substitutions, cards, and major match moments.",
      meta: "Live module",
      tone: "sky",
    },
  ],
  groupStandings: [
    {
      eyebrow: "Group A",
      title: "Standings preview",
      description:
        "Team rankings, played, won, drawn, lost, goals, goal difference, and points will be shown here.",
      meta: "Standings data",
      tone: "violet",
    },
    {
      eyebrow: "Qualification",
      title: "Knockout path",
      description:
        "A simple qualification tracker can show who is through, at risk, or eliminated.",
      meta: "Tournament rules",
      tone: "emerald",
    },
  ],
  fanPolls: [
    {
      eyebrow: "Poll",
      title: "Who wins the tournament?",
      description:
        "Fan polls will appear when available through Supabase or another lightweight voting store.",
      meta: "Poll data",
      tone: "amber",
    },
    {
      eyebrow: "Poll",
      title: "Biggest dark horse?",
      description:
        "Community voting can help drive repeat visits and social sharing.",
      meta: "Community updates",
      tone: "violet",
    },
  ],
  fanCommunity: [
    {
      eyebrow: "Community",
      title: "Telegram and X hub",
      description:
        "This block will point fans toward Telegram, X, and shareable matchday content.",
      meta: "Links later",
      tone: "sky",
    },
    {
      eyebrow: "Fan culture",
      title: "World Cup fan hub",
      description:
        "A teaser area for fan reactions, viral football moments, and community-led campaigns.",
      meta: "Football-first community",
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
      "Fixture data, venue context and match status will update as tournament information becomes available.",
    cards: [
      {
        eyebrow: "Calendar",
        title: "Full match schedule",
        description:
          "This section will list every match by date, group, team, venue, and kickoff time.",
        meta: "Fixture data",
        tone: "emerald",
      },
      {
        eyebrow: "Filters",
        title: "Browse by team or group",
        description:
          "Fans will be able to filter fixtures by country, group, round, venue, and date.",
        meta: "Browse fixtures",
        tone: "sky",
      },
      {
        eyebrow: "Match cards",
        title: "Preview-ready cards",
        description:
          "Each fixture can later expand into match previews, odds context, prediction notes, and fan content.",
        meta: "Match detail pages",
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
      "Live scores, match clocks and events will appear when live tournament data is available.",
    cards: [
      {
        eyebrow: "Scoreboard",
        title: "Live match cards",
        description:
          "Live cards will show scoreline, match minute, status, half-time score, and full-time result.",
        meta: "Live data",
        tone: "rose",
      },
      {
        eyebrow: "Events",
        title: "Goals and major moments",
        description:
          "This will later show goals, cards, substitutions, penalties, and VAR moments.",
        meta: "Event data",
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
      "Group standings and qualification context will update as tournament data becomes available.",
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
        meta: "Tournament rules",
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
      "Team pages bring together squad, fixture and tournament context as data becomes available.",
    cards: [
      {
        eyebrow: "Directory",
        title: "All teams",
        description:
          "A searchable country directory will later show badges, groups, fixtures, and squad links.",
        meta: "Team data",
        tone: "emerald",
      },
      {
        eyebrow: "Squads",
        title: "Player lists",
        description:
          "Squads, star players, managers, and team profiles will appear when squad data is available.",
        meta: "Squad data",
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
      "A future home for football reads, confidence levels, and match context.",
    heroNote:
      "Prediction-style previews and match context will appear when published.",
    cards: [
      {
        eyebrow: "Preview",
        title: "Match prediction cards",
        description:
          "Published views can include predicted result, goal angles, confidence, and reasoning snippets.",
        meta: "Prediction context",
        tone: "amber",
      },
      {
        eyebrow: "Markets",
        title: "Football read sections",
        description:
          "This area can eventually support match winner, goals, team goals, and value notes.",
        meta: "Responsible-use view",
        tone: "rose",
      },
      {
        eyebrow: "Confidence",
        title: "Clear confidence labels",
        description:
          "Each prediction should clearly separate strong reads from watchlist-only opinions.",
        meta: "Tournament rules",
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
      "Tournament updates, previews and football stories will appear here when published.",
    cards: [
      {
        eyebrow: "Latest",
        title: "Tournament headlines",
        description:
          "Latest World Cup updates, team news, and matchday stories can be displayed here.",
        meta: "Published updates",
        tone: "sky",
      },
      {
        eyebrow: "Editorial",
        title: "Preview articles",
        description:
          "Short previews can support SEO and give fans reasons to visit before kickoff.",
        meta: "Editorial updates",
        tone: "violet",
      },
      {
        eyebrow: "Social",
        title: "Viral moments",
        description:
          "This can blend football news with fan reactions, social discussion, and community moments.",
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
      "Venue guides and match allocations will update as tournament information becomes available.",
    cards: [
      {
        eyebrow: "Venues",
        title: "Stadium directory",
        description:
          "Each stadium card can show city, capacity, country, fixtures, and local context.",
        meta: "Venue data",
        tone: "emerald",
      },
      {
        eyebrow: "Travel",
        title: "Host city notes",
        description:
          "Travel tips, time zones, and local fan information can be layered in later.",
        meta: "Host city guide",
        tone: "amber",
      },
      {
        eyebrow: "Matches",
        title: "Games by venue",
        description:
          "Fans will be able to see which matches are played in each stadium.",
        meta: "Fixture links",
        tone: "sky",
      },
    ],
  },
  community: {
    eyebrow: "Community",
    title: "Fan community",
    description:
      "A social-first area for polls, Telegram and X calls-to-action, email signup, and fan discussion.",
    heroNote:
      "Community features bring together polls, email updates, social sharing and fan culture.",
    cards: [
      {
        eyebrow: "Telegram",
        title: "Join the matchday chat",
        description:
          "Telegram can become the fast-moving community hub during the tournament.",
        meta: "Community link",
        tone: "sky",
      },
      {
        eyebrow: "X",
        title: "Follow and share",
        description:
          "X can drive viral posts, match reactions, predictions, and fan-led growth.",
        meta: "Social updates",
        tone: "slate",
      },
      {
        eyebrow: "Fan culture",
        title: "Football culture layer",
        description:
          "A dedicated teaser for fan reactions, matchday debates, and community campaigns.",
        meta: "Community updates",
        tone: "rose",
      },
    ],
  },
};


