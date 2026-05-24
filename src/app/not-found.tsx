import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <div className="py-16">
      <Container>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 text-center shadow-2xl shadow-slate-950/30">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
            404
          </p>
          <h1 className="mt-4 text-4xl font-black text-white">
            Page not found
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            This page may have moved, or the tournament page you are looking for may not exist yet.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-400 px-5 text-sm font-black text-slate-950"
            >
              Back home
            </Link>
            <Link
              href="/fixtures"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white"
            >
              View fixtures
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
