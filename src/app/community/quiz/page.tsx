import type { Metadata } from "next";
import { MascotQuiz } from "@/components/community/mascot-quiz";
import { Container } from "@/components/ui/container";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Which WC26 Mascot Are You?",
  description:
    "Take the fan-made WC26 mascot personality quiz and find out whether you are Maple, Zayu or Clutch.",
  path: "/community/quiz",
});

export default function CommunityQuizPage() {
  return (
    <Container className="py-10 sm:py-14">
      <MascotQuiz />
    </Container>
  );
}
