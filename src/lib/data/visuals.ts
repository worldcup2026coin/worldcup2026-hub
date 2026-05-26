import { hostNations } from "@/lib/data/authority";
import type { HostCity, Stadium } from "@/lib/data/venues";

const countryImages = {
  USA: hostNations.find((nation) => nation.slug === "usa")?.image ?? "",
  Mexico: hostNations.find((nation) => nation.slug === "mexico")?.image ?? "",
  Canada: hostNations.find((nation) => nation.slug === "canada")?.image ?? "",
};

const cityImages: Record<string, string> = {
  "mexico-city":
    "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1600&q=80",
  guadalajara:
    "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1600&q=80",
  monterrey:
    "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=1600&q=80",
  toronto:
    "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1600&q=80",
  vancouver:
    "https://images.unsplash.com/photo-1560814304-4f05b62af116?auto=format&fit=crop&w=1600&q=80",
  atlanta:
    "https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?auto=format&fit=crop&w=1600&q=80",
  boston:
    "https://images.unsplash.com/photo-1501979376754-2ff867a4f659?auto=format&fit=crop&w=1600&q=80",
  dallas:
    "https://images.unsplash.com/photo-1540155945626-4bb6b8e1bb1f?auto=format&fit=crop&w=1600&q=80",
  houston:
    "https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?auto=format&fit=crop&w=1600&q=80",
  "kansas-city":
    "https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=1600&q=80",
  "los-angeles":
    "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=1600&q=80",
  miami:
    "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&w=1600&q=80",
  "new-york-new-jersey":
    "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=1600&q=80",
  philadelphia:
    "https://images.unsplash.com/photo-1573064793711-2e77eddb4b71?auto=format&fit=crop&w=1600&q=80",
  "san-francisco-bay-area":
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80",
  seattle:
    "https://images.unsplash.com/photo-1502175353174-a7a70e73b362?auto=format&fit=crop&w=1600&q=80",
};

const travelHighlights: Record<string, string[]> = {
  "mexico-city": ["Airport: MEX", "Metro and ride-share are key", "Altitude can affect visitors"],
  guadalajara: ["Airport: GDL", "Plan for stadium transfers", "Historic centre and food scene"],
  monterrey: ["Airport: MTY", "Mountain views around the city", "Cross-border travel interest"],
  toronto: ["Airport: YYZ", "UP Express links airport and city", "Downtown fan zones likely"],
  vancouver: ["Airport: YVR", "SkyTrain links airport and city", "Pacific timezone watch"],
  atlanta: ["Airport: ATL", "MARTA helps downtown movement", "Indoor stadium environment"],
  boston: ["Airport: BOS", "Plan extra time to Foxborough", "Northeast corridor access"],
  dallas: ["Airport: DFW", "Car planning matters", "Major multi-match hub"],
  houston: ["Airports: IAH / HOU", "Heat planning matters", "Strong international links"],
  "kansas-city": ["Airport: MCI", "Stadium-area travel planning", "Huge matchday noise"],
  "los-angeles": ["Airport: LAX", "Allow serious traffic time", "West-coast spotlight"],
  miami: ["Airport: MIA", "Heat and storm planning", "Latin America travel hub"],
  "new-york-new-jersey": ["Airports: JFK / EWR / LGA", "Transit to MetLife", "Final destination"],
  philadelphia: ["Airport: PHL", "Walkable central core", "Northeast city hopping"],
  "san-francisco-bay-area": ["Airports: SFO / SJC", "Plan Bay Area distances", "Levi's Stadium in Santa Clara"],
  seattle: ["Airport: SEA", "Light rail to downtown", "Loud Pacific Northwest venue"],
};

export function getCityImage(city: HostCity) {
  return cityImages[city.slug] ?? countryImages[city.country];
}

export function getStadiumImage(stadium: Stadium) {
  return cityImages[stadium.citySlug] ?? countryImages[stadium.country];
}

export function getTravelHighlights(city: HostCity) {
  return travelHighlights[city.slug] ?? [
    "Airport and transport guide updating",
    "Matchday routes will be added",
    "Host city highlights",
  ];
}

