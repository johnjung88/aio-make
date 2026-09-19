import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "마케팅 상담 신청 페이지를 이용해 주세요.",
      url: "/ko/quote",
    },
    { status: 410 },
  );
}
