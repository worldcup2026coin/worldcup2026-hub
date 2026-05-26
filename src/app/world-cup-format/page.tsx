import { Container } from "@/components/ui/container";
import {
  FormatExplainerPanel,
  TournamentTimelinePanel,
} from "@/components/worldcup/authority-panels";

export const metadata = {
  title: "World Cup 2026 Format Explained | 48 Teams, 12 Groups, Best Thirds",
  description:
    "World Cup 2026 format explainer covering 48 teams, 12 groups, top-two qualification, best third-placed teams and the expanded knockout route.",
};

export default function WorldCupFormatPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <FormatExplainerPanel />
        <div className="mt-8">
          <TournamentTimelinePanel />
        </div>
      </Container>
    </main>
  );
}
