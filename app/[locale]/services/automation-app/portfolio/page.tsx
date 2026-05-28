import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { AutomationPortfolio } from "@/components/landing/automation-portfolio";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/automation-app/portfolio",
    title: locale === "ko" ? "자동화·프로그램 포트폴리오 — AIO" : "Automation Portfolio — AIO",
    description: locale === "ko" ? "실제 돌아가는 자동화들" : "Live automation portfolio." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <AutomationPortfolio locale={locale} />;
}
