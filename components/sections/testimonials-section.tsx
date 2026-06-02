"use client";

import Image from "next/image";
import { CheckCircle2, Star } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

const testimonials = [
  {
    service: { ko: "웹사이트", en: "Website" },
    tag: { ko: "영업용 랜딩", en: "Sales landing" },
    name: { ko: "교육 컨설팅 대표", en: "Education consulting founder" },
    meta: { ko: "랜딩페이지 · 3일 납품", en: "Landing page · 3-day delivery" },
    image: "/marketplace/kmong-portfolio/website-portfolio-cover.png",
    result: { ko: "첫 화면 메시지와 문의 흐름 정리", en: "Hero message and inquiry flow refined" },
    points: {
      ko: ["첫 화면 문구", "문의 버튼", "빠른 수정"],
      en: ["Hero copy", "CTA placement", "Fast revisions"],
    },
    quote: {
      ko: "처음에는 빠른 제작이라 퀄리티가 걱정됐는데, 첫 화면 문구와 문의 버튼 위치까지 바로 영업에 쓸 수 있게 잡아주셨어요. 응답도 빨라서 수정 방향을 주고받는 과정이 편했습니다",
      en: "I was worried fast delivery would hurt quality, but the first screen copy and inquiry flow were ready for sales use. The response speed also made revisions easy.",
    },
  },
  {
    service: { ko: "쇼핑몰", en: "Shopping Mall" },
    tag: { ko: "카페24 메인", en: "Cafe24 main" },
    name: { ko: "식품몰 운영자", en: "Food store operator" },
    meta: { ko: "카페24 메인 · 모바일 구성", en: "Cafe24 main · mobile layout" },
    image: "/portfolio/cafe24-design-pack/d01-wide.png",
    result: { ko: "메인 배너와 카테고리 구매 동선 개선", en: "Main banner and category flow improved" },
    points: {
      ko: ["상품 진열", "모바일 확인", "구매 동선"],
      en: ["Product display", "Mobile review", "Purchase flow"],
    },
    quote: {
      ko: "기존 쇼핑몰은 상품이 많아도 뭘 먼저 봐야 할지 복잡했는데, 메인 배너와 카테고리 흐름이 정리되니 훨씬 전문적으로 보였습니다. 모바일 화면까지 같이 확인해준 점이 좋았습니다",
      en: "Our old store felt crowded even with good products. The new main banner and category flow made it look much more professional, and I liked reviewing mobile screens together.",
    },
  },
  {
    service: { ko: "로고 및 명함", en: "Logo & Card" },
    tag: { ko: "브랜드 세트", en: "Brand kit" },
    name: { ko: "카페 창업 고객", en: "Cafe startup client" },
    meta: { ko: "로고·명함 세트 · 1일 납품", en: "Logo/card kit · 1-day delivery" },
    image: "/portfolio/logo-showcase/moru-coffee/photo-business-card.jpg",
    result: { ko: "오픈 준비에 바로 쓰는 로고와 명함", en: "Logo and card assets ready for launch" },
    points: {
      ko: ["인쇄 파일", "프로필 적용", "브랜드 톤"],
      en: ["Print files", "Profile use", "Brand tone"],
    },
    quote: {
      ko: "브랜드명만 정해진 상태였는데 로고, 명함, 온라인 프로필까지 한 번에 맞춰져서 오픈 준비가 빨라졌습니다. 과하게 꾸미기보다 실제로 쓰기 좋게 정리된 점이 만족스러웠습니다",
      en: "We only had the brand name, but the logo, card, and online profile assets came together at once. It felt practical rather than over-designed.",
    },
  },
  {
    service: { ko: "상세페이지", en: "Detail Page" },
    tag: { ko: "판매 상세", en: "Sales detail" },
    name: { ko: "뷰티 스마트스토어 판매자", en: "Beauty store seller" },
    meta: { ko: "세로형 상세 · 판매 카피 구성", en: "Vertical detail page · sales copy" },
    image: "/portfolio/detail-page/ampoule-anti-aging/cover.webp",
    result: { ko: "고객 고민부터 구매 확인까지 한 흐름으로 구성", en: "A persuasive flow from concern to purchase checks" },
    points: {
      ko: ["성분 신뢰", "사용 장면", "구매 설득"],
      en: ["Ingredient trust", "Use scenes", "Sales copy"],
    },
    quote: {
      ko: "제품 설명을 어떻게 풀어야 할지 막막했는데, 고객 고민부터 사용 장면, 구매 전 확인 사항까지 순서가 잡히니 페이지가 훨씬 설득력 있어졌습니다. 결과물도 예상보다 빨랐습니다",
      en: "I did not know how to explain the product, but the flow from customer concern to usage scenes and purchase checks made the page much more persuasive.",
    },
  },
  {
    service: { ko: "PPT 디자인", en: "PPT Design" },
    tag: { ko: "제안서", en: "Proposal" },
    name: { ko: "B2B 제안 담당자", en: "B2B proposal manager" },
    meta: { ko: "제안서 리디자인 · 원본 납품", en: "Proposal redesign · editable deck" },
    image: "/portfolio/ppt-design/beanbrew-b2b-proposal/cover.png",
    result: { ko: "제안 흐름과 표지 인상을 발표용으로 정리", en: "Proposal flow and cover presence polished" },
    points: {
      ko: ["표지 개선", "흐름 정리", "원본 납품"],
      en: ["Cover polish", "Clear flow", "Editable file"],
    },
    quote: {
      ko: "내용은 있는데 장표가 산만해서 고민이었는데, 흐름과 표지가 정리되니 제안서가 훨씬 믿음직해 보였습니다. 원본 파일까지 받아 내부에서 바로 수정할 수 있었던 점도 좋았습니다",
      en: "We had the content, but the slides looked scattered. Once the flow and cover were cleaned up, the proposal felt much more credible, and the editable file helped internally.",
    },
  },
  {
    service: { ko: "자동화 및 앱", en: "Automation & App" },
    tag: { ko: "운영 관리", en: "Ops system" },
    name: { ko: "콘텐츠 운영팀 리더", en: "Content operations lead" },
    meta: { ko: "관리 화면 · 반복 업무 자동화", en: "Admin UI · workflow automation" },
    image: "/portfolio/v-aio-admin/dashboard.png",
    result: { ko: "상담, 상태 확인, 반복 관리 업무를 한 화면에서 처리", en: "Consultation, status, and repeated ops in one screen" },
    points: {
      ko: ["관리 화면", "상태 확인", "반복 업무 감소"],
      en: ["Admin screen", "Status checks", "Less repetition"],
    },
    quote: {
      ko: "매번 엑셀과 메시지를 오가며 확인하던 내용이 한 화면에 모이니 운영 속도가 확실히 빨라졌습니다. 필요한 기능을 설명하면 바로 화면 기준으로 정리해줘서 이해하기 쉬웠습니다",
      en: "Bringing scattered spreadsheet and message checks into one screen made operations noticeably faster. Explaining features through screens made the process easy to follow.",
    },
  },
  {
    service: { ko: "영상 콘텐츠", en: "Video Content" },
    tag: { ko: "홍보 영상", en: "Promo video" },
    name: { ko: "소상공인 브랜드 담당자", en: "Small business brand manager" },
    meta: { ko: "브랜드 숏폼 · 1-3일 납품", en: "Brand short-form · 1-3 days" },
    image: "/portfolio/video-content-samples/brand-shorts.png",
    result: { ko: "서비스 핵심을 짧은 홍보 영상으로 압축", en: "Core service message compressed into short video" },
    points: {
      ko: ["짧은 메시지", "SNS 활용", "브랜드 톤"],
      en: ["Short message", "SNS-ready", "Brand tone"],
    },
    quote: {
      ko: "텍스트로 설명하면 길어지던 서비스를 짧은 영상으로 보여줄 수 있어서 상담 전에 보내기 좋았습니다. 브랜드 톤도 과하지 않게 맞춰져서 SNS에 바로 올릴 수 있었습니다",
      en: "The short video explained what used to take too much text, so it was useful before consultations. The tone was polished enough to post on social channels right away.",
    },
  },
];

interface Props {
  limit?: number;
  mixed?: boolean;
}

export function TestimonialsSection({ limit = 7 }: Props) {
  const t = useTranslations("testimonials");
  const locale = useLocale() as "ko" | "en";
  const visible = testimonials.slice(0, limit);

  return (
    <section id="testimonials" className="py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">

        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                {t("sectionTitle")}
              </span>
            </div>
            <h2 className="max-w-2xl text-3xl font-bold leading-tight text-foreground md:text-5xl">
              {locale === "ko"
                ? "속도, 응대, 결과물까지 확인하고 맡기는 제작 파트너"
                : "A production partner clients choose for speed, response, and results"}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground">
            {locale === "ko"
              ? "의뢰 전 고객이 가장 궁금해하는 속도, 응대, 결과물 확인 포인트를 서비스별 후기 형식으로 정리했습니다"
              : "Review-style notes organized by service so clients can quickly check speed, response quality, and deliverables."}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {visible.map((item, index) => (
            <article
              key={item.service.ko}
              className="flex h-full flex-col overflow-hidden rounded-lg border border-white/8 bg-card"
            >
              <div className="border-b border-white/8 bg-gradient-to-br from-secondary via-card to-card p-4">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/12 text-sm font-black text-primary">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">
                        {item.name[locale]}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.meta[locale]}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-primary/25 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                    {item.service[locale]}
                  </span>
                </div>

                <div className="rounded-lg border border-white/10 bg-background/45 p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                        {locale === "ko" ? "후기 확인 포인트" : "Review proof"}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {item.result[locale]}
                      </p>
                    </div>
                    <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  </div>

                  <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-white/10 bg-black">
                    <div className="absolute left-0 right-0 top-0 z-10 flex h-7 items-center gap-1.5 border-b border-white/10 bg-black/70 px-3">
                      <span className="size-2 rounded-full bg-red-400/80" />
                      <span className="size-2 rounded-full bg-yellow-300/80" />
                      <span className="size-2 rounded-full bg-primary/80" />
                      <span className="ml-2 truncate text-[10px] font-medium text-white/55">
                        {item.tag[locale]}
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-black/80 to-transparent" />
                    <Image
                      src={item.image}
                      alt={`${item.service[locale]} ${locale === "ko" ? "결과 화면" : "result preview"}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="mb-4 flex gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-base font-semibold leading-8 text-foreground">
                    “{item.quote[locale]}”
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-white/8 pt-4">
                  {item.points[locale].map((point) => (
                    <span
                      key={point}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
