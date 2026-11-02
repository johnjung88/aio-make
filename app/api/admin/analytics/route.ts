import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { gaReport } from "@/lib/ga";
import { parseGaDays } from "@/lib/ga-data";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json(
      { error: "로그인이 필요합니다" },
      { status: 401 },
    );
  const days = parseGaDays(new URL(request.url).searchParams.get("days"));
  if (days === null)
    return NextResponse.json(
      { error: "조회 기간은 7일, 28일, 90일 중 선택해주세요" },
      { status: 400 },
    );
  return NextResponse.json(await gaReport(days), {
    headers: { "Cache-Control": "no-store" },
  });
}
