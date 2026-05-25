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
    title: "Fan-friendly match preview",
    emptyTitle: "No prediction published yet",
    emptyDescription:
      "No fan preview has been published for this match yet. This will be filled manually through Supabase for now.",
  },
  {
    type: "fantasy_tip",
    title: "Fantasy-style players to watch",
    emptyTitle: "Fantasy notes coming soon",
    emptyDescription:
      "No fantasy-style player notes have been published for this match yet.",
  },
  {
    type: "betting_style",
    title: "Betting-style view",
    emptyTitle: "Betting-style view unavailable",
    emptyDescription:
      "No betting-style view has been published for this match yet.",
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
            className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"
          >
            <h2 className="text-xl font-black text-white">{section.title}</h2>

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
