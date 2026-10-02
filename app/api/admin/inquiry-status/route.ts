import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { inquiryDb, localMode } from "@/lib/local-store";
import { notificationConfigured, notifyInquiry } from "@/lib/inquiry-submit";
import { sameOrigin } from "@/lib/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await hasAdmin()))
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  try {
    const db = await inquiryDb();
    const counts = await db.query<{ state: string; count: number }>(
      "SELECT state,count(*)::int AS count FROM inquiry_notifications GROUP BY state",
    );
    return NextResponse.json(
      {
        storage: localMode() ? "이 PC의 로컬 저장소" : "운영 문의 저장소",
        emailConfigured: notificationConfigured(),
        notificationCounts: Object.fromEntries(
          counts.rows.map((r) => [r.state, r.count]),
        ),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "문의 연결 상태를 확인하지 못했습니다" },
      { status: 503 },
    );
  }
}
export async function POST(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "허용되지 않은 요청입니다" },
      { status: 403 },
    );
  if (!notificationConfigured())
    return NextResponse.json(
      { error: "이메일 설정을 완료해주세요" },
      { status: 503 },
    );
  try {
    const db = await inquiryDb();
    const pending = await db.query<{ inquiry_id: string }>(
      "SELECT inquiry_id FROM inquiry_notifications WHERE state IN ('pending','failed') ORDER BY updated_at LIMIT 3",
    );
    for (const row of pending.rows) await notifyInquiry(row.inquiry_id);
    return NextResponse.json({ success: true, processed: pending.rows.length });
  } catch {
    return NextResponse.json(
      { error: "알림 처리 결과를 확인해주세요" },
      { status: 503 },
    );
  }
}
