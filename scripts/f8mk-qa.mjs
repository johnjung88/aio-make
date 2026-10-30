import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/AIO-PC2/00-admin/tools/rea-agents/6.7.0/node_modules/playwright-core");
const phase = process.argv[2];
assert.ok(["before", "after"].includes(phase));
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F8/mk";
await fs.mkdir(`${root}/${phase}`, { recursive: true });
const targets = {
  home: {
    path: "/marketing",
    regions: {
      "FU-01-services": "#services",
      "FU-01-touchpoints": "section:has(#touchpoints-title)",
    },
  },
  integrated: {
    path: "/marketing/services/integrated",
    regions: {
      "FU-02-10": "#deliverables",
      "FU-02-10-first": "#deliverables figure:first-child .mk-artwork",
      "FU-02-10-third": "#deliverables figure:last-child .mk-artwork",
    },
  },
  sns: {
    path: "/marketing/services/sns",
    regions: {
      "FU-03": "#signature",
      "F7-07": '.mk-service-grid-three [data-service="integrated"]',
    },
  },
  ai: {
    path: "/marketing/services/ai-influencer",
    regions: { "FU-04-ai": 'p.mk-note:has(a[href*="ai-influencer"])' },
  },
  seo: {
    path: "/marketing/services/seo",
    regions: {
      "FU-05": "#signature",
      "FU-04-seo": 'p.mk-note:has(a[href*="website"])',
    },
  },
};
const focus = process.argv.includes("--focus");
if (focus) {
  for (const name of Object.keys(targets)) {
    if (!["sns", "seo"].includes(name)) delete targets[name];
  }
  targets.sns.regions = { "FU-03": "#signature" };
  targets.seo.regions = { "FU-05": "#signature" };
}
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
  let errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [1440, 1280, 1170, 1024, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const [name, target] of Object.entries(targets)) {
      errors = [];
      const response = await page.goto(`http://127.0.0.1:3148${target.path}`, {
        waitUntil: "networkidle",
      });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map(async (im) => {
            im.loading = "eager";
            await im.decode();
          }),
        );
      });
      const metrics = await page.evaluate(() => {
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
          sources,
          duplicates: sources.filter((s, i) => sources.indexOf(s) < i),
          broken: [...document.images].filter((im) => !im.naturalWidth).length,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
        };
      });
      const row = {
        name,
        width,
        status: response.status(),
        errors: [...errors],
        ...metrics,
        regions: [],
      };
      for (const [id, selector] of Object.entries(target.regions)) {
        const locator = page.locator(selector);
        const file = `${id}-${width}.png`;
        await locator.screenshot({
          path: `${root}/${phase}/${file}`,
          style:
            ".mk-header, .aio-scroll-top, .skip-link { visibility: hidden !important; }",
        });
        row.regions.push({ id, file, box: await locator.boundingBox() });
      }
      assert.equal(row.status, 200);
      assert.deepEqual(errors, []);
      assert.equal(metrics.overflow, false);
      assert.equal(metrics.broken, 0);
      assert.deepEqual(metrics.duplicates, []);
      if (phase === "after") {
        if (name === "home")
          for (const selector of [
            "#services > .mk-caption",
            "section:has(#touchpoints-title) > .mk-caption",
          ])
            assert.equal(
              await page
                .locator(selector)
                .evaluate((el) => getComputedStyle(el).textAlign),
              "center",
            );
        if (name === "sns") {
          const texts = await page.locator(".mk-phone > div").allTextContents();
          assert.equal(new Set(texts).size, 3);
          assert.ok(
            decodeURIComponent(
              await page
                .locator('[data-service="integrated"] img')
                .getAttribute("src"),
            ).includes("f3a2-process-make"),
          );
          for (const material of [
            "스킨케어 제품",
            "필라테스 수업 공간",
            "반찬 세트",
            "카페 신메뉴",
          ]) {
            await page
              .getByRole("button", { name: material, exact: true })
              .click();
            assert.equal(
              new Set(await page.locator(".mk-phone > div").allTextContents())
                .size,
              3,
            );
          }
        }
        if (name === "ai" || name === "seo") {
          const link = page.locator(
            name === "ai"
              ? 'p.mk-note a[href*="ai-influencer"]'
              : 'p.mk-note a[href*="website"]',
          );
          assert.ok(
            (
              await link.evaluate(
                (el) => getComputedStyle(el).textDecorationLine,
              )
            ).includes("underline"),
          );
          assert.equal(await link.getAttribute("target"), "_blank");
        }
        if (name === "seo") {
          assert.equal(
            await page
              .getByRole("button", { name: "카페", exact: true })
              .getAttribute("aria-pressed"),
            "true",
          );
          assert.ok(
            (await page.locator(".mk-search-comparison").innerText()).includes(
              "귀리 라떼",
            ),
          );
          await page
            .getByRole("button", { name: "세무·법률", exact: true })
            .click();
          assert.ok(
            (await page.locator(".mk-search-comparison").innerText()).includes(
              "법인 기장 대행",
            ),
          );
          await page
            .getByRole("button", { name: "처음으로", exact: true })
            .click();
          assert.equal(
            await page
              .getByRole("button", { name: "카페", exact: true })
              .getAttribute("aria-pressed"),
            "true",
          );
        }
      }
      rows.push(row);
      console.log(phase, name, width, "pass");
    }
  }
  await fs.writeFile(
    `${root}/${phase}/${focus ? "results-focus" : "results"}.json`,
    JSON.stringify(rows, null, 2),
  );
} finally {
  await browser.close();
}
