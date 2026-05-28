import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { DevelopmentTeam } from "@/components/landing/development-team";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale, path: "/services/development/team",
    title: isKo ? "개발 팀원소개 — AIO" : "Development · Team — AIO",
    description: isKo ? "기획·카피·디자인·개발·검수 — 개발을 만드는 사람들." : "AIO development team.",
  });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <DevelopmentTeam locale={locale} />;
}
