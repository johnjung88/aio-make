import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { DevelopmentServices } from "@/components/landing/development-services";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/services/development",
    title: isKo ? "개발 서비스 소개 — AIO" : "Development Services — AIO",
    description: isKo
      ? "웹사이트·쇼핑몰·자동화까지, 비즈니스에 필요한 것을 코드로 만드는 AIO 개발팀."
      : "Web, shopping mall, automation — AIO development studio.",
  });
}

export default async function DevelopmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <DevelopmentServices locale={locale} />;
}
