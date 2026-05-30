import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { WebsiteTeam } from "@/components/landing/website-team";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale, path: "/services/website/team",
    title: isKo ? "웹사이트 팀원소개 — AIO" : "Website · Team — AIO",
    description: isKo ? "기획·디자인·개발·검수 — 웹사이트를 만드는 사람들." : "AIO website team.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <WebsiteTeam locale={locale} />;
}
