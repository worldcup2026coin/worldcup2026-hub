import { RouteShell } from "@/components/routes/route-shell";
import { routeContent } from "@/lib/placeholder-data";

export const metadata = {
  title: "Groups",
  description: "World Cup 2026 groups and standings shell.",
};

export default function GroupsPage() {
  return <RouteShell content={routeContent.groups} />;
}
