import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { contentSchemas } from "@/lib/marketing/cms-schema";
import { z } from "zod";
export async function GET() {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const r = await createSupabaseAdminClient()
      .from("marketing_content")
      .select("*")
      .order("created_at", { ascending: false });
    if (r.error) throw r.error;
    return NextResponse.json(r.data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "콘텐츠 DB 연결을 확인해 주세요." },
      { status: 503 },
    );
  }
}
export async function POST(req: Request) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (
    req.headers.get("origin") !==
    new URL(process.env.NEXT_PUBLIC_SITE_URL || req.url).origin
  )
    return NextResponse.json({ error: "Origin rejected" }, { status: 403 });
  try {
    const p = z
      .object({
        slug: z.enum(["home", "marketing", "pricing", "projects", "resources"]),
        title: z.string().min(1).max(200),
        body: z.string().max(30000),
        publish: z.boolean(),
        version: z.string().uuid().optional(),
      })
      .parse(await req.json());
    contentSchemas[p.slug].parse(JSON.parse(p.body));
    if (p.publish && process.env.MARKETING_CONTENT_PUBLISH_ENABLED !== "true")
      return NextResponse.json(
        {
          error:
            "공개 변경 승인이 활성화되지 않았습니다. 초안·미리보기만 가능합니다.",
        },
        { status: 403 },
      );
    const r = await createSupabaseAdminClient().rpc("marketing_save_content", {
      p_slug: p.slug,
      p_title: p.title,
      p_body: p.body,
      p_publish: p.publish,
      p_version: p.version || null,
    });
    if (r.error) throw r.error;
    return NextResponse.json({ id: r.data });
  } catch {
    return NextResponse.json(
      { error: "내용 형식이나 버전을 확인해 주세요." },
      { status: 400 },
    );
  }
}
