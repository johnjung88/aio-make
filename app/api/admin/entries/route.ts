import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { database, databaseReady } from "@/lib/db";
import { sameOrigin, readJson } from "@/lib/http";
import { entrySchema } from "@/lib/domain";
export async function GET() {
  if (!(await hasAdmin()))
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  if (!databaseReady())
    return NextResponse.json({ connected: false, items: [] });
  const { data, error } = await database()
    .from("website_entries")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (error)
    return NextResponse.json(
      {
        connected: false,
        items: [],
        error: "콘텐츠 데이터 연결을 확인해주세요.",
      },
      { status: 503 },
    );
  return NextResponse.json(
    { connected: true, items: data },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request) {
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
    const parsed = entrySchema.safeParse(await readJson(request, 128000));
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    const { id, ...fields } = parsed.data;
    const query = id
      ? database()
          .from("website_entries")
          .update({ ...fields, updated_at: new Date().toISOString() })
          .eq("id", id)
      : database().from("website_entries").insert(fields);
    const { data, error } = await query.select().single();
    if (error)
      return NextResponse.json(
        {
          error:
            error.code === "23505"
              ? "같은 주소가 이미 있습니다. 슬러그를 바꿔주세요."
              : "콘텐츠 저장을 완료하지 못했습니다.",
        },
        { status: 409 },
      );
    return NextResponse.json({ success: true, item: data });
  } catch {
    return NextResponse.json(
      { error: "콘텐츠 요청 형식을 확인해주세요." },
      { status: 400 },
    );
  }
}
