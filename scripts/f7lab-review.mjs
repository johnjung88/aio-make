import fs from "node:fs/promises";
import sharp from "sharp";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/AIO-PC2/50-scratch/codex/261025/01_browser-check/node_modules/playwright");
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F7/lab";
await fs.mkdir(`${root}/review`, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("https://aio-make.com/content", {
      waitUntil: "networkidle",
    });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 70));
      }
      await document.fonts.ready;
      scrollTo(0, 0);
    });
    await page.screenshot({
      path: `${root}/content_live_${width}.png`,
      fullPage: true,
    });
  }
} finally {
  await browser.close();
}
const routes = [
  "lab",
  "lab_services_website",
  "lab_services_shopping-mall",
  "lab_services_automation",
  "lab_services_program",
  "lab_insights",
  "lab_references",
];
for (const route of routes) {
  const strips = [];
  for (const width of [1440, 1280, 1170, 1024, 390]) {
    const before = await sharp(`${root}/before/${route}_${width}.png`)
      .resize({ width: 240 })
      .toBuffer();
    const after = await sharp(`${root}/after/${route}_${width}.png`)
      .resize({ width: 240 })
      .toBuffer();
    strips.push({ input: before, left: strips.length * 240, top: 32 });
    strips.push({ input: after, left: strips.length * 240, top: 32 });
  }
  const maxHeight = Math.max(
    ...(await Promise.all(
      strips.map(async (s) => (await sharp(s.input).metadata()).height),
    )),
  );
  await sharp({
    create: {
      width: 2400,
      height: maxHeight + 32,
      channels: 3,
      background: "#202020",
    },
  })
    .composite(strips)
    .jpeg({ quality: 85 })
    .toFile(`${root}/review/${route}_five_widths.jpg`);
  for (const width of [1440, 390]) {
    for (const y of [0, 1800]) {
      const parts = [];
      for (const file of [
        `${root}/content_live_${width}.png`,
        `${root}/after/${route}_${width}.png`,
      ]) {
        const m = await sharp(file).metadata();
        parts.push(
          await sharp(file)
            .extract({
              left: 0,
              top: Math.min(y, m.height - 1),
              width,
              height: Math.min(1800, m.height - Math.min(y, m.height - 1)),
            })
            .resize({ width: 500 })
            .extend({
              bottom: Math.max(
                0,
                Math.round((1800 * 500) / width) -
                  Math.round(
                    (Math.min(1800, m.height - Math.min(y, m.height - 1)) *
                      500) /
                      width,
                  ),
              ),
              background: "#080808",
            })
            .toBuffer(),
        );
      }
      const h = Math.max(
        ...(await Promise.all(
          parts.map(async (b) => (await sharp(b).metadata()).height),
        )),
      );
      await sharp({
        create: { width: 1000, height: h, channels: 3, background: "#080808" },
      })
        .composite(parts.map((input, i) => ({ input, left: i * 500, top: 0 })))
        .jpeg({ quality: 85 })
        .toFile(`${root}/review/${route}_content_${width}_${y}.jpg`);
    }
  }
}
console.log("review sheets and live content comparisons complete");
