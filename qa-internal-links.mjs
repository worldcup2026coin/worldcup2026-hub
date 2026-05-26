import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const seedRoutes = [
  "/",
  "/tournament-simulation",
  "/fan-polls",
  "/prediction-leaderboard",
  "/guides",
  "/injuries",
  "/suspensions",
  "/predictions",
  "/groups",
  "/news",
  "/fixtures"
];

const browser = await chromium.launch();
const page = await browser.newPage();

const internalLinks = new Set();

for (const route of seedRoutes) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 30000 });

  const hrefs = await page.$$eval("a[href]", links =>
    links.map(a => a.getAttribute("href")).filter(Boolean)
  );

  for (const href of hrefs) {
    if (
      href.startsWith("/") &&
      !href.startsWith("//") &&
      !href.startsWith("/#") &&
      !href.includes("mailto:") &&
      !href.includes("tel:")
    ) {
      internalLinks.add(href.split("#")[0]);
    }
  }
}

await browser.close();

let failures = [];

for (const href of [...internalLinks].sort()) {
  const url = `${baseUrl}${href}`;
  try {
    const response = await fetch(url, { redirect: "manual" });
    const status = response.status;

    if (status >= 200 && status < 400) {
      console.log(`PASS ${status} ${href}`);
    } else {
      console.log(`FAIL ${status} ${href}`);
      failures.push(`${status} ${href}`);
    }
  } catch (error) {
    console.log(`FAIL ${href} ${error.message}`);
    failures.push(`${href} ${error.message}`);
  }
}

if (failures.length) {
  console.log("\nBROKEN INTERNAL LINKS:");
  for (const failure of failures) console.log(`- ${failure}`);
  process.exit(1);
}

console.log("\nPASS: all discovered internal links returned 2xx/3xx.");
