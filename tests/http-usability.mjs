// Manual localhost integration regression; creates only disposable, synthetic loopback data.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
const base = "http://127.0.0.1:3100",
  adapter = "http://127.0.0.1:3102";
const env = Object.fromEntries(
  (await readFile(".env.local", "utf8"))
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    }),
);
assert.equal(env.NEXT_PUBLIC_SUPABASE_URL, adapter);
assert.equal(env.SUPABASE_SERVICE_ROLE_KEY, "local-qa-only");
const results = [];
const login = await fetch(base + "/api/admin/login", {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: base },
  body: JSON.stringify({
    username: env.ADMIN_USERNAME,
    password: env.ADMIN_PASSWORD,
  }),
});
assert.equal(login.status, 200);
const cookie = login.headers.get("set-cookie").split(";")[0];
const call = (path, method = "GET", body) =>
  fetch(base + path, {
    method,
    headers: {
      Cookie: cookie,
      Origin: base,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
function pass(name) {
  results.push({ name, status: "PASS" });
  console.log("PASS", name);
}
const target = "페이지경계-" + randomUUID();
let id;
for (let i = 0; i < 61; i++) {
  const r = await fetch(adapter + "/rest/v1/rpc/submit_website_inquiry", {
    method: "POST",
    headers: { apikey: "local-qa-only", "Content-Type": "application/json" },
    body: JSON.stringify({
      p_payload: {
        name: i === 0 ? target : "후속 합성 문의 " + i,
        email: "regression-" + i + "@example.test",
        phone: "",
        company: "LOCAL QA ONLY",
        division: "development",
        service: "website",
        message: "회귀 검증 전용이며 실제 고객이 아닙니다.",
        consent: true,
        idempotencyKey: randomUUID(),
        attribution: {
          landingPath: "/lab",
          submitPath: "/lab/contact",
          utm: {},
        },
      },
    }),
  });
  assert.equal(r.status, 200);
  const data = await r.json();
  if (i === 0) id = data.inquiryId;
}
const first = await (await call("/api/admin/inquiries")).json();
assert.equal(first.items.length, 50);
assert.ok(!first.items.some((x) => x.id === id));
const found = await (
  await call("/api/admin/inquiries?search=" + encodeURIComponent(target))
).json();
assert.equal(found.total, 1);
assert.equal(found.items[0].id, id);
pass("Search finds an inquiry beyond first 50 rows");
assert.equal(
  (await (await call("/api/admin/inquiries?page=2")).json()).items.length,
  Math.min(50, Math.max(0, first.total - 50)),
);
pass("Second page loads independently");
await call("/api/admin/inquiries", "PATCH", {
  id,
  status: "replied",
  note: "회귀 검사",
});
assert.equal(
  (
    await (
      await call(
        "/api/admin/inquiries?status=new&search=" + encodeURIComponent(target),
      )
    ).json()
  ).total,
  0,
);
assert.equal(
  (
    await (
      await call(
        "/api/admin/inquiries?status=replied&search=" +
          encodeURIComponent(target),
      )
    ).json()
  ).total,
  1,
);
pass("Global search and status filter combine correctly");
assert.equal(
  (await (await call("/api/admin/inquiries?search=%25")).json()).total,
  0,
);
pass("Percent search is literal, not a wildcard");
const entry = {
  type: "reference",
  division: "development",
  service: "website",
  slug: "safe-cover-regression",
  title: "검증용 이미지",
  summary: "",
  body: "로컬 검증 전용",
  cover_url: "https://www.youtube.com/watch?v=123",
  video_url: "",
  kind: "example",
  rights_confirmed: true,
  is_published: true,
  is_featured: false,
  display_order: 0,
};
assert.equal((await call("/api/admin/entries", "POST", entry)).status, 400);
assert.equal(
  (
    await call("/api/admin/entries", "POST", {
      ...entry,
      cover_url: "https://other.supabase.co/storage/v1/object/public/a.webp",
    })
  ).status,
  400,
);
pass("Video and foreign storage URLs cannot be saved as cover images");
const direct = await fetch(adapter + "/rest/v1/website_entries", {
  method: "POST",
  headers: {
    apikey: "local-qa-only",
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  body: JSON.stringify(entry),
});
assert.equal(direct.status, 201);
assert.equal((await call("/lab/work/safe-cover-regression")).status, 200);
assert.equal(
  (
    await call("/api/admin/entries", "POST", {
      ...entry,
      id: (await direct.json())[0].id,
      cover_url: "",
      is_published: false,
    })
  ).status,
  200,
);
pass("Invalid legacy cover does not crash public entry rendering");
const invalidPhone = {
  name: "QA",
  email: "",
  phone: "++++++",
  company: "",
  division: "development",
  service: "website",
  message: "로컬 회귀 검증",
  consent: true,
  website: "",
  idempotencyKey: randomUUID(),
  attribution: {
    landingPath: "/",
    submitPath: "/contact",
    referrer: "",
    utm: {},
  },
};
assert.equal((await call("/api/contact", "POST", invalidPhone)).status, 400);
pass("Punctuation alone is rejected as a phone number");
const fd = new FormData();
fd.set("file", new Blob(["test"], { type: "text/plain" }), "test.txt");
assert.equal(
  (
    await fetch(base + "/api/admin/media", {
      method: "POST",
      headers: { Cookie: cookie, Origin: base },
      body: fd,
    })
  ).status,
  400,
);
pass("Non-image upload is rejected before Storage");
await writeFile(
  (process.env.AIO_QA_OUTPUT_DIR || "docs/renewal/iteration-v03") +
    "/http-usability.json",
  JSON.stringify(
    {
      at: new Date().toISOString(),
      environment:
        "Local Next + loopback adapter + actual PGlite, not live Supabase",
      results,
    },
    null,
    2,
  ),
);
console.log("Regression flows", results.length);
