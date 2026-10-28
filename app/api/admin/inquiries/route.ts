import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { inquiryList, updateInquiry } from "@/lib/local-store";
import { sameOrigin, readJson } from "@/lib/http";
import { inquiryUpdateSchema } from "@/lib/domain";
import { purposeOptions } from "@/lib/tracking-config";
import { csvLine, inquiryCsvHeaders, inquiryCsvRow } from "@/lib/inquiry-csv";
import { cleanUtm } from "@/lib/attribution";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  const p = new URL(request.url).searchParams;
  const utm = cleanUtm(Object.fromEntries(p));
  const filters = {
    utm_campaign: utm.utm_campaign ?? "",
    utm_content: utm.utm_content ?? "",
    purpose: p.get("purpose") ?? "",
  };
  if (
    filters.purpose &&
    !purposeOptions.some(([value]) => value === filters.purpose)
  )
    return NextResponse.json(
      { error: "유입 필터 값을 확인해주세요" },
      { status: 400 },
    );
  const status = p.get("status") || "all",
    search = (p.get("search") || "").slice(0, 200);
  try {
    if (p.get("format") === "csv") {
      const first = await inquiryList(status, search, 1, filters, 500);
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            controller.enqueue(
              encoder.encode("\uFEFF" + csvLine(inquiryCsvHeaders)),
            );
            let batch = first;
            for (let page = 1; ; page++) {
              for (const item of batch.items)
                controller.enqueue(encoder.encode(inquiryCsvRow(item)));
              if (page * 500 >= first.total || !batch.items.length) break;
              batch = await inquiryList(status, search, page + 1, filters, 500);
            }
            controller.close();
          } catch {
            controller.error(new Error("문의 내보내기를 완료하지 못했습니다"));
          }
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="aio-inquiries.csv"',
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
    return NextResponse.json(
      await inquiryList(
        status,
        search,
        Math.max(1, Math.min(10000, Math.floor(Number(p.get("page"))) || 1)),
        filters,
      ),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "문의 저장소를 확인해주세요" },
      { status: 503 },
    );
  }
}
export async function PATCH(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "허용되지 않은 요청입니다" },
      { status: 403 },
    );
  try {
    const p = inquiryUpdateSchema.safeParse(await readJson(request));
    if (!p.success)
      return NextResponse.json(
        { error: "상태 또는 메모를 확인해주세요" },
        { status: 400 },
      );
    const ok = await updateInquiry(p.data.id, p.data.status, p.data.note);
    return NextResponse.json({ success: ok }, { status: ok ? 200 : 404 });
  } catch {
    return NextResponse.json(
      { error: "저장하지 못했습니다 다시 시도해주세요" },
      { status: 503 },
    );
  }
}
