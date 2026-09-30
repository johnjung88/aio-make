import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { ShoppingMallLanding } from "@/components/landing/shopping-mall-landing";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/shopping-mall",
    title: locale === "ko" ? "쇼핑몰 제작 — AIO" : "Shopping Mall — AIO",
    description: locale === "ko" ? "카페24·독립몰·자사몰 — 디자인부터 결제 연동까지 한 번에." : "Cafe24, independent malls, full setup." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <ShoppingMallLanding locale={locale} />;
}
