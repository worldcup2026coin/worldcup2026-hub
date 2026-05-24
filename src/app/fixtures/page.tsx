import { RouteShell } from "@/components/routes/route-shell";
import { routeContent } from "@/lib/placeholder-data";

export const metadata = {
  title: "Fixtures",
  description: "World Cup 2026 fixtures shell.",
};

export default function FixturesPage() {
  return <RouteShell content={routeContent.fixtures} />;
}
