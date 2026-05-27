import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const routes = [
  "/",
  "/matches/2026-06-11-mexico-vs-south-africa-1489369",
  "/matches/2026-06-13-brazil-vs-morocco-1489371",
  "/fixtures",
  "/groups"
];

const browser = await chromium.launch();

for (const route of routes) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 }
  });

  const consoleErrors = [];
  const consoleWarnings = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
    if (message.type() === "warning") consoleWarnings.push(message.text());
  });

  const url = `${baseUrl}${route}`;

  try {
    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 45000
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

    console.log(`\n=== ${route} ===`);
    console.log(`status: ${status}`);
    console.log(`title: ${title}`);
    console.log(`overflow: ${layout.hasHorizontalOverflow} document=${layout.documentWidth} viewport=${layout.viewportWidth}`);

    if (/internal server error/i.test(bodyText)) {
      console.log("BODY ISSUE: Internal Server Error text visible");
    }

    if (/application error/i.test(bodyText)) {
      console.log("BODY ISSUE: Application Error text visible");
    }

    console.log(`console errors: ${consoleErrors.length}`);
    consoleErrors.slice(0, 5).forEach((error, index) => {
      console.log(`ERROR ${index + 1}: ${error.slice(0, 500)}`);
    });

    console.log(`console warnings: ${consoleWarnings.length}`);
    consoleWarnings.slice(0, 5).forEach((warning, index) => {
      console.log(`WARNING ${index + 1}: ${warning.slice(0, 500)}`);
    });
  } catch (error) {
    console.log(`\n=== ${route} ===`);
    console.log(`SCRIPT ERROR: ${error.message}`);
  }

  await page.close();
}

await browser.close();
