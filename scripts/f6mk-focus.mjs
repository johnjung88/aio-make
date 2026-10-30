import { createRequire } from "node:module";
import fs from "node:fs/promises";
import sharp from "sharp";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/AIO-PC2/00-admin/tools/rea-agents/6.7.0/node_modules/playwright-core");
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F6/mk";
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:/Users/aioma/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
});
const metrics = [];
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.route("https://**/*", (r) => r.abort());
  for (const width of [1440, 1280, 1170, 1024, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const [route, selector] of [
      ["/marketing", ".mk-home-hero"],
      ["/marketing/services/integrated", "#signature"],
      ["/marketing/services/sns", "#signature"],
      ["/marketing/services/ai-influencer", "#signature"],
      ["/marketing/services/seo", "#signature"],
      ["/about", ".rw-about-scope"],
    ]) {
      await page.goto("http://127.0.0.1:3144" + route, {
        waitUntil: "domcontentloaded",
      });
      await page.locator(selector).waitFor();
      const name = route.slice(1).replaceAll("/", "_") + "_" + width;
      const box = await page.locator(selector).boundingBox();
      const original = await sharp(`${root}/after/${name}.png`).metadata();
      await sharp(`${root}/after/${name}.png`)
        .extract({
          left: 0,
          top: Math.floor(box.y),
          width,
          height: Math.min(
            Math.ceil(box.height),
            original.height - Math.floor(box.y),
          ),
        })
        .png()
        .toFile(`${root}/review/focus_${name}.png`);
      const metric = await page.evaluate(() => {
        const main = document.querySelector("main");
        const visible = [
          ...main.querySelectorAll("p,small,li,a,button,label,legend"),
        ].filter((e) => e.checkVisibility() && e.textContent.trim());
        const text = main.innerText;
        return {
          small: visible
            .filter((e) => parseFloat(getComputedStyle(e).fontSize) < 14)
            .map((e) => ({
              text: e.innerText,
              size: getComputedStyle(e).fontSize,
            })),
          periods: text
            .split("\n")
            .filter((t) => /[\uac00-\ud7a3]\.$/.test(t.trim())),
          joined: text.match(/[\uac00-\ud7a3][.!?][\uac00-\ud7a3]/g) || [],
          literalNewlines: text.includes("\\n"),
          internal: text.match(/Sonnet|Opus|Claude|W-F\d/g) || [],
        };
      });
      metrics.push({ route, width, ...metric });
    }
    for (const target of [
      "marketing",
      "marketing_services_integrated",
      "marketing_services_sns",
      "marketing_services_ai-influencer",
      "marketing_services_seo",
      "about",
    ]) {
      const content = await sharp(`${root}/after/content_${width}.png`)
        .extract({ left: 0, top: 0, width, height: 1600 })
        .png()
        .toBuffer();
      const comparison = await sharp(`${root}/after/${target}_${width}.png`)
        .extract({ left: 0, top: 0, width, height: 1600 })
        .png()
        .toBuffer();
      await sharp({
        create: {
          width: width * 2,
          height: 1600,
          channels: 3,
          background: "#080808",
        },
      })
        .composite([
          { input: content, left: 0, top: 0 },
          { input: comparison, left: width, top: 0 },
        ])
        .jpeg({ quality: 85 })
        .toFile(`${root}/review/content_${target}_${width}.jpg`);
    }
  }
  await fs.writeFile(
    `${root}/typography.json`,
    JSON.stringify(metrics, null, 2),
  );
  console.log("PASS typography and 30 reference comparisons");
} finally {
  await browser.close();
}
