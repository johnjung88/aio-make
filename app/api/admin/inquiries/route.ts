import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { database, databaseReady } from "@/lib/db";
import { sameOrigin, readJson } from "@/lib/http";
import { inquiryUpdateSchema } from "@/lib/domain";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  if (!databaseReady())
    return NextResponse.json({ connected: false, items: [], total: null });
  const url = new URL(request.url),
    page = Math.max(
      1,
      Math.min(10000, Math.floor(Number(url.searchParams.get("page"))) || 1),
    );
  try {
    const { data, error } = await database().rpc("list_website_inquiries", {
      p_status: url.searchParams.get("status") ?? "all",
      p_search: (url.searchParams.get("search") ?? "").trim().slice(0, 200),
      p_offset: (page - 1) * 50,
      p_limit: 50,
    });
    if (error) throw error;
    return NextResponse.json(
      {
        connected: true,
        ...data,
        page,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        connected: false,
        error: "문의 데이터 연결을 확인해주세요.",
        items: [],
        total: null,
      },
      { status: 503 },
    );
  }
}
export async function PATCH(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "허용되지 않은 요청입니다." },
      { status: 403 },
    );
  if (!databaseReady())
    return NextResponse.json(
      { error: "데이터베이스 연결이 필요합니다." },
      { status: 503 },
    );
  try {
    const parsed = inquiryUpdateSchema.safeParse(await readJson(request));
    if (!parsed.success)
      return NextResponse.json(
        { error: "상태 또는 메모 형식을 확인해주세요." },
        { status: 400 },
      );
    const { data, error } = await database().rpc("update_website_inquiry", {
      p_id: parsed.data.id,
      p_status: parsed.data.status,
      p_note: parsed.data.note,
    });
    if (error) throw error;
    if (!data)
      return NextResponse.json(
        { error: "문의를 찾을 수 없습니다." },
        { status: 404 },
      );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "상담 내역 저장을 완료하지 못했습니다." },
      { status: 503 },
    );
  }
}
