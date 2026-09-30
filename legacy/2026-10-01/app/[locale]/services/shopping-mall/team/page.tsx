import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { ShoppingMallTeam } from "@/components/landing/shopping-mall-team";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale, path: "/services/shopping-mall/team",
    title: isKo ? "쇼핑몰 팀원소개 — AIO" : "Shopping Mall · Team — AIO",
    description: isKo ? "기획·개발·검수 — 쇼핑몰을 만드는 사람들." : "AIO shopping mall team.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ShoppingMallTeam locale={locale} />;
}
