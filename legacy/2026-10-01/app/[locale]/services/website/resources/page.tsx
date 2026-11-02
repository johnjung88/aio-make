import { IdeTitlebar } from "@/components/ide/ide-titlebar";
import { IdeTabbar } from "@/components/ide/ide-tabbar";
import { IdeResources } from "@/components/ide/ide-resources";
import { IdeStatusbar } from "@/components/ide/ide-statusbar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return {
    title: "AIO · 웹 개발 꿀팁 — 의뢰 전 알면 좋은 12편",
    description: "기술 스택 선택부터 도메인 설정까지. 외주 의뢰 전 알아두면 좋은 무료 가이드 12편.",
  };
}

export default async function WebsiteResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const tabs = [
    { num: "01", label: "services.tsx", href: `/${locale}/services/website` },
    { num: "02", label: "portfolio.tsx", href: `/${locale}/services/website/portfolio` },
    { num: "03", label: "resources.md", href: `/${locale}/services/website/resources`, active: true },
  ];

  return (
    <main data-tone="ide" style={{ background: "var(--tone-ide-bg)", minHeight: "100vh" }}>
      <IdeTitlebar locale={locale} />
      <IdeTabbar tabs={tabs} />
      <IdeResources locale={locale} />
      <IdeStatusbar locale={locale} />
    </main>
  );
}
