import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import {
  localDb,
  importInquiry,
  inquiryList,
  inquiryDetail,
  updateInquiry,
  setting,
  persistentLimit,
} from "../lib/local-store.ts";
import {
  signedEnvelope,
  parseSigned,
  seal,
  unseal,
  syncInquiries,
  sendInquiry,
} from "../lib/inquiry-mail.ts";

test("local inquiry persistence, authenticated envelope, retries and Gmail failure handling", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "aio-local-qa-"));
  const previous = { ...process.env };
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, {
    LOCAL_ADMIN_ENABLED: "true",
    LOCAL_DATA_DIR: dir,
    ADMIN_SESSION_SECRET: "test-local-secret-".repeat(4),
    INQUIRY_SIGNING_SECRET: "test-signing-secret-".repeat(4),
    GMAIL_CLIENT_ID: "test-client",
    GMAIL_CLIENT_SECRET: "test-secret",
  });
  delete process.env.VERCEL;
  const id = randomUUID();
  const envelope = {
    version: 1,
    id,
    receivedAt: new Date().toISOString(),
    payload: {
      name: "로컬 QA",
      email: "qa@example.test",
      phone: "",
      company: "",
      division: "video",
      service: "webtoon",
      message: "실제 고객 자료가 아닌 자동 검증 데이터",
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
  try {
    const signed = signedEnvelope(envelope);
    assert.deepEqual(parseSigned(signed.data, signed.signature), envelope);
    assert.throws(
      () => parseSigned(signed.data + "A", signed.signature),
      /SIGNATURE/,
    );
    const encrypted = seal("test-refresh-token");
    assert.equal(unseal(encrypted), "test-refresh-token");
    assert.ok(!encrypted.includes("test-refresh-token"));
    assert.throws(() => unseal(encrypted.slice(0, -4) + "AAAA"));
    assert.equal(await importInquiry(envelope, "message-1"), true);
    assert.equal(await importInquiry(envelope, "message-2"), false);
    assert.equal((await inquiryList()).total, 1);
    assert.equal(await updateInquiry(id, "replied", "첫 상담 기록"), true);
    assert.equal((await inquiryDetail(id)).notes.length, 1);
    assert.equal((await inquiryList("new")).total, 0);
    assert.equal((await inquiryList("replied", "로컬 QA")).total, 1);
    assert.equal(await persistentLimit("test", "login", 1, 60), true);
    assert.equal(await persistentLimit("test", "login", 1, 60), false);
    await (await localDb()).close();
    delete globalThis.aioLocalDb;
    const moduleUrl = pathToFileURL(path.resolve("lib/local-store.ts")).href;
    const child = execFileSync(
      process.execPath,
      [
        "--conditions=react-server",
        "--experimental-strip-types",
        "--input-type=module",
        "-e",
        `const s=await import(${JSON.stringify(moduleUrl)});const d=await s.inquiryDetail(${JSON.stringify(id)}); console.log(JSON.stringify({status:d.item.status,notes:d.notes.length}));await(await s.localDb()).close()`,
      ],
      { env: process.env, encoding: "utf8" },
    );
    assert.deepEqual(JSON.parse(child.trim()), { status: "replied", notes: 1 });
    await setting("gmail_read", seal("test-read-refresh"));
    await setting("gmail_send", seal("test-send-refresh"));
    const second = {
      ...envelope,
      id: randomUUID(),
      payload: { ...envelope.payload, idempotencyKey: "" },
    };
    second.payload.idempotencyKey = second.id;
    const nextSigned = signedEnvelope(second);
    let failRead = false,
      failSend = false;
    globalThis.fetch = async (input, options = {}) => {
      const url = String(input);
      if (url.includes("oauth2.googleapis.com"))
        return Response.json({ access_token: "fake-access" });
      if (url.endsWith("/messages/send"))
        return failSend
          ? Response.json({ error: "failure" }, { status: 503 })
          : Response.json({ id: "sent-1" });
      if (url.includes("/messages?"))
        return Response.json({
          messages: [{ id: "message-new" }, { id: "message-tampered" }],
        });
      if (failRead) return Response.json({ error: "failure" }, { status: 503 });
      const sig = url.includes("tampered")
        ? "0".repeat(64)
        : nextSigned.signature;
      const text = `--- AIO INQUIRY V1 ---\n${nextSigned.data}\n${sig}\n--- END AIO INQUIRY ---`;
      return Response.json({
        payload: {
          mimeType: "text/plain",
          body: { data: Buffer.from(text).toString("base64url") },
        },
      });
    };
    const first = await syncInquiries();
    assert.equal(first.imported, 1);
    assert.equal(first.rejected, 1);
    const repeat = await syncInquiries();
    assert.equal(repeat.duplicates, 1);
    assert.equal((await inquiryList()).total, 2);
    const cursor = await setting("gmail_sync_since");
    failRead = true;
    await assert.rejects(syncInquiries(), /MAIL_READ_FAILED/);
    assert.equal(await setting("gmail_sync_since"), cursor);
    assert.equal((await sendInquiry(envelope)).inquiryId, id);
    failSend = true;
    await assert.rejects(sendInquiry(envelope), /MAIL_DELIVERY_FAILED/);
    process.env.VERCEL = "1";
    await assert.rejects(localDb(), /LOCAL_ONLY/);
  } finally {
    globalThis.fetch = originalFetch;
    if (globalThis.aioLocalDb) {
      await (await globalThis.aioLocalDb).close();
      delete globalThis.aioLocalDb;
    }
    for (const key of Object.keys(process.env))
      if (!(key in previous)) delete process.env[key];
    Object.assign(process.env, previous);
    await rm(dir, { recursive: true, force: true });
  }
});
