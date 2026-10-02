import "server-only";
import { Pool, type PoolClient } from "pg";

export const inquirySchema = `
CREATE TABLE IF NOT EXISTS inquiries(id uuid PRIMARY KEY, envelope jsonb NOT NULL, gmail_id text UNIQUE, status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS notes(id uuid PRIMARY KEY, inquiry_id uuid NOT NULL REFERENCES inquiries(id), content text NOT NULL, status text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS settings(key text PRIMARY KEY,value jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS limits(key text PRIMARY KEY,count integer NOT NULL,reset_at bigint NOT NULL);
CREATE TABLE IF NOT EXISTS inquiry_notifications(inquiry_id uuid PRIMARY KEY REFERENCES inquiries(id), state text NOT NULL DEFAULT 'pending', attempts integer NOT NULL DEFAULT 0, provider_id text, last_error text, updated_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS inquiries_created_idx ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS notes_inquiry_idx ON notes(inquiry_id);`;

export interface InquiryQuery {
  query<T = Record<string, unknown>>(
    sql: string,
    values?: unknown[],
  ): Promise<{ rows: T[] }>;
}
export interface InquiryDb extends InquiryQuery {
  transaction<T>(work: (tx: InquiryQuery) => Promise<T>): Promise<T>;
}
export function cloudStoreReady() {
  return Boolean(process.env.INQUIRY_DATABASE_URL);
}
export function cloudAdminEnabled() {
  return process.env.ADMIN_WEB_ENABLED === "true" && cloudStoreReady();
}
const state = globalThis as typeof globalThis & {
  aioCloudDb?: Promise<InquiryDb>;
};
function adapter(client: Pool | PoolClient): InquiryDb {
  return {
    async query<T>(sql: string, values: unknown[] = []) {
      const result = await client.query(sql, values);
      return { rows: result.rows as T[] };
    },
    async transaction<T>(work: (tx: InquiryQuery) => Promise<T>) {
      if (!(client instanceof Pool)) return work(adapter(client));
      const connection = await client.connect();
      try {
        await connection.query("BEGIN");
        const result = await work(adapter(connection));
        await connection.query("COMMIT");
        return result;
      } catch (error) {
        await connection.query("ROLLBACK");
        throw error;
      } finally {
        connection.release();
      }
    },
  };
}
export async function cloudDb(): Promise<InquiryDb> {
  if (!cloudStoreReady()) throw Error("INQUIRY_DATABASE_REQUIRED");
  if (!state.aioCloudDb)
    state.aioCloudDb = (async () => {
      const url = new URL(process.env.INQUIRY_DATABASE_URL!);
      if (url.hostname.endsWith(".supabase.co"))
        throw Error("UNSUPPORTED_INQUIRY_DATABASE");
      // Require certificate verification for the remote database.
      url.searchParams.delete("sslmode");
      const pool = new Pool({
        connectionString: url.toString(),
        ssl: { rejectUnauthorized: true },
        max: 3,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 10000,
      });
      pool.on("error", () =>
        console.error("[inquiry-db] connection unavailable"),
      );
      const db = adapter(pool);
      try {
        await db.transaction(async (tx) => {
          await tx.query("SELECT pg_advisory_xact_lock(20261002)");
          await tx.query(inquirySchema);
        });
        return db;
      } catch (error) {
        await pool.end();
        throw error;
      }
    })().catch((error) => {
      delete state.aioCloudDb;
      throw error;
    });
  return state.aioCloudDb;
}
