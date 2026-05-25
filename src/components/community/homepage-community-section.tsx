
import { EmailSignupForm } from "@/components/community/email-signup-form";
import { PollCard } from "@/components/community/poll-card";
import { getPublishedPolls } from "@/lib/data/community";

export async function HomepageCommunitySection() {
  const polls = await getPublishedPolls({
    contextType: "homepage",
    limit: 1,
  });

  return (
    <section className="neon-panel mt-12 rounded-[2rem] p-5">
      <p className="neon-kicker">Community signal</p>

      <h2 className="mt-4 text-3xl font-black uppercase text-white">
        Join the fan layer
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        Vote in fan polls, get matchday updates and follow the football internet pulse.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {polls[0] ? (
          <PollCard poll={polls[0]} source="homepage" />
        ) : (
          <div className="rounded-3xl border border-dashed border-cyan-300/20 bg-cyan-300/10 p-6 text-center">
            <h3 className="text-lg font-black uppercase text-white">No homepage poll yet</h3>
            <p className="mt-2 text-sm text-slate-300">
              Publish a homepage poll in Supabase and it will light up here.
            </p>
          </div>
        )}

        <EmailSignupForm source="homepage" />
      </div>
    </section>
  );
}
