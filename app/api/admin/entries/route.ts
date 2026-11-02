import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { hasAdmin } from "@/lib/auth";
import { database, databaseReady } from "@/lib/db";
import { sameOrigin, readJson } from "@/lib/http";
import { entrySchema, validateServiceCaseEntry, ServiceCaseConflictError, type ExistingServiceCaseEntry } from "@/lib/domain";
import { CASE_BODY_PREFIX, serviceCaseSchema, type ServiceCase } from "@/lib/service-case-schema";
import seedData from "@/content/service-cases-v14.json";
import publicMediaFiles from "@/lib/generated/public-media-files.generated.json";
import { assertServiceCaseMedia } from "@/lib/service-case-media";
export async function GET(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json(
      { error: "로그인이 필요합니다" },
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
      { error: "올바른 페이지와 컨텐츠 종류를 선택해주세요" },
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
        error: "컨텐츠 데이터 연결을 확인해주세요",
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
      { error: "로그인이 필요합니다" },
      { status: 401 },
    );
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "허용되지 않은 요청입니다" },
      { status: 403 },
    );
  if (!databaseReady())
    return NextResponse.json(
      { error: "데이터베이스 연결이 필요합니다" },
      { status: 503 },
    );
  try {
    const parsed = entrySchema.safeParse(await readJson(request, 128000));
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    const { id, ...originalFields } = parsed.data;
    let fields = originalFields;
    let caseRecord: ServiceCase | null = null;
    let previousRecord: ServiceCase | null = null;
    let expectedBody: string | undefined;
    const db = database();
    if (fields.body.startsWith(CASE_BODY_PREFIX)) {
      // Page through all content entries; filtering the marker locally also works
      // with the existing local database adapter and avoids a fixed catalogue cap.
      const existing: ExistingServiceCaseEntry[] = [];
      const pageSize = 250;
      for (let offset = 0; ; offset += pageSize) {
        const result = await db.from("website_entries").select("id,body,slug")
          .eq("type", "reference").eq("division", "video")
          .order("id", { ascending: true }).range(offset, offset + pageSize - 1);
        if (result.error) return NextResponse.json({ error: "기존 서비스 사례를 확인하지 못했습니다. 입력 내용을 보존하고 다시 저장해주세요" }, { status: 503 });
        const rows = (result.data ?? []) as ExistingServiceCaseEntry[];
        existing.push(...rows);
        if (rows.length < pageSize) break;
      }
      try {
        const seedCases = seedData.map((record) => serviceCaseSchema.parse(record));
        const validated = validateServiceCaseEntry(parsed.data, existing, seedCases);
        caseRecord = validated.record;
        previousRecord = validated.previous;
        if (!caseRecord) throw new Error("서비스 제작 사례를 확인해주세요");
        assertServiceCaseMedia(caseRecord, [fields.cover_url, fields.video_url], publicMediaFiles);
        fields = { ...fields, body: validated.body, summary: fields.summary || caseRecord.summary };
        if (id) {
          expectedBody = existing.find((entry) => entry.id === id)?.body;
          if (expectedBody === undefined) return NextResponse.json({ error: "편집할 콘텐츠를 찾지 못했습니다. 최신 목록을 다시 확인해주세요" }, { status: 409 });
        }
      } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "서비스 제작 사례 내용을 확인해주세요" }, { status: error instanceof ServiceCaseConflictError ? 409 : 400 });
      }
    }
    const query = id
      ? db
          .from("website_entries")
          .update({ ...fields, updated_at: new Date().toISOString() })
          .eq("id", id)
      : db.from("website_entries").insert(fields);
    // Protect a validated revision against a second edit arriving during validation.
    if (id && expectedBody !== undefined) query.eq("body", expectedBody);
    const { data, error } = await query.select().single();
    if (error)
      return NextResponse.json(
        {
          error:
            error.code === "PGRST116"
              ? "다른 수정이 먼저 저장되었습니다. 최신 내용을 다시 열어 확인해주세요"
              : error.code === "23505"
              ? "같은 주소가 이미 있습니다 슬러그를 바꿔주세요"
              : "컨텐츠 저장을 완료하지 못했습니다",
        },
        { status: 409 },
      );
    if (caseRecord) {
      const affected = new Set([...caseRecord.services, ...(previousRecord?.services ?? [])].map((service) => service.id));
      for (const service of affected) revalidatePath(`/content/services/${service}`);
    }
    return NextResponse.json({ success: true, item: data });
  } catch {
    return NextResponse.json(
      { error: "컨텐츠 요청 형식을 확인해주세요" },
      { status: 400 },
    );
  }
}
