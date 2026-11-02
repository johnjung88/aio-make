import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { PptDesignLanding } from "@/components/landing/ppt-design-landing";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/ppt-design",
    title: locale === "ko" ? "PPT 디자인 — AIO" : "PPT Design — AIO",
    description: locale === "ko" ? "IR·사업계획·제안·발표 — 한 장으로 전달되는 슬라이드." : "PPT design for IR, plans, proposals." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <PptDesignLanding locale={locale} />;
}
