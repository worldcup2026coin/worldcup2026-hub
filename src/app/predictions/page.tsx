import { RouteShell } from "@/components/routes/route-shell";
import { routeContent } from "@/lib/placeholder-data";

export const metadata = {
  title: "Predictions",
  description: "World Cup 2026 predictions shell.",
};

export default function PredictionsPage() {
  return <RouteShell content={routeContent.predictions} />;
}
