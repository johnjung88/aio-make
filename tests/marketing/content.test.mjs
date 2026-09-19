import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: process.env.TEST_CHROME_PATH || "/opt/google/chrome/chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const base = "http://127.0.0.1:3319";
try {
  const login = await context.request.post(base + "/api/admin/login", {
    form: { username: "local-review", password: "local-test-only-password" },
    maxRedirects: 0,
  });
  assert.equal(login.status(), 303);
  await page.goto(base + "/admin/marketing-content", {
    waitUntil: "networkidle",
  });
  await page.getByLabel("제목", { exact: true }).fill("로컬 콘텐츠 초안");
  await page.getByRole("button", { name: "새 초안 버전 저장" }).click();
  await page
    .getByRole("status")
    .filter({ hasText: "새 초안을 저장했습니다." })
    .waitFor();
  await page.getByRole("link", { name: "이 버전 미리보기 →" }).first().click();
  await page
    .getByRole("heading", { name: "로컬 콘텐츠 초안", exact: true })
    .waitFor();
  await page.goto(base + "/ko", { waitUntil: "networkidle" });
  assert.equal(
    await page
      .getByRole("heading", { name: "로컬 콘텐츠 초안", exact: true })
      .count(),
    0,
  );
  console.log(
    "PASS content editor: field editing, versioned save, private preview, draft not exposed publicly",
  );
} finally {
  await browser.close();
}
