import { NextResponse, after } from "next/server";
import { contactSchema } from "@/lib/domain";
import { sameOrigin, readJson, rateLimit } from "@/lib/http";
import { inquiryStoreReady, localMode } from "@/lib/local-store";
import { saveInquiry, notifyInquiry } from "@/lib/inquiry-submit";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { success: false, error: "요청 출처를 확인할 수 없습니다" },
      { status: 403 },
    );
  try {
    const parsed = contactSchema.safeParse(await readJson(request));
    if (!parsed.success)
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    if (
      !inquiryStoreReady() ||
      (!localMode() && process.env.CONTACT_PUBLIC_ENABLED !== "true")
    )
      return NextResponse.json(
        {
          success: false,
          error:
            "지금은 문의를 저장할 수 없습니다 입력 내용을 유지한 채 잠시 후 다시 시도해주세요",
        },
        { status: 503 },
      );
    if (!(await rateLimit(request, "contact", 5, 600)))
      return NextResponse.json(
        {
          success: false,
          error: "접수가 잠시 제한되었습니다 잠시 뒤 다시 시도해주세요",
        },
        { status: 429 },
      );
    const data = await saveInquiry({
      version: 1,
      id: parsed.data.idempotencyKey,
      receivedAt: new Date().toISOString(),
      payload: parsed.data,
    });
    if (!data.duplicate)
      after(async () => {
        try {
          await notifyInquiry(data.inquiryId);
        } catch {
          console.error("[inquiry-notification] pending reconciliation");
        }
      });
    return NextResponse.json(
      { success: true, data },
      { status: data.duplicate ? 200 : 201 },
    );
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    const status =
      code === "IDEMPOTENCY_CONFLICT"
        ? 409
        : code === "REQUEST_TOO_LARGE"
          ? 413
          : error instanceof SyntaxError
            ? 400
            : 503;
    return NextResponse.json(
      {
        success: false,
        error:
          status === 409
            ? "이미 접수된 요청과 내용이 다릅니다 새 문의를 작성해주세요"
            : status === 400 || status === 413
              ? "문의 입력 형식과 길이를 확인해주세요"
              : "접수 결과를 확인하지 못했습니다 입력 내용을 유지한 채 다시 시도해주세요",
      },
      { status },
    );
  }
}
