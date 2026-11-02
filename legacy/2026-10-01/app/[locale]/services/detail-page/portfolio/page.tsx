import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { DetailPagePortfolio } from "@/components/landing/detail-page-portfolio";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/detail-page/portfolio",
    title: locale === "ko" ? "상세페이지 포트폴리오 — AIO" : "Detail Page Portfolio — AIO",
    description: locale === "ko" ? "실제 매출로 검증된 상세페이지" : "Detail pages portfolio." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <DetailPagePortfolio locale={locale} />;
}
