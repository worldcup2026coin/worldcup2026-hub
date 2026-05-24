import { RouteShell } from "@/components/routes/route-shell";
import { routeContent } from "@/lib/placeholder-data";

export const metadata = {
  title: "News",
  description: "World Cup 2026 news shell.",
};

export default function NewsPage() {
  return <RouteShell content={routeContent.news} />;
}
