import { LifestyleNav } from "@/components/lifestyle/lifestyle-nav";
import { LifestyleTabs } from "@/components/lifestyle/lifestyle-tabs";
import { LifestyleResources } from "@/components/lifestyle/lifestyle-resources";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return {
    title: "AIO · 상세페이지 꿀팁 — 의뢰 전 알면 좋은 15편",
    description: "구매 심리부터 섹션 설계까지. 상세페이지 외주 의뢰 전 무료 가이드 15편.",
  };
}

export default async function DetailPageResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const tabs = [
    { num: "01", label: "서비스", href: `/${locale}/services/detail-page` },
    { num: "02", label: "포트폴리오", href: `/${locale}/services/detail-page/portfolio` },
    { num: "03", label: "꿀팁 자료", href: `/${locale}/services/detail-page/resources`, active: true },
  ];

  return (
    <main data-tone="lifestyle" style={{ background: "var(--tone-life-cream)", minHeight: "100vh" }}>
      <LifestyleNav locale={locale} />
      <LifestyleTabs tabs={tabs} />
      <LifestyleResources locale={locale} />
    </main>
  );
}
