"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { submitMeme } from "@/lib/memes/queries";

export type MemeSubmissionState = {
  ok: boolean;
  message: string;
};

const schema = z.object({
  nameOrHandle: z.string().trim().max(120).optional(),
  email: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Enter a valid email address.",
    }),
  memeUrl: z.string().trim().url("Enter a valid meme URL."),
  caption: z.string().trim().max(280).optional(),
  teamId: z.string().trim().optional(),
  fixtureId: z.string().trim().optional(),
  consent: z.literal("on", { message: "You must confirm you have permission to share this meme." }),
  website: z.string().trim().optional(),
});

function splitNameOrHandle(value?: string) {
  if (!value) {
    return { name: null, handle: null };
  }

  if (value.startsWith("@")) {
    return { name: null, handle: value };
  }

  return { name: value, handle: null };
}

export async function submitMemeAction(
  _prevState: MemeSubmissionState,
  formData: FormData
): Promise<MemeSubmissionState> {
  const raw = {
    nameOrHandle: String(formData.get("nameOrHandle") || ""),
    email: String(formData.get("email") || ""),
    memeUrl: String(formData.get("memeUrl") || ""),
    caption: String(formData.get("caption") || ""),
    teamId: String(formData.get("teamId") || ""),
    fixtureId: String(formData.get("fixtureId") || ""),
    consent: formData.get("consent"),
    website: String(formData.get("website") || ""),
  };

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Please check the form.",
    };
  }

  if (parsed.data.website) {
    return {
      ok: true,
      message: "Meme submitted. If it fits the vibe, it may appear on the wall.",
    };
  }

  const { name, handle } = splitNameOrHandle(parsed.data.nameOrHandle || undefined);

  try {
    await submitMeme({
      name,
      handle,
      email: parsed.data.email || null,
      meme_url: parsed.data.memeUrl,
      caption: parsed.data.caption || null,
      team_id: parsed.data.teamId || null,
      fixture_id: parsed.data.fixtureId || null,
      consent_to_feature: true,
    });

    revalidatePath("/memes");

    return {
      ok: true,
      message: "Meme submitted. If it fits the vibe, it may appear on the wall.",
    };
  } catch {
    return {
      ok: false,
      message: "Could not submit meme right now. Please try again.",
    };
  }
}


