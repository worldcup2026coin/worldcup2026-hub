import { EmailSignupCard } from "@/components/cards/email-signup-card";
import { RouteShell } from "@/components/routes/route-shell";
import { Container } from "@/components/ui/container";
import { routeContent } from "@/lib/placeholder-data";

export const metadata = {
  title: "Community",
  description: "World Cup 2026 community shell.",
};

export default function CommunityPage() {
  return (
    <>
      <RouteShell content={routeContent.community} />
      <Container className="pb-14">
        <EmailSignupCard />
      </Container>
    </>
  );
}
