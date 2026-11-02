import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aio-make.com";

const CATEGORY_IDS = [
  "website","shopping-mall","logo-business-card",
  "detail-page","ppt-design","automation-app","video-content",
] as const;

const createSchema = z.object({
  categoryId:  z.enum(CATEGORY_IDS),
  locale:      z.enum(["ko","en"]).default("ko"),
  utmSource:   z.string().trim().min(1).max(60),
  utmMedium:   z.string().trim().max(60).optional().default(""),
  utmCampaign: z.string().trim().max(60).optional().default(""),
  utmContent:  z.string().trim().max(60).optional().default(""),
  label:       z.string().trim().max(100).optional().default(""),
});

function auth401() {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}
function env503() {
  return NextResponse.json({ success: false, error: "Supabase 관리자 환경변수가 없습니다." }, { status: 503 });
}

export async function GET() {
  if (!(await getAdminSession())) return auth401();
  if (!hasSupabaseAdminConfig()) return env503();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("tracking_links")
    .select("id, code, destination_path, utm_source, utm_medium, utm_campaign, utm_content, label, is_active, created_at, category_id")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  if (!(await getAdminSession())) return auth401();
  if (!hasSupabaseAdminConfig()) return env503();

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "잘못된 요청" },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const code = nanoid(7);
  const destinationPath = `/${d.locale}/services/${d.categoryId}`;

  const supabase = createSupabaseAdminClient();
  const { data: link, error } = await supabase
    .from("tracking_links")
    .insert({
      code,
      destination_path: destinationPath,
      utm_source:   d.utmSource,
      utm_medium:   d.utmMedium  || null,
      utm_campaign: d.utmCampaign || null,
      utm_content:  d.utmContent  || null,
      category_id:  d.categoryId,
      label:        d.label || null,
    })
    .select("id, code")
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  const shortUrl = `${SITE_URL}/api/track/${code}`;
  const params = new URLSearchParams();
  params.set("utm_source", d.utmSource);
  if (d.utmMedium)   params.set("utm_medium",   d.utmMedium);
  if (d.utmCampaign) params.set("utm_campaign", d.utmCampaign);
  if (d.utmContent)  params.set("utm_content",  d.utmContent);
  params.set("_tl", code);
  const fullUrl = `${SITE_URL}${destinationPath}?${params.toString()}`;

  return NextResponse.json({ success: true, data: { id: link.id, code, shortUrl, fullUrl } }, { status: 201 });
}

export async function PATCH(req: Request) {
  if (!(await getAdminSession())) return auth401();
  if (!hasSupabaseAdminConfig()) return env503();

  const { id, isActive } = await req.json();
  if (!id) return NextResponse.json({ success: false, error: "id 필요" }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("tracking_links")
    .update({ is_active: Boolean(isActive) })
    .eq("id", id);

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
