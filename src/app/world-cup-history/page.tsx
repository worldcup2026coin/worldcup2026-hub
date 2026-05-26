import { Container } from "@/components/ui/container";
import { WorldCupHistoryPanel } from "@/components/worldcup/authority-panels";

export const metadata = {
  title: "World Cup History & Records",
  description:
    "World Cup winners, all-time top scorers, recent finals and host-history context.",
};

export default function WorldCupHistoryPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <WorldCupHistoryPanel />
      </Container>
    </main>
  );
}
