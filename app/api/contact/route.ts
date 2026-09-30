import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/domain";
import { database, databaseReady } from "@/lib/db";
import { sameOrigin, readJson, rateLimit } from "@/lib/http";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { success: false, error: "요청 출처를 확인할 수 없습니다." },
      { status: 403 },
    );
  try {
    const parsed = contactSchema.safeParse(await readJson(request));
    if (!parsed.success)
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    if (!databaseReady())
      return NextResponse.json(
        {
          success: false,
          error:
            "현재 온라인 접수 연결을 준비 중입니다. aiomake2023@gmail.com으로 문의해주세요.",
        },
        { status: 503 },
      );
    if (!(await rateLimit(request, "contact", 5, 600)))
      return NextResponse.json(
        {
          success: false,
          error: "접수가 잠시 제한되었습니다. 잠시 뒤 다시 시도해주세요.",
        },
        { status: 429 },
      );
    const { data, error } = await database().rpc("submit_website_inquiry", {
      p_payload: parsed.data,
    });
    if (error || !data?.inquiryId) {
      console.error("[contact] save failed", error?.code);
      return NextResponse.json(
        {
          success: false,
          error: "문의 저장을 완료하지 못했습니다. 잠시 뒤 다시 시도해주세요.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { success: true, data },
      { status: data.duplicate ? 200 : 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "요청 형식을 확인해주세요." },
      { status: 400 },
    );
  }
}
