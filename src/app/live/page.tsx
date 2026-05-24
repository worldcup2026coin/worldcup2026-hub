import { RouteShell } from "@/components/routes/route-shell";
import { routeContent } from "@/lib/placeholder-data";

export const metadata = {
  title: "Live Scores",
  description: "World Cup 2026 live scores shell.",
};

export default function LivePage() {
  return <RouteShell content={routeContent.live} />;
}
