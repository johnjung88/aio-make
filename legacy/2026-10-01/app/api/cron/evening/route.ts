import { NextResponse } from "next/server";
import { buildEveningCheckMessage } from "@/lib/admin/briefing";
import { notifyTelegram } from "@/lib/admin/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Evening check cron — 매일 KST 21:00 (= UTC 12:00 같은 날)
 * 오늘 처리 / 미완 / 내일 우선순위만 발송. 돈 관련 보고는 재무이사 보고로 분리.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  const results: Record<string, unknown> = { route: "evening", at: new Date().toISOString() };

  try {
    const message = await buildEveningCheckMessage();
    await notifyTelegram(message, { parseMode: "Markdown" });
    results.message = "sent";
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown";
    console.error("[cron/evening] message error:", detail);
    results.message = `error: ${detail}`;
  }

  results.xlsx = "skipped: task-only briefing; finance snapshot handled by aio_director_finance";

  return NextResponse.json({ ok: true, ...results });
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
