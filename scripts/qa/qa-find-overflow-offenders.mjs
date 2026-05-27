import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const widths = [360, 375, 390, 414, 430];

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

function expectedStatus(route) {
  return route === "/not-a-real-page" ? 404 : 200;
}

const browser = await chromium.launch();
const failures = [];

for (const width of widths) {
  for (const route of routes) {
    const page = await browser.newPage({
      viewport: { width, height: 920 },
      isMobile: true,
      deviceScaleFactor: 1
    });

    try {
      const response = await page.goto(`${baseUrl}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 45000
      });

      await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

      const result = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;

        const offenders = [...document.querySelectorAll("body *")]
          .map((el) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);

            return {
              tag: el.tagName.toLowerCase(),
              id: el.id || "",
              className: typeof el.className === "string" ? el.className.slice(0, 260) : "",
              text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 150),
              width: Math.round(rect.width),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              position: style.position,
              display: style.display,
              overflowX: style.overflowX,
              whiteSpace: style.whiteSpace
            };
          })
          .filter((item) => item.right > viewportWidth + 1 || item.left < -1)
          .sort((a, b) => Math.abs(b.right - viewportWidth) - Math.abs(a.right - viewportWidth))
          .slice(0, 20);

        return {
          viewportWidth,
          docWidth,
          bodyWidth,
          hasPageOverflow: docWidth > viewportWidth + 1 || bodyWidth > viewportWidth + 1,
          offenders
        };
      });

      const status = response?.status() ?? 0;
      const wanted = expectedStatus(route);

      if (status !== wanted || result.hasPageOverflow) {
        failures.push({ route, width, status, expectedStatus: wanted, result });
        console.log(`FAIL ${width}px ${route} status=${status} expected=${wanted} viewport=${result.viewportWidth} doc=${result.docWidth} body=${result.bodyWidth}`);
        console.log(JSON.stringify(result.offenders, null, 2));
      } else {
        console.log(`PASS ${width}px ${route} viewport=${result.viewportWidth} doc=${result.docWidth} body=${result.bodyWidth}`);
      }
    } catch (error) {
      failures.push({ route, width, error: error.message });
      console.log(`FAIL ${width}px ${route}: ${error.message}`);
    }

    await page.close();
  }
}

await browser.close();

if (failures.length > 0) {
  console.log(`\nFAIL: ${failures.length} strict mobile overflow/status issue(s) found.`);
  process.exit(1);
}

console.log("\nPASS: strict mobile offender scan found no page-level overflow.");
