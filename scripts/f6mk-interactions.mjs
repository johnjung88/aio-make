import { createRequire } from "node:module";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/AIO-PC2/00-admin/tools/rea-agents/6.7.0/node_modules/playwright-core");
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:/Users/aioma/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
});
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F6/mk";
const results = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await page.route("https://**/*", (r) => r.abort());
  const visit = async (route) => {
    await page.goto("http://127.0.0.1:3144" + route, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(300);
  };
  const record = async (label) => {
    const metric = await page.evaluate(() => {
      const main = document.querySelector("main");
      const sources = [...main.querySelectorAll("img,video")].map((el) => {
        const s = el.getAttribute("src");
        return s?.startsWith("/_next/image")
          ? new URL(s, location.origin).searchParams.get("url")
          : s;
      });
      return {
        sources,
        duplicates: sources.filter((s, i) => sources.indexOf(s) !== i),
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    assert.equal(metric.duplicates.length, 0, label + " duplicate media");
    assert.equal(metric.overflow, false);
    results.push({ label, ...metric });
  };
  await visit("/marketing");
  for (const [i, label] of ["01 노출", "02 유입", "03 문의"].entries()) {
    await page.getByRole("button", { name: label, exact: true }).click();
    assert.equal(
      await page.locator(".mk-home-hero").getAttribute("data-stage"),
      String(i),
    );
    await record(label);
  }
  await visit("/marketing/services/integrated");
  assert.equal(
    await page.locator(".mk-week-total").first().innerText(),
    "5채널 합산 25건",
  );
  await page
    .getByRole("spinbutton", { name: "인스타그램 게시 건수", exact: true })
    .fill("40");
  assert.match(
    await page.locator(".mk-week-total").first().innerText(),
    /30건/,
  );
  assert.equal(
    await page.locator("#signature-result > a.mk-primary").count(),
    0,
  );
  await page
    .getByRole("button", { name: "고르게 나누기", exact: true })
    .click();
  await page.locator(".mk-source-details summary").click();
  await record("integrated expanded originals");
  const href = await page
    .locator("#signature-result > a.mk-primary")
    .getAttribute("href");
  assert.match(href, /plan=channels/);
  assert.match(href, /message=/);
  await visit("/marketing/services/ai-influencer");
  for (const name of [
    "브랜드 안내자",
    "사용법을 알려주는 사람",
    "일상을 보여주는 크리에이터",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    assert.equal(await page.locator(".mk-persona h3").innerText(), name);
    await record("persona " + name);
  }
  await visit("/marketing/services/sns");
  for (const name of [
    "카페 신메뉴",
    "스킨케어 제품",
    "필라테스 수업 공간",
    "반찬 세트",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    await record("sns " + name);
  }
  await visit("/marketing/services/seo");
  assert.equal(
    await page.getByRole("button", { name: "정리 후", exact: true }).count(),
    0,
  );
  assert.equal(
    await page.locator(".mk-search-comparison article:visible").count(),
    2,
  );
  await page
    .getByRole("button", { name: "페이지 제목과 설명", exact: true })
    .click();
  assert.equal(await page.locator(".mk-applied-items li").count(), 4);
  await record("seo toggle");
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.locator(".mk-search-comparison article:visible").count(),
    2,
  );
  await record("seo mobile both comparisons");
  await visit("/about");
  for (const name of ["개발", "마케팅", "컨텐츠"]) {
    await page
      .locator(".rw-scope-choices")
      .getByRole("button", { name, exact: true })
      .click();
    assert.match(
      await page.locator("#rw-scope-result h3").innerText(),
      new RegExp(name),
    );
  }
  await record("about mobile scope");
  await fs.writeFile(
    `${root}/interactions.json`,
    JSON.stringify(results, null, 2),
  );
  console.log(
    "PASS",
    results.length,
    "states; inquiry link checked without submission",
  );
} finally {
  await browser.close();
}
