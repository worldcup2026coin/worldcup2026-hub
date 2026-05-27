
import type { Fixture } from "@/lib/data/matches";
import type {
  OddsStyleRecord,
  PredictionTip,
  PredictionType,
} from "@/lib/data/predictions";
import { OddsStyleTable } from "@/components/predictions/odds-style-table";
import { PredictionCard } from "@/components/predictions/prediction-card";
import { PredictionEmptyState } from "@/components/predictions/prediction-empty-state";
import { ResponsibleUseDisclaimer } from "@/components/predictions/responsible-use-disclaimer";

type MatchPredictionSectionsProps = {
  fixture: Fixture;
  tips: PredictionTip[];
  oddsRecords: OddsStyleRecord[];
};

const sections: {
  type: PredictionType;
  title: string;
  emptyTitle: string;
  emptyDescription: string;
}[] = [
  {
    type: "fan_preview",
    title: "Fan signal preview",
    emptyTitle: "No prediction signal yet",
    emptyDescription:
      "No fan preview has been published for this match yet.",
  },
  {
    type: "fantasy_tip",
    title: "Players to watch",
    emptyTitle: "Player watchlist pending",
    emptyDescription:
      "No fantasy-style player notes have been published for this match yet.",
  },
  {
    type: "betting_style",
    title: "Football read",
    emptyTitle: "Football read unavailable",
    emptyDescription:
      "No football read has been published for this match yet.",
  },
];

export function MatchPredictionSections({
  fixture,
  tips,
  oddsRecords,
}: MatchPredictionSectionsProps) {
  return (
    <section className="grid gap-6">
      {sections.map((section) => {
        const sectionTips = tips.filter((tip) => tip.type === section.type);

        return (
          <div
            key={section.type}
            className="neon-card rounded-[2rem] p-5"
          >
            <p className="neon-kicker">{section.type.replaceAll("_", " ")}</p>
            <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-white">
              {section.title}
            </h2>

            {sectionTips.length === 0 ? (
              <div className="mt-4">
                <PredictionEmptyState
                  title={section.emptyTitle}
                  description={section.emptyDescription}
                />
              </div>
            ) : (
              <div className="mt-4 grid gap-4">
                {sectionTips.map((tip) => (
                  <PredictionCard key={tip.id} tip={tip} fixture={fixture} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <OddsStyleTable records={oddsRecords} />
      <ResponsibleUseDisclaimer />
    </section>
  );
}
