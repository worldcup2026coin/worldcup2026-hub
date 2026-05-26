import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const routes = [
  "/",
  "/teams/england-16",
  "/teams/argentina-26",
  "/teams/bosnia-herzegovina-1113",
  "/matches/2026-06-11-mexico-vs-south-africa-1489369",
  "/groups",
  "/best-third-placed-teams"
];

const widths = [360, 390, 414, 430];

const browser = await chromium.launch();
const failures = [];

for (const width of widths) {
  for (const route of routes) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
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
              className: typeof el.className === "string" ? el.className.slice(0, 240) : "",
              text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 140),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              position: style.position,
              display: style.display,
              overflowX: style.overflowX,
              whiteSpace: style.whiteSpace
            };
          })
          .filter((item) => item.right > viewportWidth + 1 || item.left < -1)
          .sort((a, b) => Math.abs(b.right - viewportWidth) - Math.abs(a.right - viewportWidth))
          .slice(0, 12);

        return {
          viewportWidth,
          docWidth,
          bodyWidth,
          hasPageOverflow: docWidth > viewportWidth + 1 || bodyWidth > viewportWidth + 1,
          offenders
        };
      });

      const status = response?.status() ?? 0;

      if (status >= 400 || result.hasPageOverflow) {
        failures.push({ route, width, status, result });
        console.log(`FAIL ${width}px ${route} status=${status} viewport=${result.viewportWidth} doc=${result.docWidth} body=${result.bodyWidth}`);
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
  console.log(`\nFAIL: ${failures.length} mobile overflow/status issue(s) found.`);
  process.exit(1);
}

console.log("\nPASS: mobile overflow QA passed at 360, 390, 414 and 430px.");
