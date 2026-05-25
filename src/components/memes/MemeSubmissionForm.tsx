"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { SelectOption } from "@/lib/memes/types";
import { submitMemeAction, type MemeSubmissionState } from "@/app/memes/actions";

type Props = {
  teams: SelectOption[];
  fixtures: SelectOption[];
};

const initialState: MemeSubmissionState = {
  ok: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-lime-300 px-5 py-3 text-sm font-black text-black transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Submitting..." : "Submit your World Cup meme"}
    </button>
  );
}

export function MemeSubmissionForm({ teams, fixtures }: Props) {
  const [state, action] = useActionState(submitMemeAction, initialState);

  return (
    <section
      id="submit-meme"
      className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8"
    >
      <div className="mb-6 max-w-2xl">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-lime-300">
          Submit
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
          Submit your World Cup meme
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/60">
          Submissions may be reviewed before being featured. No login required.
        </p>
      </div>

      <form action={action} className="grid gap-4">
        <div className="hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-white/80">Name or handle</span>
            <input
              name="nameOrHandle"
              placeholder="@yourhandle"
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-lime-300"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-white/80">Email optional</span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-lime-300"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-white/80">Meme image or post URL</span>
          <input
            name="memeUrl"
            type="url"
            required
            placeholder="https://..."
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-lime-300"
          />
          <span className="text-xs leading-5 text-white/50">
            Direct image links show a preview. Article/social links appear as source links.
          </span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-white/80">Caption</span>
          <textarea
            name="caption"
            rows={4}
            maxLength={280}
            placeholder="What is happening here?"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-lime-300"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-white/80">
              Related team optional
            </span>
            <select
              name="teamId"
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-lime-300"
            >
              <option value="">No team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-white/80">
              Related match optional
            </span>
            <select
              name="fixtureId"
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-lime-300"
            >
              <option value="">No match</option>
              {fixtures.map((fixture) => (
                <option key={fixture.id} value={fixture.id}>
                  {fixture.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/70">
          <input
            name="consent"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 shrink-0"
          />
          <span>
            I confirm I have permission to share this and understand it may be
            featured publicly.
          </span>
        </label>

        {state.message ? (
          <div
            className={`rounded-2xl border p-4 text-sm font-bold ${
              state.ok
                ? "border-lime-300/40 bg-lime-300/10 text-lime-200"
                : "border-red-400/40 bg-red-400/10 text-red-200"
            }`}
          >
            {state.message}
          </div>
        ) : null}

        <SubmitButton />
      </form>
    </section>
  );
}

