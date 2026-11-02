import fs from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/AIO-PC2/00-admin/tools/rea-agents/6.7.0/node_modules/playwright-core");
const phase = process.argv[2] || "after";
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F6/mk";
await fs.mkdir(`${root}/${phase}`, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:/Users/aioma/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
});
const results = [];
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  await context.route("https://**/*", (r) => r.abort());
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [1440, 1280, 1170, 1024, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const route of [
      "/marketing",
      "/marketing/services/integrated",
      "/marketing/services/sns",
      "/marketing/services/ai-influencer",
      "/marketing/services/seo",
      "/about",
      "/content",
    ]) {
      const response = await page.goto(`http://127.0.0.1:3144${route}`, {
        waitUntil: "networkidle",
      });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map(async (im) => {
            im.loading = "eager";
            try {
              await im.decode();
            } catch {}
          }),
        );
      });
      const metric = await page.evaluate(() => {
        const main = document.querySelector("main") || document.body;
        const media = [...main.querySelectorAll("img,video")].map((el) => ({
          tag: el.tagName,
          src: (() => {
            const src =
              el.getAttribute("src") ||
              el.querySelector("source")?.getAttribute("src");
            return src?.startsWith("/_next/image")
              ? new URL(src, location.origin).searchParams.get("url")
              : src;
          })(),
        }));
        const duplicate = media.filter(
          (m, i) => media.findIndex((n) => n.src === m.src) < i,
        );
        const text = main.innerText;
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          broken: [...document.images]
            .filter((i) => !i.naturalWidth)
            .map((i) => i.src),
          media,
          duplicate,
          periods: text
            .split("\n")
            .filter((t) => /[가-힣][.!?]$/.test(t.trim())),
          internal: text.match(/Sonnet|Opus|W-F\d|GPT|Claude/g) || [],
        };
      });
      const name = route.slice(1).replaceAll("/", "_") + "_" + width;
      await page.screenshot({
        path: `${root}/${phase}/${name}.png`,
        fullPage: true,
      });
      results.push({
        route,
        width,
        status: response.status(),
        ...metric,
        errors: [...errors],
      });
      console.log(
        phase,
        name,
        metric.overflow ? "OVERFLOW" : "ok",
        `duplicate=${metric.duplicate.length}`,
      );
    }
  }
  await fs.writeFile(
    `${root}/${phase}/results.json`,
    JSON.stringify(results, null, 2),
  );
} finally {
  await browser.close();
}
