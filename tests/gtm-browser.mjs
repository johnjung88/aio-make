// Read-only local browser checks. No form submission or real tracking delivery.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const mode = process.env.AIO_ANALYTICS_MODE || "gtm";
const evidence = path.resolve(
  process.env.AIO_ANALYTICS_EVIDENCE || `.w-a2-evidence/browser-${mode}`,
);
await mkdir(evidence, { recursive: true });
const port = Number(process.env.AIO_ANALYTICS_PORT || 3138),
  origin = `http://127.0.0.1:${port}`;
const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) =>
    /^(path|systemroot|windir|temp|tmp|userprofile|appdata|localappdata|pathext|comspec|number_of_processors|processor_architecture|node_extra_ca_certs)$/i.test(
      key,
    ),
  ),
);
Object.assign(env, {
  NODE_ENV: "production",
  NEXT_TELEMETRY_DISABLED: "1",
  NEXT_PUBLIC_TRACKING_LOCAL_TEST: "1",
  __NEXT_PROCESSED_ENV: "true",
});
if (mode === "gtm") env.NEXT_PUBLIC_GTM_ID = "GTM-TEST000";
else env.NEXT_PUBLIC_GA_ID = "G-TEST000";
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  { env, stdio: "pipe", windowsHide: true },
);
let serverOutput = "",
  browser;
server.stdout.on("data", (value) => {
  serverOutput += value;
});
server.stderr.on("data", (value) => {
  serverOutput += value;
});
const checks = [],
  errors = [],
  requests = { gtm: 0, gtag: 0, contact: 0 };
function check(name, condition = true) {
  assert.ok(condition, name);
  checks.push({ name, status: "pass" });
}
const pageEvents = (page) =>
  page.evaluate(() =>
    (window.dataLayer || [])
      .filter((value) => value?.event === "aio_page_view")
      .map((value) => value.page_path),
  );
try {
  let ready = false;
  for (let i = 0; i < 90; i++) {
    try {
      ready = (await fetch(origin + "/privacy")).ok;
    } catch {}
    if (ready) break;
    await sleep(500);
  }
  check("local production server ready", ready);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  context.setDefaultTimeout(30000);
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/api/contact") {
      requests.contact++;
      return route.abort();
    }
    if (url.hostname === "www.googletagmanager.com") {
      if (url.pathname === "/gtm.js") requests.gtm++;
      if (url.pathname === "/gtag/js") requests.gtag++;
      return route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: "/* local tracking fixture */",
      });
    }
    if (url.origin !== origin) return route.abort();
    return route.continue();
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.name));
  await page.goto(origin + "/privacy?private=never-export");
  await page.waitForFunction(() =>
    window.dataLayer?.some((value) => value.event === "aio_page_view"),
  );
  await page.waitForFunction(
    (expected) => !!document.querySelector(expected),
    mode === "gtm" ? "head #gtm-init" : "#ga-init",
  );
  await sleep(300);
  check(
    "first entry emits one aio_page_view",
    JSON.stringify(await pageEvents(page)) === '["/privacy"]',
  );
  check(
    "GTM loader exactly once, gtag direct absent in GTM mode",
    mode === "gtm"
      ? requests.gtm === 1 && requests.gtag === 0
      : requests.gtm === 0 && requests.gtag === 1,
  );
  const commands = await page.evaluate(() =>
    (window.dataLayer || [])
      .filter((value) => value && typeof value.length === "number")
      .map((value) => Array.from(value)),
  );
  if (mode === "gtm") {
    check(
      "no gtag config or direct page_view commands",
      commands.every(
        (value) => value[0] !== "config" && value[1] !== "page_view",
      ),
    );
    check(
      "both loader and official snippet reside in head",
      (await page.locator('head script[src*="/gtm.js"]').count()) === 1,
    );
    check(
      "noscript is the first body element",
      await page.evaluate(
        () => document.body.firstElementChild?.tagName === "NOSCRIPT",
      ),
    );
    const html = await (await context.request.get(origin + "/privacy")).text();
    check(
      "server HTML contains body-first noscript iframe",
      /<body[^>]*><!--[^>]*-->*\s*<noscript>|<body[^>]*>\s*<noscript>/.test(
        html,
      ),
    );
  } else {
    check(
      "legacy config retains send_page_view false",
      commands.some(
        (value) => value[0] === "config" && value[2].send_page_view === false,
      ),
    );
    check(
      "legacy direct page_view once",
      commands.filter(
        (value) => value[0] === "event" && value[1] === "page_view",
      ).length === 1,
    );
    check(
      "rollback omits GTM noscript",
      (await page.locator("noscript").count()) === 0,
    );
  }
  if (mode === "gtm") {
    const draftPath = process.env.AIO_PRIVACY_DRAFT;
    if (draftPath) {
      const expected = await readFile(draftPath, "utf8");
      const normalize = (value) =>
        value
          .replaceAll("`[확인: 2026년 10월 28일]`", "2026년 10월 28일")
          .replaceAll("`[확인: 성명·직책]`", "대표")
          .replaceAll("미국 `[확인]`", "미국")
          .replaceAll("Neon `[확인: 계약 주체]`", "Neon")
          .replaceAll("`", "")
          .replaceAll("{PRIVACY_EFFECTIVE_DATE}", "2026년 10월 28일")
          .replaceAll("{PRIVACY_OFFICER}", "대표")
          .replace(/^\s*\|[-|\s]+\|\s*$/gm, "")
          .replace(/^### /gm, "")
          .replace(/^\s*- /gm, "")
          .replaceAll("|", "")
          .replace(/\s/g, "");
      const actual =
        (await page.locator(".page-intro p").last().innerText()) +
        (await page.locator("article.prose").innerText());
      check(
        "privacy full text equals the supplied draft with the specified replacements",
        normalize(actual) ===
          normalize(
            expected
              .split("## 1. 페이지 전문(개정안)")[1]
              .split("## 2. 문의 폼 동의 문구")[0]
              .trim(),
          ),
      );
    }
    check(
      "seven privacy sections, four tables and no unresolved placeholders",
      (await page.locator("article h2").count()) === 7 &&
        (await page.locator("article table").count()) === 4 &&
        !(await page.locator("article").innerText()).includes("[확인"),
    );
    await page.screenshot({
      path: path.join(evidence, "privacy-desktop.png"),
      fullPage: true,
    });
    check(
      "desktop privacy has no horizontal overflow",
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(evidence, "privacy-mobile-390.png"),
      fullPage: true,
    });
    await page
      .locator("article table")
      .nth(1)
      .screenshot({
        path: path.join(evidence, "privacy-mobile-processors.png"),
      });
    check(
      "390px privacy and every table fit the viewport",
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= innerWidth &&
          [...document.querySelectorAll("article table")].every(
            (table) => table.getBoundingClientRect().right <= innerWidth,
          ),
      ),
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  await page.locator('header a[href="/contact"]').first().click();
  await page.waitForURL("**/contact");
  await page.waitForFunction(() =>
    (window.dataLayer || []).some(
      (value) =>
        value.event === "aio_page_view" && value.page_path === "/contact",
    ),
  );
  check(
    "SPA route change emits one additional aio_page_view",
    JSON.stringify(await pageEvents(page)) === '["/privacy","/contact"]',
  );
  await page.locator('header a[href="/"]').first().click();
  await page.waitForURL(origin + "/");
  await page.waitForFunction(() =>
    (window.dataLayer || []).some(
      (value) => value.event === "aio_page_view" && value.page_path === "/",
    ),
  );
  check(
    "second SPA route emits exactly once",
    JSON.stringify(await pageEvents(page)) === '["/privacy","/contact","/"]',
  );
  await page.goBack();
  await page.waitForURL("**/contact");
  await page.waitForFunction(
    () =>
      (window.dataLayer || []).filter(
        (value) => value.event === "aio_page_view",
      ).length === 4,
  );
  check(
    "history back emits once",
    JSON.stringify(await pageEvents(page)) ===
      '["/privacy","/contact","/","/contact"]',
  );
  check(
    "loader never repeats across SPA navigation",
    mode === "gtm"
      ? requests.gtm === 1 && requests.gtag === 0
      : requests.gtm === 0 && requests.gtag === 1,
  );
  if (mode === "gtag") {
    const count = await page.evaluate(
      () =>
        (window.dataLayer || []).filter(
          (value) => value?.[0] === "event" && value[1] === "page_view",
        ).length,
    );
    check("legacy page_view remains one per path change", count === 4);
  }
  const consent = page.locator('input[name="consent"]').locator("..");
  check(
    "form consent retains privacy link and includes visit-source information",
    (await consent.innerText()).replace(/\s/g, "") ===
      "문의응대를위한개인정보수집·이용(방문경로정보포함)에동의합니다" &&
      (await consent.locator('a[href="/privacy"]').count()) === 1,
  );
  if (mode === "gtm")
    await consent.screenshot({
      path: path.join(evidence, "contact-consent.png"),
    });
  const admin = await context.newPage();
  await admin.goto(origin + "/admin/login");
  await sleep(300);
  check(
    "admin loads no analytics script or noscript",
    (await admin
      .locator('#gtm-init,#ga-init,noscript iframe[src*="googletagmanager"]')
      .count()) === 0,
  );
  check("no contact POST attempted", requests.contact === 0);
  check("no browser runtime errors", errors.length === 0);
} catch (error) {
  checks.push({ name: error.message, status: "fail" });
  process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill();
  await writeFile(
    path.join(evidence, "results.json"),
    JSON.stringify(
      { mode, checks, requests, errors, productionContactSubmissions: 0 },
      null,
      2,
    ),
  );
  await writeFile(path.join(evidence, "server.log"), serverOutput);
  console.log(JSON.stringify({ mode, checks, requests, errors }, null, 2));
}
