import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const widths = [360, 375, 390, 414, 430];

async function discoverRoutes() {
  const required = [
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

  try {
    const response = await fetch(`${baseUrl}/sitemap.xml`);
    if (response.ok) {
      const xml = await response.text();
      const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
        .map((match) => {
          try {
            return new URL(match[1]).pathname;
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const player = paths.find((path) => path.startsWith("/players/"));
      const england = paths.find((path) => path.startsWith("/teams/") && /england/i.test(path));
      const longTeam = paths
        .filter((path) => path.startsWith("/teams/"))
        .sort((a, b) => b.length - a.length)[0];

      if (player) required.splice(required.indexOf("/top-scorers"), 0, player);
      if (england && !required.includes(england)) required.push(england);
      if (longTeam && !required.includes(longTeam)) required.push(longTeam);
    }
  } catch {}

  return [...new Set(required)];
}

function expectedStatus(route) {
  return route === "/not-a-real-page" ? 404 : 200;
}

const browser = await chromium.launch();
const failures = [];
const routes = await discoverRoutes();

for (const route of routes) {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 920 },
      deviceScaleFactor: 1,
      isMobile: true
    });

    try {
      const response = await page.goto(`${baseUrl}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 45000
      });

      await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

      const status = response?.status() ?? 0;

      const result = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        const doc = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(doc.scrollWidth, body ? body.scrollWidth : 0);
        const innerWidth = window.innerWidth;

        const offenders = [...document.querySelectorAll("body *")]
          .map((el) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);

            return {
              tag: el.tagName.toLowerCase(),
              className: typeof el.className === "string" ? el.className.slice(0, 220) : "",
              text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120),
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
          .slice(0, 15);

        const tableProblems = [...document.querySelectorAll("table")]
          .map((table) => {
            const rect = table.getBoundingClientRect();
            const parent = table.parentElement;
            const parentStyle = parent ? window.getComputedStyle(parent) : null;

            return {
              width: Math.round(rect.width),
              right: Math.round(rect.right),
              parentTag: parent?.tagName?.toLowerCase() || "",
              parentClassName: typeof parent?.className === "string" ? parent.className.slice(0, 160) : "",
              parentOverflowX: parentStyle?.overflowX || ""
            };
          })
          .filter((item) => item.right > viewportWidth + 1 && !["auto", "scroll"].includes(item.parentOverflowX));

        const stickyProblems = [...document.querySelectorAll("[data-sticky-nav], nav.sticky")]
          .map((nav) => {
            const rect = nav.getBoundingClientRect();
            return {
              className: typeof nav.className === "string" ? nav.className.slice(0, 180) : "",
              width: Math.round(rect.width),
              left: Math.round(rect.left),
              right: Math.round(rect.right)
            };
          })
          .filter((item) => item.right > viewportWidth + 1 || item.left < -1);

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
          scrollWidth,
          innerWidth,
          hasOverflow: scrollWidth > innerWidth + 1,
          offenders,
          tableProblems,
          stickyProblems,
          countdownOverlap
        };
      });

      const wanted = expectedStatus(route);

      if (status !== wanted) {
        failures.push(`${route} ${width}px status ${status}, expected ${wanted}`);
      }

      if (result.hasOverflow) {
        failures.push(
          `${route} ${width}px overflow scrollWidth=${result.scrollWidth} innerWidth=${result.innerWidth} offenders=${JSON.stringify(result.offenders)}`
        );
      }

      if (result.tableProblems.length > 0) {
        failures.push(`${route} ${width}px table not contained ${JSON.stringify(result.tableProblems)}`);
      }

      if (result.stickyProblems.length > 0) {
        failures.push(`${route} ${width}px sticky nav overflow ${JSON.stringify(result.stickyProblems)}`);
      }

      if (route === "/" && result.countdownOverlap) {
        failures.push(`${route} ${width}px homepage countdown text overlaps timer grid`);
      }

      if (
        status === wanted &&
        !result.hasOverflow &&
        result.tableProblems.length === 0 &&
        result.stickyProblems.length === 0 &&
        !(route === "/" && result.countdownOverlap)
      ) {
        console.log(`PASS ${width}px ${route}`);
      } else {
        console.log(`FAIL ${width}px ${route}`);
      }
    } catch (error) {
      failures.push(`${route} ${width}px failed: ${error.message}`);
      console.log(`FAIL ${width}px ${route}: ${error.message}`);
    }

    await page.close();
  }
}

await browser.close();

if (failures.length > 0) {
  console.log("\nSTRICT MOBILE QA FAILURES:");
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
  process.exit(1);
}

console.log("\nPASS: no page-level mobile overflow, table containment, sticky-nav overflow, or countdown overlap found.");
