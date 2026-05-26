import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const routes = [
  "/",
  "/matches/2026-06-11-mexico-vs-south-africa-1489369",
  "/fixtures",
  "/groups"
];

const browser = await chromium.launch();

for (const route of routes) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 }
  });

  await page.goto(`${baseUrl}${route}`, {
    waitUntil: "networkidle",
    timeout: 45000
  });

  const result = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;

    const offenders = [...document.querySelectorAll("body *")]
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);

        return {
          tag: el.tagName.toLowerCase(),
          className: typeof el.className === "string" ? el.className.slice(0, 240) : "",
          id: el.id || "",
          text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          position: style.position,
          display: style.display,
          overflowX: style.overflowX
        };
      })
      .filter((item) => item.right > viewportWidth + 2 || item.left < -2)
      .sort((a, b) => Math.abs(b.right - viewportWidth) - Math.abs(a.right - viewportWidth))
      .slice(0, 20);

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
