"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { MagazineHeader } from "@/components/magazine/magazine-header";
import { MagazineFooter } from "@/components/magazine/magazine-footer";

/**
 * 톤 매핑 (4분야 체계):
 * - 매거진: /, /about, /quote
 * - IDE(개발): /services/development (구 /services/website 유지)
 * - 라이프스타일(디자인): /services/design (구 /services/detail-page 유지)
 * - 시네마(영상): /services/video
 * - 컨설턴트(마케팅): /services/marketing (구 /services/business, /services/ppt-design 유지)
 */
// 자체완결형(자체 nav+footer 내장) 소 카테고리 랜딩 — 전역 헤더/푸터 미출력
function isStandalone(pathname: string): boolean {
  // Dark Premium 자체완결형 페이지들 (자체 AioNav + AioFooter 내장 — 전역 헤더/푸터 미출력)
  // 중카테고리 허브: /services/{development|design|video|marketing}
  // 소카테고리: /services/{website|shopping-mall|automation-app|detail-page|ppt-design}/(... portfolio 등)
  // 포트폴리오 카테고리 페이지: /portfolio/category/{slug} (서비스별 AioNav 내장)
  return /^\/[a-z]{2}\/services\/(website|shopping-mall|automation-app|detail-page|ppt-design)(\/.*)?$/.test(pathname)
    || /^\/[a-z]{2}\/services\/(development|design|video|marketing)(\/.*)?$/.test(pathname)
    || /^\/[a-z]{2}\/portfolio\/category\/(website|shopping-mall|automation-app|logo-business-card|detail-page|ppt-design|video-content)$/.test(pathname)
    // 포트폴리오 상세 페이지 — 자체 AioNav/AioFooter 내장 (카테고리·인덱스 제외)
    || /^\/[a-z]{2}\/portfolio\/(?!category(\/|$))[^/]+$/.test(pathname);
}

function getTone(
  pathname: string
): "magazine" | "consultant" | "lifestyle" | "ide" | "cinema" | "default" {
  if (/^\/[a-z]{2}(\/(about|quote|team))?\/?$/.test(pathname)) return "magazine";
  if (/^\/[a-z]{2}\/services\/(development|website)(\/.*)?$/.test(pathname)) return "ide";
  if (/^\/[a-z]{2}\/services\/(design|detail-page)(\/.*)?$/.test(pathname)) return "lifestyle";
  if (/^\/[a-z]{2}\/services\/video(\/.*)?$/.test(pathname)) return "cinema";
  if (/^\/[a-z]{2}\/services\/(marketing|business|ppt-design)(\/.*)?$/.test(pathname)) return "consultant";
  return "default";
}

export function SiteHeader() {
  const pathname = usePathname();
  if (isStandalone(pathname)) return null;
  const tone = getTone(pathname);
  // 컨설턴트·라이프스타일·IDE·시네마는 자체 Nav를 page.tsx에서 렌더 → SiteHeader 생략
  if (tone === "consultant" || tone === "lifestyle" || tone === "ide" || tone === "cinema") return null;
  if (tone === "magazine") return <MagazineHeader />;
  return <Header />;
}

export function SiteFooter() {
  const pathname = usePathname();
  if (isStandalone(pathname)) return null;
  return <MagazineFooter />;
}
