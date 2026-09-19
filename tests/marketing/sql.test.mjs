import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const db = new PGlite();
await db.exec(
  "create role anon; create role authenticated; create role service_role bypassrls;",
);
await db.exec(
  readFileSync(
    new URL(
      "../../supabase/migrations/20260919055959_marketing_consultations.sql",
      import.meta.url,
    ),
    "utf8",
  ),
);
const rpc = async (fn, args) =>
  (
    await db.query(
      `select ${fn}(${args.map((_, i) => "$" + (i + 1)).join(",")}) as result`,
      args,
    )
  ).rows[0].result;
const payload = {
  idempotencyKey: crypto.randomUUID(),
  locale: "ko",
  category: "marketing",
  consent_privacy: true,
  consent_version: "test-v1",
  company: "테스트 매장",
  name: "시험 담당",
  email: "test@example.com",
  phone: "01000000000",
  industry: "시험",
  region: "시험",
  description: "로컬 검증",
};
const id = await rpc("marketing_submit", [payload]);
assert.equal(await rpc("marketing_submit", [payload]), id);
assert.equal(
  (await db.query("select count(*)::int n from marketing_outbox")).rows[0].n,
  2,
);
await assert.rejects(
  rpc("marketing_submit", [{ ...payload, company: "다른 매장" }]),
);
let d = await rpc("marketing_action", [
  id,
  "draft",
  {
    subject: "초안",
    body: "시험 본문",
    reply_revision: 0,
    author: "human-admin",
  },
]);
await rpc("marketing_action", [
  id,
  "approve",
  { draft_id: d.id, actor: "owner" },
]);
await rpc("marketing_action", [
  id,
  "approve",
  { draft_id: d.id, actor: "owner" },
]);
assert.equal(
  (
    await db.query(
      "select count(*)::int n from marketing_outbox where kind='email'",
    )
  ).rows[0].n,
  1,
);
const d2 = await rpc("marketing_action", [
  id,
  "draft",
  {
    subject: "새 초안",
    body: "수정 본문",
    reply_revision: 0,
    author: "human-admin",
  },
]);
await assert.rejects(
  rpc("marketing_action", [id, "approve", { draft_id: d.id, actor: "owner" }]),
);
await rpc("marketing_action", [
  id,
  "approve",
  { draft_id: d2.id, actor: "owner" },
]);
await rpc("marketing_action", [
  id,
  "reply",
  { event_key: "reply-1", body: "고객 회신" },
]);
await rpc("marketing_action", [
  id,
  "reply",
  { event_key: "reply-1", body: "고객 회신" },
]);
assert.equal(
  (
    await db.query(
      "select reply_revision from marketing_consultations where id=$1",
      [id],
    )
  ).rows[0].reply_revision,
  1,
);
await assert.rejects(
  rpc("marketing_action", [id, "approve", { draft_id: d2.id, actor: "owner" }]),
);
assert.equal(await rpc("marketing_claim", ["email"]), null);
const d3 = await rpc("marketing_action", [
  id,
  "draft",
  {
    subject: "회신 초안",
    body: "회신",
    reply_revision: 1,
    author: "human-admin",
  },
]);
await rpc("marketing_action", [
  id,
  "approve",
  { draft_id: d3.id, actor: "owner" },
]);
const job = await rpc("marketing_claim", ["email"]);
assert.equal(job.draft.id, d3.id);
assert.equal(await rpc("marketing_claim", ["email"]), null);
await rpc("marketing_finish", [
  job.outbox.id,
  "unknown",
  { reason: "timeout" },
]);
await assert.rejects(
  rpc("marketing_action", [
    id,
    "draft",
    { subject: "중복 발송 방지", body: "x", reply_revision: 1, author: "grok" },
  ]),
);
assert.equal(await rpc("marketing_claim", ["email"]), null);
const otherId = await rpc("marketing_submit", [
  { ...payload, idempotencyKey: crypto.randomUUID(), company: "다른 상담" },
]);
const otherDraft = await rpc("marketing_action", [
  otherId,
  "draft",
  {
    subject: "다른 상담",
    body: "독립 처리",
    reply_revision: 0,
    author: "human-admin",
  },
]);
await rpc("marketing_action", [
  otherId,
  "approve",
  { draft_id: otherDraft.id, actor: "owner" },
]);
const independent = await rpc("marketing_claim", ["email"]);
assert.equal(independent.consultation.id, otherId);
await rpc("marketing_finish", [
  independent.outbox.id,
  "done",
  { provider_id: "independent-message" },
]);
const c = await rpc("marketing_save_content", [
  "home",
  "제목",
  "{}",
  false,
  null,
]);
await rpc("marketing_save_content", ["home", "", "", true, c]);
assert.equal(
  (
    await db.query(
      "select count(*)::int n from marketing_content where state='published'",
    )
  ).rows[0].n,
  1,
);
await db.exec("set role anon;");
await assert.rejects(db.query("select * from marketing_consultations"));
await assert.rejects(
  rpc("marketing_submit", [
    { ...payload, idempotencyKey: crypto.randomUUID() },
  ]),
);
await db.exec("reset role;");
// Prove outbox failure rolls back intake, not just the outbox row.
await db.exec(
  "create function fail_outbox() returns trigger language plpgsql as $$ begin raise exception 'forced outage';end $$; create trigger forced_outage before insert on marketing_outbox for each row execute function fail_outbox();",
);
const failed = crypto.randomUUID();
await assert.rejects(
  rpc("marketing_submit", [{ ...payload, idempotencyKey: failed }]),
);
assert.equal(
  (
    await db.query(
      "select count(*)::int n from marketing_consultations where idempotency_key=$1",
      [failed],
    )
  ).rows[0].n,
  0,
);
await db.exec("drop trigger forced_outage on marketing_outbox");
await rpc("marketing_reconcile", [
  job.outbox.id,
  "failed",
  "Provider checked; no send; previous worker stopped",
  "",
  "",
]);
const next = await rpc("marketing_action", [
  id,
  "draft",
  {
    subject: "복구 후 초안",
    body: "복구 시험",
    reply_revision: 1,
    author: "human-admin",
  },
]);
await rpc("marketing_action", [
  id,
  "approve",
  { draft_id: next.id, actor: "owner" },
]);
const send = await rpc("marketing_claim", ["email"]);
await rpc("marketing_finish", [
  send.outbox.id,
  "done",
  { provider_id: "provider-message-test" },
]);
assert.equal(
  (await db.query("select state from marketing_drafts where id=$1", [next.id]))
    .rows[0].state,
  "sent",
);
assert.equal(await rpc("marketing_claim", ["email"]), null);
await rpc("marketing_action", [
  id,
  "reply",
  { event_key: "reply-after-send", body: "발송 후 고객 회신" },
]);
assert.equal(
  (
    await db.query(
      "select reply_revision from marketing_consultations where id=$1",
      [id],
    )
  ).rows[0].reply_revision,
  2,
);
const grok = await rpc("marketing_claim", ["grok"]);
const result = {
  subject: "후속 초안",
  body: "원문 기반 초안",
  reply_revision: 2,
  author: "grok",
};
await rpc("marketing_grok_result", [grok.outbox.id, result]);
await rpc("marketing_grok_result", [grok.outbox.id, result]);
assert.equal(
  (
    await db.query(
      "select count(*)::int n from marketing_drafts where consultation_id=$1 and author=$2",
      [id, "grok"],
    )
  ).rows[0].n,
  1,
);
const c2 = await rpc("marketing_save_content", [
  "home",
  "새 제목",
  "{}",
  false,
  null,
]);
await rpc("marketing_save_content", ["home", "", "", true, c2]);
assert.equal(
  (
    await db.query(
      "select count(*)::int n from marketing_content where state='published'",
    )
  ).rows[0].n,
  1,
);
assert.equal(
  (await db.query("select state from marketing_content where id=$1", [c]))
    .rows[0].state,
  "retired",
);
console.log(
  "PASS: recovery evidence, successful send once, inbound after send, Grok result deduplication, content retirement;",
);
console.log(
  "PASS: transaction rollback, intake deduplication/conflict, approval deduplication, stale draft/reply rejection, reply deduplication, single claim, unknown delivery freeze, content version, anonymous access denial",
);
for(const table of ["marketing_consultations","marketing_drafts","marketing_events","marketing_outbox","marketing_content"]){
 assert.equal((await db.query("select relrowsecurity from pg_class where relname=$1",[table])).rows[0].relrowsecurity,true);
 for(const role of ["anon","authenticated"])assert.equal((await db.query("select has_table_privilege($1,$2,'SELECT') allowed",[role,"public."+table])).rows[0].allowed,false);
}
for(const fn of ["marketing_submit(jsonb)","marketing_action(uuid,text,jsonb)","marketing_claim(text)","marketing_finish(uuid,text,jsonb)","marketing_grok_result(uuid,jsonb)","marketing_save_content(text,text,text,boolean,uuid)","marketing_reconcile(uuid,text,text,text,text)"]){
 for(const role of ["anon","authenticated"])assert.equal((await db.query("select has_function_privilege($1,$2,'EXECUTE') allowed",[role,"public."+fn])).rows[0].allowed,false);
}
console.log("PASS: every new table has RLS; anon/authenticated denied across every new table and workflow function");
await db.close();
