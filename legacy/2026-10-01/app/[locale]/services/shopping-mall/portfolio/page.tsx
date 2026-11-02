import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { ShoppingMallPortfolio } from "@/components/landing/shopping-mall-portfolio";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/shopping-mall/portfolio",
    title: locale === "ko" ? "쇼핑몰 포트폴리오 — AIO" : "Shopping Mall Portfolio — AIO",
    description: locale === "ko" ? "실제 운영 중인 스토어들" : "Live shopping mall portfolio." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <ShoppingMallPortfolio locale={locale} />;
}
