import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { MarketingHub } from "@/components/landing/marketing-hub";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/marketing",
    title: locale === "ko" ? "마케팅 운영대행 — AIO" : "Marketing — AIO",
    description: locale === "ko" ? "블로그·SNS·영상채널 운영대행 — 꾸준함이 만드는 유입." : "Blog, SNS, video channel ops." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <MarketingHub locale={locale} />;
}
