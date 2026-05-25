
import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <div className="py-16">
      <Container>
        <div className="hero-panel rounded-[2.25rem] p-8 text-center">
          <p className="neon-kicker mx-auto">404 signal lost</p>
          <h1 className="neon-title glow-text mt-5 text-5xl font-black text-white sm:text-7xl">
            Page not found
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            This route has gone offside, moved, or does not exist yet.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="glow-button-primary">
              Back home
            </Link>
            <Link href="/fixtures" className="glow-button-secondary">
              View fixtures
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
