import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { PptDesignPortfolio } from "@/components/landing/ppt-design-portfolio";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/ppt-design/portfolio",
    title: locale === "ko" ? "PPT 포트폴리오 — AIO" : "PPT Portfolio — AIO",
    description: locale === "ko" ? "투자·계약을 이끈 슬라이드" : "PPT portfolio." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <PptDesignPortfolio locale={locale} />;
}
