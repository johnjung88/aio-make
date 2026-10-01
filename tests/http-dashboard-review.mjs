// Loopback-only regression of list counts and GA endpoint behavior.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
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
assert.equal(env.NEXT_PUBLIC_SUPABASE_URL, "http://127.0.0.1:3102");
assert.equal(env.SUPABASE_SERVICE_ROLE_KEY, "local-qa-only");
const login = await fetch(base + "/api/admin/login", {
  method: "POST",
  headers: { Origin: base, "Content-Type": "application/json" },
  body: JSON.stringify({
    username: env.ADMIN_USERNAME,
    password: env.ADMIN_PASSWORD,
  }),
});
assert.equal(login.status, 200);
const Cookie = login.headers.get("set-cookie").split(";")[0];
const get = (path) => fetch(base + path, { headers: { Cookie } });
const results = [];
const pass = (name) => {
  results.push({ name, status: "PASS" });
  console.log("PASS", name);
};
const before = await (await get("/api/admin/entries")).json();
assert.equal(before.connected, true);
for (let i = 0; i < 205; i++) {
  const res = await fetch("http://127.0.0.1:3102/rest/v1/website_entries", {
    method: "POST",
    headers: { apikey: "local-qa-only", "Content-Type": "application/json" },
    body: JSON.stringify({
      type: i % 2 ? "reference" : "insight",
      division: "marketing",
      service: "integrated",
      slug: "qa-count-" + i,
      title: "로컬 목록 시험 " + i,
      summary: "검수용 합성 데이터",
      body: "실제 고객 콘텐츠가 아닌 로컬 목록 시험입니다.",
      cover_url: "/renewal/marketing-content-v03.webp",
      kind: "example",
      rights_confirmed: true,
      is_published: i < 155,
      display_order: i,
    }),
  });
  assert.equal(res.status, 201);
}
const first = await (await get("/api/admin/entries")).json();
const last = await (await get("/api/admin/entries?page=5")).json();
assert.equal(first.total, before.total + 205);
assert.equal(first.publishedCount, before.publishedCount + 155);
assert.equal(first.items.length, 50);
assert.ok(last.items.length > 0);
assert.equal(
  new Set([...first.items, ...last.items].map((e) => e.id)).size,
  first.items.length + last.items.length,
);
pass(
  "Content totals and published count include entries beyond 200, with distinct pages",
);
const insight = await (
  await get("/api/admin/entries?type=insight&page=2")
).json();
assert.ok(insight.total >= 103);
assert.ok(insight.items.every((e) => e.type === "insight"));
assert.equal(insight.publishedCount, first.publishedCount);
pass(
  "Content type filters apply on the server; global published count stays stable",
);
for (const path of [
  "/api/admin/entries?page=-1",
  "/api/admin/entries?type=unknown",
  "/api/admin/analytics?days=14",
])
  assert.equal((await get(path)).status, 400);
pass("Invalid content pagination, type and analytics period return 400");
for (const days of [7, 28, 90]) {
  const res = await get("/api/admin/analytics?days=" + days);
  assert.match(res.headers.get("cache-control"), /no-store/);
  const ga = await res.json();
  assert.equal(ga.days, days);
  assert.equal(ga.connected, false);
  assert.equal(ga.totals, undefined);
}
pass(
  "7/28/90 day queries preserve period and never invent metrics without Google authorization",
);
await writeFile(
  "docs/review-v04/http-dashboard.json",
  JSON.stringify(
    {
      at: new Date().toISOString(),
      environment:
        "Next development + loopback PGlite adapter, synthetic records only",
      results,
    },
    null,
    2,
  ),
);
