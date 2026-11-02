import { NextResponse } from "next/server";
import { clearSession, hasAdmin } from "@/lib/auth";
import { sameOrigin } from "@/lib/http";
export async function POST(request: Request) {
  if (!sameOrigin(request) || !(await hasAdmin()))
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 403 });
  await clearSession();
  return NextResponse.json({ success: true });
}
