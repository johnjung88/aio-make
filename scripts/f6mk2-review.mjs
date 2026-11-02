import fs from "node:fs/promises";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import sharp from "sharp";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/AIO-PC2/00-admin/tools/rea-agents/6.7.0/node_modules/playwright-core");
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F6/mk";
const browser = await chromium.launch({ headless: true, executablePath: "C:/Users/aioma/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe" });
const results = [];
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.route("https://**/*", r => r.abort());
  for (const width of [1440, 1280, 1170, 1024, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const [route, selector, id] of [
      ["/marketing", ".mk-home-hero", "home"],
      ["/marketing/services/ai-influencer", ".mk-persona", "persona"],
      ["/marketing/services/seo", ".mk-detail-hero", "seo"],
    ]) {
      await page.goto(`http://127.0.0.1:3144${route}`, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map(async im => { im.loading = "eager"; await im.decode().catch(() => {}); }));
      });
      const metric = await page.evaluate(id => {
        const x = selector => document.querySelector(selector).getBoundingClientRect().x;
        return id === "home" ? {
          copyX: x(".mk-home-hero h1"), tabX: x(".mk-journey button"), captionX: x(".mk-home-hero .mk-caption"),
        } : id === "persona" ? {
          guideRows: document.querySelectorAll(".mk-persona-guide > div").length,
          imageWidth: document.querySelector(".mk-persona > img").getBoundingClientRect().width,
          guideWidth: document.querySelector(".mk-persona-guide").getBoundingClientRect().width,
        } : { photo: document.querySelector(".mk-seo-hero-result img").getAttribute("src") };
      }, id);
      if (id === "home") {
        assert.ok(Math.abs(metric.copyX - metric.tabX) < 1);
        assert.ok(Math.abs(metric.copyX - metric.captionX) < 1);
      } else if (id === "persona") assert.equal(metric.guideRows, 3);
      else assert.ok(metric.photo.includes("feed-0"));
      const box = await page.locator(selector).boundingBox();
      const name = `${route.slice(1).replaceAll("/", "_")}_${width}.png`;
      await sharp(`${root}/after/${name}`).extract({
        left: Math.floor(box.x), top: Math.floor(box.y),
        width: Math.floor(box.width), height: Math.floor(box.height),
      }).png().toFile(`${root}/review/mk2_${id}_${width}.png`);
      if (id === "persona") {
        await page.getByRole("button", { name: "차분하게", exact: true }).click();
        assert.equal(await page.locator(".mk-persona-guide dd").nth(1).innerText(), "차분하게");
        assert.match(await page.locator(".mk-persona-quote").innerText(), /먼저 제품 정보/);
      }
      results.push({ route, width, ...metric, pass: true });
    }
  }
  const before = JSON.parse(await fs.readFile(`${root}/before/results.json`));
  const after = JSON.parse(await fs.readFile(`${root}/after/results.json`));
  for (const row of after) {
    assert.equal(row.status, 200);
    assert.equal(row.overflow, false);
    assert.equal(row.broken.length, 0);
    assert.equal(row.errors.length, 0);
    if (row.route !== "/content") assert.equal(row.duplicate.length, 0);
    if (row.route === "/content") {
      const baseline = before.find(r => r.route === row.route && r.width === row.width);
      assert.deepEqual(row.media, baseline.media);
    }
  }
  console.log("SEO before media", before.find(r => r.route.endsWith("/seo") && r.width === 1440).media);
  await fs.writeFile(`${root}/mk2-review.json`, JSON.stringify(results, null, 2));
  console.log("PASS 15 review regions, aligned tabs, persona tone update, matching SEO photo, full-page media and unchanged content media");
} finally { await browser.close(); }
