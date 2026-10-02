import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { localDb, validEnvelope, type Envelope } from "@/lib/local-store";
import { sameOrigin, readJson } from "@/lib/http";
import { z } from "zod";
import { inquiryStatuses } from "@/lib/domain";
export const runtime = "nodejs";
const rowSchema = z.object({
  id: z.string().uuid(),
  envelope: z.custom<Envelope>(validEnvelope),
  gmail_id: z.string().max(300),
  status: z.enum(inquiryStatuses),
  created_at: z.string().refine((s) => Number.isFinite(Date.parse(s))),
});
const noteSchema = z.object({
  id: z.string().uuid(),
  inquiry_id: z.string().uuid(),
  content: z.string().max(5000),
  status: z.enum(inquiryStatuses),
  created_at: z.string().refine((s) => Number.isFinite(Date.parse(s))),
});
const backupSchema = z.object({
  version: z.literal(1),
  inquiries: z.array(rowSchema).max(50000),
  notes: z.array(noteSchema).max(200000),
});
function csv(value: unknown) {
  let s = String(value ?? "");
  if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replaceAll('"', '""') + '"';
}
export async function GET(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  const db = await localDb();
  const dump = await db.transaction(async (tx) => ({
    version: 1,
    inquiries: (
      await tx.query<z.infer<typeof rowSchema>>(
        "SELECT * FROM inquiries ORDER BY created_at",
      )
    ).rows,
    notes: (await tx.query("SELECT * FROM notes ORDER BY created_at")).rows,
  }));
  const isCsv = new URL(request.url).searchParams.get("format") === "csv";
  const body = isCsv
    ? "\uFEFF" +
      [
        [
          "접수번호",
          "접수일",
          "고객명",
          "회사",
          "이메일",
          "전화",
          "분야",
          "서비스",
          "내용",
          "상태",
        ],
        ...dump.inquiries.map((row) => {
          const e = row.envelope as Envelope,
            p = e.payload;
          return [
            row.id,
            row.created_at,
            p.name,
            p.company,
            p.email,
            p.phone,
            p.division,
            p.service,
            p.message,
            row.status,
          ];
        }),
      ]
        .map((r) => r.map(csv).join(","))
        .join("\r\n")
    : JSON.stringify(dump, null, 2);
  return new Response(body, {
    headers: {
      "Content-Type": isCsv ? "text/csv; charset=utf-8" : "application/json",
      "Content-Disposition":
        'attachment; filename="aio-inquiries-' +
        new Date().toISOString().slice(0, 10) +
        (isCsv ? '.csv"' : '.json"'),
      "Cache-Control": "no-store",
    },
  });
}
export async function POST(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "허용되지 않은 요청입니다" },
      { status: 403 },
    );
  try {
    const data = backupSchema.parse(await readJson(request, 20 * 1024 * 1024));
    for (const row of data.inquiries)
      if (row.id !== row.envelope.id) throw Error();
    const db = await localDb();
    await db.transaction(async (tx) => {
      for (const r of data.inquiries)
        await tx.query(
          "INSERT INTO inquiries(id,envelope,gmail_id,status,created_at) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING",
          [
            r.id,
            JSON.stringify(r.envelope),
            r.gmail_id,
            r.status,
            r.created_at,
          ],
        );
      for (const n of data.notes)
        await tx.query(
          "INSERT INTO notes(id,inquiry_id,content,status,created_at) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING",
          [n.id, n.inquiry_id, n.content, n.status, n.created_at],
        );
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "백업 형식을 확인해주세요 기존 자료는 유지됩니다" },
      { status: 400 },
    );
  }
}
