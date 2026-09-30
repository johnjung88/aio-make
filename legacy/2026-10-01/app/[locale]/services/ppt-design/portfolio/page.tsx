import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";
import { PptDesignPortfolio } from "@/components/landing/ppt-design-portfolio";
import { getProjectsByCategory } from "@/lib/portfolio";

// slug → display category for filter chips
const PPT_KIND: Record<string, string> = {
  "ppt-government-grant":     "지원사업·R&D",
  "ppt-ir-investment":        "IR·투자유치",
  "ppt-brand-proposal":       "제안·회사소개",
  "ppt-seminar-lecture":      "발표·강연",
  "ppt-school-assignment":    "학술·과제",
  "ppt-tips-vibestack":       "지원사업·R&D",
  "ppt-youngceo-greenpet":    "지원사업·R&D",
  "ppt-prea-silvercarelab":   "IR·투자유치",
  "ppt-seriesa-greenpet":     "IR·투자유치",
  "ppt-vibestack-company-profile": "제안·회사소개",
  "ppt-beanbrew-b2b-proposal": "제안·회사소개",
  "ppt-ai-automation-seminar": "발표·강연",
  "ppt-solopreneur-talk":     "발표·강연",
  "ppt-capstone-recycleme":   "학술·과제",
  "ppt-academic-paper":       "학술·과제",
  "ppt-seriesb-flowdesk":     "IR·투자유치",
  "ppt-demoday-noderush":     "IR·투자유치",
  "ppt-kstartup-luminex":     "지원사업·R&D",
  "ppt-rnd-neuralwave":       "지원사업·R&D",
  "ppt-lifecare-insurance":   "제안·회사소개",
  "ppt-growthpie-marketing":  "제안·회사소개",
  "ppt-marketing-keynote":    "발표·강연",
  "ppt-data-intro-seminar":   "발표·강연",
  "ppt-teamproject-coffee":   "학술·과제",
  "ppt-internship-report":    "학술·과제",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata({
    locale,
    path: "/services/ppt-design/portfolio",
    title: locale === "ko" ? "PPT 포트폴리오 — AIO" : "PPT Portfolio — AIO",
    description: locale === "ko" ? "투자·계약을 이끈 슬라이드" : "PPT portfolio.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ko = locale === "ko";
  const projects = await getProjectsByCategory("ppt-design");

  const items = projects.map((p) => ({
    slug: p.slug,
    title: ko ? p.title.ko : (p.title.en ?? p.title.ko),
    cover: p.cover,
    slides: p.kpis?.[0]?.value ?? "",
    deckUrl: p.downloads?.deck ?? null,
    kind: PPT_KIND[p.slug] ?? "제안·회사소개",
  }));

  return <PptDesignPortfolio locale={locale} items={items} />;
}
