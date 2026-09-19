import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
const base = "http://127.0.0.1:3319";
const req = async (path, options = {}) =>
  fetch(base + path, { ...options, redirect: "manual" });
for (const [path, code, target] of [
  ["/", 308, "/ko"],
  ["/sitemap-0.xml", 308, "/sitemap.xml"],
  ["/services/video", 307, "/ko#business"],
  ["/quote", 308, "/ko/quote"],
  ["/en/services/marketing", 308, "/ko/services/marketing"],
  ["/en/removed", 308, "/ko"],
  ["/ko/services/video", 307, "/ko#business"],
  ["/ko/services/development/portfolio", 307, "/ko#business"],
]) {
  const r = await req(path);
  assert.equal(r.status, code, path);
  assert.equal(
    new URL(r.headers.get("location")).pathname +
      new URL(r.headers.get("location")).hash,
    target,
  );
}
const sitemap = await (await req("/sitemap.xml")).text();
assert(!sitemap.includes("/en"));
assert(!sitemap.includes("/services/video"));
assert(!sitemap.includes("hreflang"));
assert.equal((await req("/api/admin/marketing-consultations")).status, 401);
assert.equal((await req("/api/admin/marketing-content")).status, 401);
assert.equal(
  (
    await req("/api/integrations/marketing/dispatch", {
      method: "POST",
      body: "{}",
    })
  ).status,
  401,
);
const p = {
  locale: "ko",
  category: "marketing",
  idempotencyKey: crypto.randomUUID(),
  company: "API 시험",
  name: "시험",
  email: "api@example.com",
  phone: "01000000000",
  industry: "테스트",
  region: "로컬",
  description: "원자적 저장 시험",
  consent_privacy: true,
  consent_version: "local-test-v1",
  attribution: {
    entry_path: "/ko",
    referrer: "",
    utm_source: "test",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    content_id: "",
    reference_case: "",
  },
};
const post = async (payload) => {
  const r = await req("/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { status: r.status, body: await r.json() };
};
const first = await post(p);
assert.equal(first.status, 201, JSON.stringify(first));
const again = await post(p);
assert.equal(first.body.data.quoteId, again.body.data.quoteId);
assert.equal((await post({ ...p, category: "video" })).status, 400);
assert.equal((await post({ ...p, locale: "en" })).status, 400);
assert.equal((await post({ ...p, consent_privacy: false })).status, 400);
assert.equal((await post({ ...p, consent_version: "old" })).status, 409);
const raw = new URLSearchParams({
  payload: JSON.stringify({
    user: { id: "unauthorized" },
    team: { id: "team-test" },
    channel: { id: "channel-test" },
    actions: [],
  }),
}).toString();
const timestamp = String(Math.floor(Date.now() / 1000));
const sig =
  "v0=" +
  createHmac("sha256", "local-test-signing")
    .update(`v0:${timestamp}:${raw}`)
    .digest("hex");
assert.equal(
  (
    await req("/api/integrations/marketing/slack", {
      method: "POST",
      body: raw,
      headers: {
        "x-slack-request-timestamp": timestamp,
        "x-slack-signature": sig,
      },
    })
  ).status,
  403,
);
assert.equal(
  (
    await req("/api/integrations/marketing/slack", {
      method: "POST",
      body: raw,
      headers: {
        "x-slack-request-timestamp": timestamp,
        "x-slack-signature": "invalid",
      },
    })
  ).status,
  401,
);
for (const file of ["marketing-checklist", "consultation-prep"])
  assert.equal((await req("/resources/" + file + ".txt")).status, 200);
console.log(
  "PASS HTTP: redirects, sitemap, private APIs, unauthorized approvals, idempotent intake, locale/service/consent validation, downloads",
);
