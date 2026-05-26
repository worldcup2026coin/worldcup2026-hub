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
  "/fixtures",
  "/host-nations",
  "/host-nations/usa",
  "/host-nations/mexico",
  "/host-nations/canada",
  "/stadiums",
  "/host-cities",
  "/world-cup-format",
  "/world-cup-history",
  "/tournament-timeline"
];

const widths = [390, 430, 768];

const browser = await chromium.launch();
const failures = [];

for (const route of routes) {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
      isMobile: width < 768
    });

    const url = `${baseUrl}${route}`;

    try {
      const response = await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 30000
      });

      const status = response?.status() ?? 0;

      const result = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;

        const viewportWidth = doc.clientWidth;
        const documentWidth = Math.max(
          doc.scrollWidth,
          body ? body.scrollWidth : 0
        );

        const overflowAmount = documentWidth - viewportWidth;

        const offenders = [...document.querySelectorAll("body *")]
          .map((el) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);

            return {
              tag: el.tagName.toLowerCase(),
              text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
              className: typeof el.className === "string" ? el.className.slice(0, 120) : "",
              right: Math.round(rect.right),
              left: Math.round(rect.left),
              width: Math.round(rect.width),
              position: style.position,
              display: style.display,
              overflowX: style.overflowX
            };
          })
          .filter((item) => item.right > viewportWidth + 2 || item.left < -2)
          .slice(0, 8);

        return {
          viewportWidth,
          documentWidth,
          overflowAmount,
          hasOverflow: overflowAmount > 2,
          offenders
        };
      });

      if (status !== 200) {
        failures.push(`${route} ${width}px returned HTTP ${status}`);
      }

      if (result.hasOverflow) {
        failures.push(
          `${route} ${width}px horizontal overflow: document=${result.documentWidth}px viewport=${result.viewportWidth}px overflow=${result.overflowAmount}px offenders=${JSON.stringify(result.offenders)}`
        );
      }

      if (status === 200 && !result.hasOverflow) {
        console.log(`PASS ${route} ${width}px`);
      } else {
        console.log(`FAIL ${route} ${width}px`);
      }
    } catch (error) {
      failures.push(`${route} ${width}px failed: ${error.message}`);
      console.log(`FAIL ${route} ${width}px`);
    }

    await page.close();
  }
}

await browser.close();

if (failures.length > 0) {
  console.log("\nMOBILE OVERFLOW QA FAILURES:");
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
  process.exit(1);
}

console.log("\nPASS: mobile overflow QA passed for all checked routes and widths.");
