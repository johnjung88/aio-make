import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

const CATEGORY_IDS = [
  "website", "shopping-mall", "logo-business-card",
  "detail-page", "ppt-design", "automation-app", "video-content",
] as const;

const patchSchema = z.object({
  primaryCategoryId: z.enum(CATEGORY_IDS).optional(),
  titleKo: z.string().trim().min(1).max(200).optional(),
  titleEn: z.string().trim().max(200).optional(),
  clientName: z.string().trim().max(100).optional(),
  summaryKo: z.string().trim().max(1000).optional(),
  summaryEn: z.string().trim().max(1000).optional(),
  durationDays: z.number().int().positive().nullable().optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  externalUrl: z.string().trim().url().nullable().or(z.literal("")).optional(),
  techStack: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
  testimonial: z.string().trim().max(500).optional(),
  coverUrl: z.string().trim().max(500).optional(),
});

function auth401() {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}
function env503() {
  return NextResponse.json({ success: false, error: "Supabase 관리자 환경변수가 없습니다." }, { status: 503 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) return auth401();
  if (!hasSupabaseAdminConfig()) return env503();

  const { id } = await params;
  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "잘못된 요청" },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const supabase = createSupabaseAdminClient();

  const updates: Record<string, unknown> = {};
  if (d.primaryCategoryId !== undefined) updates.primary_category_id = d.primaryCategoryId;
  if (d.titleKo !== undefined) updates.title_ko = d.titleKo;
  if (d.titleEn !== undefined) updates.title_en = d.titleEn || null;
  if (d.clientName !== undefined) updates.client_name = d.clientName || null;
  if (d.summaryKo !== undefined) updates.summary_ko = d.summaryKo || null;
  if (d.summaryEn !== undefined) updates.summary_en = d.summaryEn || null;
  if (d.durationDays !== undefined) updates.duration_days = d.durationDays;
  if (d.isFeatured !== undefined) updates.is_featured = d.isFeatured;
  if (d.isPublished !== undefined) updates.is_published = d.isPublished;
  if (d.externalUrl !== undefined) updates.external_url = d.externalUrl || null;
  if (d.techStack !== undefined) updates.tech_stack = d.techStack;
  if (d.testimonial !== undefined) updates.testimonial = d.testimonial || null;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from("portfolios").update(updates).eq("id", id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (d.coverUrl !== undefined) {
    await supabase
      .from("portfolio_assets")
      .delete()
      .eq("portfolio_id", id)
      .eq("asset_type", "image")
      .eq("display_order", 0);
    if (d.coverUrl) {
      await supabase.from("portfolio_assets").insert({
        portfolio_id: id,
        asset_type: "image",
        url: d.coverUrl,
        display_order: 0,
      });
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) return auth401();
  if (!hasSupabaseAdminConfig()) return env503();

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("portfolios").delete().eq("id", id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
