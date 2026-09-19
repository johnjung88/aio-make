import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/site";
import "../marketing.css";
import { MarketingAttribution } from "@/components/marketing/attribution";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { default: "AIO | 매장을 위한 통합 마케팅", template: "%s | AIO" },
  description:
    "재방문 준비·콘텐츠 운영·유입 측정을 하나의 월간 플랜으로 연결합니다.",
};
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== "ko") notFound();
  return (
    <div className="m-site">
      <MarketingAttribution />
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
