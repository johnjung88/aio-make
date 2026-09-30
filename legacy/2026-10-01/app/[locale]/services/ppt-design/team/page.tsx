import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { PptDesignTeam } from "@/components/landing/ppt-design-team";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale, path: "/services/ppt-design/team",
    title: isKo ? "PPT·IR 팀원소개 — AIO" : "PPT · IR · Team — AIO",
    description: isKo ? "IR 덱·제안서·PPT — 발표 자료를 만드는 사람들." : "AIO PPT and IR design team.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PptDesignTeam locale={locale} />;
}
