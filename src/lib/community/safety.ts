const scamPhrases = [
  "airdrop",
  "claim reward",
  "connect wallet",
  "double your",
  "free tokens",
  "giveaway",
  "guaranteed profit",
  "private key",
  "seed phrase",
  "wallet drain",
  "wallet drainer",
];

export function cleanCommunityText(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function validateChatMessage(message: string) {
  const lower = message.toLowerCase();
  const links = message.match(/https?:\/\//gi) ?? [];

  if (message.length < 1) {
    return "Message cannot be empty.";
  }

  if (message.length > 280) {
    return "Message must be 280 characters or fewer.";
  }

  if (links.length > 1) {
    return "Please keep chat links to a minimum.";
  }

  if (scamPhrases.some((phrase) => lower.includes(phrase))) {
    return "That message looks like spam or a scam attempt.";
  }

  return null;
}

export function validateProfileInput({
  displayName,
  handle,
  bio,
}: {
  displayName: string;
  handle: string;
  bio: string;
}) {
  if (displayName.length < 2 || displayName.length > 32) {
    return "Display name must be 2-32 characters.";
  }

  if (handle && !/^[a-zA-Z0-9_]{3,24}$/.test(handle)) {
    return "Handle must be 3-24 letters, numbers or underscores.";
  }

  if (bio.length > 240) {
    return "Bio must be 240 characters or fewer.";
  }

  return null;
}

export function validateMemeInput({
  title,
  caption,
  file,
  confirmed,
}: {
  title: string;
  caption: string;
  file: File | null;
  confirmed: boolean;
}) {
  if (title.length < 2 || title.length > 80) {
    return "Title must be 2-80 characters.";
  }

  if (caption.length > 220) {
    return "Caption must be 220 characters or fewer.";
  }

  if (!confirmed) {
    return "Please confirm the content rights and fan-made rules.";
  }

  if (!file || file.size === 0) {
    return "Please choose an image.";
  }

  if (file.size > 3 * 1024 * 1024) {
    return "Image must be 3MB or smaller.";
  }

  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    return "Only PNG, JPG, JPEG and WebP images are allowed.";
  }

  return null;
}
