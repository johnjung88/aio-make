// 카페24 디자인 18개 스크린샷 자동 캡처
import { chromium } from "@playwright/test";
import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { extname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { mkdir } from "fs/promises";

const CAFE24_BASE = "C:/Users/PC/OneDrive/Desktop/솔로프리너/1_플랫폼관리/카페24";
const OUT_DIR = resolve("public/portfolio/shopping-mall");

const DESIGNS = [
  { code: "d01", cat: "01_solopreneur",  dir: "D01_minimal_mono" },
  { code: "d02", cat: "01_solopreneur",  dir: "D02_soft_pastel" },
  { code: "d03", cat: "01_solopreneur",  dir: "D03_bold_modern" },
  { code: "d04", cat: "02_food_health",  dir: "D04_natural_forest" },
  { code: "d05", cat: "02_food_health",  dir: "D05_warm_bakery" },
  { code: "d06", cat: "02_food_health",  dir: "D06_premium_dark" },
  { code: "d07", cat: "03_live_commerce",dir: "D07_live_pulse" },
  { code: "d08", cat: "03_live_commerce",dir: "D08_studio_bright" },
  { code: "d09", cat: "03_live_commerce",dir: "D09_trendy_pop" },
  { code: "d10", cat: "04_pet",          dir: "D10_cozy_pet" },
  { code: "d11", cat: "04_pet",          dir: "D11_premium_pet_maison" },
  { code: "d12", cat: "04_pet",          dir: "D12_active_outdoor" },
  { code: "d13", cat: "05_home_interior",dir: "D13_neo_deco" },
  { code: "d14", cat: "05_home_interior",dir: "D14_butter_yellow" },
  { code: "d15", cat: "05_home_interior",dir: "D15_cool_blue" },
  { code: "d16", cat: "06_beauty",       dir: "D16_kbeauty_chrome" },
  { code: "d17", cat: "06_beauty",       dir: "D17_persimmon_pop" },
  { code: "d18", cat: "06_beauty",       dir: "D18_plum_noir" },
];

const MIME = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2":"font/woff2",
  ".woff": "font/woff",
  ".ttf":  "font/ttf",
};

function startServer(rootDir, port) {
  const server = createServer((req, res) => {
    const safePath = req.url.split("?")[0];
    const filePath = join(rootDir, decodeURIComponent(safePath));
    if (!existsSync(filePath)) { res.writeHead(404); res.end(); return; }
    const ext = extname(filePath).toLowerCase();
    const ct = MIME[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": ct });
    res.end(readFileSync(filePath));
  });
  return new Promise((r) => server.listen(port, "127.0.0.1", () => r(server)));
}

(async () => {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const d of DESIGNS) {
    const designDir = `${CAFE24_BASE}/${d.cat}/${d.dir}/v2`;
    const server = await startServer(designDir, 0);
    const port = server.address().port;
    const url = `http://127.0.0.1:${port}/index.html`;

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(800);
      const outPath = `${OUT_DIR}/${d.code}.jpg`;
      await page.screenshot({ path: outPath, type: "jpeg", quality: 88, clip: { x: 0, y: 0, width: 1280, height: 900 } });
      console.log(`✓ ${d.code} → ${d.code}.jpg`);
    } catch (e) {
      console.error(`✗ ${d.code}: ${e.message}`);
    } finally {
      await new Promise((r) => server.close(r));
    }
  }

  await browser.close();
  console.log("\n완료! public/portfolio/shopping-mall/ 에 저장됨");
})();
