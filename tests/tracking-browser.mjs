// Run after npm run build. Uses an isolated loopback next start and local PGlite.
// PLAYWRIGHT_MODULE can point at an existing installation; no production values are loaded.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { setTimeout as sleep } from "node:timers/promises";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const evidence = process.env.AIO_TRACKING_EVIDENCE || await mkdtemp(path.join(tmpdir(), "aio-tracking-browser-"));
await mkdir(evidence, { recursive: true });
const directory = await mkdtemp(path.join(evidence, "local-db-"));
const port = Number(process.env.AIO_TRACKING_PORT || 3128), origin = `http://127.0.0.1:${port}`;
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => /^(path|systemroot|windir|temp|tmp|userprofile|appdata|localappdata|pathext|comspec|number_of_processors|processor_architecture|node_extra_ca_certs)$/i.test(key)));
Object.assign(env, { NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1", LOCAL_ADMIN_ENABLED: "true", LOCAL_DATA_DIR: directory, ADMIN_USERNAME: "tracking-local", ADMIN_PASSWORD: randomBytes(24).toString("hex"), ADMIN_SESSION_SECRET: randomBytes(32).toString("hex") });
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { env, stdio: "pipe", windowsHide: true });
let serverOutput = "";
server.stdout.on("data", value => { serverOutput += value; });
server.stderr.on("data", value => { serverOutput += value; });
const checks = [], ids = [], errors = [];
let browser, currentPage;
const contactResponses = [];
const check = (name, condition = true) => { assert.ok(condition, name); checks.push({ name, status: "pass" }); };
const events = page => page.evaluate(() => (window.dataLayer || []).filter(value => value && typeof value.event === "string" && value.event.startsWith("aio_")));
async function fill(page, purpose = "sales_ad") {
  await page.locator('.cs-chooser input[value="webtoon"]').check();
  await page.locator('input[name="name"]').fill("[자체검증] 문의추적 로컬");
  await page.locator('input[name="email"]').fill("tracking-fixture@example.test");
  await page.locator('textarea[name="message"]').fill("개인정보 전송 없이 문의 추적을 확인하는 로컬 시험");
  await page.locator('input[name="consent"]').check();
  if (purpose) await page.locator(`input[name="purpose"][value="${purpose}"]`).check();
}
try {
  let ready = false;
  for (let i = 0; i < 90; i++) { try { ready = (await fetch(origin + "/content/contact")).ok; } catch {} if (ready) break; await sleep(500); }
  check("local next start ready", ready);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  context.setDefaultTimeout(90000);
  const warmLogin = await context.request.post(origin + "/api/admin/login", { data: { username: env.ADMIN_USERNAME, password: env.ADMIN_PASSWORD }, headers: { Origin: origin }, timeout: 90000 });
  check("isolated local database initialized", warmLogin.ok());
  const page = await context.newPage();
  currentPage = page;
  page.on("response", response => { if (response.url().endsWith("/api/contact")) { contactResponses.push({ status: response.status(), method: response.request().method(), url: response.url() }); } });
  page.on("pageerror", () => errors.push("pageerror"));
  for (const [source, expected] of Object.entries({ yt: "youtube", ig: "instagram", fb: "facebook", th: "threads" })) {
    const response = await context.request.get(`${origin}/go/a001/${source}`, { maxRedirects: 0 });
    check("307 profile redirect " + source, response.status() === 307);
    const url = new URL(response.headers().location, origin);
    check("profile UTM " + source, url.pathname === "/content/contact" && url.searchParams.get("utm_source") === expected && url.searchParams.get("utm_medium") === "social" && url.searchParams.get("utm_campaign") === "a001_aio_contents" && url.searchParams.get("utm_term") === "profile");
  }
  for (const suffix of ["/go/a002/yt", "/go/a001/xx", "/go/a001/c/bad%40id?s=yt&p=post", "/go/a001/c/good?s=x&p=post", "/go/a001/c/good?s=yt&p=x", "/go/a001/yt?p=bad"]) {
    const response = await context.request.get(origin + suffix, { maxRedirects: 0 });
    check("invalid link returns parameter-free contact " + suffix, response.status() === 307 && new URL(response.headers().location, origin).pathname === "/content/contact" && !new URL(response.headers().location, origin).search);
  }
  const noPlacement = await context.request.get(
    origin + "/go/a001/c/good?s=yt",
    { maxRedirects: 0 },
  );
  const noPlacementUrl = new URL(noPlacement.headers().location, origin);
  check(
    "missing p preserves content UTMs without utm_term",
    noPlacement.status() === 307 &&
      noPlacementUrl.searchParams.get("utm_content") === "good" &&
      noPlacementUrl.searchParams.get("utm_campaign") === "a001_aio_contents" &&
      !noPlacementUrl.searchParams.has("utm_term"),
  );
  await page.goto(origin + "/go/a001/c/a001_test-1?s=yt&p=description");
  check("short link preserves the requesting origin", new URL(page.url()).origin === origin);
  await page.waitForFunction(() => window.dataLayer?.some(value => value.event === "aio_page_view"));
  check("content link UTM", new URL(page.url()).searchParams.get("utm_content") === "a001_test-1");
  await page.goto(page.url() + "&gclid=local_click_1&fbclid=local_fb_1&NaPm=ct%3Dlocal%7Cci%3Dfixture");
  await page.waitForFunction(() => window.dataLayer?.some(value => value.event === "aio_page_view"));
  const firstCookie = (await context.cookies()).find(value => value.name === "aio_first_touch");
  check("first-touch 90-day first-party cookie", firstCookie && firstCookie.sameSite === "Lax" && firstCookie.expires > Date.now() / 1000 + 89 * 86400);
  await page.locator('header a[href="/content/services/webtoon"]').click();
  await page.waitForURL("**/content/services/webtoon");
  await page.waitForFunction(() => window.dataLayer?.some(value => value.event === "aio_service_view"));
  check("SPA service event once", (await events(page)).filter(value => value.event === "aio_service_view").length === 1);
  await page.locator('header a[href="/content/contact"]').click();
  await page.waitForURL("**/content/contact");
  check("CTA recorded on real navigation", (await events(page)).some(value => value.event === "aio_cta_click" && value.cta_location === "header"));
  const internalUtms = await page.locator("a[href]").evaluateAll(links => links.filter(link => { const url = new URL(link.href, location.href); return url.origin === location.origin && [...url.searchParams.keys()].some(key => key.startsWith("utm_")); }).length);
  check("rendered internal links carry no UTM", internalUtms === 0);
  await page.getByRole("button", { name: "상담 신청하기", exact: true }).click();
  check("missing service blocks submission", (await events(page)).some(value => value.event === "aio_form_error" && value.error_field === "service"));
  await fill(page, "");
  await page.getByRole("button", { name: "상담 신청하기", exact: true }).click();
  check("missing purpose blocks submission", (await events(page)).some(value => value.event === "aio_form_error" && value.error_field === "purpose"));
  check("first form interaction once", (await events(page)).filter(value => value.event === "aio_form_start").length === 1);
  await page.locator('input[name="purpose"][value="sales_ad"]').check();
  await page.locator('input[name="found_via"][value="youtube"]').check();
  await page.screenshot({ path: path.join(evidence, "contact-desktop.png"), fullPage: true });
  await page.route("**/api/contact", route => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ success: false, error: "로컬 실패 시험" }) }));
  await page.getByRole("button", { name: "상담 신청하기", exact: true }).click();
  await page.getByRole("alert").filter({ hasText: "로컬 실패 시험" }).waitFor();
  check("failed save emits zero lead events", !(await events(page)).some(value => value.event === "aio_lead"));
  await page.unroute("**/api/contact");
  let captured;
  page.on("request", request => { if (request.url().endsWith("/api/contact") && request.method() === "POST") captured = request.postDataJSON(); });
  const savedResponse = page.waitForResponse("**/api/contact");
  await page.getByRole("button", { name: "상담 신청하기", exact: true }).click();
  const savedHttp = await savedResponse; const saved = await savedHttp.json(); assert.equal(savedHttp.status(), 201, saved.error || "saved response"); ids.push(saved.data.inquiryId);
  await page.getByRole("heading", { name: "문의가 접수되었습니다", exact: true }).waitFor();
  const leadEvents = (await events(page)).filter(value => value.event === "aio_lead");
  check("successful submit emits one matching inquiry ID", leadEvents.length === 1 && leadEvents[0].event_id === saved.data.inquiryId);
  check("current/first UTM and recent click IDs cross internal navigation", captured.attribution.utm.utm_campaign === "a001_aio_contents" && captured.attribution.utm.utm_content === "a001_test-1" && captured.attribution.firstTouch.utm.utm_source === "youtube" && captured.attribution.clickIds.gclid === "local_click_1" && captured.attribution.clickIds.NaPm === "ct=local|ci=fixture");
  check("no contact fields in dataLayer", !JSON.stringify(await events(page)).includes("tracking-fixture@example.test") && !JSON.stringify(await events(page)).includes("[자체검증]") && !JSON.stringify(await events(page)).includes("개인정보 전송 없이"));
  const duplicate = await context.request.post(origin + "/api/contact", { data: captured, headers: { Origin: origin } });
  const duplicateBody = await duplicate.json();
  check("server idempotency returns same ID without a new record", duplicate.status() === 200 && duplicateBody.data.duplicate && duplicateBody.data.inquiryId === ids[0]);
  await page.goto(origin + "/content/contact");
  await fill(page);
  await page.route("**/api/contact", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(duplicateBody) }));
  await page.getByRole("button", { name: "상담 신청하기", exact: true }).click();
  await page.getByRole("heading", { name: "문의가 접수되었습니다", exact: true }).waitFor();
  check("duplicate success response emits zero browser leads", !(await events(page)).some(value => value.event === "aio_lead"));
  await page.unroute("**/api/contact");
  await page.evaluate(() => sessionStorage.clear());
  await page.goto(origin + "/content/contact");
  await fill(page, "unknown");
  const directResponse = page.waitForResponse("**/api/contact");
  await page.getByRole("button", { name: "상담 신청하기", exact: true }).click();
  ids.push((await (await directResponse).json()).data.inquiryId);
  check("next-session direct submission retains first touch and permits empty found-via", Object.keys(captured.attribution.utm).length === 0 && captured.attribution.firstTouch.utm.utm_source === "youtube" && !captured.found_via);
  check("first-touch cookie remains unchanged", (await context.cookies()).find(value => value.name === "aio_first_touch").value === firstCookie.value);
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobile.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", { get: () => { throw new Error("storage denied"); } });
    Object.defineProperty(document, "cookie", { get: () => { throw new Error("cookies denied"); }, set: () => { throw new Error("cookies denied"); } });
  });
  const mobilePage = await mobile.newPage();
  mobilePage.on("pageerror", () => errors.push("mobile-pageerror"));
  const externalUtm = new URLSearchParams({
    utm_source: " m.facebook.com ",
    utm_campaign: "spring sale",
    utm_term: "문\n의",
  });
  await mobilePage.goto(origin + "/content/contact?" + externalUtm);
  await fill(mobilePage);
  check("mobile form has no horizontal overflow", await mobilePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await mobilePage.screenshot({ path: path.join(evidence, "contact-mobile.png"), fullPage: true });
  const blockedResponse = mobilePage.waitForResponse("**/api/contact");
  await mobilePage.getByRole("button", { name: "상담 신청하기", exact: true }).click();
  ids.push((await (await blockedResponse).json()).data.inquiryId);
  check("submission succeeds when both storage APIs are denied", true);
  await mobile.close();
  const login = await context.request.post(origin + "/api/admin/login", { data: { username: env.ADMIN_USERNAME, password: env.ADMIN_PASSWORD }, headers: { Origin: origin } });
  check("local administrator login", login.ok());
  const query = "utm_campaign=a001_aio_contents&utm_content=a001_test-1&purpose=sales_ad";
  const list = await (await context.request.get(origin + "/api/admin/inquiries?" + query)).json();
  check("administrator server filters and saved source_meta", list.total === 1 && list.items[0].leads.source_meta.purpose === "sales_ad" && list.items[0].leads.source_meta.found_via === "youtube");
  const externalList = await (
    await context.request.get(
      origin +
        "/api/admin/inquiries?" +
        new URLSearchParams({ utm_campaign: "spring sale" }),
    )
  ).json();
  const externalSource =
    externalList.items[0]?.leads.source_meta.attribution.utm;
  check(
    "external dotted, spaced and Korean UTMs persist through API, database and admin filter",
    externalList.total === 1 &&
      externalSource.utm_source === "m.facebook.com" &&
      externalSource.utm_campaign === "spring sale" &&
      externalSource.utm_term === "문의",
  );
  const beforeBypass = await (
    await context.request.get(origin + "/api/admin/inquiries")
  ).json();
  for (const formId of [undefined, "general_contact", "guide_inquiry"]) {
    const forged = await context.request.post(origin + "/api/contact", {
      data: {
        ...captured,
        formId,
        purpose: undefined,
        idempotencyKey: randomUUID(),
        attribution: { ...captured.attribution, submitPath: "/" },
      },
      headers: { Origin: origin },
    });
    check(
      "forged submitPath and formId cannot bypass content purpose " +
        String(formId),
      forged.status() === 400,
    );
  }
  const disguised = await context.request.post(origin + "/api/contact", {
    data: {
      ...captured,
      division: "marketing",
      service: "integrated",
      formId: "general_contact",
      purpose: undefined,
      idempotencyKey: randomUUID(),
      attribution: { ...captured.attribution, submitPath: "/" },
    },
    headers: { Origin: origin, Referer: origin + "/content/contact" },
  });
  check(
    "server content-page context blocks simultaneous body-identity tampering",
    disguised.status() === 400,
  );
  const afterBypass = await (
    await context.request.get(origin + "/api/admin/inquiries")
  ).json();
  check(
    "rejected purpose bypass attempts create no inquiries",
    afterBypass.total === beforeBypass.total,
  );
  await page.goto(origin + "/admin");
  await page.getByRole("button", { name: "문의·상담 내역", exact: true }).click();
  await page.getByLabel("utm_campaign", { exact: true }).fill("a001_aio_contents");
  await page.getByLabel("utm_content", { exact: true }).fill("a001_test-1");
  await page.getByLabel("사용 목적 필터").selectOption("sales_ad");
  const filtered = page.waitForResponse(response => response.url().includes("/api/admin/inquiries?") && response.url().includes("utm_content=a001_test-1"));
  await page.getByRole("button", { name: "검색", exact: true }).click(); await filtered;
  await page.getByRole("button", { name: /상담 열기/ }).first().click();
  await page.getByRole("heading", { name: "유입", exact: true }).waitFor();
  check("administrator detail renders both UTM sets and click-ID presence", await page.locator('section[aria-label="문의 유입 정보"]').innerText().then(value => value.includes("최초 유입") && value.includes("gclid 있음") && value.includes("매출을 올릴 광고")));
  await page.screenshot({ path: path.join(evidence, "admin-detail.png"), fullPage: true });
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("link", { name: "조건에 맞는 문의 CSV 내보내기" }).click();
  await (await downloadEvent).saveAs(path.join(evidence, "local-inquiries.csv"));
  const csv = await (await context.request.get(origin + "/api/admin/inquiries?" + query + "&format=csv")).text();
  check("authenticated CSV includes filtered inquiry and attribution columns", csv.includes(ids[0]) && csv.includes('"first_utm_content"') && csv.includes('"found_via"') && !csv.includes(ids[1]));
  const general = await context.request.post(origin + "/api/contact", {
    data: {
      ...captured,
      division: "marketing",
      service: "integrated",
      formId: "general_contact",
      purpose: undefined,
      idempotencyKey: randomUUID(),
      attribution: { ...captured.attribution, submitPath: "/contact" },
    },
    headers: { Origin: origin, Referer: origin + "/contact" },
  });
  const generalBody = await general.json();
  check(
    "existing non-content inquiry remains accepted without purpose",
    general.status() === 201,
  );
  ids.push(generalBody.data.inquiryId);
  for (const id of ids) {
    const status = await context.request.patch(origin + "/api/admin/inquiries", { data: { id, status: "rejected", note: "[자체검증] 로컬 시험 완료" }, headers: { Origin: origin } });
    check("local test inquiry closed " + id, status.ok());
  }
  const invalid = await context.request.post(origin + "/api/contact", { data: { ...captured, purpose: undefined }, headers: { Origin: origin } });
  check("API rejects content purpose omission", invalid.status() === 400);
  check("anonymous CSV denied", (await fetch(origin + "/api/admin/inquiries?format=csv")).status === 401);
  await page.goto(origin + "/contact");
  await page.locator('select[name="division"]').selectOption("video");
  check(
    "general form shows purpose choices for video inquiries",
    (await page.locator('.inquiry-purpose input[name="purpose"]').count()) ===
      4,
  );
  await page.locator('input[name="name"]').fill("[자체검증] 범용폼 회귀");
  await page
    .locator('input[name="email"]')
    .fill("tracking-fixture@example.test");
  await page
    .locator('textarea[name="message"]')
    .fill("콘텐츠 선택 시 목적 필수 회귀 시험");
  await page.locator('input[name="consent"]').check();
  await page
    .getByRole("button", { name: "프로젝트 문의 보내기", exact: true })
    .click();
  await page
    .getByRole("alert")
    .filter({ hasText: "사용 목적을 골라주세요" })
    .waitFor();
  check("general form enforces purpose before a video request", true);
  await page.locator('input[name="purpose"][value="brand_intro"]').check();
  let generalCaptured;
  await page.screenshot({ path: path.join(evidence, "general-content-form.png"), fullPage: true });
  await page.route("**/api/contact", (route) => {
    generalCaptured = route.request().postDataJSON();
    return route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { inquiryId: randomUUID(), duplicate: false },
      }),
    });
  });
  await page
    .getByRole("button", { name: "프로젝트 문의 보내기", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "문의가 접수되었습니다", exact: true })
    .waitFor();
  check(
    "general content inquiry sends purpose and form identity",
    generalCaptured.formId === "general_contact" &&
      generalCaptured.division === "video" &&
      generalCaptured.purpose === "brand_intro",
  );
  await page.unroute("**/api/contact");
  await page.goto(origin + "/contact");
  check(
    "marketing form does not acquire a new required purpose field",
    (await page.locator(".inquiry-purpose").count()) === 0,
  );
  await page.locator('select[name="division"]').selectOption("development");
  check(
    "development form does not acquire a new required purpose field",
    (await page.locator(".inquiry-purpose").count()) === 0,
  );
  await page.goto(origin + "/content/insights");
  const articleHref = await page.locator('a[href^="/content/insights/"]').first().getAttribute("href");
  await page.goto(origin + articleHref);
  await page.waitForFunction(() => window.dataLayer?.some(value => value.event === "aio_reference_view"));
  check("individual insight emits one reference-view event", (await events(page)).filter(value => value.event === "aio_reference_view").length === 1);
  await page.route("https://www.youtube.com/embed/**", route => route.fulfill({ body: "", contentType: "text/html" }));
  await page.evaluate(() => {
    window.YT = { Player: class { constructor(frame, options) { window.__state = options.events.onStateChange; } addEventListener() {} removeEventListener() {} } };
    const frame = document.createElement("iframe"); frame.src = "https://www.youtube.com/embed/M7lc1UVf-VE"; document.body.appendChild(frame);
  });
  await page.waitForFunction(() => typeof window.__state === "function");
  await page.evaluate(() => { window.__state({ data: 2 }); window.__state({ data: 1 }); window.__state({ data: 1 }); });
  check("YouTube adapter emits once on PLAYING, using a simulated provider callback", (await events(page)).filter(value => value.event === "aio_video_play").length === 1);
  check("no browser page errors", errors.length === 0);
  check("local sitemap responds", (await context.request.get(origin + "/sitemap.xml")).ok());
  await context.close();
  await writeFile(path.join(evidence, "browser-results.json"), JSON.stringify({ checks, localInquiryIds: ids, productionSubmissions: 0, realAppBrowsersTested: false, youtubeProviderCallback: "simulated", pageErrors: errors.length }, null, 2));
  console.log(JSON.stringify({ status: "pass", checks: checks.length, localInquiryIds: ids, evidence }));
} catch (error) {
  const formState = await currentPage?.evaluate(() => ({ busy: document.querySelector("form")?.getAttribute("aria-busy"), invalid: [...document.querySelectorAll("input,textarea")].filter(input => !input.validity.valid).map(input => input.name), alert: document.querySelector(".guide-form-error")?.textContent })).catch(() => null);
  await writeFile(path.join(evidence, "browser-results.json"), JSON.stringify({ checks, localInquiryIds: ids, status: "fail", error: error.message, formState, contactResponses, pageErrors: errors.length }, null, 2));
  throw error;
} finally { await browser?.close(); server.kill(); await writeFile(path.join(evidence, "server-runtime.log"), serverOutput); }
