import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/AIO-PC2/50-scratch/codex/261025/01_browser-check/node_modules/playwright");
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F7/lab";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const checks = [];
try {
  const page = await browser.newPage();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("http://127.0.0.1:3145/lab/services/automation");
    const sig = page.locator("#signature");
    assert.match(await sig.innerText(), /대조 완료 · 일치 9 · 확인 필요 3/);
    await sig.getByRole("button", { name: "확인 필요", exact: true }).click();
    assert.match(await sig.innerText(), /수량 없음/);
    await sig.getByLabel("규칙 바꾸기 · 주문번호 앞 # 자동 제거").check();
    assert.match(await sig.innerText(), /기본 시료 미리보기/);
    await sig.getByRole("button", { name: "대조 실행", exact: true }).click();
    assert.match(await sig.innerText(), /대조 완료 · 일치 10 · 확인 필요 2/);
    await sig.screenshot({ path: `${root}/automation_rules_${width}.png` });
    await sig.getByRole("button", { name: "처음으로", exact: true }).click();
    assert.match(await sig.innerText(), /대조 완료 · 일치 9 · 확인 필요 3/);
    checks.push({
      width,
      check: "automation initial, filter, normalize, run, reset",
      pass: true,
    });
    await page.goto("http://127.0.0.1:3145/lab/services/shopping-mall");
    await sig.getByRole("button", { name: "풀 세팅", exact: true }).click();
    await sig.getByRole("button", { name: "모바일", exact: true }).click();
    await sig.getByLabel("브랜드 이름").fill("시험 브랜드");
    await sig.getByLabel(/복사 ↔ 풀 세팅 비교/).fill("70");
    assert.match(await sig.innerText(), /풀 세팅 · 총 30만 원/);
    assert.match(await sig.innerText(), /풀 세팅 · 모바일/);
    const href = await sig
      .getByRole("link", { name: /이 내용으로 상담/ })
      .getAttribute("href");
    assert.equal(
      new URL(href, "http://localhost").searchParams.get("plan"),
      "full",
    );
    assert.match(
      new URL(href, "http://localhost").searchParams.get("message"),
      /시험 브랜드/,
    );
    await sig.screenshot({ path: `${root}/shop_full_${width}.png` });
    await sig.getByRole("button", { name: "처음으로", exact: true }).click();
    assert.match(await sig.innerText(), /단순 복사 · 총 15만 원/);
    checks.push({
      width,
      check: "shop full/mobile/brand/range/query/reset",
      pass: true,
    });
    await page.goto("http://127.0.0.1:3145/lab/services/program");
    await sig.getByRole("button", { name: "요청 등록", exact: true }).click();
    assert.equal(
      await page
        .getByPlaceholder("요청 제목")
        .evaluate((e) => e === document.activeElement),
      true,
    );
    await page.getByPlaceholder("요청 제목").fill("장비 확인");
    await sig.getByRole("button", { name: "요청 등록", exact: true }).click();
    assert.match(await sig.innerText(), /장비 확인/);
    checks.push({
      width,
      check: "program empty focus and registration",
      pass: true,
    });
    await page.goto("http://127.0.0.1:3145/lab/references");
    await page.getByRole("button", { name: "의료", exact: true }).click();
    assert.match(await page.getByRole("status").innerText(), /의료 · 2개/);
    if (width === 390) {
      const nav = page.getByRole("navigation", { name: "개발 전체 메뉴" });
      await nav.evaluate((e) => {
        e.scrollLeft = 0;
      });
      assert.equal(await nav.evaluate((e) => e.dataset.scrollEnd), "false");
      await nav.evaluate((e) => {
        e.scrollLeft = e.scrollWidth;
      });
      await page.waitForTimeout(100);
      assert.equal(await nav.evaluate((e) => e.dataset.scrollEnd), "true");
    }
    checks.push({
      width,
      check: "reference filter and mobile navigation fade",
      pass: true,
    });
  }
  await fs.writeFile(`${root}/flows.json`, JSON.stringify(checks, null, 2));
  console.log(checks);
} finally {
  await browser.close();
}
