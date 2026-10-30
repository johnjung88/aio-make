import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/AIO-PC2/00-admin/tools/rea-agents/6.7.0/node_modules/playwright-core");
const phase = process.argv[2];
assert.ok(["before", "after"].includes(phase));
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F7/mk/r2";
await fs.mkdir(`${root}/${phase}`, { recursive: true });
const expected = {
  integrated: "f3a2-process-review",
  sns: "f3a2-process-plan",
  "ai-influencer": "f3a2-process-brief",
};
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:/Users/aioma/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
});
const rows = [];
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  await context.route("https://**/*", (r) => r.abort());
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [1440, 1280, 1170, 1024, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const [service, cut] of Object.entries(expected)) {
      const response = await page.goto(
        `http://127.0.0.1:3146/marketing/services/${service}`,
        { waitUntil: "networkidle" },
      );
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map(async (im) => {
            im.loading = "eager";
            await im.decode();
          }),
        );
      });
      const metric = await page.evaluate(() => {
        const sources = [
          ...document.querySelectorAll("main img, main video"),
        ].map((el) => {
          const src =
            el.getAttribute("src") ||
            el.querySelector("source")?.getAttribute("src");
          return src?.startsWith("/_next/image")
            ? new URL(src, location.origin).searchParams.get("url")
            : src;
        });
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          broken: [...document.images].filter((im) => !im.naturalWidth).length,
          sources,
          duplicates: sources.filter((src, i) => sources.indexOf(src) < i),
        };
      });
      const card = page.locator('.mk-service-grid-three [data-service="seo"]');
      const src = await card.locator("img").getAttribute("src");
      const label = await card.locator(".mk-publication-label").innerText();
      const prefix = `${root}/${phase}/${service}-${width}`;
      await page.screenshot({ path: `${prefix}-full.png`, fullPage: true });
      await card.screenshot({ path: `${prefix}-seo.png` });
      rows.push({
        service,
        width,
        status: response.status(),
        src,
        label,
        errors: [...errors],
        ...metric,
      });
      assert.equal(response.status(), 200);
      assert.equal(metric.overflow, false);
      assert.equal(metric.broken, 0);
      assert.deepEqual(metric.duplicates, []);
      assert.deepEqual(errors, []);
      assert.equal(label, "SEARCH & ANSWER");
      if (phase === "after")
        assert.ok(
          decodeURIComponent(src).includes(`/marketing-renewal/${cut}.webp`),
        );
      console.log(phase, service, width, "pass");
    }
  }
  await fs.writeFile(
    `${root}/${phase}/results.json`,
    JSON.stringify(rows, null, 2),
  );
} finally {
  await browser.close();
}
