import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { AutomationTeam } from "@/components/landing/automation-team";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale, path: "/services/automation-app/team",
    title: isKo ? "자동화·앱 팀원소개 — AIO" : "Automation · App · Team — AIO",
    description: isKo ? "자동화·앱 개발 — 반복 업무를 시스템으로 대신하는 사람들." : "AIO automation and app team.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AutomationTeam locale={locale} />;
}
