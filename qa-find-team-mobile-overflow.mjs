import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const routes = [
  "/teams/usa-2384",
  "/teams/argentina-26",
  "/teams/bosnia-herzegovina-1113",
  "/teams/canada-5529"
];

const browser = await chromium.launch();

for (const route of routes) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 900 },
    isMobile: true
  });

  await page.goto(`${baseUrl}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 45000
  });

  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

  const result = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;

    const offenders = [...document.querySelectorAll("body *")]
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);

        return {
          tag: el.tagName.toLowerCase(),
          className: typeof el.className === "string" ? el.className.slice(0, 260) : "",
          id: el.id || "",
          text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 160),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          position: style.position,
          display: style.display,
          overflowX: style.overflowX,
          whiteSpace: style.whiteSpace
        };
      })
      .filter((item) => item.right > viewportWidth + 2 || item.left < -2)
      .sort((a, b) => Math.abs(b.right - viewportWidth) - Math.abs(a.right - viewportWidth))
      .slice(0, 25);

    return {
      viewportWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      offenders
    };
  });

  console.log(`\n=== ${route} ===`);
  console.log(`viewport=${result.viewportWidth} document=${result.documentWidth} body=${result.bodyWidth}`);
  console.log(JSON.stringify(result.offenders, null, 2));

  await page.close();
}

await browser.close();
