import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { DesignTeam } from "@/components/landing/design-team";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/design/team",
    title: locale === "ko" ? "디자인 팀원 소개 — AIO" : "Design Team — AIO", description: locale === "ko" ? "디자인을 만드는 사람들" : "AIO design team." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <DesignTeam locale={locale} />;
}
