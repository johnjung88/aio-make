import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    {
      message:
        "현재 마케팅 상담을 받고 있습니다. 마케팅 상담 신청 페이지에서 문의를 남겨 주세요.",
      url: "/ko/quote",
    },
    { status: 410 },
  );
}
