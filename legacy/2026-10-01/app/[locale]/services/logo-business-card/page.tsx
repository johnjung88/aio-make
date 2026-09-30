import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { LogoBusinessCardLanding } from "@/components/landing/logo-business-card-landing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/services/logo-business-card",
    title: isKo ? "로고·명함 디자인 — AIO" : "Logo & Business Card — AIO",
    description: isKo
      ? "처음 본 사람도 기억하는 브랜드 — 로고·명함·브랜드 키트를 1일~3일 안에 납품합니다."
      : "Memorable brand identity — logo, business card, and brand kit delivered in 1–3 days.",
  });
}

export default async function LogoBusinessCardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LogoBusinessCardLanding locale={locale} />;
}
