import { sameOrigin } from "../lib/origin.ts";
import test from "node:test";
import assert from "node:assert/strict";
import {
  contactSchema,
  entrySchema,
  isSafeMediaUrl,
  isSafeImageUrl,
  safeJsonLd,
} from "../lib/domain.ts";
import { legacyDestination } from "../lib/redirects.ts";
import {
  createToken,
  verifyToken,
  verifyCredentials,
  credentialsReady,
} from "../lib/session.ts";
import { createHmac } from "node:crypto";
const valid = {
  name: "테스트",
  email: "qa@example.test",
  phone: "",
  company: "검증",
  division: "marketing",
  service: "integrated",
  message: "사이트 기능 확인 문의입니다.",
  consent: true,
  website: "",
  idempotencyKey: "550e8400-e29b-41d4-a716-446655440000",
  attribution: {
    landingPath: "/",
    submitPath: "/contact",
    referrer: "",
    utm: {},
  },
};
test("contact requires reachable address, consent and matching service", () => {
  assert.equal(contactSchema.safeParse(valid).success, true);
  for (const value of [
    { email: "", phone: "" },
    { consent: false },
    { division: "video", service: "website" },
    { website: "spam" },
    { message: "a" },
    { email: "not-an-email" },
    { email: "", phone: "++++++" },
    { email: "", phone: "( ) - 12" },
  ])
    assert.equal(
      contactSchema.safeParse({ ...valid, ...value }).success,
      false,
    );
  assert.equal(
    contactSchema.safeParse({ ...valid, email: "", phone: "010-1234-5678" })
      .success,
    true,
  );
});
test("public entry requires confirmed rights and safe media", () => {
  const entry = {
    type: "reference",
    division: "development",
    service: "website",
    slug: "qa-project",
    title: "제작 예시",
    summary: "",
    body: "",
    cover_url: "/renewal/lab.webp",
    video_url: "",
    is_published: true,
    rights_confirmed: true,
  };
  assert.equal(entrySchema.safeParse(entry).success, true);
  assert.equal(
    entrySchema.safeParse({ ...entry, rights_confirmed: false }).success,
    false,
  );
  assert.equal(
    entrySchema.safeParse({ ...entry, cover_url: "javascript:alert(1)" })
      .success,
    false,
  );
  assert.equal(
    entrySchema.safeParse({ ...entry, slug: "../admin" }).success,
    false,
  );
});
test("media URLs reject credentials, traversal, script and untrusted hosts", () => {
  for (const url of [
    "javascript:alert(1)",
    "https://attacker.example/image.png",
    "/renewal/../secret",
    "https://me:pass@www.youtube.com/watch",
  ])
    assert.equal(isSafeMediaUrl(url), false);
  for (const url of [
    "/renewal/hero.webp",
    "https://rohodabwnabpqkxgxbft.supabase.co/storage/v1/object/public/website-media/a.webp",
    "https://www.youtube.com/watch?v=123",
  ])
    assert.equal(isSafeMediaUrl(url), true);
});
test("cover images reject video URLs, foreign storage and private paths", () => {
  for (const url of [
    "https://www.youtube.com/watch?v=123",
    "https://other.supabase.co/storage/v1/object/public/a.webp",
    "https://rohodabwnabpqkxgxbft.supabase.co/storage/v1/object/authenticated/a.webp",
  ])
    assert.equal(isSafeImageUrl(url), false);
  assert.equal(isSafeImageUrl("/renewal/lab.webp"), true);
});
test("legacy locale and service aliases resolve in one step", () => {
  for (const [from, to] of [
    ["/ko", "/"],
    ["/KO/", "/"],
    ["/ko/marketing", "/marketing"],
    ["/en/dev", "/lab"],
    ["/dev", "/lab"],
    ["/ko/quote", "/contact"],
    ["/ko/services/development", "/lab"],
  ])
    assert.equal(legacyDestination(from), to);
  assert.equal(legacyDestination("/lab"), null);
});
test("JSON-LD cannot close the script element", () => {
  assert.equal(
    safeJsonLd({ name: "</script><script>alert(1)" }).includes("<"),
    false,
  );
});
test("admin session rejects missing credentials, tampering, expiration and wrong password", () => {
  process.env.ADMIN_USERNAME = "qa-admin";
  process.env.ADMIN_PASSWORD = "qa-only-not-a-live-password";
  process.env.ADMIN_SESSION_SECRET = "qa-only-" + "x".repeat(40);
  assert.equal(credentialsReady(), true);
  assert.equal(
    verifyCredentials("qa-admin", "qa-only-not-a-live-password"),
    true,
  );
  assert.equal(verifyCredentials("qa-admin", "wrong"), false);
  const token = createToken();
  assert.equal(verifyToken(token), true);
  assert.equal(verifyToken(token + "x"), false);
  const payload = Buffer.from(
    JSON.stringify({ role: "admin", exp: 1 }),
  ).toString("base64url");
  const expired =
    payload +
    "." +
    createHmac("sha256", process.env.ADMIN_SESSION_SECRET)
      .update(payload)
      .digest("base64url");
  assert.equal(verifyToken(expired), false);
  delete process.env.ADMIN_SESSION_SECRET;
  assert.equal(verifyToken(token), false);
});

test("origin checks the actual Host while respecting HTTPS proxy protocol", () => {
  const req = (origin, host = "127.0.0.1:3100", proto = "http") =>
    new Request("http://localhost:3100/api/contact", {
      headers: { Origin: origin, Host: host, "x-forwarded-proto": proto },
    });
  assert.equal(sameOrigin(req("http://127.0.0.1:3100")), true);
  assert.equal(
    sameOrigin(req("https://aio-make.com", "aio-make.com", "https")),
    true,
  );
  assert.equal(
    sameOrigin(req("https://other.example", "aio-make.com", "https")),
    false,
  );
  assert.equal(
    sameOrigin(req("http://aio-make.com", "aio-make.com", "https")),
    false,
  );
  assert.equal(
    sameOrigin(new Request("https://aio-make.com/api/contact")),
    false,
  );
});
