import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { WebsitePortfolio } from "@/components/landing/website-portfolio";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/services/website/portfolio",
    title: isKo ? "웹사이트 포트폴리오 — AIO" : "Website Portfolio — AIO",
    description: isKo ? "회사·서비스·마케팅 랜딩, 쇼핑몰까지 — 분야별 웹사이트 작업." : "Website work by type.",
  });
}

export default async function WebsitePortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <WebsitePortfolio locale={locale} />;
}
