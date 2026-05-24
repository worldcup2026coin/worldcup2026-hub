import { EmailSignupForm } from "@/components/community/email-signup-form";
import { PollCard } from "@/components/community/poll-card";
import { getPublishedPolls } from "@/lib/data/community";

export async function HomepageCommunitySection() {
  const polls = await getPublishedPolls({
    contextType: "homepage",
    limit: 1,
  });

  return (
    <section className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
        Community
      </p>

      <h2 className="mt-2 text-2xl font-black text-white">
        Join the fan layer
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-300">
        Vote in fan polls, get email updates and follow the tournament with the community.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {polls[0] ? (
          <PollCard poll={polls[0]} source="homepage" />
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-center">
            <h3 className="text-lg font-black text-white">No homepage poll yet</h3>
            <p className="mt-2 text-sm text-slate-300">
              Publish a homepage poll in Supabase and it will appear here.
            </p>
          </div>
        )}

        <EmailSignupForm source="homepage" />
      </div>
    </section>
  );
}
