/**
 * Portfolio data adapter
 * PORTFOLIO_SOURCE=db  → Supabase DB
 * PORTFOLIO_SOURCE=code (default) → lib/portfolio-data.ts
 *
 * Server components use the async functions here.
 * lib/portfolio-data.ts remains as-is (client component + static params fallback).
 */

export type {
  PortfolioProject,
  PortfolioGroup,
  PortfolioType,
  KpiCard,
  BeforeAfter,
  LocalizedString,
} from "./portfolio-data";

export {
  portfolioGroups,
  portfolioProjects,
  portfolioTypes,
  portfolioTypeColors,
  formatProjectDuration,
  getPortfolioGroup,
} from "./portfolio-data";

import type { PortfolioProject, PortfolioGroup, PortfolioType, PortfolioSubtype } from "./portfolio-data";
import {
  portfolioProjects as _allProjects,
  getProjectsByPortfolioGroup as _byGroup,
  getFeaturedProjects as _featured,
  getPortfolioProjectBySlug as _bySlug,
} from "./portfolio-data";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "./supabase";

const USE_DB =
  process.env.PORTFOLIO_SOURCE === "db" && hasSupabaseAdminConfig();

// ── DB → PortfolioProject 변환 ──────────────────────────────────────

function categoryToType(categoryId: string): PortfolioType {
  if (categoryId === "video-content") return "video";
  if (categoryId === "automation-app") return "automation";
  if (
    categoryId === "logo-business-card" ||
    categoryId === "detail-page" ||
    categoryId === "ppt-design"
  )
    return "design";
  return "web";
}

// getPortfolioGroup()이 DB 프로젝트에서도 정확히 동작하도록
// subtype을 category_id에서 역매핑
function categoryToSubtype(categoryId: string): PortfolioSubtype | undefined {
  const MAP: Record<string, PortfolioSubtype> = {
    "shopping-mall":      "shopping-mall",
    "ppt-design":         "ppt",
    "detail-page":        "detail-page",
    "logo-business-card": "logo",
  };
  return MAP[categoryId];
}

type DbPortfolioRow = {
  id: string;
  slug: string;
  primary_category_id: string;
  title_ko: string;
  title_en: string | null;
  client_name: string | null;
  summary_ko: string | null;
  summary_en: string | null;
  duration_days: number | null;
  is_featured: boolean;
  is_published: boolean;
  external_url: string | null;
  tech_stack: string[];
  created_at: string;
  portfolio_assets: {
    asset_type: string;
    url: string;
    display_order: number;
  }[];
  portfolio_kpis: {
    label_ko: string;
    label_en: string | null;
    value_text: string;
    display_order: number;
  }[];
};

function dbRowToProject(row: DbPortfolioRow): PortfolioProject {
  const assets = row.portfolio_assets ?? [];
  const kpis = row.portfolio_kpis ?? [];

  const cover =
    assets.find((a) => a.asset_type === "image" && a.display_order === 0)
      ?.url ?? "";
  const gallery = assets
    .filter((a) => a.asset_type === "image" && a.display_order > 0)
    .sort((a, b) => a.display_order - b.display_order)
    .map((a) => a.url);
  const beforeAsset = assets.find((a) => a.asset_type === "before");
  const afterAsset = assets.find((a) => a.asset_type === "after");

  return {
    id: row.id,
    slug: row.slug,
    type: categoryToType(row.primary_category_id),
    subtype: categoryToSubtype(row.primary_category_id),
    visibility: row.is_published ? "public" : "private-result",
    proofType: "screenshots",
    mediaPolicy: "rich-gallery",
    title: { ko: row.title_ko, en: row.title_en ?? row.title_ko },
    summary: {
      ko: row.summary_ko ?? "",
      en: row.summary_en ?? row.summary_ko ?? "",
    },
    problem: { ko: "", en: "" },
    solution: { ko: "", en: "" },
    impact: { ko: "", en: "" },
    kpis: kpis
      .sort((a, b) => a.display_order - b.display_order)
      .map((k) => ({
        value: k.value_text,
        label: { ko: k.label_ko, en: k.label_en ?? k.label_ko },
      })),
    stack: row.tech_stack ?? [],
    role: [],
    duration: row.duration_days ? `${row.duration_days}일` : "진행 중",
    client: row.client_name ?? "",
    links: {
      live: row.external_url ?? null,
      github: null,
      case: `/portfolio/${row.slug}`,
    },
    cover,
    gallery,
    beforeAfter:
      beforeAsset && afterAsset
        ? {
            before: beforeAsset.url,
            after: afterAsset.url,
            beforeLabel: { ko: "이전", en: "Before" },
            afterLabel: { ko: "이후", en: "After" },
          }
        : undefined,
    size: "md",
    featured: row.is_featured,
    publishedAt: row.created_at?.slice(0, 10) ?? "",
  };
}

// ── DB fetch helpers ────────────────────────────────────────────────

const SELECT = "*, portfolio_assets(*), portfolio_kpis(*)";

async function dbByCategory(group: PortfolioGroup): Promise<PortfolioProject[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("portfolios")
    .select(SELECT)
    .eq("primary_category_id", group)
    .eq("is_published", true)
    .order("display_order");
  if (error) throw error;
  return (data as DbPortfolioRow[]).map(dbRowToProject);
}

async function dbFeatured(): Promise<PortfolioProject[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("portfolios")
    .select(SELECT)
    .eq("is_featured", true)
    .eq("is_published", true)
    .order("display_order")
    .limit(9);
  if (error) throw error;
  return (data as DbPortfolioRow[]).map(dbRowToProject);
}

async function dbBySlug(slug: string): Promise<PortfolioProject | undefined> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("portfolios")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? dbRowToProject(data as DbPortfolioRow) : undefined;
}

// ── Public async API ────────────────────────────────────────────────

export async function getProjectsByCategory(
  group: PortfolioGroup
): Promise<PortfolioProject[]> {
  if (USE_DB) {
    try {
      return await dbByCategory(group);
    } catch (e) {
      console.error("[portfolio] DB fallback to code:", e);
    }
  }
  return _byGroup(group);
}

export async function getFeaturedPortfolios(): Promise<PortfolioProject[]> {
  if (USE_DB) {
    try {
      return await dbFeatured();
    } catch (e) {
      console.error("[portfolio] DB fallback to code:", e);
    }
  }
  return _featured();
}

export async function getPortfolioBySlug(
  slug: string
): Promise<PortfolioProject | undefined> {
  if (USE_DB) {
    try {
      return await dbBySlug(slug);
    } catch (e) {
      console.error("[portfolio] DB fallback to code:", e);
    }
  }
  return _bySlug(slug);
}

export async function getAllPortfolios(): Promise<PortfolioProject[]> {
  if (USE_DB) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("portfolios")
        .select(SELECT)
        .eq("is_published", true)
        .order("display_order");
      if (error) throw error;
      return (data as DbPortfolioRow[]).map(dbRowToProject);
    } catch (e) {
      console.error("[portfolio] DB fallback to code:", e);
    }
  }
  return _allProjects;
}
