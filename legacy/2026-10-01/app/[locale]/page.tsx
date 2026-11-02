import { MagazineCover } from "@/components/magazine/magazine-cover";
import { MagazineCategoryBand } from "@/components/magazine/magazine-category-band";
import { MagazineBanner } from "@/components/magazine/magazine-banner";
import { MagazineEditorsNote } from "@/components/magazine/magazine-editors-note";
import { MagazineToc } from "@/components/magazine/magazine-toc";
import { MagazineVoices } from "@/components/magazine/magazine-voices";
import { MagazineEditorial } from "@/components/magazine/magazine-editorial";
import { getTranslations } from "next-intl/server";
import { localizedPageMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

// AEO: 자주 묻는 질문 구조화 데이터 (FAQPage + WebSite 검색박스)
const HOME_JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "AIO에이전시는 얼마나 빨리 결과물을 납품하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "최대 5일 이내 결과물을 보장합니다. 긴급 요청 시 협의를 통해 당일~1일 내 납품도 가능합니다.",
        },
      },
      {
        "@type": "Question",
        name: "어떤 서비스를 제공하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "홈페이지·랜딩페이지 제작, 쇼핑몰 구축, 로고·명함 디자인, 상세페이지 제작, PPT 디자인, 앱·업무 자동화 개발, 마케팅 영상 제작까지 모든 결과물을 원스톱으로 제공합니다.",
        },
      },
      {
        "@type": "Question",
        name: "견적은 어떻게 받나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "홈페이지의 '견적 문의' 폼을 통해 서비스 종류, 예산, 일정을 입력하시면 담당 PM이 바로 연락드립니다.",
        },
      },
      {
        "@type": "Question",
        name: "가격이 어떻게 되나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "프리랜서 수준 가격에 에이전시 퀄리티를 제공합니다. 정확한 가격은 요구사항에 따라 다르며, 견적 문의 후 안내받으실 수 있습니다.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "AIO에이전시",
    description: "최대 5일 결과물 보장. 웹사이트·앱·디자인·영상·자동화.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/ko/portfolio?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return localizedPageMetadata({
    locale,
    title: t("headline"),
    description: t("subheadline"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main data-tone="magazine" style={{ background: "var(--tone-magazine-paper)" }}>
      <JsonLd data={HOME_JSON_LD} />
      <MagazineCover />
      <MagazineCategoryBand locale={locale} />
      <MagazineBanner />
      <MagazineEditorsNote />
      <MagazineToc locale={locale} />
      <MagazineVoices />
      <MagazineEditorial locale={locale} />
    </main>
  );
}
