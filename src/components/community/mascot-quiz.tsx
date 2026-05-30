"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type MascotKey = "maple" | "zayu" | "clutch";

type QuizOption = {
  label: string;
  mascot: MascotKey;
};

const questions: Array<{
  prompt: string;
  options: QuizOption[];
}> = [
  {
    prompt: "It’s 90+7 and VAR is checking a goal. You are...",
    options: [
      { label: "Calmly explaining the rules to everyone", mascot: "maple" },
      { label: "Screaming at the screen in three languages", mascot: "zayu" },
      { label: "Already making the meme before the decision", mascot: "clutch" },
    ],
  },
  {
    prompt: "Your World Cup group chat role is...",
    options: [
      { label: "The organiser with fixtures, times and links", mascot: "maple" },
      { label: "The chaos merchant starting debates", mascot: "zayu" },
      { label: "The instant-reaction meme machine", mascot: "clutch" },
    ],
  },
  {
    prompt: "Pick your matchday fuel",
    options: [
      { label: "Coffee and a spreadsheet", mascot: "maple" },
      { label: "Tacos, noise and bad decisions", mascot: "zayu" },
      { label: "Wings, hype and 14 tabs open", mascot: "clutch" },
    ],
  },
  {
    prompt: "Your football personality",
    options: [
      { label: "Loyal, tactical, secretly dangerous", mascot: "maple" },
      { label: "Fast, loud, unpredictable", mascot: "zayu" },
      { label: "Confident, dramatic, born for highlights", mascot: "clutch" },
    ],
  },
  {
    prompt: "Your $WC26 energy",
    options: [
      { label: "Build the hub, keep it clean", mascot: "maple" },
      { label: "Bring the chaos, wake the timeline", mascot: "zayu" },
      { label: "Post the meme, lead the charge", mascot: "clutch" },
    ],
  },
];

const results: Record<
  MascotKey,
  {
    name: string;
    emoji: string;
    image: string;
    intro: string;
    body: string;
    vibe: string;
    color: string;
  }
> = {
  maple: {
    name: "Maple",
    emoji: "🫎",
    image: "/wc26/wc26-maple.png",
    intro: "You are Maple 🫎",
    body: "The calm commander of the chaos. You bring structure, loyalty and ‘I actually checked the fixtures’ energy.",
    vibe: "Fixtures saved. Group chat organised. Quietly dangerous.",
    color: "border-lime-300/35 bg-lime-300/10 text-lime-100",
  },
  zayu: {
    name: "Zayu",
    emoji: "🐆",
    image: "/wc26/wc26-zayu.png",
    intro: "You are Zayu 🐆",
    body: "The matchday chaos engine. Loud, fast, impossible to predict, and absolutely not waiting for full-time before posting.",
    vibe: "VAR rage. Tacos. Bad takes delivered with confidence.",
    color: "border-fuchsia-300/35 bg-fuchsia-400/10 text-fuchsia-100",
  },
  clutch: {
    name: "Clutch",
    emoji: "🦅",
    image: "/wc26/wc26-clutch.png",
    intro: "You are Clutch 🦅",
    body: "The highlight-reel menace. You live for late winners, viral clips and posting before everyone else catches up.",
    vibe: "Big game energy. Meme first. Apologise never.",
    color: "border-cyan-300/35 bg-cyan-300/10 text-cyan-100",
  },
};

function getWinner(answers: MascotKey[]): MascotKey | null {
  if (answers.length !== questions.length) return null;

  const counts: Record<MascotKey, number> = {
    maple: 0,
    zayu: 0,
    clutch: 0,
  };

  for (const answer of answers) {
    counts[answer] += 1;
  }

  const highScore = Math.max(counts.maple, counts.zayu, counts.clutch);
  const tied = (Object.keys(counts) as MascotKey[]).filter(
    (key) => counts[key] === highScore,
  );

  if (tied.length === 1) return tied[0];

  for (let index = answers.length - 1; index >= 0; index -= 1) {
    if (tied.includes(answers[index])) {
      return answers[index];
    }
  }

  return tied[0];
}

export function MascotQuiz() {
  const [answers, setAnswers] = useState<Array<MascotKey | null>>(
    Array(questions.length).fill(null),
  );
  const [showResult, setShowResult] = useState(false);
  const completeAnswers = answers.filter(Boolean) as MascotKey[];
  const winner = getWinner(completeAnswers);
  const result = winner ? results[winner] : null;
  const quizUrl =
    typeof window === "undefined"
      ? "https://www.worldcup2026coin.com/community/quiz"
      : `${window.location.origin}/community/quiz`;
  const shareUrl = result
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `I got ${result.name} in the WC26 mascot quiz. Which one are you?`,
      )}&url=${encodeURIComponent(quizUrl)}`
    : "#";

  function answerQuestion(questionIndex: number, mascot: MascotKey) {
    setAnswers((current) =>
      current.map((answer, index) => (index === questionIndex ? mascot : answer)),
    );
    setShowResult(false);
  }

  function resetQuiz() {
    setAnswers(Array(questions.length).fill(null));
    setShowResult(false);
  }

  return (
    <div className="grid gap-6">
      <section className="hero-panel rounded-[2.5rem] p-6 sm:p-10">
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-center">
          <div>
            <p className="neon-kicker">Fan-made mascot quiz</p>
            <h1 className="neon-title glow-text mt-4 text-5xl font-black uppercase leading-[0.9] text-white sm:text-7xl">
              Which WC26 mascot are you?
            </h1>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-200">
              A lightweight community quiz for the fan-made WC26 mascot crew.
              No login, no database, no wallet, just matchday personality chaos.
            </p>
            <p className="mt-4 max-w-3xl text-xs font-semibold leading-5 text-slate-400">
              Maple, Zayu and Clutch are unofficial WC26 community mascots. They
              are not official FIFA, World Cup, federation, team or sponsor
              assets.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-[2rem] border border-white/10 bg-black/20 p-3">
            {(Object.keys(results) as MascotKey[]).map((key) => (
              <div key={key} className="rounded-2xl bg-white/[0.05] p-2">
                <Image
                  src={results[key].image}
                  alt={`${results[key].name} fan-made WC26 mascot`}
                  width={180}
                  height={260}
                  className="h-24 w-full object-contain sm:h-32"
                />
                <p className="mt-1 text-center text-[0.65rem] font-black uppercase tracking-[0.12em] text-white">
                  {results[key].name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        {questions.map((question, questionIndex) => (
          <article key={question.prompt} className="neon-panel rounded-[2rem] p-5">
            <p className="neon-kicker">Question {questionIndex + 1}</p>
            <h2 className="mt-3 text-2xl font-black text-white">
              {question.prompt}
            </h2>
            <div className="mt-5 grid gap-3">
              {question.options.map((option) => {
                const selected = answers[questionIndex] === option.mascot;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => answerQuestion(questionIndex, option.mascot)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold leading-6 transition ${
                      selected
                        ? results[option.mascot].color
                        : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-lime-300/35 hover:bg-lime-300/10"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </section>

      <section className="neon-panel rounded-[2rem] p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={completeAnswers.length !== questions.length}
            onClick={() => setShowResult(true)}
            className="glow-button-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reveal result
          </button>
          <button
            type="button"
            onClick={resetQuiz}
            className="glow-button-secondary"
          >
            Reset quiz
          </button>
        </div>
        <p className="mt-3 text-xs font-semibold text-slate-500">
          {completeAnswers.length} of {questions.length} answered
        </p>
      </section>

      {showResult && result ? (
        <section className="neon-panel rounded-[2rem] p-6">
          <div className="grid gap-6 lg:grid-cols-[18rem_1fr] lg:items-center">
            <div className={`rounded-[2rem] border p-4 ${result.color}`}>
              <Image
                src={result.image}
                alt={`${result.name} fan-made WC26 mascot result`}
                width={320}
                height={440}
                className="mx-auto h-72 w-full object-contain"
              />
            </div>
            <div>
              <p className="neon-kicker">Your result</p>
              <h2 className="mt-4 text-4xl font-black uppercase text-white">
                {result.intro}
              </h2>
              <p className="mt-4 text-base font-semibold leading-7 text-slate-200">
                {result.body}
              </p>
              <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm font-black leading-6 text-lime-100">
                Your vibe: {result.vibe}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-button-primary text-center"
                >
                  Share on X
                </a>
                <a
                  href="https://t.me/WC26HubChat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-button-secondary text-center"
                >
                  Telegram chat
                </a>
                <Link href="/wc26" className="glow-button-secondary text-center">
                  $WC26 page
                </Link>
                <Link
                  href="/community/memes"
                  className="glow-button-secondary text-center"
                >
                  Meme Wall
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
