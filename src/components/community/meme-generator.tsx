"use client";

import { useEffect, useRef, useState } from "react";

const templates = [
  {
    name: "Mascot banner",
    src: "/wc26/wc26-mascot-banner.png",
  },
  {
    name: "Sticker pack",
    src: "/wc26/wc26-sticker-pack.png",
  },
  {
    name: "Launch hero",
    src: "/wc26/wc26-website-hero.png",
  },
];

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.toUpperCase().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (context.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }

  if (line) lines.push(line);

  lines.slice(0, 3).forEach((lineText, index) => {
    context.strokeText(lineText, x, y + index * lineHeight);
    context.fillText(lineText, x, y + index * lineHeight);
  });
}

export function MemeGenerator({ signedIn }: { signedIn: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [template, setTemplate] = useState(templates[0].src);
  const [topText, setTopText] = useState("WHEN YOUR GROUP IS PURE CHAOS");
  const [bottomText, setBottomText] = useState("WC26 MATCHDAY MODE");
  const [confirm, setConfirm] = useState(false);
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const image = new Image();
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#02030a";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const scale = Math.max(
        canvas.width / image.width,
        canvas.height / image.height,
      );
      const width = image.width * scale;
      const height = image.height * scale;
      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 2;
      context.drawImage(image, x, y, width, height);

      context.fillStyle = "rgba(2,3,10,0.42)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.textAlign = "center";
      context.lineJoin = "round";
      context.font = "900 48px Arial, sans-serif";
      context.fillStyle = "#ffffff";
      context.strokeStyle = "#02030a";
      context.lineWidth = 8;
      wrapText(context, topText, canvas.width / 2, 72, canvas.width - 56, 54);
      wrapText(
        context,
        bottomText,
        canvas.width / 2,
        canvas.height - 128,
        canvas.width - 56,
        54,
      );

      context.font = "900 20px Arial, sans-serif";
      context.fillStyle = "#a3ff12";
      context.strokeStyle = "#02030a";
      context.lineWidth = 5;
      context.strokeText("FAN-MADE · UNOFFICIAL · WC26 HUB", canvas.width / 2, canvas.height - 28);
      context.fillText("FAN-MADE · UNOFFICIAL · WC26 HUB", canvas.width / 2, canvas.height - 28);
    };
    image.src = template;
  }, [bottomText, template, topText]);

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "wc26-fan-meme.png";
    link.click();
  }

  async function submitForReview() {
    const canvas = canvasRef.current;
    if (!canvas || !confirm) {
      setNotice("Confirm the fan-made content rule before submitting.");
      return;
    }

    setSubmitting(true);
    setNotice("");

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );

    if (!blob) {
      setNotice("Unable to create PNG right now.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.set("title", topText.slice(0, 80) || "WC26 fan meme");
    formData.set("caption", bottomText.slice(0, 220));
    formData.set("confirm", "on");
    formData.set("image", new File([blob], "wc26-fan-meme.png", { type: "image/png" }));

    const response = await fetch("/api/community/memes", {
      method: "POST",
      body: formData,
    });
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      message?: string;
    } | null;

    setSubmitting(false);
    setNotice(
      response.ok
        ? payload?.message ?? "Meme submitted for review."
        : payload?.error ?? "Unable to submit meme right now.",
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4">
        <canvas
          ref={canvasRef}
          width={1080}
          height={1080}
          className="aspect-square h-auto w-full rounded-[1.5rem] border border-white/10 bg-slate-950"
        />
      </section>

      <aside className="grid content-start gap-4">
        <section className="rounded-[2rem] border border-lime-300/20 bg-lime-300/10 p-5">
          <p className="neon-kicker">Meme generator</p>
          <h2 className="mt-3 text-2xl font-black uppercase text-white">
            Build a WC26 meme
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Plain canvas MVP using fan-made WC26 assets only. Download your PNG
            or submit it to the moderated meme wall.
          </p>
        </section>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">
            Template
          </span>
          <select
            value={template}
            onChange={(event) => setTemplate(event.target.value)}
            className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm font-bold text-white"
          >
            {templates.map((item) => (
              <option key={item.src} value={item.src}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
            Top text
          </span>
          <input
            value={topText}
            maxLength={80}
            onChange={(event) => setTopText(event.target.value)}
            className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm font-bold text-white"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-200">
            Bottom text
          </span>
          <input
            value={bottomText}
            maxLength={80}
            onChange={(event) => setBottomText(event.target.value)}
            className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm font-bold text-white"
          />
        </label>

        <label className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">
          <input
            type="checkbox"
            checked={confirm}
            onChange={(event) => setConfirm(event.target.checked)}
            className="mt-1"
          />
          <span>
            I confirm this is fan-made content and does not use official FIFA,
            World Cup, mascot, team, sponsor or copyrighted marks.
          </span>
        </label>

        <button type="button" onClick={downloadPng} className="glow-button-primary">
          Download PNG
        </button>

        {signedIn ? (
          <button
            type="button"
            onClick={submitForReview}
            disabled={submitting}
            className="glow-button-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit to Meme Wall"}
          </button>
        ) : (
          <a href="/auth/login" className="glow-button-secondary">
            Sign in to submit
          </a>
        )}

        {notice ? (
          <p className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-slate-200">
            {notice}
          </p>
        ) : null}
      </aside>
    </div>
  );
}
