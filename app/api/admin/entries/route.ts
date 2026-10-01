import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { database, databaseReady } from "@/lib/db";
import { sameOrigin, readJson } from "@/lib/http";
import { entrySchema } from "@/lib/domain";
export async function GET(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  if (!databaseReady())
    return NextResponse.json({ connected: false, items: [] });
  const params = new URL(request.url).searchParams;
  const page = Number(params.get("page") || 1);
  const type = params.get("type") || "all";
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > 100000 ||
    !["all", "reference", "insight"].includes(type)
  )
    return NextResponse.json(
      { error: "올바른 페이지와 콘텐츠 종류를 선택해주세요." },
      { status: 400 },
    );
  const db = database();
  let query = db
    .from("website_entries")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false })
    .range((page - 1) * 50, page * 50 - 1);
  if (type !== "all") query = query.eq("type", type);
  const [list, published] = await Promise.all([
    query,
    db
      .from("website_entries")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true)
      .eq("rights_confirmed", true),
  ]);
  if (list.error || published.error)
    return NextResponse.json(
      {
        connected: false,
        items: [],
        error: "콘텐츠 데이터 연결을 확인해주세요.",
      },
      { status: 503 },
    );
  return NextResponse.json(
    {
      connected: true,
      items: list.data,
      total: list.count,
      page,
      publishedCount: published.count,
    },
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
