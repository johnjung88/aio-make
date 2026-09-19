import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminConfig,
} from "@/lib/supabase";
import { quoteSchema } from "@/lib/marketing/validation";
export async function POST(request: Request) {
  if (
    process.env.MARKETING_INTAKE_ENABLED !== "true" ||
    !hasSupabaseAdminConfig() ||
    !process.env.MARKETING_CONSENT_NOTICE ||
    !process.env.MARKETING_CONSENT_VERSION
  )
    return NextResponse.json(
      { success: false, error: "온라인 상담 접수 준비 중입니다." },
      { status: 503 },
    );
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 24000)
      return NextResponse.json(
        { success: false, error: "입력 내용이 너무 깁니다." },
        { status: 413 },
      );
    const parsed = quoteSchema.safeParse(JSON.parse(raw));
    if (!parsed.success)
      return NextResponse.json(
        { success: false, error: "필수 항목과 개인정보 동의를 확인해 주세요." },
        { status: 400 },
      );
    if (parsed.data.consent_version !== process.env.MARKETING_CONSENT_VERSION)
      return NextResponse.json(
        {
          success: false,
          error: "개인정보 안내가 변경되었습니다. 화면을 새로고침해 주세요.",
        },
        { status: 409 },
      );
    const { data, error } = await createSupabaseAdminClient().rpc(
      "marketing_submit",
      {
        p_payload: {
          ...parsed.data,
          consent_notice: process.env.MARKETING_CONSENT_NOTICE,
        },
      },
    );
    if (error || !data)
      return NextResponse.json(
        {
          success: false,
          error:
            "저장 결과를 확인하지 못했습니다. 같은 화면에서 다시 시도해 주세요.",
        },
        { status: 503 },
      );
    return NextResponse.json(
      { success: true, data: { quoteId: data } },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "접수하지 못했습니다. 입력 내용 또는 연결 상태를 확인해 주세요.",
      },
      { status: 400 },
    );
  }
}
