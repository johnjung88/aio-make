import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { database, databaseReady } from "@/lib/db";
import { z } from "zod";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await hasAdmin()))
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success)
    return NextResponse.json(
      { error: "잘못된 접수번호입니다." },
      { status: 400 },
    );
  if (!databaseReady())
    return NextResponse.json(
      { error: "데이터베이스 연결이 필요합니다." },
      { status: 503 },
    );
  const db = database(),
    { data: item, error } = await db
      .from("quote_requests")
      .select(
        "id,lead_id,raw_text,status,created_at,leads(customer_name,company_name,email,phone,source_meta)",
      )
      .eq("id", id)
      .eq("channel", "website")
      .maybeSingle();
  if (error)
    return NextResponse.json(
      { error: "문의 조회를 완료하지 못했습니다." },
      { status: 503 },
    );
  if (!item)
    return NextResponse.json(
      { error: "문의를 찾을 수 없습니다." },
      { status: 404 },
    );
  const { data: notes, error: notesError } = await db
    .from("conversations")
    .select("id,role,content,metadata,created_at")
    .eq("lead_id", item.lead_id)
    .contains("metadata", { request_id: id })
    .order("created_at");
  if (notesError)
    return NextResponse.json(
      { error: "상담 내역을 불러오지 못했습니다." },
      { status: 503 },
    );
  return NextResponse.json(
    { item, notes },
    { headers: { "Cache-Control": "no-store" } },
  );
}
