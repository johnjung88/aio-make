import fs from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/AIO-PC2/50-scratch/codex/261025/01_browser-check/node_modules/playwright");
const phase = process.argv[2] || "after";
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F7/lab/f7lab2";
await fs.mkdir(`${root}/${phase}`, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const onlyRoute = process.argv[3];
const results = onlyRoute
  ? JSON.parse(await fs.readFile(`${root}/${phase}/audit.json`, "utf8")).filter(
      (row) => row.route !== onlyRoute,
    )
  : [];
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  let errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [1440, 1280, 1170, 1024, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/lab",
      "/lab/services/website",
      "/lab/services/shopping-mall",
      "/lab/services/automation",
      "/lab/services/program",
      "/lab/insights",
      "/lab/references",
      "/content",
    ]) {
      if (onlyRoute && route !== onlyRoute) continue;
      errors = [];
      const response = await page.goto("http://127.0.0.1:3145" + route);
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
          scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 70));
        }
        await document.fonts.ready;
        scrollTo(0, 0);
      });
      await page.waitForTimeout(500);
      const data = await page.evaluate(() => {
        const media = [...document.querySelectorAll("main img,main video")].map(
          (e) => {
            const url = new URL(e.currentSrc || e.src, location.href);
            return url.searchParams.get("url") || url.pathname;
          },
        );
        return {
          scroll: document.documentElement.scrollWidth,
          broken: [...document.images]
            .filter((i) => !i.complete || !i.naturalWidth)
            .map((i) => i.src),
          media,
          duplicates: media.filter((s, i) => media.indexOf(s) !== i),
          clippedBoards: [
            ...document.querySelectorAll('[data-compact="true"]'),
          ].filter((board) =>
            [...board.querySelectorAll('[class*="boardRow"]')].some(
              (row) =>
                row.getBoundingClientRect().bottom >
                board.getBoundingClientRect().bottom + 1,
            ),
          ).length,
          h1: document.querySelectorAll("h1").length,
        };
      });
      const name = route.slice(1).replaceAll("/", "_");
      await page.screenshot({
        path: `${root}/${phase}/${name}_${width}.png`,
        fullPage: true,
      });
      if (route.includes("/services/"))
        await page.locator("#signature").screenshot({
          path: `${root}/${phase}/${name}_${width}_signature.png`,
        });
      results.push({
        route,
        width,
        status: response.status(),
        ...data,
        errors: [...errors],
      });
      console.log(
        phase,
        width,
        route,
        data.scroll,
        data.broken.length,
        errors.length,
      );
    }
  }
  await fs.writeFile(
    `${root}/${phase}/audit.json`,
    JSON.stringify(results, null, 2),
  );
} finally {
  await browser.close();
}
