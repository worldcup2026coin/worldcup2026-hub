import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const routes = [
  "/",
  "/fixtures",
  "/matches/2026-06-11-mexico-vs-south-africa-1489369",
  "/news",
  "/community",
  "/privacy",
  "/terms"
];

const badTextPatterns = [
  { label: "U+00C2 mojibake marker", regex: /\u00c2/ },
  { label: "U+00E2 mojibake marker", regex: /\u00e2/ },
  { label: "replacement character", regex: /\ufffd/ },
  { label: "literal escaped newline marker", regex: /`r`n|\\r\\n/ },
];

const oldHardcodedLabels = [
  "Mexico City · 15:00 local",
  "Mexico City - 15:00 local",
  "UTC · 21:00 kick-off",
  "UTC - 21:00 kick-off",
];

function walk(dir) {
  const skip = new Set([".git", ".next", "node_modules", "out", "build", "coverage", "qa-screenshots"]);
  const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".mdx", ".css"]);
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (skip.has(entry.name)) continue;
      if (entry.name.startsWith("qa-copy-time-fix-backup-")) continue;
      if (entry.name.startsWith("qa-mobile-fix-backup-")) continue;

      files.push(...walk(path.join(dir, entry.name)));
    } else if (entry.isFile() && exts.has(path.extname(entry.name))) {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

const staticFailures = [];

for (const file of walk(process.cwd())) {
  const text = fs.readFileSync(file, "utf8");

  for (const pattern of badTextPatterns) {
    if (pattern.regex.test(text)) {
      staticFailures.push(`${path.relative(process.cwd(), file)} contains ${pattern.label}`);
    }
  }
}

if (staticFailures.length > 0) {
  console.log("\nSTATIC COPY/TIME QA FAILURES:");
  for (const failure of staticFailures) console.log(`- ${failure}`);
  process.exit(1);
}

const browser = await chromium.launch();
const runtimeFailures = [];

for (const route of routes) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 920 },
    isMobile: true,
    deviceScaleFactor: 1
  });

  try {
    const response = await page.goto(`${baseUrl}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 45000
    });

    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

    const status = response?.status() ?? 0;
    const bodyText = await page.locator("body").innerText({ timeout: 15000 });

    if (status >= 500) {
      runtimeFailures.push(`${route}: HTTP ${status}`);
    }

    for (const pattern of badTextPatterns) {
      if (pattern.regex.test(bodyText)) {
        runtimeFailures.push(`${route}: visible text contains ${pattern.label}`);
      }
    }

    for (const label of oldHardcodedLabels) {
      if (bodyText.includes(label)) {
        runtimeFailures.push(`${route}: visible text contains old hardcoded label "${label}"`);
      }
    }

    if (route === "/") {
      for (const label of ["Venue time", "UTC", "Your time"]) {
        if (!bodyText.includes(label)) {
          runtimeFailures.push(`/: homepage countdown missing ${label}`);
        }
      }
    }

    console.log(`CHECKED ${route}`);
  } catch (error) {
    runtimeFailures.push(`${route}: ${error.message}`);
    console.log(`FAIL ${route}: ${error.message}`);
  }

  await page.close();
}

await browser.close();

if (runtimeFailures.length > 0) {
  console.log("\nRUNTIME COPY/TIME QA FAILURES:");
  for (const failure of runtimeFailures) console.log(`- ${failure}`);
  process.exit(1);
}

console.log("\nPASS: static and visible copy/time scan found no mojibake, escaped newline markers, or old hardcoded kickoff labels.");
