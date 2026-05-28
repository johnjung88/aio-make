import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { VideoHub } from "@/components/landing/video-hub";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/video",
    title: locale === "ko" ? "영상 제작 — AIO" : "Video — AIO",
    description: locale === "ko" ? "브랜드·SNS·마케팅·유튜브 — 한 컷이 전부입니다." : "Brand, SNS, marketing, YouTube videos." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <VideoHub locale={locale} />;
}
