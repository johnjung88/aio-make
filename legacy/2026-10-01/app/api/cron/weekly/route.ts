import { NextResponse } from "next/server";
import { buildWeeklySummaryMessage } from "@/lib/admin/briefing";
import { notifyTelegram } from "@/lib/admin/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Weekly summary cron — 월요일 KST 07:00 (= 일요일 UTC 22:00)
 * 월요일에는 daily(07:00 KST)와 weekly(07:00 KST) 모두 발송 → 텔레그램 메시지 2개 도착.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const message = await buildWeeklySummaryMessage();
    await notifyTelegram(message, { parseMode: "Markdown" });
    return NextResponse.json({ ok: true, route: "weekly", at: new Date().toISOString() });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown";
    console.error("[cron/weekly] error:", detail);
    return NextResponse.json({ ok: false, error: detail }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  return GET(request);
}

function verifyCronAuth(request: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET not configured" }, { status: 503 });
  }
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return null;
}
