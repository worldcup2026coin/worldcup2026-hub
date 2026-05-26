import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const outputDir = "qa-screenshots/full-site";

const mustIncludeRoutes = [
  "/",
  "/matches/2026-06-11-mexico-vs-south-africa-1489369",
  "/matches/2026-06-13-brazil-vs-morocco-1489371",
  "/fixtures",
  "/groups",
  "/predictions",
  "/injuries",
  "/suspensions",
  "/tournament-simulation",
  "/fan-polls",
  "/prediction-leaderboard",
  "/guides",
  "/host-nations",
  "/host-nations/usa",
  "/host-nations/mexico",
  "/host-nations/canada",
  "/stadiums",
  "/host-cities",
  "/world-cup-format",
  "/world-cup-history",
  "/tournament-timeline",
  "/best-third-placed-teams"
];

const viewports = [
  { name: "desktop", width: 1440, height: 1000, isMobile: false },
  { name: "mobile", width: 390, height: 900, isMobile: true }
];

function safeName(route) {
  if (route === "/") return "home";
  return route
    .replace(/^\/+/, "")
    .replace(/[\/:?#[\]@!$&'()*+,;=.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getSitemapRoutes() {
  try {
    const response = await fetch(`${baseUrl}/sitemap.xml`);
    if (!response.ok) return [];

    const xml = await response.text();

    return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
      .map((match) => {
        try {
          return new URL(match[1]).pathname;
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

const sitemapRoutes = await getSitemapRoutes();

const routes = [...new Set([...mustIncludeRoutes, ...sitemapRoutes])]
  .filter((route) => route && route.startsWith("/"))
  .filter((route) => !route.startsWith("/api/"))
  .filter((route) => route !== "/robots.txt")
  .filter((route) => route !== "/sitemap.xml")
  .sort();

console.log(`Checking ${routes.length} routes from sitemap + required launch pages.`);

const browser = await chromium.launch();
const failures = [];

for (const viewport of viewports) {
  const viewportDir = path.join(outputDir, viewport.name);
  await fs.mkdir(viewportDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    isMobile: viewport.isMobile
  });

  for (const route of routes) {
    const page = await context.newPage();
    const url = `${baseUrl}${route}`;
    const screenshotPath = path.join(viewportDir, `${safeName(route)}.png`);

    const duplicateKeyWarnings = [];

    page.on("console", (message) => {
      const text = message.text();

      if (/same key|keys should be unique/i.test(text)) {
        duplicateKeyWarnings.push(text);
      }
    });

    try {
      const response = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45000
      });

      await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {
        // Non-blocking. Some pages may keep light network activity alive.
      });

      const status = response?.status() ?? 0;
      const title = await page.title().catch(() => "");
      const bodyText = await page.locator("body").innerText({ timeout: 10000 }).catch(() => "");

      const layout = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;

        const viewportWidth = doc.clientWidth;
        const documentWidth = Math.max(doc.scrollWidth, body ? body.scrollWidth : 0);

        return {
          viewportWidth,
          documentWidth,
          overflowAmount: documentWidth - viewportWidth,
          hasHorizontalOverflow: documentWidth > viewportWidth + 2
        };
      });

      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      const routeFailures = [];

      if (status >= 500) {
        routeFailures.push(`HTTP ${status}`);
      }

      if (status === 404) {
        routeFailures.push("HTTP 404");
      }

      if (
        /internal server error/i.test(bodyText) ||
        /application error/i.test(bodyText) ||
        /server error/i.test(title)
      ) {
        routeFailures.push("Internal Server Error/Application Error visible");
      }

      if (layout.hasHorizontalOverflow) {
        routeFailures.push(
          `horizontal overflow document=${layout.documentWidth}px viewport=${layout.viewportWidth}px overflow=${layout.overflowAmount}px`
        );
      }

      if (duplicateKeyWarnings.length > 0) {
        routeFailures.push("duplicate React key warning");
      }

      if (routeFailures.length > 0) {
        const reason = `${viewport.name} ${route}: ${routeFailures.join("; ")}`;
        failures.push(reason);
        console.log(`FAIL ${reason}`);
      } else {
        console.log(`PASS ${viewport.name} ${route}`);
      }
    } catch (error) {
      const reason = `${viewport.name} ${route}: ${error.message}`;
      failures.push(reason);
      console.log(`FAIL ${reason}`);
    }

    await page.close();
  }

  await context.close();
}

await browser.close();

await fs.writeFile(
  path.join(outputDir, "qa-summary.json"),
  JSON.stringify(
    {
      baseUrl,
      checkedAt: new Date().toISOString(),
      routeCount: routes.length,
      viewports,
      failures
    },
    null,
    2
  )
);

if (failures.length > 0) {
  console.log("\nFULL-SITE SCREENSHOT QA FAILURES:");
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }

  console.log(`\nScreenshots saved to: ${outputDir}`);
  process.exit(1);
}

console.log("\nPASS: full-site screenshot QA passed on desktop and mobile.");
console.log(`Screenshots saved to: ${outputDir}`);
