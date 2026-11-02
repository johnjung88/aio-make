import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { googleConfigured } from "@/lib/inquiry-mail";
import { setting } from "@/lib/local-store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await hasAdmin()))
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  return NextResponse.json(
    {
      configured: googleConfigured(),
      read: !!(await setting("gmail_read")),
      send: !!(await setting("gmail_send")),
      lastSync: await setting("gmail_sync_status"),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
