export const siteConfig = {
  name: "World Cup 2026 Hub",
  shortName: "$WC26 Hub",
  description:
    "An API-first World Cup 2026 fan hub for fixtures, live scores, groups, teams, predictions, news, stadiums, and community.",
  navLinks: [
    { href: "/", label: "Home" },
    { href: "/fixtures", label: "Fixtures" },
    { href: "/live", label: "Live" },
    { href: "/groups", label: "Groups" },
    { href: "/best-third-placed-teams", label: "3rd Place" },
    { href: "/teams", label: "Teams" },
    { href: "/top-scorers", label: "Scorers" },
    { href: "/top-assists", label: "Assists" },
    { href: "/top-cards", label: "Cards" },
    { href: "/predictions", label: "Predictions" },
    { href: "/news", label: "News" },
    { href: "/stadiums", label: "Stadiums" },
    { href: "/community", label: "Community" },
  ],
  wc26Links: [
    { href: "/wc26", label: "$WC26" },
    { href: "/launch", label: "Launch" },
    { href: "/how-to-buy", label: "How to Buy" },
    { href: "/community", label: "Join Community" },
  ],
} as const;

