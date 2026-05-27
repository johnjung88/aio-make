import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { WebsiteLanding } from "@/components/landing/website-landing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/services/website",
    title: isKo ? "웹사이트 제작 — AIO" : "Website — AIO",
    description: isKo
      ? "회사 홈페이지·서비스 랜딩·마케팅 랜딩 — 스크롤을 멈추게 만드는 홈페이지."
      : "Company sites, service & marketing landing pages.",
  });
}

export default async function WebsitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <WebsiteLanding locale={locale} />;
}
