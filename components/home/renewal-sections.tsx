"use client";

import Image from "next/image";
import { MonthlyMarketingBoard } from "./monthly-marketing-board";
import { useRef, useState } from "react";
import { GuideLink } from "@/components/guide/primitives";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
import { homeStartingMotionFrames } from "@/lib/content-home";

export const divisions = [
  {
    name: "개발",
    href: "/lab",
    image: "/lab/clinic-pc.webp",
    alt: "서리온결 웹사이트 디자인 샘플 첫 화면",
    line: "시스템을 만드는 분야",
    services: "업무 자동화 · 프로그램 · 웹사이트 · 쇼핑몰",
    note: "서리온결 · 가상 브랜드 제작 샘플",
  },
  {
    name: "마케팅",
    href: "/marketing",
    image: "",
    alt: "가상 브랜드 월간 운영 보드 화면 구성 예시",
    line: "고객을 부르는 분야",
    services: "통합 마케팅 · SNS 대행 운영 · SEO·AEO·GEO",
    note: "달빛정원 · 가상 브랜드 화면 구성 예시",
  },
  {
    name: "컨텐츠",
    href: "/content",
    image: "/service-detail-v14/webtoon-03.webp",
    previews: [
      "/content-renewal-20261019/webtoon-characters.webp",
      homeStartingMotionFrames[1].src,
    ],
    alt: "자체 기획 웹툰 1억의 구단주 완성 원고",
    line: "장면을 담는 분야",
    services:
      "웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상",
    note: "웹툰 · 캐릭터 · 브랜드 모션",
  },
];

export function DivisionCards() {
  return (
    <div className="rw-divisions">
      {divisions.map((item, i) => (
        <GuideLink key={item.href} className="rw-division" href={item.href}>
          <div
            className={`rw-card-media${item.previews ? " rw-card-media--collage" : ""}${item.href === "/marketing" ? " rw-card-media--board" : ""}`}
          >
            {item.href === "/marketing" ? (
              <MonthlyMarketingBoard compact />
            ) : (
              <Image
                src={item.image}
                alt={item.alt}
                width={960}
                height={640}
                sizes="(min-width:768px) 33vw, 100vw"
              />
            )}
            {item.previews?.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt={
                  index === 0
                    ? "자체 기획 웹툰의 캐릭터 설정"
                    : "브랜드 모션 영상 제작 장면"
                }
                width={640}
                height={360}
                sizes="(min-width:768px) 20vw, 60vw"
              />
            ))}
            {item.href !== "/marketing" && (
              <span className="rw-media-note cs-t-caption">{item.note}</span>
            )}
          </div>
          <div className="rw-card-body">
            <span className="cs-t-num">0{i + 1}</span>
            <h3 className="cs-t-h3">{item.name}</h3>
            <p className="cs-t-body">{item.line}</p>
            <p className="cs-t-small rw-muted">{item.services}</p>
            <span className="cs-link">
              {item.name} 살펴보기 <span aria-hidden="true">↗</span>
            </span>
          </div>
        </GuideLink>
      ))}
    </div>
  );
}

export function SectionHead({
  id,
  eyebrow,
  title,
  lead,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <CsSectionHead
      id={id}
      eyebrow={eyebrow}
      title={title}
      lead={lead}
      align="center"
    />
  );
}

export function ContactCta({ source = "main" }: { source?: string }) {
  return (
    <section
      id="contact"
      className="rw-section rw-contact"
      aria-labelledby="rw-contact-title"
    >
      <div className="cs-container">
        <SectionHead
          id="rw-contact-title"
          eyebrow="CONTACT"
          title={"필요한 작업,\n편하게 문의하세요"}
          lead="만드는 일의 끝은 고객이 쓰기 시작하는 순간입니다"
        />
        <GuideLink
          className="cs-btn cs-btn--lg"
          href={`/contact?source=${source}`}
        >
          상담 신청 <span aria-hidden="true">→</span>
        </GuideLink>
      </div>
    </section>
  );
}

export function BrandVideoButton() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [failed, setFailed] = useState(false);
  const close = () => {
    dialog.current?.querySelector("video")?.pause();
    dialog.current?.close();
  };
  return (
    <>
      <button
        type="button"
        className="rw-video-button"
        onClick={() => dialog.current?.showModal()}
      >
        소개 영상 <span aria-hidden="true">▷</span>
      </button>
      <dialog
        ref={dialog}
        className="rw-video-dialog"
        aria-labelledby="rw-video-title"
        onCancel={close}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="rw-video-top">
          <h2 id="rw-video-title" className="cs-t-h3">
            AIO MAKE 소개 영상
          </h2>
          <button type="button" onClick={close} aria-label="소개 영상 닫기">
            닫기 ×
          </button>
        </div>
        <video
          src="/videos/brand-intro-v01.mp4"
          poster="/videos/brand-intro-poster.jpg"
          controls
          playsInline
          preload="none"
          onError={() => setFailed(true)}
        />
        {failed && <p role="status">영상을 불러오지 못했습니다</p>}
        <a href="/videos/brand-intro-v01.mp4" className="cs-link">
          영상 파일 열기
        </a>
      </dialog>
      <noscript>
        <a href="/videos/brand-intro-v01.mp4">소개 영상 보기</a>
      </noscript>
    </>
  );
}

export const companySteps = [
  {
    title: "상담",
    art: "checklist" as const,
    body: "목표와 필요한 작업을 확인합니다",
    check: "작업 범위 · 일정 · 비용",
  },
  {
    title: "기획",
    art: "storyboard" as const,
    body: "자료를 바탕으로 제작 방향을 정합니다",
    check: "구성 · 표현 · 결과물 규격",
  },
  {
    title: "제작",
    art: "refine" as const,
    body: "합의한 방향에 맞춰 결과물을 만듭니다",
    check: "중간 결과 · 수정 내용",
  },
  {
    title: "납품·운영",
    art: "frames" as const,
    body: "실제로 사용할 환경에서 확인합니다",
    check: "최종 검수 · 전달 · 관리 범위",
  },
];
