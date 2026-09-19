import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: process.env.TEST_CHROME_PATH || "/opt/google/chrome/chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
const url = "http://127.0.0.1:3319/ko/quote";
let savedId,
  firstKey,
  secondKey,
  calls = 0;
await page.route("**/api/quote", async (route) => {
  const payload = route.request().postDataJSON();
  calls++;
  if (calls === 1) {
    firstKey = payload.idempotencyKey;
    const result = await route.fetch();
    assert.equal(result.status(), 201);
    savedId = (await result.json()).data.quoteId;
    await route.abort("failed");
  } else {
    secondKey = payload.idempotencyKey;
    await route.continue();
  }
});
async function fill() {
  for (const [label, value] of [
    ["업체명 *", "응답 유실 시험"],
    ["담당자명 *", "로컬 시험"],
    ["이메일 *", "retry@example.com"],
    ["전화번호 *", "01000000000"],
    ["업종 *", "시험"],
    ["지역 *", "로컬"],
    ["상담 내용 *", "DB 저장 뒤 응답 유실 시험"],
  ])
    await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByLabel("개인정보 수집·이용에 동의합니다. *").check();
  await page.getByRole("button", { name: "마케팅 상담 신청하기 ↗" }).click();
}
try {
  await page.goto(url, { waitUntil: "networkidle" });
  await fill();
  await page.getByRole("alert").waitFor();
  assert.equal(
    await page.getByRole("heading", { name: "상담이 접수되었습니다." }).count(),
    0,
  );
  await page.reload({ waitUntil: "networkidle" });
  await fill();
  await page.getByRole("heading", { name: "상담이 접수되었습니다." }).waitFor();
  assert.equal(firstKey, secondKey);
  assert((await page.locator("body").innerText()).includes(savedId));
  console.log(
    "PASS browser: saved-but-lost response, no false success, refresh retains idempotency key, retry returns same quoteId",
  );
} finally {
  await browser.close();
}
