import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { inquiryDetail } from "@/lib/local-store";
import { z } from "zod";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await hasAdmin()))
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success)
    return NextResponse.json(
      { error: "접수번호를 확인해주세요" },
      { status: 400 },
    );
  try {
    const d = await inquiryDetail(id);
    return NextResponse.json(d ?? { error: "문의를 찾을 수 없습니다" }, {
      status: d ? 200 : 404,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "로컬 문의 조회 실패" }, { status: 503 });
  }
}
