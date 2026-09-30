import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { gaReport } from "@/lib/ga";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await hasAdmin()))
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  return NextResponse.json(await gaReport(), {
    headers: { "Cache-Control": "no-store" },
  });
}
