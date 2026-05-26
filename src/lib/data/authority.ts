export const formatFacts = [
  { value: "48", label: "Teams" },
  { value: "12", label: "Groups" },
  { value: "104", label: "Matches" },
  { value: "32", label: "Knockout teams" },
];

export const tournamentTimeline = [
  {
    label: "Opening match",
    date: "11 June 2026",
    title: "Mexico City starts the tournament",
    copy: "The first match opens the 48-team era at Estadio Azteca.",
  },
  {
    label: "Group stage",
    date: "11-27 June 2026",
    title: "Twelve groups decide the first cut",
    copy: "Top two in every group advance, while third-place teams enter a cross-group race.",
  },
  {
    label: "Round of 32",
    date: "28 June-3 July 2026",
    title: "The expanded knockout bracket begins",
    copy: "The 24 automatic qualifiers are joined by the eight best third-place teams.",
  },
  {
    label: "Final",
    date: "19 July 2026",
    title: "New York/New Jersey crowns the winner",
    copy: "MetLife Stadium hosts the final match of the biggest World Cup yet.",
  },
];

export const worldCupWinners = [
  ["Brazil", "5 titles"],
  ["Germany", "4 titles"],
  ["Italy", "4 titles"],
  ["Argentina", "3 titles"],
  ["France", "2 titles"],
  ["Uruguay", "2 titles"],
  ["England", "1 title"],
  ["Spain", "1 title"],
];

export const pastFinals = [
  ["2022", "Argentina 3-3 France", "Argentina won on penalties"],
  ["2018", "France 4-2 Croatia", "France's second World Cup"],
  ["2014", "Germany 1-0 Argentina", "Extra-time winner in Brazil"],
  ["2010", "Spain 1-0 Netherlands", "Spain's first World Cup"],
];

export const historicTopScorers = [
  ["Miroslav Klose", "16"],
  ["Ronaldo", "15"],
  ["Gerd Muller", "14"],
  ["Just Fontaine", "13"],
  ["Lionel Messi", "13"],
  ["Kylian Mbappe", "12"],
];

export const hostNations = [
  {
    slug: "usa",
    name: "USA",
    summary: "The largest host footprint, with 11 cities and the final in New York/New Jersey.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "mexico",
    name: "Mexico",
    summary: "The opening match host and a three-city tournament route built around iconic football culture.",
    image:
      "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "canada",
    name: "Canada",
    summary: "Toronto and Vancouver give the tournament eastern and Pacific Canadian anchors.",
    image:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1600&q=80",
  },
] as const;

export function getHostNation(slug: string) {
  return hostNations.find((nation) => nation.slug === slug);
}
