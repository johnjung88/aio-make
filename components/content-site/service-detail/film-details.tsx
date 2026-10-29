"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FilmPreview, type FilmPreviewSelection } from "./film-preview";
import {
  CaseCta,
  DetailHero,
  DetailImage,
  DetailSection,
  DetailVideo,
  ServiceOverview,
} from "./shared";
import "./film-details.css";

const media = "/service-detail-v14/";

function seekScene(stage: HTMLDivElement | null, time: number) {
  const video = stage?.querySelector("video");
  if (!video) return;
  video.pause();
  if (video.readyState >= 1) video.currentTime = time;
}

const motionScenes = [
  { time: 2, image: "bwl-motion-frame-02.webp", title: "제형을 담은 알약형 창", description: "가운데 작은 알약형 창 안에 제품의 제형을 보여줍니다" },
  { time: 10, image: "bwl-motion-frame-10.webp", title: "손과 제형의 큰 화면", description: "같은 형태의 창을 크게 확장해 손과 제형에 집중합니다" },
  { time: 25, image: "bwl-motion-frame-25.webp", title: "브랜드 씰로 마무리", description: "영상의 둥근 창이 브랜드 로고와 씰로 이어집니다" },
];

const brandHeroWorks = [
  { id: "dr", src: `${media}bwl-brand-ad.mp4`, poster: `${media}poster-bwl-brand-ad.webp`, title: "DR’s Secret 브랜드 광고", label: "DR’s Secret · AI 가상인물을 활용한 제안용 드래프트 시안 · 30초 · 16:9", caseId: "CASE-BWL-BRAND-AD", name: "DR’s Secret · 인물·제품" },
  { id: "maxtech", src: "/service-detail-v15/maxtech/hero-promo.mp4", poster: "/service-detail-v15/maxtech/poster.webp", title: "맥스테크 웹사이트 홍보영상", label: "맥스테크 · 홍보영상 제작 시안 · 실제 61.8초 · 16:9 · 고객 채택·납품·게시와 별도", caseId: "CASE-MAXTECH-BRANDFILM", name: "맥스테크 · 홍보영상" },
];

type FilmWork = {
  id: string;
  caseId: string;
  title: string;
  category: "product" | "company" | "character" | "comic";
  categoryLabel: string;
  description: string;
  format: string;
  status: string;
  portrait?: boolean;
};

const motionWorks: FilmWork[] = [
  {
    id: "healernet-motion",
    caseId: "CASE-HEALERNET-MOTION",
    title: "HEALERNET · 회사 홍보 모션",
    category: "company",
    categoryLabel: "회사·정보",
    description: "회사 자료와 제품, 타이포를 소개 순서에 맞춰 연결한 모션입니다",
    format: "30초 · 16:9",
    status: "제작 시안 · 최종 확인 대기",
  },
  {
    id: "yofree-kinetic",
    caseId: "CASE-YOFREE-CHARACTER",
    title: "YoFree · 하루 한 병",
    category: "character",
    categoryLabel: "타이포·캐릭터",
    description: "브랜드 캐릭터의 포즈와 제품, 큰 타이포가 설명을 나눠 맡습니다",
    format: "30초 · 9:16",
    status: "캐릭터·키네틱 모션그래픽 제작 시안",
    portrait: true,
  },
  {
    id: "yofree-premium",
    caseId: "CASE-YOFREE-CHARACTER",
    title: "YoFree · 부모님께 드리는 하루",
    category: "product",
    categoryLabel: "제품·브랜드",
    description: "같은 제품을 한지와 먹의 질감, 선물의 맥락으로 소개한 표현안입니다",
    format: "30초 · 9:16",
    status: "요프리 30초 프로젝트의 프리미엄 표현 시안",
    portrait: true,
  },
  {
    id: "yofree-motioncomic",
    caseId: "CASE-YOFREE-CHARACTER",
    title: "YoFree · 요프리가 왔어요",
    category: "comic",
    categoryLabel: "웹툰·모션코믹",
    description: "웹툰과 캐릭터를 제품 이야기로 연결한 모션코믹 표현안입니다",
    format: "30초 · 9:16",
    status: "요프리 30초 프로젝트의 모션코믹 시안",
    portrait: true,
  },
  {
    id: "aio-brand-intro",
    caseId: "CASE-AIO-BRAND-INTRO",
    title: "AIO · 브랜드 인트로",
    category: "company",
    categoryLabel: "로고·브랜드",
    description: "로고와 기하 요소, 타이포를 음악의 박자와 함께 구성했습니다",
    format: "30초 · 16:9",
    status: "AIO 자체 브랜드 제작물",
  },
  {
    id: "yofree-short-gift",
    caseId: "CASE-YOFREE-SHORT",
    title: "YoFree · 선물 메시지",
    category: "product",
    categoryLabel: "제품·선물",
    description: "제품을 선물하는 순간에 맞춘 프리미엄 모션입니다",
    format: "9:16",
    status: "두 콘셉트·네 변형 중 한 표현 시안",
    portrait: true,
  },
];

function FilmCard({ work }: { work: FilmWork }) {
  return (
    <article className="fd-work">
      <div className={`fd-work-media${work.portrait ? " fd-work-media--portrait" : ""}`}>
        <DetailVideo
          src={`${media}${work.id}.mp4`}
          poster={`${media}poster-${work.id}.webp`}
          label={`${work.title} · ${work.format} · ${work.status}`}
          portrait={work.portrait}
        />
      </div>
      <div className="fd-work-copy">
        <p className="fd-kicker">{work.categoryLabel}</p>
        <h3>{work.title}</h3>
        <p>{work.description}</p>
        <p className="fd-work-meta">{work.format}<span aria-hidden="true"> · </span>{work.status}</p>
        <CaseCta caseId={work.caseId} caseTitle={work.title} entryPoint="service-additional-case">
          이런 표현으로 제작 문의
        </CaseCta>
      </div>
    </article>
  );
}

function MotionLibrary() {
  const [filter, setFilter] = useState("all");
  const filters = [
    ["all", "전체"],
    ["product", "제품·브랜드"],
    ["company", "회사·로고"],
    ["character", "타이포·캐릭터"],
    ["comic", "웹툰·모션코믹"],
  ];
  const visibleWorks = motionWorks.filter((work) => filter === "all" || work.category === filter);

  return (
    <>
      <div className="fd-filters" role="group" aria-label="모션그래픽 표현 선택">
        {filters.map(([value, label]) => (
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
            {label}
          </button>
        ))}
      </div>
      <p className="fd-result-count" role="status">선택한 표현의 제작 사례 {visibleWorks.length}편</p>
      <div className="fd-work-grid">
        {visibleWorks.map((work) => <FilmCard key={work.id} work={work} />)}
      </div>
      <p className="fd-footnote">같은 프로젝트의 표현안은 각각의 제작 방식으로 소개합니다<br />별도 고객 수나 납품 실적으로 합산하지 않습니다</p>
    </>
  );
}

export function MotionGraphicsDetail() {
  const [heroScene, setHeroScene] = useState<number | null>(null);
  const [preview, setPreview] = useState<FilmPreviewSelection | null>(null);
  const heroStage = useRef<HTMLDivElement>(null);
  const activeScene = heroScene === null ? null : motionScenes[heroScene];
  return (
    <div className="sd-motion">
      <DetailHero
        eyebrow="MOTION GRAPHICS · 모션그래픽"
        title={"브랜드의 메시지에\n움직임을 더합니다"}
        description="로고와 제품 이미지에 타이포·그래픽·캐릭터를 더해 모션으로 만듭니다"
        variant="motion"
        primaryLabel="모션그래픽 작품 보기"
        caseHref="#case"
      >
        <div className="fd-motion-stage" ref={heroStage}>
          <div className="fd-stage-caption" aria-hidden="true"><span>TYPE</span><span>SHAPE</span><span>RHYTHM</span></div>
          <DetailVideo
            src={`${media}bwl-brand-motion.mp4`}
            poster={`${media}poster-bwl-brand-motion.webp`}
            label="DR’s Secret 브랜드 모션 · 30초 · 16:9 · 사용자 확정"
            startAt={activeScene?.time}
          />
          <div className="fd-hero-scenes" role="group" aria-label="모션 본편의 실제 장면 선택">{motionScenes.map((item, index) => <button key={item.time} type="button" aria-pressed={heroScene === index} onClick={() => { seekScene(heroStage.current, item.time); setHeroScene(index); }}><Image src={`${media}${item.image}`} alt="" width={1280} height={720} unoptimized /><span><small>{String(item.time).padStart(2, "0")}초</small><strong>{item.title}</strong></span></button>)}</div>
          <div className="fd-hero-reading" aria-live="polite"><p>{activeScene?.description ?? "장면을 고른 뒤 재생 버튼을 누르면 같은 본편의 해당 구간부터 볼 수 있습니다"}</p><button className="fd-preview-open" type="button" aria-haspopup="dialog" onClick={(event) => setPreview({ src: `${media}bwl-brand-motion.mp4`, poster: `${media}${activeScene?.image ?? "poster-bwl-brand-motion.webp"}`, title: "DR’s Secret 브랜드 모션", label: "30초 · 16:9 · 사용자 확정 · 고객 전달·게시와 별도", caseId: "CASE-BWL-BRAND-MOTION", startAt: activeScene?.time, trigger: event.currentTarget })}>큰 영상 보기 ↗</button></div>
        </div>
      </DetailHero>

      <ServiceOverview service="motion-graphics" items={[
        "로고·제품 이미지·브랜드 문구를 활용하는 모션그래픽",
        "단순형과 브랜드 전용 캐릭터를 포함한 맞춤형",
        "사용할 채널과 길이에 맞춰 화면 구성·리듬 협의",
      ]} />

      <DetailSection id="case" eyebrow="FEATURED CASE · DR’S SECRET" title={"여러 자료를,\n하나의 브랜드 흐름으로"} lead={"제품 사진과 제형 영상, 로고와 공식 문구에서 출발했습니다\n브랜드 씰의 모양을 화면의 공통 규칙으로 정하고 30초 모션으로 연결했습니다"}>
        <div className="fd-case-summary">
          <div><span>제작 범위</span><p>기획·화면 구성·타이포·도형 모션·기존 사진과 영상 편집</p></div>
          <div><span>실제 결과</span><p>30초 · 1920×1080 · 16:9 · 60fps</p></div>
          <div><span>작품 상태</span><p>사용자 확정<br />고객 전달·게시와 별도</p></div>
        </div>
        <div className="fd-process-intro">
          <div className="fd-process-number" aria-hidden="true">01—03</div>
          <div><h3>자료를 고르고,<br />화면의 규칙을 정합니다</h3><p>이 사례는 기존 제품 자료를 활용했습니다<br />무엇을 새로 구성하고 어떤 자료를 편집했는지 구분해 볼 수 있습니다</p></div>
        </div>
        <div className="fd-process-cards">
          <article><span className="fd-step">01 · 입력자료</span><h3>브랜드가 가진 자료</h3><ul><li>로고와 브랜드 씰</li><li>제품·제형의 실제 사진과 영상</li><li>공식 브랜드 문구</li></ul><p>사진과 영상의 제품, 원래 문구를 확인하고 사용할 소재를 골랐습니다</p></article>
          <article><span className="fd-step">02 · 기획 선택</span><h3>씰의 모양을 모티프로</h3><p className="fd-quote">선 → 영상 창 → 씰</p><p>브랜드 씰의 길고 둥근 형태를 화면의 창으로 확장했습니다<br />제품별 번호 대신 한 브랜드의 인상을 이어가는 구성을 선택했습니다</p></article>
          <article><span className="fd-step">03 · 화면과 움직임</span><h3>문구와 제품을 보여주는 순서</h3><p>창의 크기와 위치, 타이포 등장, 여러 제품 창의 리듬을 정했습니다<br />마지막에는 영상 창이 다시 브랜드 씰로 닫힙니다</p></article>
        </div>
      </DetailSection>

      <DetailSection eyebrow="STILL TO MOTION" title={"같은 모티프가\n한 편을 이어갑니다"} lead={"같은 최종 영상에서 추출한 화면입니다\n정지 화면의 배치가 본편에서는 어떻게 열리고, 이동하고, 마무리되는지 비교해 보세요"}>
        <div className="fd-frame-grid">
          <DetailImage src={`${media}bwl-motion-frame-02.webp`} alt="DR’s Secret 모션 2초, 브랜드 형태 안에 제형 영상이 열린 화면" caption="02초 · 브랜드 형태 안에 제형 영상 열기" />
          <DetailImage src={`${media}bwl-motion-frame-10.webp`} alt="같은 모션 10초, 크게 확장한 둥근 영상 창 속 손과 제형" caption="10초 · 손과 제형에 집중하는 큰 영상 창" />
          <DetailImage src={`${media}bwl-motion-frame-25.webp`} alt="같은 모션 25초의 브랜드 씰 마무리" caption="25초 · 같은 형태를 브랜드 씰로 마무리" />
        </div>
        <div className="fd-result-film">
          <DetailVideo src={`${media}bwl-brand-motion.mp4`} poster={`${media}poster-bwl-brand-motion.webp`} label="DR’s Secret 브랜드 모션그래픽 본편 · 사용자 확정 · 30초" />
          <div className="fd-result-copy"><h3>실제 30초 본편</h3><p>제품·타이포·도형과 실사 자료를 한 화면의 리듬으로 편집했습니다<br />이 작품의 자료 선택과 표현을 참고해 원하는 모션의 범위를 상담할 수 있습니다</p><CaseCta caseId="CASE-BWL-BRAND-MOTION" caseTitle="DR’s Secret 브랜드 모션그래픽" entryPoint="service-featured-case">이런 모션 제작 문의</CaseCta></div>
        </div>
      </DetailSection>

      <DetailSection id="motion-works" eyebrow="MORE WAYS TO MOVE" title={"우리 브랜드에 맞는\n표현을 골라보세요"} lead="회사 정보를 정리하는 화면부터 제품, 타이포와 캐릭터, 웹툰을 활용하는 모션까지 실제 작업을 살펴볼 수 있습니다">
        <MotionLibrary />
      </DetailSection>
      <FilmPreview selection={preview} onClose={() => setPreview(null)} />
    </div>
  );
}

const brandWorks: FilmWork[] = [
  {
    id: "yofree-jinsang", caseId: "CASE-YOFREE-JINSANG", title: "YoFree · 진상품 납시오", category: "product", categoryLabel: "이야기·인물·제품",
    description: "이야기와 인물, 대사·소리에서 마지막 캐릭터와 제품으로 연결하는 브랜드 영상입니다", format: "25.3초 · 16:9", status: "완성 · 확인 대기 · 드래프트 기반 확대본",
  },
  {
    id: "bwl-brand-motion", caseId: "CASE-BWL-BRAND-MOTION", title: "DR’s Secret · 브랜드 모션", category: "product", categoryLabel: "제품·그래픽·브랜드",
    description: "같은 브랜드를 제품 사진과 제형 영상, 도형과 타이포로 소개하는 방식입니다", format: "30초 · 16:9", status: "사용자 확정 · 고객 전달·게시와 별도",
  },
  {
    id: "healernet-motion", caseId: "CASE-HEALERNET-MOTION", title: "HEALERNET · 회사 홍보 모션", category: "company", categoryLabel: "회사·정보·제품",
    description: "회사가 전할 정보와 제품 자료를 순서대로 정리하는 그래픽 중심 소개입니다", format: "30초 · 16:9", status: "제작 시안 · 최종 확인 대기",
  },
  {
    id: "aio-brand-intro", caseId: "CASE-AIO-BRAND-INTRO", title: "AIO · 브랜드 인트로", category: "company", categoryLabel: "로고·타이포·음악",
    description: "AIO 자체 브랜드의 로고와 기하 요소를 음악에 연결한 인트로입니다", format: "30초 · 16:9", status: "AIO 자체 브랜드 제작물",
  },
];

export function BrandFilmDetail() {
  const [heroWork, setHeroWork] = useState(0);
  const [preview, setPreview] = useState<FilmPreviewSelection | null>(null);
  const active = brandHeroWorks[heroWork];
  return (
    <div className="sd-brand">
      <DetailHero eyebrow="BRAND FILM · 브랜드 영상" title={"브랜드의 이야기를\n한 편의 영상으로"} description="전할 메시지를 정리하고 인물·제품·장면을 하나의 흐름으로 엮습니다" variant="brand" caseHref="#case" primaryLabel="브랜드 영상 사례 보기" inquiryCase={{ caseId: active.caseId, caseTitle: active.title }}>
        <div className="fd-brand-stage">
          <div className="fd-brand-choices" role="group" aria-label="배너에서 볼 브랜드 영상 선택">{brandHeroWorks.map((item, index) => <button type="button" key={item.id} aria-pressed={heroWork === index} onClick={() => setHeroWork(index)}>{item.name}</button>)}</div>
          <DetailVideo key={active.id} src={active.src} poster={active.poster} label={active.label} />
          <div className="fd-brand-hero-actions"><button type="button" className="fd-preview-open" aria-haspopup="dialog" onClick={(event) => setPreview({ ...active, trigger: event.currentTarget })}>큰 영상 보기 ↗</button><CaseCta caseId={active.caseId} caseTitle={active.title} entryPoint="brand-hero-selected">이 영상으로 제작 상담</CaseCta></div>
        </div>
      </DetailHero>

      <ServiceOverview service="brand-film" items={[
        "소개할 브랜드와 시청자, 전할 핵심 메시지부터 정리",
        "보유 자료와 원하는 표현에 맞춰 기획·장면·편집 구성",
        "회사 소개·제품 브랜드·웹페이지 등 사용할 목적 협의",
      ]} />

      <DetailSection id="case" eyebrow="FEATURED CASE · DR’S SECRET" title={"한 사람의 하루에\n브랜드의 메시지를 담다"} lead={"87언니 AI 가상인물이 아침과 저녁, 주말의 장면에서 제품을 소개하는 브랜드 광고 시안입니다\n같은 인물과 제품 활용 장면을 한 편의 이야기로 묶었습니다"}>
        <div className="fd-case-summary">
          <div><span>기획 방향</span><p>한 사람의 여러 일상과<br />브랜드의 제품 소개 연결</p></div>
          <div><span>실제 제작 범위</span><p>기획·AI 인물/장면 제작·기존 제품영상 장면 재편집·자막</p></div>
          <div><span>작품 상태</span><p>30초 · 16:9<br />제안용 드래프트 시안</p></div>
        </div>
        <div className="fd-brand-message">
          <blockquote>내 피부에 맞춘 루틴,<br />닥터 시크릿</blockquote>
          <p>기획에서 정한 마지막 문구입니다<br />서로 다른 시간의 인물 장면과 제품을 이 메시지로 모았습니다</p>
        </div>
      </DetailSection>

      <DetailSection eyebrow="MESSAGE TO FILM" title={"원고의 문구가\n장면의 역할이 됩니다"} lead={"같은 브랜드 시안의 실제 기획 원고와 본편 화면을 연결했습니다\n아침의 도입, 세 제품의 사용 장면, 인물과 브랜드로 마무리하는 구조입니다"}>
        <div className="fd-brand-story">
          <article><DetailImage src={`${media}bwl-brand-frame-02.webp`} alt="브랜드 광고 2초, 아침 창가의 87언니와 도입 문구" caption="같은 본편의 02초 화면" /><div><span className="fd-step">01 · 도입</span><h3>일상에서 이야기를 시작</h3><blockquote>뭘 써야 하나,<br />고민하지 마세요</blockquote><p>아침 창가와 저녁 욕실의 인물을 도입에 배치했습니다<br />기획 원고의 질문과 다음 문구가 이어집니다</p></div></article>
          <article><DetailImage src={`${media}bwl-brand-frame-10.webp`} alt="같은 브랜드 광고 10초, 클렌저와 C Plus, 아쿠아의 세로 패널" caption="같은 본편의 10초 화면" /><div><span className="fd-step">02 · 핵심</span><h3>제품과 사용 장면을 연결</h3><blockquote>내 피부에 맞춘<br />제품과 사용법</blockquote><p>클렌저 1·C Plus 세럼 7S·아쿠아 부스트 세럼 10의 기존 제품영상 장면을 세로 패널로 재편집했습니다</p></div></article>
          <article><DetailImage src={`${media}bwl-brand-frame-25.webp`} alt="같은 브랜드 광고 25초, 같은 인물이 세 제품을 보여주는 마무리 패널" caption="같은 본편의 25초 화면" /><div><span className="fd-step">03 · 마무리</span><h3>같은 인물과 브랜드로 모으기</h3><blockquote>내 피부에 맞춘 루틴,<br />닥터 시크릿</blockquote><p>인물이 제품을 든 장면과 로고를 마지막 화면에 연결했습니다<br />여러 제품이 하나의 브랜드 소개로 마무리됩니다</p></div></article>
        </div>
        <div className="fd-result-film">
          <DetailVideo src={`${media}bwl-brand-ad.mp4`} poster={`${media}poster-bwl-brand-ad.webp`} label="DR’s Secret 브랜드 광고 30초 본편 · 제안용 드래프트 시안" />
          <div className="fd-result-copy"><h3>한 편으로 보는 브랜드 소개</h3><p>가상인물과 제품 장면을 활용한 제안용 드래프트입니다<br />실제 시설·임직원 촬영을 담은 회사 소개 영상과는 제작 범위가 다릅니다</p><CaseCta caseId="CASE-BWL-BRAND-AD" caseTitle="DR’s Secret 브랜드 광고" entryPoint="service-featured-case">이런 브랜드 영상 제작 문의</CaseCta></div>
        </div>
      </DetailSection>

      <DetailSection eyebrow="DIFFERENT BRAND STORIES" title={"브랜드마다,\n전하는 방식도 다르게"} lead="인물과 제품, 이야기, 회사 정보, 로고와 타이포 소개할 내용에 맞춰 사용할 표현을 비교해 보세요">
        <div className="fd-work-grid">{brandWorks.map((work) => <FilmCard key={work.id} work={work} />)}</div>
      </DetailSection>

      <DetailSection eyebrow="브랜드 영상 기획" title={"무엇을 소개할지 정하면\n구성이 선명해집니다"}>
        <div className="fd-decision-grid"><article><span>01</span><h3>누구에게 보여줄까요</h3><p>처음 만나는 고객인지, 제품을 검토하는 담당자인지 시청자를 정합니다</p></article><article><span>02</span><h3>무엇을 기억할까요</h3><p>회사와 브랜드의 여러 정보 중 한 편에서 전할 핵심 메시지를 고릅니다</p></article><article><span>03</span><h3>어디에서 사용할까요</h3><p>홈페이지·소개 화면·행사 등 사용처와 보유 자료에 맞춰 길이와 규격을 협의합니다</p></article></div>
      </DetailSection>
      <FilmPreview selection={preview} onClose={() => setPreview(null)} />
    </div>
  );
}

const adScenes = [
  { time: 1, image: "sns-cplus-opening.webp", name: "첫 장면", title: "출근 전이라는 상황", description: "아침 화장대의 인물과 제목으로 장면의 맥락을 먼저 보여줍니다", script: "출근 전 10분, 오늘의 기록" },
  { time: 9, image: "sns-cplus-middle.webp", name: "제품 사용 장면", title: "손과 제품에 가까이", description: "같은 제품의 스포이트와 손을 크게 보여주며 사용 장면으로 넘어갑니다", script: "스포이트·손바닥 근접 장면" },
  { time: 18, image: "sns-cplus-ending.webp", name: "마무리", title: "제품을 다시 기억하게", description: "같은 인물이 제품을 들고 마지막 문구와 제품명을 함께 보여줍니다", script: "제품명과 마무리 문구" },
];

const adWorks: FilmWork[] = [
  { id: "bwl-cleanser-ad", caseId: "CASE-BWL-CLEANSER-AD", title: "DR’s Secret · 클렌저 1", category: "product", categoryLabel: "AI 인물·사용 장면", description: "같은 AI 인물을 다른 제품의 사용 장면에 연결한 별도 제품영상입니다", format: "20초 · 9:16", status: "제안용 시안", portrait: true },
  { id: "yofree-kinetic", caseId: "CASE-YOFREE-CHARACTER", title: "YoFree · 하루 한 병", category: "character", categoryLabel: "제품·타이포·캐릭터", description: "타이포와 캐릭터, 제품을 차례로 배치해 전할 문구를 설명합니다", format: "30초 · 9:16", status: "키네틱 모션그래픽 제작 시안", portrait: true },
  { id: "yofree-premium", caseId: "CASE-YOFREE-CHARACTER", title: "YoFree · 부모님께 드리는 하루", category: "product", categoryLabel: "제품·선물·프리미엄", description: "선물하는 상황과 한지·먹의 분위기로 제품을 소개하는 표현안입니다", format: "30초 · 9:16", status: "요프리 30초 프로젝트의 표현 시안", portrait: true },
  { id: "yofree-motioncomic", caseId: "CASE-YOFREE-CHARACTER", title: "YoFree · 요프리가 왔어요", category: "comic", categoryLabel: "웹툰·캐릭터·이야기", description: "웹툰과 캐릭터의 이야기를 제품 소개에 활용하는 모션코믹입니다", format: "30초 · 9:16", status: "요프리 30초 프로젝트의 표현 시안", portrait: true },
];

export function AdDetail() {
  const [scene, setScene] = useState(0);
  const [heroScene, setHeroScene] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [preview, setPreview] = useState<FilmPreviewSelection | null>(null);
  const heroStage = useRef<HTMLDivElement>(null);
  const selectedStage = useRef<HTMLDivElement>(null);
  const activeHeroScene = heroScene === null ? null : adScenes[heroScene];

  return (
    <div className="sd-ad">
      <DetailHero eyebrow="SOCIAL AD · SNS 광고" title={"제품의 매력을\n짧고 선명하게"} description="제품 하나의 메시지를 세로 화면에 맞는 장면과 자막으로 구성합니다" variant="ad" caseHref="#case" primaryLabel="SNS 광고 사례 보기">
        <div className="fd-social-stage" ref={heroStage}>
          <div className="fd-social-side fd-social-side--left" aria-hidden="true"><Image src={`${media}sns-cplus-opening.webp`} width={1080} height={1920} alt="" unoptimized /><span>OPENING</span></div>
          <div className="fd-social-main"><DetailVideo src={`${media}bwl-cplus-ad.mp4`} poster={`${media}${activeHeroScene?.image ?? "poster-bwl-cplus-ad.webp"}`} label="C Plus 세럼 · 87언니 AI 가상인물 활용 제안용 시안 · 20초 · 9:16 · 무음" portrait startAt={activeHeroScene?.time} /></div>
          <div className="fd-social-side fd-social-side--right" aria-hidden="true"><Image src={`${media}sns-cplus-ending.webp`} width={1080} height={1920} alt="" unoptimized /><span>ENDING</span></div>
          <span className="fd-social-stamp">ONE PRODUCT<br />ONE STORY</span>
        </div>
        <div className="fd-social-hero-controls"><div className="fd-social-moments" role="group" aria-label="배너의 같은 C Plus 광고 구간 선택">{adScenes.map((item, index) => <button key={item.time} type="button" aria-pressed={heroScene === index} onClick={() => { seekScene(heroStage.current, item.time); setHeroScene(index); }}>{item.time}초 · {item.name}</button>)}</div><div className="fd-social-hero-actions"><button type="button" className="fd-preview-open" aria-expanded={showGuide} aria-controls="fd-ad-composition-guide" onClick={() => setShowGuide((value) => !value)}>화면 구성 가이드 {showGuide ? "닫기 −" : "보기 ＋"}</button><button type="button" className="fd-preview-open" aria-haspopup="dialog" onClick={(event) => setPreview({ src: `${media}bwl-cplus-ad.mp4`, poster: `${media}${activeHeroScene?.image ?? "poster-bwl-cplus-ad.webp"}`, title: "C Plus · 87언니 제품영상", label: "AI 가상인물 활용 제안용 시안 · 20초 · 9:16 · 무음", caseId: "CASE-BWL-CPLUS-AD", portrait: true, startAt: activeHeroScene?.time, trigger: event.currentTarget })}>큰 영상 보기 ↗</button></div></div>
        {showGuide ? <div className="fd-composition-guide" id="fd-ad-composition-guide"><h3>화면 구성을 확인하는 가이드</h3><p>같은 광고의 실제 세 장면에서 제목·인물·제품·자막을 어디에 배치했는지 살펴봅니다<br />영상 위를 가리지 않는 확인용 안내이며, 게시할 채널의 표시 영역은 별도로 확인합니다</p><ol><li><b>1초 · 상황 소개</b><span>상단 제목과 날짜 → 중앙 인물 → 하단 문구와 제품</span></li><li><b>9초 · 손과 제품</b><span>스포이트와 손의 근접 화면 → 손동작 위쪽의 설명 자막</span></li><li><b>18초 · 제품명과 마무리</b><span>상단 제품명 → 인물과 병 → 하단 마무리 문구</span></li></ol></div> : null}
      </DetailHero>

      <ServiceOverview service="ad" items={[
        "제품 1개·콘셉트 1개를 위한 세로형 광고 제작",
        "9:16·1080p·기본 자막/BGM 제공 기준",
        "기획부터 첫 장면·제품 설명·마지막 안내까지 구성",
      ]} />

      <DetailSection id="case" eyebrow="FEATURED CASE · C PLUS" title={"같은 제품의 첫 장면부터\n마지막 안내까지"} lead={"출근 전 화장대에서 C Plus 세럼을 소개하는 87언니 AI 가상인물의 제품영상 시안입니다\n상황·의상·제품을 유지하고 장면의 거리와 역할을 바꿨습니다"}>
        <div className="fd-case-summary">
          <div><span>기획의 기준</span><p>제품 하나 · 같은 인물<br />같은 화장대와 아침의 빛</p></div>
          <div><span>실제 구성</span><p>도입·제품 소개·손과 사용 장면·인물과 제품 마무리</p></div>
          <div><span>사례의 실제 분량</span><p>20초 · 9:16 · 제안용 시안<br />드래프트 기반 1080×1920 출력</p></div>
        </div>
        <div className="fd-ad-principles"><article><span>첫 장면</span><h3>상황을 보여주기</h3><p>출근 전 화장대라는 익숙한 장면에서 이야기를 시작합니다</p></article><article><span>핵심 설명</span><h3>제품이 잘 보이게</h3><p>인물의 얼굴에서 제품, 스포이트와 손의 근접 장면으로 보는 거리를 바꿉니다</p></article><article><span>마지막 안내</span><h3>이름을 남기기</h3><p>제품을 든 같은 인물과 제품명으로 마무리합니다</p></article></div>
        <p className="fd-footnote">영상은 AI 가상인물을 활용한 제안용 시안입니다<br />실제 체험 후기나 고객의 게시·성과 사례로 표시하지 않습니다<br />실제 20초 분량은 아래 30·60초 판매 구성과 별개입니다</p>
      </DetailSection>

      <DetailSection eyebrow="ONE AD, THREE MOMENTS" title={"같은 광고 안에서\n장면을 살펴보세요"} lead={"아래 이미지는 모두 같은 C Plus 광고의 실제 1초·9초·18초 화면입니다\n선택한 장면부터 본편을 확인할 수 있습니다"}>
        <div className="fd-ad-sequence">
          <div className="fd-scene-options" role="group" aria-label="같은 C Plus 광고의 구간 선택">
            {adScenes.map((item, index) => <button type="button" key={item.time} aria-pressed={scene === index} onClick={() => { seekScene(selectedStage.current, item.time); setScene(index); }}><Image src={`${media}${item.image}`} width={1080} height={1920} alt={`같은 C Plus 광고 ${item.time}초, ${item.name}`} loading="lazy" unoptimized /><span><small>{String(index + 1).padStart(2, "0")} · {item.time}초 · {item.name}</small><strong>{item.title}</strong><span>{item.description}</span><i>이 장면부터 보기 ↗</i></span></button>)}
          </div>
          <div className="fd-selected-ad" ref={selectedStage}><DetailVideo key={adScenes[scene].time} src={`${media}bwl-cplus-ad.mp4`} poster={`${media}${adScenes[scene].image}`} label={`C Plus 광고 · ${adScenes[scene].time}초 ${adScenes[scene].name}부터 · 실제 20초 제안용 시안`} startAt={adScenes[scene].time} portrait /><p aria-live="polite">선택한 구간 · {adScenes[scene].time}초 / {adScenes[scene].name}</p></div>
        </div>
        <div className="fd-inline-contact"><p>우리 제품은 어떤 장면으로 시작할까요?<br />관심 사례와 원하는 채널을 함께 전달할 수 있습니다</p><CaseCta caseId="CASE-BWL-CPLUS-AD" caseTitle="DR’s Secret C Plus 세럼 광고" entryPoint="service-featured-case">이런 SNS 광고 제작 문의</CaseCta></div>
      </DetailSection>

      <DetailSection eyebrow="MORE AD FORMATS" title={"제품에 맞춰\n다른 표현도 선택할 수 있습니다"} lead="AI 인물, 제품과 타이포, 캐릭터와 이야기 각각의 실제 광고·모션 시안을 비교해 원하는 방식을 골라보세요">
        <div className="fd-work-grid fd-work-grid--portrait">{adWorks.map((work) => <FilmCard key={work.id} work={work} />)}</div>
        <p className="fd-footnote">다른 제품과 프로젝트는 별도 사례로 소개했습니다<br />요프리의 여러 표현안은 같은 프로젝트의 변형입니다</p>
      </DetailSection>

      <DetailSection eyebrow="MADE FOR YOUR CHANNEL" title={"제작할 광고와\n사용할 채널을 함께 정합니다"}>
        <div className="fd-delivery-band"><div><span className="fd-kicker">기본 제작 기준</span><h3>제품 1개 · 콘셉트 1개<br />9:16 · 1080p</h3><p>기본 자막과 BGM을 포함한 판매 구성입니다<br />이 페이지의 무음 드래프트 사례와 실제 제공 기준을 구분해 안내합니다</p></div><div><h3>사용할 채널과 다음 행동</h3><p>제품을 알리고 싶은 대상, 사용할 채널, 마지막에 안내할 행동을 정합니다<br />다른 화면비·대량·정기 제작은 필요한 범위로 상담합니다</p><p className="fd-footnote">광고 집행·계정 운영·매체비는 영상 제작과 별도입니다<br />조회·클릭·매출 성과를 보장하는 구성은 아닙니다</p></div></div>
      </DetailSection>
      <FilmPreview selection={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
