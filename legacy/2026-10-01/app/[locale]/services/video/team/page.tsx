import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { VideoTeam } from "@/components/landing/video-team";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({ locale, path: "/services/video/team",
    title: locale === "ko" ? "영상 팀원 소개 — AIO" : "Video Team — AIO", description: locale === "ko" ? "영상을 만드는 사람들" : "AIO video team." });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return <VideoTeam locale={locale} />;
}
