import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { gaReport } from "../lib/ga.ts";
// Google is never contacted. The private key is generated for this process only.
test("GA server contract: missing setup, real response parsing, caching and sanitized failures", async () => {
  const names = [
    "GA4_PROPERTY_ID",
    "NEXT_PUBLIC_GA_ID",
    "GOOGLE_APPLICATION_CREDENTIALS",
    "GOOGLE_SERVICE_ACCOUNT_EMAIL",
    "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
  ];
  const saved = Object.fromEntries(names.map((n) => [n, process.env[n]]));
  const originalFetch = globalThis.fetch;
  let calls = [];
  let mode = "ok";
  try {
    for (const n of names) delete process.env[n];
    globalThis.fetch = async (url, options) => {
      calls.push({ url: String(url), body: options.body });
      if (String(url).includes("oauth2")) {
        if (mode === "auth")
          return Response.json(
            {
              error: "invalid_grant",
              error_description: "SECRET_MUST_NOT_LEAK",
            },
            { status: 400 },
          );
        return Response.json({ access_token: "test-only-token" });
      }
      assert.match(options.headers.Authorization, /test-only-token/);
      assert.ok(options.signal);
      assert.equal(options.cache, "no-store");
      const requests = JSON.parse(options.body).requests;
      assert.ok(requests.length <= 5);
      if (mode === "permission")
        return Response.json(
          { error: { message: "SECRET_MUST_NOT_LEAK" } },
          { status: 403 },
        );
      if (mode === "disabled")
        return Response.json(
          { error: { details: [{ reason: "SERVICE_DISABLED" }] } },
          { status: 403 },
        );
      if (mode === "quota") return Response.json({}, { status: 429 });
      if (mode === "network") throw new Error("SECRET_MUST_NOT_LEAK");
      if (mode === "missing") return Response.json({ reports: [] });
      return Response.json({
        reports: requests.map((r) => ({
          rows: r.dimensions.length
            ? []
            : [{ metricValues: r.metrics.map(() => ({ value: "2" })) }],
          metadata: { timeZone: "Asia/Seoul" },
        })),
      });
    };
    let r = await gaReport();
    assert.equal(r.status, "invalid_config");
    assert.equal(calls.length, 0);
    process.env.GA4_PROPERTY_ID = "900001";
    process.env.NEXT_PUBLIC_GA_ID = "G-TEST123";
    r = await gaReport();
    assert.equal(r.status, "not_configured");
    assert.equal(r.totals, undefined);
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "local-test@example.invalid";
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = "malformed-local-test-key";
    r = await gaReport();
    assert.equal(r.status, "invalid_config");
    assert.equal(calls.length, 0);
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = generateKeyPairSync(
      "rsa",
      {
        modulusLength: 2048,
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
        publicKeyEncoding: { type: "spki", format: "pem" },
      },
    ).privateKey;
    const [a, b] = await Promise.all([gaReport(7), gaReport(7)]);
    assert.equal(a.connected, true);
    assert.deepEqual(a, b);
    assert.equal(a.totals.leads, 2);
    assert.equal(calls.length, 3);
    await gaReport(7);
    assert.equal(calls.length, 3);
    await gaReport(28);
    assert.equal(calls.length, 6);
    for (const [i, [scenario, status]] of Object.entries(
      Object.entries({
        auth: "authentication",
        permission: "permission",
        disabled: "api_disabled",
        quota: "quota",
        network: "unavailable",
        missing: "unavailable",
      }),
    )) {
      mode = scenario;
      process.env.GA4_PROPERTY_ID = String(910000 + Number(i));
      r = await gaReport(90);
      assert.equal(r.status, status);
      assert.equal(r.connected, false);
      assert.equal(r.totals, undefined);
      assert.doesNotMatch(
        JSON.stringify(r),
        /SECRET_MUST_NOT_LEAK|test-only-token|BEGIN PRIVATE/,
      );
    }
    // An error is never cached as a successful empty report.
    mode = "ok";
    r = await gaReport(90);
    assert.equal(r.connected, true);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [n, v] of Object.entries(saved))
      if (v === undefined) delete process.env[n];
      else process.env[n] = v;
  }
});
