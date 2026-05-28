import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { DesignHub } from "@/components/landing/design-hub";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/design",
    title: locale === "ko" ? "디자인 서비스 소개 — AIO" : "Design Services — AIO",
    description: locale === "ko" ? "상세페이지·로고·명함·PPT — 첫인상을 디자인합니다." : "Detail page, logo, business card, PPT." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <DesignHub locale={locale} />;
}
