import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { inquiryList, updateInquiry } from "@/lib/local-store";
import { sameOrigin, readJson } from "@/lib/http";
import { inquiryUpdateSchema } from "@/lib/domain";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  const p = new URL(request.url).searchParams;
  try {
    return NextResponse.json(
      await inquiryList(
        p.get("status") || "all",
        (p.get("search") || "").slice(0, 200),
        Math.max(1, Math.min(10000, Math.floor(Number(p.get("page"))) || 1)),
      ),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "로컬 문의 저장소를 확인해주세요" },
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
