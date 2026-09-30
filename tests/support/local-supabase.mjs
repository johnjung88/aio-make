// Loopback-only REST test adapter backed by actual PostgreSQL (PGlite).
// This is not a Supabase replacement and never connects to production.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
const db = new PGlite();
await db.exec(
  "CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;CREATE SCHEMA auth;CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE SQL AS 'SELECT NULL::uuid';CREATE SCHEMA storage;CREATE TABLE storage.buckets(id text PRIMARY KEY,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);",
);
for (const file of [
  "001_initial_schema.sql",
  "002_core_schema_completion.sql",
  "20260930174544_website_renewal.sql",
]) {
  await db.exec(
    (await readFile("supabase/migrations/" + file, "utf8")).replace(
      "CREATE EXTENSION IF NOT EXISTS pgcrypto;",
      "",
    ),
  );
}
const tables = new Set([
  "website_entries",
  "quote_requests",
  "leads",
  "conversations",
]);
const functions = {
  submit_website_inquiry: ["p_payload"],
  update_website_inquiry: ["p_id", "p_status", "p_note"],
  website_rate_limit: ["p_key", "p_limit", "p_seconds"],
};
function identifier(value) {
  if (!/^[a-z_]+$/.test(value)) throw new Error("invalid identifier");
  return '"' + value + '"';
}
const server = createServer(async (req, res) => {
  const json = (status, value, extra = {}) => {
    res.writeHead(status, { "Content-Type": "application/json", ...extra });
    res.end(JSON.stringify(value));
  };
  if (req.headers.apikey !== "local-qa-only") {
    json(401, { error: "local QA key required" });
    return;
  }
  try {
    const url = new URL(req.url, "http://127.0.0.1:3102"),
      path = url.pathname.split("/").filter(Boolean);
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 50000) throw new Error("too large");
    }
    const body = raw ? JSON.parse(raw) : null;
    if (path[0] !== "rest" || path[1] !== "v1") {
      json(404, { error: "test adapter route unavailable" });
      return;
    }
    if (path[2] === "rpc") {
      const name = path[3],
        keys = functions[name];
      if (!keys) {
        json(404, { error: "unknown RPC" });
        return;
      }
      const params = keys.map((k) =>
        typeof body[k] === "object" ? JSON.stringify(body[k]) : body[k],
      );
      const casts =
        name === "submit_website_inquiry"
          ? ["::jsonb"]
          : name === "update_website_inquiry"
            ? ["::uuid", "::text", "::text"]
            : ["::text", "::integer", "::integer"];
      const result = await db.query(
        "SELECT " +
          identifier(name) +
          "(" +
          params.map((_, i) => "$" + (i + 1) + casts[i]).join(",") +
          ") AS value",
        params,
      );
      json(200, result.rows[0].value);
      return;
    }
    const table = path[2];
    if (!tables.has(table)) {
      json(404, { error: "unknown table" });
      return;
    }
    let params = [],
      conditions = [];
    for (const [key, value] of url.searchParams) {
      if (["select", "order", "offset", "limit"].includes(key)) continue;
      const [op, ...rest] = value.split("."),
        val = rest.join(".");
      if (op === "eq") {
        params.push(
          ["is_published", "rights_confirmed", "is_featured"].includes(key)
            ? val === "true"
            : val,
        );
        conditions.push("t." + identifier(key) + "=$" + params.length);
      } else if (op === "cs") {
        params.push(val);
        conditions.push(
          "t." + identifier(key) + " @> $" + params.length + "::jsonb",
        );
      } else throw new Error("unsupported test filter");
    }
    const where = conditions.length ? " WHERE " + conditions.join(" AND ") : "";
    if (req.method === "POST") {
      const item = Array.isArray(body) ? body[0] : body,
        keys = Object.keys(item);
      const result = await db.query(
        "INSERT INTO " +
          identifier(table) +
          "(" +
          keys.map(identifier).join(",") +
          ") VALUES(" +
          keys.map((_, i) => "$" + (i + 1)).join(",") +
          ") RETURNING *",
        keys.map((k) => item[k]),
      );
      json(
        201,
        req.headers.accept?.includes("object") ? result.rows[0] : result.rows,
      );
      return;
    }
    if (req.method === "PATCH") {
      const keys = Object.keys(body),
        offset = params.length,
        values = keys.map((k) => body[k]);
      const result = await db.query(
        "UPDATE " +
          identifier(table) +
          " t SET " +
          keys
            .map((k, i) => identifier(k) + "=$" + (offset + i + 1))
            .join(",") +
          where +
          " RETURNING *",
        [...params, ...values],
      );
      json(
        200,
        req.headers.accept?.includes("object") ? result.rows[0] : result.rows,
      );
      return;
    }
    const count = (
      await db.query(
        "SELECT count(*)::int AS count FROM " +
          identifier(table) +
          " t" +
          where,
        params,
      )
    ).rows[0].count;
    let select = "t.*",
      join = "";
    if (
      table === "quote_requests" &&
      url.searchParams.get("select")?.includes("leads(")
    ) {
      select += ",row_to_json(l) AS leads";
      join = " LEFT JOIN leads l ON l.id=t.lead_id";
    }
    const orders = (url.searchParams.get("order") ?? "")
      .split(",")
      .filter(Boolean)
      .map((part) => {
        const [key, direction] = part.split(".");
        return (
          "t." + identifier(key) + (direction === "desc" ? " DESC" : " ASC")
        );
      });
    const order = orders.length ? " ORDER BY " + orders.join(",") : "";
    const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0),
      limit = Math.min(
        1000,
        Math.max(1, Number(url.searchParams.get("limit")) || 1000),
      );
    const result = await db.query(
      "SELECT " +
        select +
        " FROM " +
        identifier(table) +
        " t" +
        join +
        where +
        order +
        " LIMIT " +
        limit +
        " OFFSET " +
        offset,
      params,
    );
    if (req.method === "HEAD") {
      res.writeHead(200, { "Content-Range": "0-0/" + count });
      res.end();
      return;
    }
    json(
      200,
      req.headers.accept?.includes("object")
        ? (result.rows[0] ?? null)
        : result.rows,
      {
        "Content-Range":
          offset + "-" + (offset + result.rows.length - 1) + "/" + count,
      },
    );
  } catch (error) {
    json(error.code === "23505" ? 409 : 400, {
      code: error.code ?? "LOCAL_QA",
      message: "Local PostgreSQL test request failed",
    });
    console.error("QA adapter:", error.message);
  }
});
server.listen(3102, "127.0.0.1", () =>
  console.log(
    "Local PostgreSQL REST test adapter ready at 127.0.0.1:3102; no production connection.",
  ),
);
process.on("SIGINT", async () => {
  server.close();
  await db.close();
  process.exit();
});
