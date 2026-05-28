import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/worldcup/page-header";
import { PredictionCard } from "@/components/predictions/prediction-card";
import { PredictionEmptyState } from "@/components/predictions/prediction-empty-state";
import { ResponsibleUseDisclaimer } from "@/components/predictions/responsible-use-disclaimer";
import { TeamFlag } from "@/components/worldcup/team-flag";
import { getPredictionsIndexData } from "@/lib/data/predictions";
import {
  darkHorseWatch,
  groupPredictionSlots,
  predictionRecordRows,
  tournamentOutrightSlots,
  upsetWatch,
  type PredictionHubItem,
} from "@/lib/data/prediction-hub";
import { formatVenueDateTime } from "@/lib/worldcup/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "World Cup 2026 Predictions",
  description:
    "World Cup 2026 AI-assisted fan match reads, group predictions, tournament outrights, dark horse watch and prediction record.",
};

function PredictionSlotGrid({
  title,
  eyebrow,
  items,
}: {
  title: string;
  eyebrow: string;
  items: PredictionHubItem[];
}) {
  return (
    <section className="neon-panel rounded-[2rem] p-5">
      <p className="neon-kicker">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-black uppercase text-white">
        {title}
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-white/10 bg-slate-950/45 p-5"
          >
            <span className="neon-badge">
              {item.status === "ready" ? "Published" : "Awaiting upload"}
            </span>
            <h3 className="mt-4 text-xl font-black uppercase text-white">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {item.summary}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function PredictionsPage() {
  const predictionItems = await getPredictionsIndexData();

  return (
    <>
      <PageHeader
        eyebrow="Predictions"
        title="World Cup 2026 Predictions"
        description="AI-assisted fan match reads, group calls, outrights and prediction records. Football analysis only: no betting tips, no guarantees and no official tournament claim."
        meta="Fan-made reads · AI-assisted · Football analysis only"
      />

      <Container className="pb-14">
        <ResponsibleUseDisclaimer />

        <section className="neon-panel mt-8 rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="neon-kicker">Bracket Challenge</p>
              <h2 className="mt-4 text-3xl font-black uppercase text-white">
                Build your World Cup 2026 path
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Pick group qualifiers, choose the eight best third-placed teams,
                build the knockout path and share your WC26 champion call.
              </p>
            </div>
            <Link
              href="/predictions/bracket-challenge"
              className="glow-button-primary"
            >
              Build My Bracket
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-4">
          {[
            [
              "Today’s AI Match Reads",
              "Uploaded match reads appear first, with clear empty states before upload.",
            ],
            [
              "Group Predictions",
              "Group winners, qualifiers and danger spots sit in their own section.",
            ],
            [
              "Tournament Outrights",
              "Winner, finalist, semi-finalist and dark horse calls have dedicated space.",
            ],
            [
              "Prediction Record",
              "Results tracking starts only when matches produce real outcomes.",
            ],
          ].map(([title, copy]) => (
            <article key={title} className="neon-card rounded-[2rem] p-5">
              <span className="neon-badge neon-badge-cyan">Prediction hub</span>
              <h2 className="mt-4 text-2xl font-black uppercase text-white">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
            </article>
          ))}
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="neon-kicker">Today’s AI Match Reads</p>
              <h2 className="mt-4 text-3xl font-black uppercase text-white">
                Uploaded match predictions
              </h2>
            </div>
            <Link href="/fixtures" className="glow-button-secondary">
              Browse fixtures
            </Link>
          </div>

          {predictionItems.length === 0 ? (
            <PredictionEmptyState
              title="No AI match reads uploaded yet"
              description="Upload prediction rows in Supabase and they will appear here automatically. Until then, the hub shows the launch structure without pretending results exist."
            />
          ) : (
          <div className="grid gap-6">
            {predictionItems.map((item) => (
              <section
                key={item.fixture.id}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                      AI-assisted match read
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-white">
                      <TeamFlag
                        name={item.fixture.home_team_name}
                        className="mr-2 inline-flex h-8 w-8 align-middle"
                      />
                      {item.matchTitle}
                      <TeamFlag
                        name={item.fixture.away_team_name}
                        className="ml-2 inline-flex h-8 w-8 align-middle"
                      />
                    </h2>
                  </div>

                  <a
                    href={`/predictions/${item.canonicalSlug}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    View full read
                  </a>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  <article className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                      Match angle
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">
                      {item.matchTitle} is scheduled for{" "}
                      {formatVenueDateTime(item.fixture)}. The preview should
                      read the venue, group pressure and available team data
                      before any lean.
                    </p>
                  </article>
                  <article className="rounded-3xl border border-lime-300/20 bg-lime-300/10 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-100">
                      Likely script
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">
                      Expect this page to frame tempo, first-goal pressure and
                      late-game risk once published analysis is available.
                    </p>
                  </article>
                  <article className="rounded-3xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-100">
                      Risk note
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">
                      Risk labels are fan context only. Lineups, venue changes
                      and injuries can move the read quickly.
                    </p>
                  </article>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {item.tips.map((tip) => (
                    <PredictionCard
                      key={tip.id}
                      tip={tip}
                      fixture={item.fixture}
                      href={`/predictions/${item.canonicalSlug}`}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
          )}
        </section>

        <div className="mt-8 grid gap-6">
          <PredictionSlotGrid
            eyebrow="Group Predictions"
            title="Winner and qualifier calls"
            items={groupPredictionSlots}
          />
          <PredictionSlotGrid
            eyebrow="Tournament Outrights"
            title="Winner, finalist and semi-finalist spaces"
            items={tournamentOutrightSlots}
          />
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <PredictionSlotGrid
            eyebrow="Dark Horse Watch"
            title="Teams that can break brackets"
            items={darkHorseWatch}
          />
          <PredictionSlotGrid
            eyebrow="Upset Watch"
            title="Matches with chaos potential"
            items={upsetWatch}
          />
        </section>

        <section className="neon-card mt-8 rounded-[2rem] p-5">
          <p className="neon-kicker">Prediction Record</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-white">
            Results tracking
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            This table will track uploaded prediction records only after real
            match, group or tournament outcomes are known.
          </p>
          <div className="cyber-table mt-5">
            <table className="min-w-[680px] text-left text-sm">
              <thead>
                <tr>
                  <th>Track</th>
                  <th className="text-center">Correct</th>
                  <th className="text-center">Missed</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {predictionRecordRows.map(([track, correct, missed, notes]) => (
                  <tr key={track} className="text-slate-200">
                    <td className="font-black text-white">{track}</td>
                    <td className="text-center font-black text-lime-200">
                      {correct}
                    </td>
                    <td className="text-center font-black text-fuchsia-100">
                      {missed}
                    </td>
                    <td>{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="neon-panel mt-8 rounded-[2rem] p-5">
          <p className="neon-kicker">Method / Disclaimer</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-white">
            Football reads, not guarantees
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            These predictions are fan-made and AI-assisted football analysis
            based on available fixture, team, venue and tournament context. They
            are not financial advice, not wagering guidance, not official
            tournament content and not a promise of any outcome.
          </p>
        </section>
      </Container>
    </>
  );
}

