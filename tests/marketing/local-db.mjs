import http from "node:http";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
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
http
  .createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
      const url = new URL(req.url, "http://localhost");
      const parts = url.pathname.split("/");
      let data;
      let raw = "";
      for await (const chunk of req) raw += chunk;
      if (parts[3] === "rpc") {
        const fn = parts[4];
        if (!/^marketing_[a-z_]+$/.test(fn)) throw Error();
        const p = JSON.parse(raw);
        const keys = Object.keys(p);
        if (keys.some((k) => !/^p_[a-z_]+$/.test(k))) throw Error();
        data = (
          await db.query(
            `select ${fn}(${keys.map((k, i) => `${k} => $${i + 1}`).join(",")}) result`,
            Object.values(p),
          )
        ).rows[0].result;
      } else {
        const table = parts[3];
        if (!/^marketing_[a-z_]+$/.test(table)) throw Error();
        const where = [],
          values = [];
        for (const [k, v] of url.searchParams) {
          if (v.startsWith("eq.") && /^[a-z_]+$/.test(k)) {
            values.push(v.slice(3));
            where.push(`${k}=$${values.length}`);
          }
        }
        if (req.method === "GET") {
          let sql =
            `select * from ${table}` +
            (where.length ? " where " + where.join(" and ") : "");
          const order = url.searchParams.get("order");
          if (order && /^[a-z_]+\.(asc|desc)$/.test(order))
            sql += " order by " + order.replace(".", " ");
          sql += " limit 100";
          data = (await db.query(sql, values)).rows;
          if (req.headers.accept?.includes("vnd.pgrst.object")) {
            if (data.length !== 1) {
              res.statusCode = 406;
              res.end(
                JSON.stringify({ code: "PGRST116", message: "Not single" }),
              );
              return;
            }
            data = data[0];
          }
        } else throw Error("not supported");
      }
      res.end(JSON.stringify(data));
    } catch (e) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: String(e), code: "TEST_DB" }));
    }
  })
  .listen(54339, "127.0.0.1", () =>
    console.log("Isolated local PostgreSQL test adapter ready"),
  );
