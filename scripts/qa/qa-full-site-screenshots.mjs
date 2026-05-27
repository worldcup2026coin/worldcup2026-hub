import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const outputDir = "qa-screenshots/strict-mobile";

const routes = [
  "/",
  "/fixtures",
  "/live",
  "/groups",
  "/best-third-placed-teams",
  "/teams",
  "/teams/england-16",
  "/teams/bosnia-herzegovina-1113",
  "/matches/2026-06-11-mexico-vs-south-africa-1489369",
  "/top-scorers",
  "/top-assists",
  "/top-cards",
  "/predictions",
  "/news",
  "/stadiums",
  "/host-cities",
  "/host-nations",
  "/guides",
  "/injuries",
  "/suspensions",
  "/tournament-simulation",
  "/fan-polls",
  "/prediction-leaderboard",
  "/community",
  "/privacy",
  "/terms",
  "/not-a-real-page"
];

const viewports = [360, 375, 390, 414, 430];

function safeName(route) {
  if (route === "/") return "home";
  return route.replace(/^\/+/, "").replace(/[\/:?#[\]@!$&'()*+,;=.]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function expectedStatus(route) {
  return route === "/not-a-real-page" ? 404 : 200;
}

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const failures = [];

for (const width of viewports) {
  const viewportDir = path.join(outputDir, `${width}px`);
  await fs.mkdir(viewportDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width, height: 920 },
    deviceScaleFactor: 1,
    isMobile: true
  });

  for (const route of routes) {
    const page = await context.newPage();
    const screenshotPath = path.join(viewportDir, `${safeName(route)}.png`);

    try {
      const response = await page.goto(`${baseUrl}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 45000
      });

      await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

      const status = response?.status() ?? 0;
      const wanted = expectedStatus(route);

      const layout = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        const documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);

        let countdownOverlap = false;
        const countdown = document.querySelector("[data-match-countdown]");
        if (countdown) {
          const copy = countdown.querySelector("[data-countdown-copy]");
          const grid = countdown.querySelector("[data-countdown-timer-grid]");
          if (copy && grid) {
            const a = copy.getBoundingClientRect();
            const b = grid.getBoundingClientRect();
            countdownOverlap =
              a.bottom > b.top + 1 &&
              a.right > b.left + 1 &&
              b.right > a.left + 1;
          }
        }

        return {
          viewportWidth,
          documentWidth,
          overflowAmount: documentWidth - viewportWidth,
          hasHorizontalOverflow: documentWidth > viewportWidth + 1,
          countdownOverlap
        };
      });

      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      const routeFailures = [];

      if (status !== wanted) {
        routeFailures.push(`HTTP ${status}, expected ${wanted}`);
      }

      if (layout.hasHorizontalOverflow) {
        routeFailures.push(`horizontal overflow document=${layout.documentWidth}px viewport=${layout.viewportWidth}px overflow=${layout.overflowAmount}px`);
      }

      if (route === "/" && layout.countdownOverlap) {
        routeFailures.push("homepage countdown text overlaps timer");
      }

      if (routeFailures.length > 0) {
        const reason = `${width}px ${route}: ${routeFailures.join("; ")}`;
        failures.push(reason);
        console.log(`FAIL ${reason}`);
      } else {
        console.log(`PASS ${width}px ${route}`);
      }
    } catch (error) {
      const reason = `${width}px ${route}: ${error.message}`;
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
      routes,
      viewports,
      failures
    },
    null,
    2
  )
);

if (failures.length > 0) {
  console.log("\nSTRICT MOBILE SCREENSHOT QA FAILURES:");
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }

  console.log(`\nScreenshots saved to: ${outputDir}`);
  process.exit(1);
}

console.log("\nPASS: full-site mobile screenshot QA passed at every requested width.");
console.log(`Screenshots saved to: ${outputDir}`);
