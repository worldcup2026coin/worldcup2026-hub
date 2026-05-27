import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const routes = [
  "/",
  "/tournament-simulation",
  "/fan-polls",
  "/prediction-leaderboard",
  "/guides",
  "/injuries",
  "/suspensions",
  "/best-third-placed-teams",
  "/predictions",
  "/groups",
  "/news",
  "/fixtures"
];

const bannedVisiblePatterns = [
  /placeholder/i,
  /\bMVP\b/i,
  /later phase/i,
  /\bfake\b/i,
  /\bdummy\b/i,
  /meme wall/i,
  /\btoken\b/i,
  /pump\.fun/i,
  /presale/i,
  /fundraising/i,
  /\bwallet\b/i,
  /buy now/i,
  /holder[- ]gated/i,
  /\bpremium\b/i,
  /guaranteed/i,
  /must bet/i,
  /betting advice/i,
  /gambling advice/i
];

const widths = [390, 430, 768];

const browser = await chromium.launch();

let failures = [];

for (const route of routes) {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 900 }
    });

    const url = `${baseUrl}${route}`;
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    const status = response?.status() ?? 0;
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content").catch(() => "");
    const bodyText = await page.locator("body").innerText().catch(() => "");

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    });

    const bannedMatches = bannedVisiblePatterns
      .filter((pattern) => pattern.test(bodyText))
      .map((pattern) => pattern.toString());

    if (status !== 200) {
      failures.push(`${route} width ${width}: status ${status}`);
    }

    if (!title || title.trim().length < 10) {
      failures.push(`${route} width ${width}: weak/missing title`);
    }

    if (!description || description.trim().length < 50) {
      failures.push(`${route} width ${width}: weak/missing meta description`);
    }

    if (overflow) {
      failures.push(`${route} width ${width}: horizontal overflow`);
    }

    if (bannedMatches.length > 0) {
      failures.push(`${route} width ${width}: banned visible text ${bannedMatches.join(", ")}`);
    }

    console.log(`CHECK ${route} ${width}px status=${status} overflow=${overflow} title="${title}"`);
    await page.close();
  }
}

await browser.close();

if (failures.length) {
  console.log("\nFAILURES:");
  for (const failure of failures) console.log(`- ${failure}`);
  process.exit(1);
}

console.log("\nPASS: route, metadata, visible-copy, and mobile-overflow checks passed.");
