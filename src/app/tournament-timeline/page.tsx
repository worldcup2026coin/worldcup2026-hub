import { Container } from "@/components/ui/container";
import { TournamentTimelinePanel } from "@/components/worldcup/authority-panels";

export const metadata = {
  title: "World Cup 2026 Tournament Timeline",
  description:
    "Opening match, group stage, knockouts and final timeline for World Cup 2026.",
};

export default function TournamentTimelinePage() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <TournamentTimelinePanel />
      </Container>
    </main>
  );
}
