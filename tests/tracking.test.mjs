import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { shortLinkDestination } from "../lib/tracking-config.ts";
import {
  captureAttribution,
  submissionAttribution,
  cleanUtm,
  utmValueLimit,
} from "../lib/attribution.ts";
import {
  track,
  trackLead,
  trackFormStart,
  pageTracking,
} from "../lib/tracking-events.ts";
import {
  trackedContactSchema,
  contactSchema,
  contactRequestSchema,
} from "../lib/domain.ts";
import { services } from "../lib/content.ts";
import {
  csvLine,
  inquiryCsvHeaders,
  inquiryCsvRow,
} from "../lib/inquiry-csv.ts";
import { saveInquiry } from "../lib/inquiry-submit.ts";
import { inquiryList, inquiryDetail, localDb } from "../lib/local-store.ts";

test("short links construct five UTMs from approved identifiers and reject every malformed component", () => {
  for (const [key, source] of Object.entries({
    yt: "youtube",
    ig: "instagram",
    fb: "facebook",
    th: "threads",
  })) {
    const url = new URL(
      shortLinkDestination(["a001", key], new URLSearchParams()),
      "https://example.test",
    );
    assert.equal(url.pathname, "/content/contact");
    assert.deepEqual(Object.fromEntries(url.searchParams), {
      utm_source: source,
      utm_medium: "social",
      utm_campaign: "a001_aio_contents",
      utm_term: "profile",
    });
  }
  const content = new URL(
    shortLinkDestination(
      ["a001", "c", "A01_test-7"],
      new URLSearchParams(
        "s=yt&p=description&redirect=https://example.test&email=private",
      ),
    ),
    "https://example.test",
  );
  assert.equal(content.searchParams.get("utm_content"), "A01_test-7");
  assert.equal(content.searchParams.size, 5);
  for (const [segments, query] of [
    [["a002", "yt"], ""],
    [["a01", "yt"], ""],
    [["__proto__", "yt"], ""],
    [["a001", "bad"], ""],
    [["a001", "c", "bad@id"], "s=yt&p=post"],
    [["a001", "c", "good"], "s=bad&p=post"],
    [["a001", "c", "good"], "s=yt&p=bad"],
    [["a001", "c", "good"], "s=yt&s=ig&p=post"],
    [["a001", "yt", "extra"], ""],
    [["a001", "yt"], "p=bad"],
  ])
    assert.equal(
      shortLinkDestination(segments, new URLSearchParams(query)),
      "/content/contact",
    );
  const withoutPlacement = new URL(
    shortLinkDestination(
      ["a001", "c", "A01_test-7"],
      new URLSearchParams("s=yt"),
    ),
    "https://example.test",
  );
  assert.equal(withoutPlacement.searchParams.size, 4);
  assert.equal(withoutPlacement.searchParams.get("utm_content"), "A01_test-7");
  assert.equal(
    withoutPlacement.searchParams.get("utm_campaign"),
    "a001_aio_contents",
  );
  assert.equal(withoutPlacement.searchParams.has("utm_term"), false);
});

function browser() {
  const jar = new Map(),
    written = [],
    values = new Map();
  const document = {
    referrer: "https://example.test/start?email=hidden#value",
    title: "Page",
  };
  Object.defineProperty(document, "cookie", {
    configurable: true,
    get: () => [...jar].map(([key, value]) => key + "=" + value).join("; "),
    set: (value) => {
      written.push(value);
      const item = value.split(";")[0];
      const split = item.indexOf("=");
      jar.set(item.slice(0, split), item.slice(split + 1));
    },
  });
  globalThis.document = document;
  globalThis.location = {
    pathname: "/content/contact",
    search: "",
    protocol: "https:",
  };
  globalThis.sessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  globalThis.window = { dataLayer: [] };
  return { jar, written, values };
}
test("first touch lasts across a new session, current UTM stays in its session, recent click IDs update independently", () => {
  const env = browser();
  captureAttribution(
    "/content",
    new URLSearchParams("utm_source=youtube&utm_content=first&gclid=first_id"),
  );
  const firstCookie = env.jar.get("aio_first_touch");
  captureAttribution(
    "/content/contact",
    new URLSearchParams(
      "utm_source=instagram&utm_content=second&gclid=latest_id&fbclid=fb_id&NaPm=ct%3Dabc%7Cci%3Ddef",
    ),
  );
  let submitted = submissionAttribution();
  assert.equal(submitted.utm.utm_source, "youtube");
  assert.equal(submitted.clickIds.gclid, "latest_id");
  assert.equal(submitted.clickIds.NaPm, "ct=abc|ci=def");
  assert.equal(submitted.referrer, "https://example.test/start");
  assert.equal(env.jar.get("aio_first_touch"), firstCookie);
  assert.ok(
    env.written.every(
      (value) =>
        value.includes("Max-Age=7776000") &&
        value.includes("SameSite=Lax") &&
        value.includes("Secure"),
    ),
  );
  env.values.clear(); // Next-day direct visit: a new session retains the first-party cookie.
  submitted = submissionAttribution();
  assert.deepEqual(submitted.utm, {});
  assert.equal(submitted.firstTouch.utm.utm_source, "youtube");
  assert.equal(submitted.firstTouch.landingPath, "/content");
  assert.equal(submitted.clickIds.fbclid, "fb_id");
});
test("blocked or malformed storage never blocks attribution retrieval or the form", () => {
  const env = browser();
  env.values.set("aio_renewal_utm", "{");
  assert.doesNotThrow(() => submissionAttribution());
  globalThis.sessionStorage = {
    getItem: () => {
      throw Error("denied");
    },
    setItem: () => {
      throw Error("denied");
    },
  };
  Object.defineProperty(globalThis.document, "cookie", {
    configurable: true,
    get: () => {
      throw Error("denied");
    },
    set: () => {
      throw Error("denied");
    },
  });
  assert.doesNotThrow(() => submissionAttribution());
});
test("purpose and found-via are checked on the server-facing schema without invalidating historical envelopes", () => {
  const base = {
    name: "fixture",
    email: "fixture@example.test",
    phone: "",
    company: "",
    division: "video",
    service: "webtoon",
    message: "tracking fixture",
    consent: true,
    website: "",
    idempotencyKey: randomUUID(),
    attribution: {
      landingPath: "/content",
      submitPath: "/content/contact",
      referrer: "",
      utm: {},
    },
  };
  assert.equal(trackedContactSchema.safeParse(base).success, false);
  assert.equal(
    contactSchema.safeParse(base).success,
    true,
    "historical video envelopes remain readable",
  );
  for (const service of services.filter(
    (value) => value.division === "video",
  )) {
    for (const formId of [
      undefined,
      "general_contact",
      "guide_inquiry",
      "content_contact",
    ]) {
      assert.equal(
        trackedContactSchema.safeParse({
          ...base,
          service: service.id,
          formId,
          attribution: { ...base.attribution, submitPath: "/" },
        }).success,
        false,
        `${service.id}/${formId} cannot bypass purpose by changing form identity or path`,
      );
    }
  }
  for (const [division, service] of [
    ["marketing", "integrated"],
    ["marketing", "ai-influencer"],
    ["development", "website"],
  ]) {
    for (const formId of [undefined, "general_contact", "guide_inquiry"]) {
      const other = { ...base, division, service, formId };
      assert.equal(
        trackedContactSchema.safeParse(other).success,
        true,
        "non-content forms remain compatible regardless of client submitPath",
      );
      assert.equal(
        contactRequestSchema(true).safeParse(other).success,
        false,
        "server content-page context blocks simultaneous body-signal tampering",
      );
    }
  }
  assert.equal(
    trackedContactSchema.safeParse({
      ...base,
      division: "marketing",
      service: "integrated",
      formId: "content_contact",
      purpose: "unknown",
    }).success,
    false,
    "content identity must match the service classification",
  );
  assert.equal(
    trackedContactSchema.safeParse({ ...base, purpose: "unknown" }).success,
    true,
  );
  assert.equal(
    trackedContactSchema.safeParse({ ...base, purpose: "made_up" }).success,
    false,
  );
  assert.equal(
    trackedContactSchema.safeParse({
      ...base,
      purpose: "sales_ad",
      found_via: "made_up",
    }).success,
    false,
  );
});
test("external UTM punctuation, whitespace and Korean survive session, cookie and server normalization", () => {
  browser();
  const input = {
    utm_source: "  m.facebook.com \n",
    utm_campaign: " spring sale ",
    utm_term: "문\u0000의\u0085",
    utm_medium: "cpc",
    utm_content: "콘텐츠".repeat(80),
    name: "PRIVATE",
  };
  const normalized = cleanUtm(input);
  assert.equal(normalized.utm_source, "m.facebook.com");
  assert.equal(normalized.utm_campaign, "spring sale");
  assert.equal(normalized.utm_term, "문의");
  assert.equal(Array.from(normalized.utm_content).length, utmValueLimit);
  assert.equal(normalized.name, undefined);
  captureAttribution("/content", new URLSearchParams(input));
  const attribution = submissionAttribution();
  assert.deepEqual(attribution.utm, normalized);
  assert.deepEqual(attribution.firstTouch.utm, normalized);
  const parsed = trackedContactSchema.parse({
    name: "fixture",
    email: "fixture@example.test",
    phone: "",
    company: "",
    division: "video",
    service: "webtoon",
    formId: "content_contact",
    purpose: "unknown",
    message: "tracking fixture",
    consent: true,
    website: "",
    idempotencyKey: randomUUID(),
    attribution: {
      ...attribution,
      utm: input,
      firstTouch: { ...attribution.firstTouch, utm: input },
    },
  });
  assert.deepEqual(parsed.attribution.utm, normalized);
  assert.deepEqual(parsed.attribution.firstTouch.utm, normalized);
  trackLead({ inquiryId: randomUUID(), duplicate: false }, parsed);
  const lead = window.dataLayer.find((value) => value.event === "aio_lead");
  assert.equal(
    lead.utm_source,
    undefined,
    "external free-form UTM is preserved in storage but not copied into dataLayer",
  );
  assert.equal(lead.utm_medium, "cpc");
});

test("lead emits exactly once per successful saved ID; duplicates and missing IDs emit zero; no PII enters the event", () => {
  browser();
  const id = randomUUID(),
    attribution = {
      landingPath: "/",
      submitPath: "/content/contact",
      referrer: "",
      utm: { utm_source: "youtube" },
    };
  const payload = {
    name: "PRIVATE NAME",
    email: "PRIVATE EMAIL",
    message: "PRIVATE MESSAGE",
    division: "video",
    service: "webtoon",
    purpose: "sales_ad",
    attribution,
  };
  assert.equal(trackLead({ inquiryId: id, duplicate: true }, payload), false);
  assert.equal(trackLead({}, payload), false);
  assert.equal(trackLead({ inquiryId: id, duplicate: false }, payload), true);
  assert.equal(trackLead({ inquiryId: id, duplicate: false }, payload), false);
  track("aio_form_error", { error_field: "purpose", name: "PRIVATE NAME" });
  const form = {};
  trackFormStart(form);
  trackFormStart(form);
  assert.equal(
    window.dataLayer.filter((event) => event.event === "aio_form_start").length,
    1,
  );
  assert.equal(
    window.dataLayer.filter((event) => event.event === "aio_lead").length,
    1,
  );
  assert.ok(!JSON.stringify(window.dataLayer).includes("PRIVATE"));
  assert.equal(pageTracking("/content/services/webtoon").service, "webtoon");
  assert.equal(
    pageTracking("/content/insights/example").contentType,
    "insight",
  );
});
test("saved JSON fields, server filtering beyond page one, and CSV fields agree without schema migration", async () => {
  delete globalThis.window;
  delete globalThis.document;
  delete globalThis.location;
  delete globalThis.sessionStorage;
  process.env.LOCAL_ADMIN_ENABLED = "true";
  process.env.LOCAL_DATA_DIR = await mkdtemp(
    path.join(tmpdir(), "aio-tracking-"),
  );
  delete process.env.VERCEL;
  try {
    const db = await localDb();
    const id = randomUUID(),
      source = {
        landingPath: "/content",
        submitPath: "/content/contact",
        referrer: "",
        utm: { utm_campaign: "a001_aio_contents", utm_content: "target" },
        firstTouch: {
          landingPath: "/content",
          date: new Date().toISOString(),
          utm: { utm_source: "youtube" },
        },
        clickIds: { gclid: "fixture_id" },
      };
    const payload = {
      name: "=fixture",
      email: "fixture@example.test",
      phone: "",
      company: "",
      division: "video",
      service: "webtoon",
      message: "tracking fixture",
      consent: true,
      website: "",
      idempotencyKey: id,
      purpose: "sales_ad",
      found_via: "youtube",
      attribution: source,
    };
    await saveInquiry({
      version: 1,
      id,
      receivedAt: "2026-01-01T00:00:00.000Z",
      payload,
    });
    for (let i = 0; i < 51; i++) {
      const other = randomUUID();
      await db.query(
        "INSERT INTO inquiries(id,envelope,created_at) VALUES($1,$2,$3)",
        [
          other,
          JSON.stringify({
            version: 1,
            id: other,
            receivedAt: new Date().toISOString(),
            payload: {
              ...payload,
              idempotencyKey: other,
              purpose: "unknown",
              attribution: { ...source, utm: {} },
            },
          }),
          new Date().toISOString(),
        ],
      );
    }
    assert.equal(
      (await inquiryList()).items.some((item) => item.id === id),
      false,
    );
    const result = await inquiryList("all", "", 1, {
      utm_campaign: "a001_aio_contents",
      utm_content: "target",
      purpose: "sales_ad",
    });
    assert.equal(result.total, 1);
    assert.equal(result.items[0].leads.source_meta.found_via, "youtube");
    assert.equal(
      (await inquiryList("all", "", 1, { utm_content: "' OR 1=1 --" })).total,
      0,
    );
    const item = (await inquiryDetail(id)).item;
    const csv = csvLine(inquiryCsvHeaders) + inquiryCsvRow(item);
    assert.ok(
      csv.includes('"purpose"') &&
        csv.includes('"first_utm_source"') &&
        csv.includes('"sales_ad"'),
    );
    assert.ok(csv.includes("'=fixture"));
    assert.ok(!csv.includes("fixture_id"));
  } finally {
    await (await localDb()).close();
    delete globalThis.aioLocalDb;
  }
});
