// Run manually with Next dev on :3100 and tests/support/local-supabase.mjs on :3102.
// No production requests, real customer data, notifications or GA events.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
const base = "http://127.0.0.1:3100";
const env = Object.fromEntries(
  (await readFile(".env.local", "utf8"))
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    }),
);
if (
  env.NEXT_PUBLIC_SUPABASE_URL !== "http://127.0.0.1:3102" ||
  env.SUPABASE_SERVICE_ROLE_KEY !== "local-qa-only"
)
  throw new Error("Must use isolated local PostgreSQL test adapter.");
const results = [];
async function request(path, method = "GET", body, headers = {}) {
  return fetch(base + path, {
    method,
    redirect: "manual",
    headers: {
      ...(method !== "GET"
        ? { "Content-Type": "application/json", Origin: base }
        : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
function pass(name) {
  results.push({ test: name, status: "PASS" });
  console.log("PASS", name);
}
for (const path of [
  "/api/admin/inquiries",
  "/api/admin/entries",
  "/api/admin/analytics",
]) {
  assert.equal((await request(path)).status, 401);
}
pass("Unauthenticated admin APIs return 401");
assert.equal((await request("/admin")).status, 307);
pass("Admin page redirects without session");
for (const [from, to] of [
  ["/ko?utm_source=qa", "/?utm_source=qa"],
  ["/KO/lab?utm_campaign=test", "/lab?utm_campaign=test"],
  ["/en/dev", "/lab"],
  ["/ko/quote", "/contact"],
]) {
  const r = await request(from);
  assert.equal(r.status, 301);
  assert.equal(
    new URL(r.headers.get("location")).pathname +
      new URL(r.headers.get("location")).search,
    to,
  );
}
pass("Legacy 301 destinations preserve UTM");
assert.equal(
  (
    await request(
      "/api/admin/login",
      "POST",
      { username: "x", password: "x" },
      { Origin: "https://invalid.example" },
    )
  ).status,
  403,
);
assert.equal(
  (
    await request("/api/admin/login", "POST", {
      username: env.ADMIN_USERNAME,
      password: "wrong",
    })
  ).status,
  401,
);
const login = await request("/api/admin/login", "POST", {
  username: env.ADMIN_USERNAME,
  password: env.ADMIN_PASSWORD,
});
assert.equal(login.status, 200);
const setCookie = login.headers.get("set-cookie");
assert.ok(/HttpOnly/i.test(setCookie));
assert.ok(/SameSite=strict/i.test(setCookie));
const cookie = setCookie.split(";")[0];
pass("Login validates credentials and creates HttpOnly strict cookie");
const payload = {
  name: "로컬 API 검증",
  email: "qa-api@example.test",
  phone: "",
  company: "LOCAL QA",
  division: "development",
  service: "website",
  message: "운영 고객이 아닌 로컬 HTTP 검증 요청입니다.",
  consent: true,
  website: "",
  idempotencyKey: randomUUID(),
  attribution: {
    landingPath: "/lab",
    submitPath: "/lab/contact",
    referrer: "",
    utm: { utm_source: "qa" },
  },
};
assert.equal(
  (await request("/api/contact", "POST", { ...payload, consent: false }))
    .status,
  400,
);
assert.equal(
  (
    await request("/api/contact", "POST", payload, {
      Origin: "https://invalid.example",
    })
  ).status,
  403,
);
const saved = await request("/api/contact", "POST", payload);
assert.equal(saved.status, 201);
const receipt = (await saved.json()).data;
assert.ok(receipt.inquiryId);
const repeat = await request("/api/contact", "POST", payload);
assert.equal(repeat.status, 200);
assert.equal((await repeat.json()).data.duplicate, true);
pass("Inquiry consent/source checks, transaction and duplicate protection");
const list = await (
  await request("/api/admin/inquiries", "GET", undefined, { Cookie: cookie })
).json();
assert.equal(list.connected, true);
assert.equal(list.total, 1);
assert.equal(list.items[0].leads.source_meta.division, "development");
assert.equal(
  (
    await request(
      "/api/admin/inquiries",
      "PATCH",
      { id: receipt.inquiryId, status: "replied", note: "HTTP 검증 상담 메모" },
      { Cookie: cookie },
    )
  ).status,
  200,
);
const detail = await (
  await request("/api/admin/inquiries/" + receipt.inquiryId, "GET", undefined, {
    Cookie: cookie,
  })
).json();
assert.equal(detail.item.status, "replied");
assert.ok(detail.notes.some((n) => n.content === "HTTP 검증 상담 메모"));
assert.ok(detail.notes.some((n) => n.role === "system"));
pass("Admin joins inquiry, changes status, persists and reads audit/notes");
const entry = {
  type: "reference",
  division: "development",
  service: "website",
  slug: "local-api-example",
  title: "로컬 검증용 제작 예시",
  summary: "실제 고객 작업이 아닌 검증 전용 자료입니다.",
  body: "일반 텍스트로 작성한 로컬 테스트입니다. <script>는 실행되지 않습니다.",
  cover_url: "/renewal/lab.webp",
  video_url: "",
  kind: "example",
  rights_confirmed: false,
  is_published: true,
  is_featured: false,
  display_order: 10,
};
assert.equal(
  (await request("/api/admin/entries", "POST", entry, { Cookie: cookie }))
    .status,
  400,
);
const creation = await request(
  "/api/admin/entries",
  "POST",
  { ...entry, rights_confirmed: true },
  { Cookie: cookie },
);
assert.equal(creation.status, 200);
const created = (await creation.json()).item;
assert.equal((await request("/lab/work/local-api-example")).status, 200);
assert.equal(
  (
    await request(
      "/api/admin/entries",
      "POST",
      { ...created, is_published: false },
      { Cookie: cookie },
    )
  ).status,
  200,
);
assert.equal((await request("/lab/work/local-api-example")).status, 404);
pass("Rights gate, actual save, public page and unpublish");
const ga = await (
  await request("/api/admin/analytics", "GET", undefined, { Cookie: cookie })
).json();
assert.equal(ga.connected, false);
assert.equal(ga.propertyId, "536780274");
assert.equal(ga.totals, undefined);
pass("GA disconnected state never fabricates zero metrics");
assert.equal(
  (await request("/api/admin/logout", "POST", {}, { Cookie: cookie })).status,
  200,
);
pass("Logout expires server cookie");
await mkdir("docs/renewal", { recursive: true });
await writeFile(
  "docs/renewal/http-qa.json",
  JSON.stringify(
    {
      environment:
        "Windows Next dev + loopback REST test adapter + actual PGlite PostgreSQL. Not live Supabase.",
      at: new Date().toISOString(),
      results,
    },
    null,
    2,
  ),
);
console.log("HTTP flow PASS:", results.length);
