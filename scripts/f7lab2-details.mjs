import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/AIO-PC2/50-scratch/codex/261025/01_browser-check/node_modules/playwright");
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F7/lab/f7lab2";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const results = [];
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  for (const width of [1440, 1280, 1170, 1024, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const service of [
      "website",
      "shopping-mall",
      "automation",
      "program",
    ]) {
      await page.goto(`http://127.0.0.1:3145/lab/services/${service}`);
      await page.evaluate(() => document.fonts.ready);
      const related = page.locator('section[aria-labelledby="related-title"]');
      await related.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await related.screenshot({
        path: `${root}/after/related_${service}_${width}.png`,
      });
      const heights = await related
        .locator('[class*="visual"]')
        .evaluateAll((es) => es.map((e) => e.getBoundingClientRect().height));
      if (width > 900)
        assert.ok(
          Math.max(...heights) - Math.min(...heights) < 2,
          `${service} related visual heights: ${heights}`,
        );
      if (["automation", "program"].includes(service)) {
        const price = page.locator('[class*="customPrice"]');
        const labels = await price.locator("li strong").evaluateAll((es) =>
          es.map((e) => ({
            font: getComputedStyle(e).fontSize,
            y: e.getBoundingClientRect().y,
            valueY: e.nextElementSibling.getBoundingClientRect().y,
          })),
        );
        assert.ok(
          labels.every(
            (e) => e.font === "14px" && Math.abs(e.y - e.valueY) < 1,
          ),
        );
        await price.screenshot({
          path: `${root}/after/price_${service}_${width}.png`,
        });
        results.push({ width, service, labels, heights });
      } else results.push({ width, service, heights });
    }
    await page.goto("http://127.0.0.1:3145/lab/insights");
    assert.equal(await page.locator(".cs-insight-card").count(), 4);
    if (width > 900) {
      const columns = await page
        .locator(".cs-insight-list")
        .evaluate(
          (e) => getComputedStyle(e).gridTemplateColumns.split(" ").length,
        );
      assert.equal(columns, 3);
    }
    await page
      .locator(".cs-insight-list")
      .screenshot({ path: `${root}/after/insight_cards_${width}.png` });
    await page.goto("http://127.0.0.1:3145/lab/insights/program-roles");
    assert.equal(
      await page.locator("h1").innerText(),
      "업무 프로그램의 사용자와 권한 정리하기",
    );
    await page.screenshot({
      path: `${root}/after/program_article_${width}.png`,
      fullPage: true,
    });
    if (width === 390) {
      await page.goto("http://127.0.0.1:3145/lab/services/program");
      const nav = page.getByRole("navigation", { name: "개발 전체 메뉴" });
      const masks = [];
      for (const [name, ratio] of [
        ["start", 0],
        ["middle", 0.5],
        ["end", 1],
      ]) {
        await nav.evaluate((e, r) => {
          e.scrollLeft = (e.scrollWidth - e.clientWidth) * r;
        }, ratio);
        await page.waitForTimeout(150);
        masks.push(
          await nav.evaluate((e) => ({
            start: e.dataset.scrollStart,
            end: e.dataset.scrollEnd,
            mask: getComputedStyle(e).maskImage,
          })),
        );
        await page
          .locator(".cs-header-v15")
          .screenshot({ path: `${root}/after/menu_${name}.png` });
      }
      assert.equal(new Set(masks.map((e) => e.mask)).size, 3);
      assert.equal(masks[0].start, "true");
      assert.equal(masks[2].end, "true");
      results.push({ check: "menu computed masks", masks });
    }
  }
  await fs.writeFile(`${root}/details.json`, JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
