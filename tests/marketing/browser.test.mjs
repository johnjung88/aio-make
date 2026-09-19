import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
const browser = await chromium.launch({
  executablePath: process.env.TEST_CHROME_PATH || "/opt/google/chrome/chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
page.setDefaultTimeout(120000);
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const base = "http://127.0.0.1:3319";
const output = new URL("../../docs/rebuild/screenshots/", import.meta.url)
  .pathname;
mkdirSync(output, { recursive: true });
await page.goto(base + "/ko/quote", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await page.getByLabel("업체명 *", { exact: true }).fill("브라우저 시험 매장");
await page.getByLabel("담당자명 *", { exact: true }).fill("시험 담당");
await page.getByLabel("이메일 *", { exact: true }).fill("local@example.com");
await page.getByLabel("전화번호 *", { exact: true }).fill("01000000000");
await page.getByLabel("업종 *", { exact: true }).fill("테스트");
await page.getByLabel("지역 *", { exact: true }).fill("로컬");
await page
  .getByLabel("상담 내용 *", { exact: true })
  .fill("외부 발송 없는 로컬 검증입니다.");
await page.getByLabel("개인정보 수집·이용에 동의합니다. *").check();
await page.getByRole("button", { name: "마케팅 상담 신청하기 ↗" }).click();
await page.getByRole("heading", { name: "상담이 접수되었습니다." }).waitFor();
console.log("PASS browser intake persisted");
const res = await context.request.post(base + "/api/admin/login", {
  form: { username: "local-review", password: "local-test-only-password" },
  maxRedirects: 0,
});
assert.equal(res.status(), 303);
await page.goto(base + "/admin/marketing-consultations", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await page
  .getByRole("button", { name: /브라우저 시험 매장/ })
  .first()
  .click();
await page.getByRole("heading", { name: "사람이 작성한 답변 초안" }).waitFor();
await page.getByLabel("제목", { exact: true }).fill("로컬 초안");
await page
  .getByLabel("본문", { exact: true })
  .fill("승인 전에 발송되지 않는 테스트 초안입니다.");
await page.getByRole("button", { name: "새 버전 저장·검토 요청" }).click();
await page.getByText(/v1 · draft · 로컬 초안/).waitFor();
console.log("PASS admin consultation and human draft");
await page.screenshot({
  path: output + "/admin-consultation.png",
  fullPage: true,
});
for (const direction of ["a", "b"])
  for (const screen of ["home", "marketing"])
    for (const viewport of [
      { width: 1440, height: 1000, name: "desktop" },
      { width: 390, height: 844, name: "mobile" },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(
        `${base}/admin/marketing-preview?direction=${direction}&page=${screen}`,
        { waitUntil: "networkidle", timeout: 120000 },
      );
      await page
        .locator(".m-site")
        .screenshot({
          path: `${output}/${direction}-${screen}-${viewport.name}.png`,
        });
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        "horizontal overflow",
      );
      console.log(`PASS ${direction} ${screen} ${viewport.name}`);
    }
await page.goto(base + "/ko/services/marketing", { waitUntil: "networkidle" });
await page.getByRole("cell", { name: "12개월", exact: true }).first().waitFor();
assert.equal(await page.locator("[hreflang]").count(), 0);
assert(!(await page.locator("body").innerText()).includes("5일 결과물 보장"));
await page.screenshot({
  path: output + "/marketing-mobile-public.png",
  fullPage: true,
});
assert.deepEqual(errors, []);
writeFileSync(
  output + "/browser-result.json",
  JSON.stringify({ passed: true, pageErrors: errors }, null, 2),
);
await browser.close();
console.log("PASS all browser checks");
