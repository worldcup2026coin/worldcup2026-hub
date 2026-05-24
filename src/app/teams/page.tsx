import { RouteShell } from "@/components/routes/route-shell";
import { routeContent } from "@/lib/placeholder-data";

export const metadata = {
  title: "Teams",
  description: "World Cup 2026 teams shell.",
};

export default function TeamsPage() {
  return <RouteShell content={routeContent.teams} />;
}
