import { NextResponse } from "next/server";
import { buildDailyBriefingMessage } from "@/lib/admin/briefing";
import { notifyTelegram } from "@/lib/admin/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily briefing cron — 매일 KST 07:00 (= UTC 22:00 전날)
 * Vercel cron은 Authorization: Bearer ${CRON_SECRET} 헤더 자동 전달.
 * 외부 호출 시에도 동일 헤더 필요.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const message = await buildDailyBriefingMessage();
    await notifyTelegram(message, { parseMode: "Markdown" });
    return NextResponse.json({ ok: true, route: "daily", at: new Date().toISOString() });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown";
    console.error("[cron/daily] error:", detail);
    return NextResponse.json({ ok: false, error: detail }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  return GET(request);
}

function verifyCronAuth(request: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // CRON_SECRET 미설정 시 차단 (보안)
    return NextResponse.json({ ok: false, error: "CRON_SECRET not configured" }, { status: 503 });
  }
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return null;
}
