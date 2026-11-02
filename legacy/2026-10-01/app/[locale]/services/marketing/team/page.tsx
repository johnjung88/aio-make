import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { MarketingTeam } from "@/components/landing/marketing-team";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/marketing/team",
    title: locale === "ko" ? "마케팅 팀원 소개 — AIO" : "Marketing Team — AIO", description: locale === "ko" ? "운영하는 사람들" : "AIO marketing team." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <MarketingTeam locale={locale} />;
}
