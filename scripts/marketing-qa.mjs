import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_CORE_PATH ||
    "C:/AIO-PC2/00-admin/tools/rea-agents/6.7.0/node_modules/playwright-core",
);
const base = process.env.QA_BASE || "http://127.0.0.1:3117";
const output =
  process.env.QA_OUTPUT || "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_RW2";
await fs.mkdir(output, { recursive: true });
const results = { pages: [], interactions: [], errors: [], submission: null };
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROMIUM_PATH ||
    "C:/Users/aioma/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
});
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
await ctx.route("https://**/*", (r) => r.abort());
const page = await ctx.newPage();
page.on("pageerror", (e) => results.errors.push(e.message));
async function ready() {
  await page.evaluate(() => document.fonts.ready);
  await page.locator("img").evaluateAll(async (images) => {
    await Promise.all(
      images.map(async (im) => {
        im.loading = "eager";
        try {
          await im.decode();
        } catch {}
      }),
    );
  });
}
async function go(route) {
  const response = await page.goto(base + route, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, route);
  await ready();
}
async function geometry(route, width) {
  const metric = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    broken: [...document.images]
      .filter((im) => im.complete && im.naturalWidth === 0)
      .map((im) => im.currentSrc),
    h1: document.querySelectorAll("h1").length,
    header: document.querySelector(".mk-header")?.getBoundingClientRect()
      .height,
    bar: !!document.querySelector(".floating-contact"),
  }));
  assert.ok(
    metric.scrollWidth <= width + 1,
    `${route} overflow at ${width}: ${metric.scrollWidth}`,
  );
  assert.equal(metric.h1, 1, route + " h1");
  assert.equal(metric.broken.length, 0, route + " broken images");
  assert.equal(metric.bar, false);
  results.pages.push({ route, ...metric });
}
try {
  if (!process.env.QA_INTERACTIONS_ONLY) {
    const routes = [
      "/marketing",
      "/marketing/services/integrated",
      "/marketing/services/sns",
      "/marketing/services/ai-influencer",
      "/marketing/services/seo",
      "/marketing/work",
      "/marketing/insights",
      "/marketing/contact",
    ];
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      for (const route of routes) {
        await go(route);
        await geometry(route, width);
        const name = route.replaceAll("/", "_").slice(1);
        await page.screenshot({
          path: path.join(output, `${name}_${width}_first.png`),
        });
        await page.screenshot({
          path: path.join(output, `${name}_${width}_full.png`),
          fullPage: true,
        });
        if (route.includes("/services/")) {
          for (const section of ["#signature", "#deliverables", "#pricing"])
            await page.locator(section).screenshot({
              path: path.join(
                output,
                `${name}_${width}_${section.slice(1)}.png`,
              ),
            });
        }
        if (route === "/marketing") {
          await page
            .locator("section:has(#touchpoints-title)")
            .screenshot({
              path: path.join(output, `marketing_${width}_touchpoints.png`),
            });
          for (const section of ["#finder", "#services"])
            await page.locator(section).screenshot({
              path: path.join(
                output,
                `${name}_${width}_${section.slice(1)}.png`,
              ),
            });
        }
      }
      await go("/content");
      await page.screenshot({
        path: path.join(output, `content_${width}_first.png`),
      });
      await page.screenshot({
        path: path.join(output, `content_${width}_full.png`),
        fullPage: true,
      });
    }
    // Additional layout boundaries, no duplicate screenshots needed.
    for (const width of [360, 375, 768, 1024, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of [
        "/marketing",
        "/marketing/services/integrated",
        "/marketing/services/sns",
        "/marketing/services/ai-influencer",
        "/marketing/services/seo",
        "/marketing/contact",
      ]) {
        await go(route);
        await geometry(route, width);
      }
    }
  } else {
    results.pages = JSON.parse(
      await fs.readFile(path.join(output, "browser-results.json"), "utf8"),
    ).pages;
  }
  await page.goto(base + "/", { waitUntil: "networkidle" });
  assert.equal(
    await page
      .locator('.guide-header a[href="/marketing"]')
      .first()
      .getAttribute("target"),
    "_blank",
  );
  assert.match(
    await page
      .locator('.guide-header a[href="/marketing"]')
      .first()
      .textContent(),
    /새 탭에서 열림/,
  );
  results.interactions.push("main-to-marketing new-tab hint");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await go("/marketing");
  for (const [situation, expected] of [
    ["채널이 여러 개라 따로 놀아요", "통합 마케팅"],
    ["설명해 줄 출연자가 없어요", "AI 인플루언서 운영"],
    ["사이트가 있는데 검색과 AI 답변에서 잘 안 보여요", "SEO·AEO·GEO"],
  ]) {
    await page.getByRole("button", { name: situation, exact: true }).click();
    assert.equal(
      await page.locator("#finder-result h3").textContent(),
      expected,
    );
  }
  await page
    .getByRole("button", { name: "설명해 줄 출연자가 없어요", exact: true })
    .click();
  await page
    .getByRole("button", { name: "한 번 제대로 고치고 싶어요", exact: true })
    .click();
  assert.equal(
    await page.locator("#finder-result h3").textContent(),
    "AI 인플루언서 제작",
  );
  assert.equal(
    await page
      .getByRole("link", {
        name: "AI 인플루언서 제작 자세히 보기 · 새 탭에서 열림",
      })
      .getAttribute("target"),
    "_blank",
  );
  await page.getByRole("button", { name: "처음으로", exact: true }).click();
  assert.equal(
    await page.locator("#finder-result h3").textContent(),
    "SNS 대행 운영",
  );
  results.interactions.push("finder rules, cross-division new tab, reset");
  await go("/marketing/services/integrated");
  await page
    .getByRole("button", { name: "인스타그램 5건 늘리기", exact: true })
    .click();
  assert.match(
    await page.locator("#signature-result").textContent(),
    /5건 많아요/,
  );
  assert.equal(
    await page.getByRole("link", { name: "이 내용으로 상담하기" }).count(),
    0,
  );
  await page
    .getByRole("button", { name: "네이버 블로그 5건 줄이기", exact: true })
    .click();
  assert.equal(
    await page.getByRole("link", { name: "이 내용으로 상담하기" }).count(),
    1,
  );
  await page.getByRole("button", { name: "인스타그램", exact: true }).click();
  assert.equal(
    await page.locator(".mk-allocation button").first().isDisabled(),
    true,
  );
  await page
    .getByRole("button", { name: "검색 노출용 글", exact: true })
    .click();
  await page.getByRole("button", { name: "고르게 나누기" }).click();
  await page.getByRole("button", { name: "20", exact: true }).click();
  assert.match(
    await page.locator("#signature-result").textContent(),
    /원본 20 →/,
  );
  results.interactions.push(
    "planner selection gate, +/- total, equal allocation, original tile",
  );
  await go("/marketing/services/sns");
  await page
    .getByRole("button", { name: "스킨케어 제품", exact: true })
    .click();
  await page.getByLabel("02 이름").fill("리프 세럼");
  await page.getByLabel("알리고 싶은 한 가지").fill("제품 정보부터 확인해요");
  await page.getByRole("button", { name: "언제 좋아요?", exact: true }).click();
  assert.equal(
    await page.locator(".mk-phone h4").filter({ hasText: "리프 세럼" }).count(),
    3,
  );
  const signatureLink = await page
    .getByRole("link", { name: "이 내용으로 상담하기" })
    .getAttribute("href");
  assert.equal(
    new URL(signatureLink, base).searchParams.get("plan"),
    "preview",
  );
  await page.getByRole("link", { name: "이 내용으로 상담하기" }).click();
  await ready();
  assert.match(
    await page
      .getByRole("textbox", { name: "요청 내용", exact: true })
      .inputValue(),
    /리프 세럼/,
  );
  assert.match(
    await page.locator(".mk-selected-plan").textContent(),
    /한 소재/,
  );
  await page
    .getByRole("textbox", { name: "요청 내용", exact: true })
    .fill("W-RW2 로컬 연동 검증\n리프 세럼 상담 예시");
  results.interactions.push(
    "SNS material/name/question to editable contact message + plan + entry",
  );
  // Verify failure keeps the edited message, then use the actual isolated local API for one persisted receipt.
  await page.getByLabel("고객명 *", { exact: true }).fill("W-RW2 검증");
  await page.getByLabel("이메일", { exact: true }).fill("rw2@example.test");
  await page
    .getByRole("checkbox", { name: "개인정보 수집·이용에 동의합니다 (필수)" })
    .check();
  await page.route("**/api/contact", (r) =>
    r.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ success: false, error: "로컬 검증용 일시 실패" }),
    }),
  );
  await page.getByRole("button", { name: "문의 보내기" }).click();
  await page.getByText("로컬 검증용 일시 실패", { exact: true }).waitFor();
  assert.match(
    await page
      .getByRole("textbox", { name: "요청 내용", exact: true })
      .inputValue(),
    /리프 세럼/,
  );
  await page.unroute("**/api/contact");
  const responsePromise = page.waitForResponse(
    (r) => r.url().endsWith("/api/contact") && r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "문의 보내기" }).click();
  const response = await responsePromise;
  const payload = response.request().postDataJSON();
  assert.equal(response.status(), 201, JSON.stringify(await response.json()));
  const receipt = await response.json();
  assert.equal(receipt.success, true);
  assert.equal(payload.service, "sns");
  assert.match(payload.message, /선택한 구성: 한 소재/);
  assert.match(payload.message, /상담 진입: signature/);
  await page
    .getByRole("heading", { name: "문의가 접수되었습니다", exact: true })
    .waitFor();
  results.submission = {
    status: response.status(),
    service: payload.service,
    receipt: receipt.data.inquiryId,
    localOnly: true,
  };
  await page.screenshot({
    path: path.join(output, "contact_local_receipt.png"),
    fullPage: true,
  });
  results.interactions.push(
    "503 preserves edit; actual local API persists receipt and selection",
  );
  await go("/marketing/services/ai-influencer");
  await page.getByRole("button", { name: "식품", exact: true }).click();
  await page
    .getByRole("button", { name: "사용법을 알려주는 사람", exact: true })
    .click();
  await page.getByRole("button", { name: "차분하게", exact: true }).click();
  assert.match(await page.locator(".mk-month").textContent(), /포장 여는 법/);
  assert.equal(await page.locator(".mk-month details>div").count(), 8);
  const personaHref = await page
    .getByRole("link", { name: "이 내용으로 상담하기" })
    .getAttribute("href");
  assert.match(new URL(personaHref, base).searchParams.get("message"), /식품/);
  await page.getByRole("button", { name: "처음으로", exact: true }).click();
  assert.match(
    await page.locator(".mk-month").textContent(),
    /브랜드가 지키는 기준/,
  );
  results.interactions.push(
    "persona product × role × tone, eight topics, reset",
  );
  await go("/marketing/services/seo");
  assert.ok(!(await page.locator('[data-compare="정리 전"] .mk-answer-card').textContent()).includes("0"), "No numeric zero leaks into the before answer");
  await page.getByRole("button", { name: "B2B 제조", exact: true }).click();
  await page.getByLabel("02 서비스 이름").fill("산업 센서");
  await page.getByLabel("지역 · 선택").fill("김포");
  await page
    .getByRole("button", { name: "견적은 어떻게 받나요?", exact: true })
    .click();
  await page
    .getByRole("checkbox", { name: "페이지 제목과 설명", exact: true })
    .uncheck();
  assert.equal(
    await page
      .locator('[data-compare="정리 후"] .mk-search-card h3')
      .textContent(),
    "홈 | 회사소개 | 서비스",
  );
  await page
    .getByRole("checkbox", { name: "페이지 제목과 설명", exact: true })
    .check();
  assert.match(
    await page
      .locator('[data-compare="정리 후"] .mk-search-card h3')
      .textContent(),
    /김포 산업 센서/,
  );
  await page
    .getByRole("checkbox", { name: "가격·범위 문단", exact: true })
    .uncheck();
  assert.equal(
    await page
      .locator('[data-compare="정리 후"]')
      .getByText("비용은 제공 범위와 준비 자료를 확인한 뒤 정합니다", {
        exact: true,
      })
      .count(),
    0,
  );
  results.interactions.push(
    "SEO industry questions, switches update search + answer, consultation summary",
  );
  // Arrow keys follow selection and focus.
  const industryButton = page.getByRole("button", {
    name: "B2B 제조",
    exact: true,
  });
  await industryButton.focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(
    await page
      .getByRole("button", { name: "쇼핑몰", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  results.interactions.push("arrow-key chip selection");
  await page.setViewportSize({ width: 390, height: 844 });
  await go("/marketing/services/seo");
  assert.ok(!(await page.locator('[data-compare="정리 전"] .mk-answer-card').textContent()).includes("0"), "No numeric zero leaks into the before answer");
  await page.getByRole("button", { name: "정리 전", exact: true }).click();
  assert.equal(
    await page.locator('[data-compare="정리 전"]').isVisible(),
    true,
  );
  assert.equal(
    await page.locator('[data-compare="정리 후"]').isVisible(),
    false,
  );
  await page.locator(".mk-faq-list summary").first().click();
  assert.equal(
    await page.locator(".mk-faq-list details").first().getAttribute("open"),
    "",
  );
  results.interactions.push("mobile comparison and FAQ");
  await go("/marketing/insights");
  const href = await page
    .locator(".mk-insights a")
    .first()
    .getAttribute("href");
  if (href) {
    await go(href);
    await geometry(href, 390);
    await page.screenshot({
      path: path.join(output, "marketing_article_390_full.png"),
      fullPage: true,
    });
  }
  // Defaults remain server rendered when scripts are unavailable.
  const nojsRoutes = [
    "/marketing",
    "/marketing/services/integrated",
    "/marketing/services/sns",
    "/marketing/services/ai-influencer",
    "/marketing/services/seo",
  ];
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await nojs.newPage();
  for (const route of nojsRoutes) {
    await staticPage.goto(base + route);
    assert.ok(
      await staticPage.locator("#finder-result, #signature-result").count(),
    );
    assert.ok(
      (
        await staticPage
          .locator("#finder-result, #signature-result")
          .textContent()
      ).length > 100,
    );
  }
  await nojs.close();
  results.interactions.push("no-JS default result screens");
  assert.equal(results.errors.length, 0, JSON.stringify(results.errors));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await fs.writeFile(
    path.join(output, "browser-results.json"),
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
