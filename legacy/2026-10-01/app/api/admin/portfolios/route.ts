import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

const CATEGORY_IDS = [
  "website", "shopping-mall", "logo-business-card",
  "detail-page", "ppt-design", "automation-app", "video-content",
] as const;

const portfolioSchema = z.object({
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/, "slug는 소문자·숫자·하이픈만 허용"),
  primaryCategoryId: z.enum(CATEGORY_IDS),
  titleKo: z.string().trim().min(1).max(200),
  titleEn: z.string().trim().max(200).optional().default(""),
  clientName: z.string().trim().max(100).optional().default(""),
  summaryKo: z.string().trim().max(1000).optional().default(""),
  summaryEn: z.string().trim().max(1000).optional().default(""),
  durationDays: z.number().int().positive().optional().nullable().default(null),
  isFeatured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
  externalUrl: z.string().trim().url().optional().nullable().or(z.literal("")).default(""),
  techStack: z.array(z.string().trim().min(1).max(60)).max(20).optional().default([]),
  testimonial: z.string().trim().max(500).optional().default(""),
  coverUrl: z.string().trim().max(500).optional().default(""),
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
    .from("portfolios")
    .select("id, slug, title_ko, primary_category_id, is_featured, is_published, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) return auth401();
  if (!hasSupabaseAdminConfig()) return env503();

  const parsed = portfolioSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "잘못된 요청" },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const supabase = createSupabaseAdminClient();

  const { data: portfolio, error } = await supabase
    .from("portfolios")
    .insert({
      slug: d.slug,
      primary_category_id: d.primaryCategoryId,
      title_ko: d.titleKo,
      title_en: d.titleEn || null,
      client_name: d.clientName || null,
      summary_ko: d.summaryKo || null,
      summary_en: d.summaryEn || null,
      duration_days: d.durationDays ?? null,
      is_featured: d.isFeatured,
      is_published: d.isPublished,
      external_url: d.externalUrl || null,
      tech_stack: d.techStack,
      testimonial: d.testimonial || null,
    })
    .select("id")
    .single();

  if (error) {
    const msg = error.code === "23505" ? "이미 존재하는 slug입니다." : error.message;
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }

  if (d.coverUrl) {
    await supabase.from("portfolio_assets").insert({
      portfolio_id: portfolio.id,
      asset_type: "image",
      url: d.coverUrl,
      display_order: 0,
    });
  }

  return NextResponse.json({ success: true, data: { id: portfolio.id } }, { status: 201 });
}
