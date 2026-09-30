import type { AioNavLevel } from "@/components/landing/aio-nav";

type CatKey = "development" | "design" | "video" | "marketing";

interface NavMeta {
  level: AioNavLevel;
  cat: CatKey;
  sub?: string;
}

/** 포트폴리오 그룹 → AioNav 파라미터 매핑 (단일 소스) */
const CATEGORY_NAV: Record<string, NavMeta> = {
  "logo-business-card": { level: "middle", cat: "design" },
  "detail-page":        { level: "leaf",   cat: "design",      sub: "detail-page" },
  "ppt-design":         { level: "leaf",   cat: "design",      sub: "ppt-design" },
  "website":            { level: "leaf",   cat: "development", sub: "website" },
  "shopping-mall":      { level: "leaf",   cat: "development", sub: "shopping-mall" },
  "automation-app":     { level: "leaf",   cat: "development", sub: "automation-app" },
  "video-content":      { level: "middle", cat: "video" },
};

const DEFAULT_NAV: NavMeta = { level: "middle", cat: "development" };

export function getCategoryNav(group: string): NavMeta {
  return CATEGORY_NAV[group] ?? DEFAULT_NAV;
}
