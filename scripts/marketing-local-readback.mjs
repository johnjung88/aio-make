import fs from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import path from "node:path";
import assert from "node:assert/strict";
const folder = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_RW2";
const report = JSON.parse(
  await fs.readFile(path.join(folder, "browser-results.json"), "utf8"),
);
const db = new PGlite(
  path.join(process.env.TEMP, "aio-rw2-qa-local", "database"),
);
try {
  const r = await db.query("SELECT envelope FROM inquiries WHERE id=$1", [
    report.submission.receipt,
  ]);
  assert.equal(r.rows.length, 1);
  const p = r.rows[0].envelope.payload;
  assert.equal(p.service, "sns");
  assert.match(p.message, /선택한 구성: 한 소재/);
  assert.match(p.message, /상담 진입: signature/);
  const result = {
    savedRows: 1,
    service: p.service,
    messagePreserved: p.message.includes("리프 세럼"),
    planPreserved: p.message.includes("한 소재"),
    entryPreserved: p.message.includes("signature"),
    receiptMatches: true,
    notificationSent: false,
    localOnly: true,
  };
  await fs.writeFile(
    path.join(folder, "local-readback.json"),
    JSON.stringify(result, null, 2),
  );
  console.log(result);
} finally {
  await db.close();
}
