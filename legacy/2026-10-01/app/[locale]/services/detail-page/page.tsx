import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { DetailPageLanding } from "@/components/landing/detail-page-landing";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/detail-page",
    title: locale === "ko" ? "상세페이지 제작 — AIO" : "Detail Page — AIO",
    description: locale === "ko" ? "5,000~20,000PX 상세페이지 — 스크롤을 멈추게 만드는." : "Detail page design 5,000~20,000PX." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <DetailPageLanding locale={locale} />;
}
