import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { AutomationLanding } from "@/components/landing/automation-landing";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/automation-app",
    title: locale === "ko" ? "자동화·프로그램 — AIO" : "Automation & Programs — AIO",
    description: locale === "ko" ? "엑셀·데이터·크롤링·매크로·데스크탑 프로그램." : "Automation, scripts, desktop programs." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <AutomationLanding locale={locale} />;
}
