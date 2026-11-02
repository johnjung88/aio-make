import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

export type AdminPortfolio = {
  id: string;
  slug: string;
  primaryCategoryId: string;
  titleKo: string;
  titleEn: string | null;
  clientName: string | null;
  summaryKo: string | null;
  summaryEn: string | null;
  durationDays: number | null;
  isFeatured: boolean;
  isPublished: boolean;
  externalUrl: string | null;
  techStack: string[];
  testimonial: string | null;
  coverUrl: string | null;
  createdAt: string;
};

function toAdminPortfolio(row: Record<string, unknown>): AdminPortfolio {
  const assets = Array.isArray(row.portfolio_assets) ? row.portfolio_assets as Record<string, unknown>[] : [];
  const coverAsset = assets.find((a) => a.asset_type === "image" && a.display_order === 0);
  return {
    id: String(row.id),
    slug: String(row.slug),
    primaryCategoryId: String(row.primary_category_id),
    titleKo: String(row.title_ko),
    titleEn: row.title_en ? String(row.title_en) : null,
    clientName: row.client_name ? String(row.client_name) : null,
    summaryKo: row.summary_ko ? String(row.summary_ko) : null,
    summaryEn: row.summary_en ? String(row.summary_en) : null,
    durationDays: typeof row.duration_days === "number" ? row.duration_days : null,
    isFeatured: Boolean(row.is_featured),
    isPublished: Boolean(row.is_published),
    externalUrl: row.external_url ? String(row.external_url) : null,
    techStack: Array.isArray(row.tech_stack) ? row.tech_stack.map(String) : [],
    testimonial: row.testimonial ? String(row.testimonial) : null,
    coverUrl: coverAsset ? String(coverAsset.url) : null,
    createdAt: String(row.created_at),
  };
}

export async function getAdminPortfolios(): Promise<{
  portfolios: AdminPortfolio[];
  error?: string;
}> {
  if (!hasSupabaseAdminConfig()) {
    return { portfolios: [], error: "Supabase 관리자 환경변수가 없습니다." };
  }
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("portfolios")
      .select("*, portfolio_assets(asset_type, url, display_order)")
      .order("created_at", { ascending: false });
    if (error) return { portfolios: [], error: error.message };
    return { portfolios: (data ?? []).map(toAdminPortfolio) };
  } catch (e) {
    return { portfolios: [], error: e instanceof Error ? e.message : "포트폴리오를 불러오지 못했습니다." };
  }
}

export async function getAdminPortfolioById(id: string): Promise<{
  portfolio: AdminPortfolio | null;
  error?: string;
}> {
  if (!hasSupabaseAdminConfig()) {
    return { portfolio: null, error: "Supabase 관리자 환경변수가 없습니다." };
  }
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("portfolios")
      .select("*, portfolio_assets(asset_type, url, display_order)")
      .eq("id", id)
      .maybeSingle();
    if (error) return { portfolio: null, error: error.message };
    return { portfolio: data ? toAdminPortfolio(data as Record<string, unknown>) : null };
  } catch (e) {
    return { portfolio: null, error: e instanceof Error ? e.message : "포트폴리오를 불러오지 못했습니다." };
  }
}
