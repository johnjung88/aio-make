import "server-only";
import { PGlite } from "@electric-sql/pglite";
import { mkdir } from "node:fs/promises";
import { randomUUID, createHash } from "node:crypto";
import path from "node:path";
import type { z } from "zod";
import { contactSchema } from "./domain.ts";
export type Contact = z.infer<typeof contactSchema>;
export type Envelope = {
  version: 1;
  id: string;
  receivedAt: string;
  payload: Contact;
};
export function localMode() {
  return process.env.LOCAL_ADMIN_ENABLED === "true" && !process.env.VERCEL;
}
export function dataDirectory() {
  if (!localMode()) throw Error("LOCAL_ONLY");
  const dir = process.env.LOCAL_DATA_DIR;
  if (!dir || !path.isAbsolute(dir)) throw Error("LOCAL_DATA_DIR_REQUIRED");
  return dir;
}
const globalDb = globalThis as typeof globalThis & {
  aioLocalDb?: Promise<PGlite>;
};
export async function localDb() {
  if (!localMode()) throw Error("LOCAL_ONLY");
  if (!globalDb.aioLocalDb)
    globalDb.aioLocalDb = (async () => {
      const dir = dataDirectory();
      await mkdir(dir, { recursive: true });
      const db = new PGlite(path.join(dir, "database"));
      await db.exec(`CREATE TABLE IF NOT EXISTS inquiries(id uuid PRIMARY KEY, envelope jsonb NOT NULL, gmail_id text UNIQUE, status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL);
  CREATE TABLE IF NOT EXISTS notes(id uuid PRIMARY KEY, inquiry_id uuid NOT NULL REFERENCES inquiries(id), content text NOT NULL, status text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
  CREATE TABLE IF NOT EXISTS settings(key text PRIMARY KEY,value jsonb NOT NULL);
  CREATE TABLE IF NOT EXISTS limits(key text PRIMARY KEY,count integer NOT NULL,reset_at bigint NOT NULL);`);
      return db;
    })().catch((e) => {
      delete globalDb.aioLocalDb;
      throw e;
    });
  return globalDb.aioLocalDb;
}
export function validEnvelope(value: unknown): value is Envelope {
  if (!value || typeof value !== "object") return false;
  const v = value as Envelope;
  return (
    v.version === 1 &&
    /^[0-9a-f-]{36}$/i.test(v.id) &&
    Number.isFinite(Date.parse(v.receivedAt)) &&
    contactSchema.safeParse(v.payload).success &&
    v.id === v.payload.idempotencyKey
  );
}
export async function importInquiry(e: Envelope, gmailId: string) {
  if (!validEnvelope(e)) throw Error("INVALID_INQUIRY");
  const db = await localDb();
  const r = await db.query(
    "INSERT INTO inquiries(id,envelope,gmail_id,created_at) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING id",
    [e.id, JSON.stringify(e), gmailId, e.receivedAt],
  );
  return r.rows.length === 1;
}
function present(row: {
  id: string;
  envelope: Envelope;
  status: string;
  created_at: string;
}) {
  const p = row.envelope.payload;
  return {
    id: row.id,
    lead_id: row.id,
    raw_text: p.message,
    status: row.status,
    created_at: row.created_at,
    leads: {
      customer_name: p.name,
      company_name: p.company,
      email: p.email,
      phone: p.phone,
      source_meta: {
        division: p.division,
        service: p.service,
        attribution: p.attribution,
      },
    },
  };
}
export async function inquiryList(status = "all", search = "", page = 1) {
  const db = await localDb();
  const values: unknown[] = [];
  const conditions: string[] = [];
  if (status !== "all") {
    values.push(status);
    conditions.push("status=$" + values.length);
  }
  if (search) {
    values.push("%" + search.replace(/[\\%_]/g, "\\$&") + "%");
    conditions.push("(envelope->'payload')::text ILIKE $" + values.length);
  }
  const where = conditions.length ? " WHERE " + conditions.join(" AND ") : "";
  const count = await db.query<{ total: number }>(
    "SELECT count(*)::int AS total FROM inquiries" + where,
    values,
  );
  const all = await db.query<{ total: number; new_count: number }>(
    "SELECT count(*)::int AS total,count(*) FILTER(WHERE status='new')::int AS new_count FROM inquiries",
  );
  const rows = await db.query<{
    id: string;
    envelope: Envelope;
    status: string;
    created_at: string;
  }>(
    "SELECT * FROM inquiries" +
      where +
      " ORDER BY created_at DESC,id LIMIT 50 OFFSET " +
      (page - 1) * 50,
    values,
  );
  return {
    connected: true,
    items: rows.rows.map(present),
    total: count.rows[0].total,
    globalTotal: all.rows[0].total,
    newCount: all.rows[0].new_count,
    page,
  };
}
export async function inquiryDetail(id: string) {
  const db = await localDb();
  const r = await db.query<{
    id: string;
    envelope: Envelope;
    status: string;
    created_at: string;
  }>("SELECT * FROM inquiries WHERE id=$1", [id]);
  if (!r.rows.length) return null;
  const notes = await db.query(
    "SELECT id,content,created_at,'admin' AS role,jsonb_build_object('to',status) AS metadata FROM notes WHERE inquiry_id=$1 ORDER BY created_at,id",
    [id],
  );
  return { item: present(r.rows[0]), notes: notes.rows };
}
export async function updateInquiry(id: string, status: string, note: string) {
  const db = await localDb();
  return db.transaction(async (tx) => {
    const r = await tx.query(
      "UPDATE inquiries SET status=$2 WHERE id=$1 RETURNING id",
      [id, status],
    );
    if (!r.rows.length) return false;
    await tx.query(
      "INSERT INTO notes(id,inquiry_id,content,status) VALUES($1,$2,$3,$4)",
      [randomUUID(), id, note || "상태 변경", status],
    );
    return true;
  });
}
export async function setting(key: string, value?: unknown) {
  const db = await localDb();
  if (value !== undefined) {
    await db.query(
      "INSERT INTO settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value",
      [key, JSON.stringify(value)],
    );
    return value;
  }
  const r = await db.query<{ value: unknown }>(
    "SELECT value FROM settings WHERE key=$1",
    [key],
  );
  return r.rows[0]?.value;
}
export async function persistentLimit(
  address: string,
  bucket: string,
  limit: number,
  seconds: number,
) {
  const db = await localDb(),
    now = Date.now(),
    key = createHash("sha256")
      .update(bucket + ":" + address)
      .digest("hex");
  const r = await db.query<{ count: number }>(
    `INSERT INTO limits(key,count,reset_at) VALUES($1,1,$2)
 ON CONFLICT(key) DO UPDATE SET count=CASE WHEN limits.reset_at<$3 THEN 1 ELSE limits.count+1 END,reset_at=CASE WHEN limits.reset_at<$3 THEN $2 ELSE limits.reset_at END RETURNING count`,
    [key, now + seconds * 1000, now],
  );
  return r.rows[0].count <= limit;
}
