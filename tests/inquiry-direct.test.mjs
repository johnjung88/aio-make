import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  localDb,
  inquiryDb,
  inquiryList,
  inquiryDetail,
  updateInquiry,
  persistentLimit,
} from "../lib/local-store.ts";
import { saveInquiry, notifyInquiry } from "../lib/inquiry-submit.ts";
import { cloudAdminEnabled } from "../lib/inquiry-db.ts";

test("direct submission survives notification failure, deduplicates concurrently and remains manageable", async () => {
  const previous = { ...process.env },
    originalFetch = globalThis.fetch;
  process.env.LOCAL_ADMIN_ENABLED = "true";
  process.env.LOCAL_DATA_DIR = await mkdtemp(
    path.join(tmpdir(), "aio-direct-qa-"),
  );
  delete process.env.VERCEL;
  delete process.env.RESEND_API_KEY;
  const make = () => {
    const id = randomUUID();
    return {
      version: 1,
      id,
      receivedAt: new Date().toISOString(),
      payload: {
        name: "검증 고객",
        email: "qa@example.test",
        phone: "",
        company: "",
        division: "video",
        service: "webtoon",
        message: "실제 고객 문의가 아닌 연동 검증",
        consent: true,
        website: "",
        idempotencyKey: id,
        attribution: {
          landingPath: "/",
          submitPath: "/video/contact",
          referrer: "",
          utm: {},
        },
      },
    };
  };
  try {
    const envelope = make();
    const results = await Promise.all(
      Array.from({ length: 4 }, () => saveInquiry(envelope)),
    );
    assert.equal(results.filter((r) => !r.duplicate).length, 1);
    assert.equal((await inquiryList()).total, 1);
    await assert.rejects(
      saveInquiry({
        ...envelope,
        payload: { ...envelope.payload, message: "변경된 다른 문의 내용" },
      }),
      /IDEMPOTENCY_CONFLICT/,
    );
    assert.equal(await notifyInquiry(envelope.id), "pending");
    assert.equal(
      (await inquiryDetail(envelope.id)).item.raw_text,
      envelope.payload.message,
    );
    process.env.RESEND_API_KEY = "test-only";
    process.env.INQUIRY_EMAIL_FROM = "qa@example.test";
    let sends = 0;
    globalThis.fetch = async () => {
      sends++;
      throw new Error("network timeout");
    };
    assert.equal(await notifyInquiry(envelope.id), "unknown");
    assert.equal(await notifyInquiry(envelope.id), "unchanged");
    assert.equal(sends, 1, "ambiguous delivery must not be sent again");
    assert.equal((await inquiryList()).total, 1);
    await updateInquiry(envelope.id, "replied", "관리자에서 상담 확인");
    assert.equal((await inquiryDetail(envelope.id)).notes.length, 1);
    const second = make();
    await saveInquiry(second);
    globalThis.fetch = async (_, init) => {
      sends++;
      const body = JSON.parse(init.body);
      assert.deepEqual(body.to, ["aiomake2023@gmail.com"]);
      assert.equal(body.reply_to, "qa@example.test");
      assert.equal(init.headers["Idempotency-Key"], "aio-inquiry/" + second.id);
      return Response.json({ id: "test-mail-id" });
    };
    const notified = await Promise.all([
      notifyInquiry(second.id),
      notifyInquiry(second.id),
    ]);
    assert.deepEqual(notified.sort(), ["sent", "unchanged"]);
    assert.equal(sends, 2);
    const limits = await Promise.all(
      Array.from({ length: 8 }, () =>
        persistentLimit("same-client", "login", 5, 60),
      ),
    );
    assert.equal(limits.filter(Boolean).length, 5);
    const db = await inquiryDb();
    const outbox = await db.query(
      "SELECT state FROM inquiry_notifications ORDER BY state",
    );
    assert.deepEqual(
      outbox.rows.map((r) => r.state),
      ["sent", "unknown"],
    );
    delete process.env.ADMIN_WEB_ENABLED;
    assert.equal(cloudAdminEnabled(), false);
    process.env.ADMIN_WEB_ENABLED = "true";
    delete process.env.INQUIRY_DATABASE_URL;
    assert.equal(cloudAdminEnabled(), false);
    process.env.INQUIRY_DATABASE_URL =
      "postgresql://configuration-only.example/db";
    assert.equal(cloudAdminEnabled(), true);
  } finally {
    globalThis.fetch = originalFetch;
    if (globalThis.aioLocalDb) {
      await (await localDb()).close();
      delete globalThis.aioLocalDb;
    }
    for (const key of Object.keys(process.env))
      if (!(key in previous)) delete process.env[key];
    Object.assign(process.env, previous);
  }
});
