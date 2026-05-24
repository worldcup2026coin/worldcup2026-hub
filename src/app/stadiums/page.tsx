import { RouteShell } from "@/components/routes/route-shell";
import { routeContent } from "@/lib/placeholder-data";

export const metadata = {
  title: "Stadiums",
  description: "World Cup 2026 stadiums and host cities shell.",
};

export default function StadiumsPage() {
  return <RouteShell content={routeContent.stadiums} />;
}
