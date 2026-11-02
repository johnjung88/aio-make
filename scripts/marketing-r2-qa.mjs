import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import sharp from "sharp";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/AIO-PC2/00-admin/tools/rea-agents/6.7.0/node_modules/playwright-core");
const output = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_RW2/r2";
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:/Users/aioma/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
});
const results = { pages: [], stages: [], errors: [] };
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  await context.route("https://**/*", (r) => r.abort());
  const page = await context.newPage();
  page.on("pageerror", (e) => results.errors.push(e.message));
  for (const width of [1440, 390]) {
    const height = width === 390 ? 844 : 1000;
    await page.setViewportSize({ width, height });
    for (const route of [
      "/marketing",
      ...["integrated", "sns", "ai-influencer", "seo"].map(
        (id) => `/marketing/services/${id}`,
      ),
      "/content",
    ]) {
      const response = await page.goto("http://127.0.0.1:3117" + route, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200);
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
      const name = route.replaceAll("/", "_").slice(1) + "_" + width;
      const metric = await page.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        broken: [...document.images]
          .filter((im) => im.naturalWidth === 0)
          .map((im) => im.src),
      }));
      assert.ok(metric.scrollWidth <= width + 1, name + " overflow");
      assert.equal(metric.broken.length, 0, name + " images");
      if (route !== "/content") {
        for (const picture of await page.locator(".mk-picture").all()) {
          const source = await picture
            .locator("img")
            .evaluate((im) => im.currentSrc);
          assert.ok(
            source.includes("rw2r"),
            "Updated image version: " + source,
          );
        }
        const picture = page.locator(
          route === "/marketing"
            ? ".mk-channel-ribbon .mk-picture"
            : ".mk-hero-image .mk-picture",
        );
        const pixels = await sharp(await picture.screenshot())
          .removeAlpha()
          .raw()
          .toBuffer();
        assert.ok(
          pixels[0] < 70 && pixels[1] < 70 && pixels[2] < 70,
          name + " dark outer surface",
        );
        metric.darkSurface = true;
        await page.evaluate(() => scrollTo(0, 0));
      }
      await page.screenshot({ path: path.join(output, name + "_first.png") });
      if (route === "/marketing") {
        const top = await page
          .locator(".mk-channel-ribbon")
          .evaluate((el) => el.getBoundingClientRect().top);
        assert.ok(
          top + 110 < height,
          "Cards must appear above the fold: " + top,
        );
        metric.ribbonTop = top;
        const transforms = [];
        for (const [index, label] of [
          "01 노출",
          "02 유입",
          "03 문의",
        ].entries()) {
          await page.getByRole("button", { name: label, exact: true }).click();
          assert.equal(
            await page
              .getByRole("button", { name: label, exact: true })
              .getAttribute("aria-pressed"),
            "true",
          );
          transforms.push(
            await page
              .locator(".mk-channel-ribbon .mk-picture")
              .evaluate((el) => getComputedStyle(el).transform),
          );
          await page.locator(".mk-home-hero").screenshot({
            path: path.join(output, `${name}_stage${index}.png`),
          });
        }
        assert.equal(new Set(transforms).size, 3);
        results.stages.push({ width, transforms });
        await page
          .locator("section:has(#touchpoints-title)")
          .screenshot({ path: path.join(output, name + "_touchpoints.png") });
      } else if (route.includes("/services/")) {
        for (const section of [".mk-hero-image", "#deliverables"])
          await page.locator(section).screenshot({
            path: path.join(
              output,
              name + "_" + section.replace(/[.#]/g, "") + ".png",
            ),
          });
      }
      results.pages.push({ route, ...metric });
    }
    const left = await sharp(path.join(output, `content_${width}_first.png`))
      .resize(600)
      .toBuffer();
    const right = await sharp(path.join(output, `marketing_${width}_first.png`))
      .resize(600)
      .toBuffer();
    const meta = await sharp(left).metadata();
    await sharp({
      create: {
        width: 1200,
        height: meta.height,
        channels: 3,
        background: "#141414",
      },
    })
      .composite([
        { input: left, left: 0, top: 0 },
        { input: right, left: 600, top: 0 },
      ])
      .png()
      .toFile(path.join(output, `compare_content_marketing_${width}.png`));
  }
  assert.deepEqual(results.errors, []);
  results.status = "pass";
} finally {
  await fs.writeFile(
    path.join(output, "browser-results.json"),
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
console.log(JSON.stringify(results, null, 2));
