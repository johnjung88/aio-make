import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { DetailPageTeam } from "@/components/landing/detail-page-team";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale, path: "/services/detail-page/team",
    title: isKo ? "상세페이지 팀원소개 — AIO" : "Detail Page · Team — AIO",
    description: isKo ? "디자인·카피 — 상세페이지를 만드는 사람들." : "AIO detail page team.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <DetailPageTeam locale={locale} />;
}
