import { ConsultNav } from "@/components/consultant/consult-nav";
import { ConsultTabs } from "@/components/consultant/consult-tabs";
import { ConsultResources } from "@/components/consultant/consult-resources";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return {
    title: "AIO · PPT 꿀팁 — 발표 전 알면 좋은 Field Guide 13편",
    description: "스토리라인·IR Deck·발표 스킬까지. 외주 의뢰 전 무료 Field Guide 13편.",
  };
}

export default async function PptResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const tabs = [
    { num: "01", label: "서비스", href: `/${locale}/services/ppt-design` },
    { num: "02", label: "포트폴리오", href: `/${locale}/services/ppt-design/portfolio` },
    { num: "03", label: "꿀팁 자료", href: `/${locale}/services/ppt-design/resources`, active: true },
  ];

  return (
    <main data-tone="consultant" style={{ background: "var(--tone-consult-paper)", minHeight: "100vh" }}>
      <ConsultNav locale={locale} />
      <ConsultTabs tabs={tabs} />
      <ConsultResources locale={locale} />
    </main>
  );
}
