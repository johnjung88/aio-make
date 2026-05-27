"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { MagazineHeader } from "@/components/magazine/magazine-header";
import { MagazineFooter } from "@/components/magazine/magazine-footer";
import { ConsultFooter } from "@/components/consultant/consult-footer";
import { LifestyleFooter } from "@/components/lifestyle/lifestyle-footer";
import { IdeFooter } from "@/components/ide/ide-footer";
import { VideoFooter } from "@/components/video/video-footer";

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
  return /^\/[a-z]{2}\/services\/(website)(\/.*)?$/.test(pathname);
}

function getTone(
  pathname: string
): "magazine" | "consultant" | "lifestyle" | "ide" | "cinema" | "default" {
  if (/^\/[a-z]{2}(\/(about|quote))?\/?$/.test(pathname)) return "magazine";
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
  const tone = getTone(pathname);
  if (tone === "magazine") return <MagazineFooter />;
  if (tone === "consultant") return <ConsultFooter />;
  if (tone === "lifestyle") return <LifestyleFooter />;
  if (tone === "ide") return <IdeFooter />;
  if (tone === "cinema") return <VideoFooter />;
  return <Footer />;
}
