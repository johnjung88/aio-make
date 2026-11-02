import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("candidate migration: atomic inquiries, idempotency, audit and public-content policy", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      "CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;CREATE SCHEMA auth;CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE SQL AS 'SELECT NULL::uuid';CREATE SCHEMA storage;CREATE TABLE storage.buckets(id text PRIMARY KEY,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);",
    );
    for (const path of [
      "001_initial_schema.sql",
      "002_core_schema_completion.sql",
    ]) {
      let sql = await readFile("supabase/migrations/" + path, "utf8");
      sql = sql.replace("CREATE EXTENSION IF NOT EXISTS pgcrypto;", "");
      await db.exec(sql);
    }
    await db.exec(
      await readFile(
        "supabase/migrations/20260930174544_website_renewal.sql",
        "utf8",
      ),
    );
    const payload = {
      name: "검증 전용",
      email: "qa@example.test",
      phone: "",
      company: "LOCAL QA",
      division: "development",
      service: "website",
      message: "실제 고객이 아닌 로컬 SQL 검증 자료입니다.",
      consent: true,
      idempotencyKey: "550e8400-e29b-41d4-a716-446655440000",
      attribution: {
        landingPath: "/lab",
        submitPath: "/lab/contact",
        utm: { utm_source: "qa" },
      },
    };
    const first = await db.query(
        "SELECT submit_website_inquiry($1::jsonb) AS result",
        [JSON.stringify(payload)],
      ),
      id = first.rows[0].result.inquiryId;
    assert.equal(first.rows[0].result.duplicate, false);
    const again = await db.query(
      "SELECT submit_website_inquiry($1::jsonb) AS result",
      [JSON.stringify(payload)],
    );
    assert.equal(again.rows[0].result.inquiryId, id);
    assert.equal(again.rows[0].result.duplicate, true);
    for (const table of ["leads", "quote_requests", "conversations"]) {
      assert.equal(
        (await db.query("SELECT count(*)::int AS count FROM " + table)).rows[0]
          .count,
        1,
      );
    }
    await db.query(
      "SELECT update_website_inquiry($1::uuid,'replied','상담 메모')",
      [id],
    );
    assert.equal(
      (await db.query("SELECT status FROM quote_requests WHERE id=$1", [id]))
        .rows[0].status,
      "replied",
    );
    const notes = await db.query(
      "SELECT role,content FROM conversations ORDER BY created_at",
    );
    assert.equal(notes.rows.length, 3);
    assert.ok(
      notes.rows.some((n) => n.role === "agent" && n.content === "상담 메모"),
    );
    assert.ok(notes.rows.some((n) => n.role === "system"));
    await assert.rejects(() =>
      db.query("SELECT submit_website_inquiry($1::jsonb)", [
        JSON.stringify({
          ...payload,
          idempotencyKey: "550e8400-e29b-41d4-a716-446655440011",
          message: null,
        }),
      ]),
    );
    assert.equal(
      (await db.query("SELECT count(*)::int AS n FROM leads")).rows[0].n,
      1,
    );
    await assert.rejects(() =>
      db.query("SELECT submit_website_inquiry($1::jsonb)", [
        JSON.stringify({ ...payload, idempotencyKey: "other", consent: false }),
      ]),
    );
    assert.equal(
      (await db.query("SELECT count(*)::int AS n FROM leads")).rows[0].n,
      1,
    );
    assert.equal(
      (await db.query("SELECT website_rate_limit('qa',2,600) AS allowed"))
        .rows[0].allowed,
      true,
    );
    assert.equal(
      (await db.query("SELECT website_rate_limit('qa',2,600) AS allowed"))
        .rows[0].allowed,
      true,
    );
    assert.equal(
      (await db.query("SELECT website_rate_limit('qa',2,600) AS allowed"))
        .rows[0].allowed,
      false,
    );
    await db.exec(
      "INSERT INTO website_entries(type,division,service,slug,title,is_published,rights_confirmed) VALUES('reference','development','website','public-example','제작 예시',true,true),('reference','development','website','private-example','초안',false,false);",
    );
    await assert.rejects(() =>
      db.exec(
        "INSERT INTO website_entries(type,division,service,slug,title,is_published,rights_confirmed) VALUES('reference','development','website','unconfirmed','미확인',true,false);",
      ),
    );
    for (let i = 0; i < 60; i++)
      await db.query("SELECT submit_website_inquiry($1::jsonb)", [
        JSON.stringify({
          ...payload,
          idempotencyKey: crypto.randomUUID(),
          name: "추가 문의 " + i,
          email: "other" + i + "@example.test",
        }),
      ]);
    const listing = async (status, search, offset = 0) =>
      (
        await db.query(
          "SELECT list_website_inquiries($1::text,$2::text,$3::int,50) AS data",
          [status, search, offset],
        )
      ).rows[0].data;
    assert.equal((await listing("all", "")).items.length, 50);
    assert.equal((await listing("all", "", 50)).items.length, 11);
    const found = await listing("all", "검증 전용");
    assert.equal(found.total, 1);
    assert.equal(found.items[0].id, id);
    assert.equal(found.globalTotal, 61);
    assert.equal((await listing("replied", "검증 전용")).total, 1);
    assert.equal((await listing("new", "검증 전용")).total, 0);
    assert.equal((await listing("all", "%")).total, 0);
    await db.exec("SET ROLE anon");
    await assert.rejects(() => listing("all", ""));
    assert.equal(
      (await db.query("SELECT * FROM website_entries")).rows.length,
      1,
    );
    await assert.rejects(() =>
      db.query("SELECT submit_website_inquiry($1::jsonb)", [
        JSON.stringify(payload),
      ]),
    );
    await assert.rejects(() =>
      db.exec(
        "INSERT INTO website_entries(type,division,service,slug,title) VALUES('reference','video','animation','not-allowed','접근 제한');",
      ),
    );
    await db.exec("RESET ROLE");
  } finally {
    await db.close();
  }
});
