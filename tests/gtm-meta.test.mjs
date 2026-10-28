import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import {
  analyticsAllowed,
  gtmId,
  gtmSnippet,
  trackLegacyLead,
} from "../lib/analytics-config.ts";
import {
  sendMetaLead,
  META_TIMEOUT_MS,
  META_GRAPH_API_VERSION,
} from "../lib/meta-conversions.ts";
import { trackLead } from "../lib/tracking-events.ts";

const id = "11111111-1111-4111-8111-111111111111";
const receipt = { inquiryId: id, duplicate: false };
test("GTM does not add noscript, request headers or a metadata-streaming override to the root", () => {
  assert.equal(existsSync("components/gtm-noscript.tsx"), false);
  const layout = readFileSync("app/layout.tsx", "utf8");
  assert.match(layout, /export default function RootLayout\(/);
  assert.doesNotMatch(layout, /GtmNoscript|next\/headers/);
  assert.ok(
    !readFileSync("middleware.ts", "utf8").includes("x-aio-tracking-path"),
  );
  assert.ok(
    !readFileSync("next.config.ts", "utf8").includes("htmlLimitedBots"),
  );
});
function globalValue(t, key, value) {
  const before = Object.getOwnPropertyDescriptor(globalThis, key);
  Object.defineProperty(globalThis, key, {
    value,
    configurable: true,
    writable: true,
  });
  t.after(() => {
    if (before) Object.defineProperty(globalThis, key, before);
    else delete globalThis[key];
  });
}
function env(t, values) {
  const keys = [
    "NEXT_PUBLIC_GTM_ID",
    "META_PIXEL_ID",
    "META_CAPI_TOKEN",
    "META_TEST_EVENT_CODE",
  ];
  const before = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) {
    if (values[key] === undefined) delete process.env[key];
    else process.env[key] = values[key];
  }
  t.after(() => {
    for (const key of keys) {
      if (before[key] === undefined) delete process.env[key];
      else process.env[key] = before[key];
    }
  });
}
const configured = {
  META_PIXEL_ID: "123456789",
  META_CAPI_TOKEN: "synthetic-test-token",
};
function request(cookie = "_fbp=fb.1.1234567890000.123456789") {
  return new Request("https://aio-make.com/api/contact?ignore=1", {
    method: "POST",
    headers: {
      cookie,
      "x-forwarded-for": "192.0.2.1, 192.0.2.2",
      "user-agent": "synthetic-browser",
      host: "aio-make.com",
      referer: "https://aio-make.com/content/contact?email=never-send",
    },
    body: JSON.stringify({
      name: "private-name",
      email: "private@example.test",
      phone: "private-phone",
      message: "private-message",
      company: "private-company",
    }),
  });
}

test("GTM ID validation, production host, local override and admin exclusions", () => {
  assert.equal(gtmId("GTM-TEST000"), "GTM-TEST000");
  for (const value of ["", "gtm-TEST", "GTM-ABC<script>", " GTM-ABC", "G-ABC"])
    assert.equal(gtmId(value), "");
  const options = {
    canonicalHost: "aio-make.com",
    pathname: "/privacy",
    production: true,
    localTest: false,
  };
  assert.equal(
    analyticsAllowed({ ...options, hostname: "aio-make.com" }),
    true,
  );
  for (const hostname of [
    "preview.vercel.app",
    "localhost",
    "127.0.0.1",
    "[::1]",
  ])
    assert.equal(analyticsAllowed({ ...options, hostname }), false);
  assert.equal(
    analyticsAllowed({
      ...options,
      hostname: "aio-make.com",
      production: false,
    }),
    false,
  );
  assert.equal(
    analyticsAllowed({ ...options, hostname: "localhost", localTest: true }),
    true,
  );
  for (const pathname of ["/admin", "/admin/login", "/admin/inquiries"])
    assert.equal(
      analyticsAllowed({
        ...options,
        hostname: "localhost",
        localTest: true,
        pathname,
      }),
      false,
    );
});

test("official loader preserves dataLayer and creates one async GTM request without gtag config", () => {
  const inserted = [],
    dataLayer = [{ event: "aio_page_view" }],
    first = { parentNode: { insertBefore: (node) => inserted.push(node) } };
  const context = {
    window: { dataLayer },
    document: {
      getElementsByTagName: () => [first],
      createElement: () => ({}),
    },
  };
  vm.runInNewContext(gtmSnippet("GTM-TEST000"), context);
  assert.equal(context.window.dataLayer, dataLayer);
  assert.equal(inserted.length, 1);
  assert.equal(
    inserted[0].src,
    "https://www.googletagmanager.com/gtm.js?id=GTM-TEST000",
  );
  assert.equal(inserted[0].async, true);
  assert.equal(dataLayer.filter((value) => value.event === "gtm.js").length, 1);
  assert.ok(!gtmSnippet("GTM-TEST000").includes("gtag("));
});

test("both forms share reversible legacy lead dispatch: GTM zero, gtag one, duplicates zero", (t) => {
  env(t, { NEXT_PUBLIC_GTM_ID: "GTM-TEST000" });
  const calls = [];
  globalValue(t, "window", { gtag: (...args) => calls.push(args) });
  globalValue(t, "location", { hostname: "aio-make.com" });
  trackLegacyLead(receipt, { division: "video", service: "webtoon" });
  assert.equal(calls.length, 0);
  delete process.env.NEXT_PUBLIC_GTM_ID;
  trackLegacyLead(receipt, { division: "video", service: "webtoon" });
  assert.deepEqual(calls, [
    ["event", "generate_lead", { division: "video", service: "webtoon" }],
  ]);
  trackLegacyLead(
    { ...receipt, duplicate: true },
    { division: "video", service: "webtoon" },
  );
  assert.equal(calls.length, 1);
  for (const file of [
    "components/contact-form.tsx",
    "components/guide/inquiry-bridge.tsx",
  ]) {
    const source = readFileSync(file, "utf8");
    assert.ok(source.includes("trackLegacyLead(result.data,"));
    assert.ok(!source.includes('window.gtag?.("event", "generate_lead"'));
  }
});

test("Meta sends zero without either env value, cookie consent, or for duplicates", async (t) => {
  env(t, {});
  const fetch = t.mock.method(globalThis, "fetch", async () =>
    Response.json({}),
  );
  await sendMetaLead(request(), receipt, "webtoon", "/content/contact");
  process.env.META_PIXEL_ID = configured.META_PIXEL_ID;
  await sendMetaLead(request(), receipt, "webtoon", "/content/contact");
  delete process.env.META_PIXEL_ID;
  process.env.META_CAPI_TOKEN = configured.META_CAPI_TOKEN;
  await sendMetaLead(request(), receipt, "webtoon", "/content/contact");
  Object.assign(process.env, configured);
  await sendMetaLead(request(""), receipt, "webtoon", "/content/contact");
  await sendMetaLead(
    request(),
    { ...receipt, duplicate: true },
    "webtoon",
    "/content/contact",
  );
  assert.equal(fetch.mock.callCount(), 0);
});

test("successful Meta Lead matches browser event_id, excludes form PII and strips URL query/hash", async (t) => {
  env(t, { ...configured, META_TEST_EVENT_CODE: "SYNTHETIC" });
  globalValue(t, "window", { dataLayer: [] });
  const fetch = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ events_received: 1 }),
  );
  await sendMetaLead(
    request(
      "_fbp=fb.1.1234567890000.123456789; _fbc=fb.1.1234567890000.click-existing; fbclid=click-fallback",
    ),
    receipt,
    "webtoon",
    "/content/contact?email=private@example.test#private",
  );
  assert.equal(fetch.mock.callCount(), 1);
  const [url, options] = fetch.mock.calls[0].arguments;
  assert.equal(
    url,
    `https://graph.facebook.com/${META_GRAPH_API_VERSION}/123456789/events`,
  );
  const body = JSON.parse(options.body),
    event = body.data[0];
  trackLead(receipt, {
    division: "video",
    service: "webtoon",
    attribution: {
      utm: {},
      submitPath: "/content/contact",
      landingPath: "/content/contact",
      referrer: "",
    },
  });
  assert.equal(
    event.event_id,
    window.dataLayer.find((value) => value.event === "aio_lead").event_id,
  );
  assert.equal(event.event_name, "Lead");
  assert.equal(event.action_source, "website");
  assert.equal(event.event_source_url, "https://aio-make.com/content/contact");
  assert.ok(Math.abs(event.event_time - Date.now() / 1000) < 2);
  assert.deepEqual(event.user_data, {
    client_ip_address: "192.0.2.1",
    client_user_agent: "synthetic-browser",
    fbp: "fb.1.1234567890000.123456789",
    fbc: "fb.1.1234567890000.click-existing",
  });
  assert.deepEqual(event.custom_data, { content_category: "webtoon" });
  assert.equal(body.test_event_code, "SYNTHETIC");
  for (const value of [
    "private-name",
    "private@example.test",
    "private-phone",
    "private-message",
    "private-company",
    '"em"',
    '"ph"',
  ])
    assert.ok(!options.body.includes(value));
  assert.ok(!url.includes(configured.META_CAPI_TOKEN));
});

test("Meta fbc fallback uses the fbclid cookie and milliseconds; external source cannot leak", async (t) => {
  env(t, configured);
  const fetch = t.mock.method(globalThis, "fetch", async () =>
    Response.json({}),
  );
  await sendMetaLead(
    request("_fbp=fb.1.1234567890000.123456789; fbclid=click-fallback"),
    receipt,
    "webtoon",
    "/contact",
  );
  const body = JSON.parse(fetch.mock.calls[0].arguments[1].body);
  assert.match(body.data[0].user_data.fbc, /^fb\.1\.\d{13}\.click-fallback$/);
  assert.ok(!("test_event_code" in body));
  await sendMetaLead(
    request(),
    receipt,
    "webtoon",
    "https://other.example/contact",
  );
  assert.equal(fetch.mock.callCount(), 1);
});

test("Meta failure and three-second timeout only log a fixed, PII-free message", async (t) => {
  env(t, configured);
  const logs = [];
  t.mock.method(console, "error", (...args) => logs.push(args));
  const fetch = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("private-name synthetic-test-token");
  });
  await sendMetaLead(request(), receipt, "webtoon", "/contact");
  fetch.mock.mockImplementation(
    async () => new Response("private-message", { status: 500 }),
  );
  await sendMetaLead(request(), receipt, "webtoon", "/contact");
  fetch.mock.mockImplementation(
    (_url, { signal }) =>
      new Promise((resolve, reject) => {
        const keepAlive = setTimeout(
          () => resolve(Response.json({})),
          META_TIMEOUT_MS + 2000,
        );
        signal.addEventListener(
          "abort",
          () => {
            clearTimeout(keepAlive);
            reject(signal.reason);
          },
          { once: true },
        );
      }),
  );
  const start = performance.now();
  await sendMetaLead(request(), receipt, "webtoon", "/contact");
  assert.ok(performance.now() - start < META_TIMEOUT_MS + 1000);
  assert.equal(logs.length, 3);
  assert.ok(
    logs.every(
      (args) => JSON.stringify(args) === '["[meta-capi] delivery failed"]',
    ),
  );
});

test("contact route schedules Meta only after a successful new save; response never waits for delivery", async (t) => {
  const tasks = [],
    meta = [],
    notifications = [];
  let saveResult = receipt,
    failSave = false,
    valid = true;
  const fixture = {
    NextResponse: { json: (body, options) => Response.json(body, options) },
    after: (callback) => tasks.push(callback),
    sameOrigin: () => true,
    readJson: async () => ({}),
    rateLimit: async () => true,
    inquiryStoreReady: () => true,
    localMode: () => true,
    contactRequestSchema: () => ({
      safeParse: () => ({
        success: valid,
        data: {
          idempotencyKey: id,
          service: "webtoon",
          attribution: { submitPath: "/content/contact" },
        },
        error: { issues: [{ message: "invalid" }] },
      }),
    }),
    saveInquiry: async () => {
      if (failSave) throw new Error("synthetic");
      return saveResult;
    },
    notifyInquiry: async (id) => notifications.push(id),
    sendMetaLead: async (...args) => meta.push(args),
  };
  globalValue(t, "__contactFixture", fixture);
  let source = readFileSync("app/api/contact/route.ts", "utf8").replace(
    /^import .* from .*;\r?$/gm,
    "",
  );
  source =
    "const {" +
    Object.keys(fixture).join(",") +
    "}=globalThis.__contactFixture;\n" +
    source;
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
    },
  }).outputText;
  const { POST } = await import(
    "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
  );
  const response = await POST(request());
  assert.equal(response.status, 201);
  assert.equal(meta.length, 0);
  assert.equal(tasks.length, 2);
  await Promise.all(tasks.splice(0).map((callback) => callback()));
  assert.equal(meta.length, 1);
  assert.equal(meta[0][1].inquiryId, id);
  assert.deepEqual(notifications, [id]);
  saveResult = { ...receipt, duplicate: true };
  assert.equal((await POST(request())).status, 200);
  assert.equal(tasks.length, 0);
  failSave = true;
  assert.equal((await POST(request())).status, 503);
  assert.equal(tasks.length, 0);
  failSave = false;
  valid = false;
  assert.equal((await POST(request())).status, 400);
  assert.equal(tasks.length, 0);
});
