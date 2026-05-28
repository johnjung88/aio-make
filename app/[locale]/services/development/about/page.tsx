import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { DevelopmentAbout } from "@/components/landing/development-about";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale, path: "/services/development/about",
    title: isKo ? "개발 회사소개 — AIO" : "Development · About — AIO",
    description: isKo ? "웹·쇼핑몰·자동화까지, 필요한 것을 코드로 만드는 AIO 개발팀." : "AIO development studio.",
  });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <DevelopmentAbout locale={locale} />;
}
