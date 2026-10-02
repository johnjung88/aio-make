import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/domain";
import { sameOrigin, readJson, rateLimit } from "@/lib/http";
import { sendInquiry, mailError } from "@/lib/inquiry-mail";
import { localMode } from "@/lib/local-store";
export const runtime = "nodejs";
const pending = new Map<
  string,
  Promise<{ inquiryId: string; duplicate: boolean }>
>();
const delivered = new Map<string, number>();
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { success: false, error: "요청 출처를 확인할 수 없습니다" },
      { status: 403 },
    );
  try {
    if (
      !localMode() &&
      (process.env.CONTACT_PUBLIC_ENABLED !== "true" ||
        !process.env.GMAIL_SEND_REFRESH_TOKEN ||
        !process.env.GMAIL_CLIENT_ID ||
        !process.env.GMAIL_CLIENT_SECRET ||
        !process.env.INQUIRY_SIGNING_SECRET)
    )
      return NextResponse.json(
        {
          success: false,
          error:
            "온라인 접수 연결을 준비 중입니다 aiomake2023@gmail.com으로 문의해주세요",
        },
        { status: 503 },
      );
    const parsed = contactSchema.safeParse(await readJson(request));
    if (!parsed.success)
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    if (!(await rateLimit(request, "contact", 5, 600)))
      return NextResponse.json(
        {
          success: false,
          error: "접수가 잠시 제한되었습니다 잠시 뒤 다시 시도해주세요",
        },
        { status: 429 },
      );
    const id = parsed.data.idempotencyKey,
      now = Date.now();
    for (const [key, until] of delivered)
      if (until < now) delivered.delete(key);
    if (delivered.has(id))
      return NextResponse.json({
        success: true,
        data: { inquiryId: id, duplicate: true },
      });
    let task = pending.get(id);
    if (!task) {
      task = sendInquiry({
        version: 1,
        id,
        receivedAt: new Date().toISOString(),
        payload: parsed.data,
      })
        .then((d) => {
          delivered.set(id, Date.now() + 86400000);
          return d;
        })
        .finally(() => pending.delete(id));
      pending.set(id, task);
    }
    const data = await task;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error:
          mailError(e) +
          " 이메일 aiomake2023@gmail.com으로도 문의하실 수 있습니다",
      },
      { status: 503 },
    );
  }
}
