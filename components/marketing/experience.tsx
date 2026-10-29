"use client";

import Image from "next/image";
import { useState } from "react";

type Step = {
  title: string;
  copy: string;
  image: string;
  label: string;
  items: string[];
};
const coffee = "/creative-v06/marketing-sns.webp";
const creator = "/content-examples/ai-influencer/ai-creator.webp";
const homeSteps: Step[] = [
  {
    title: "노출",
    copy: "고객이 궁금해하는 이야기로 브랜드를 발견하게 합니다",
    image: creator,
    label: "컨텐츠와 채널",
    items: ["고객 질문 정리", "브랜드 컨텐츠 제작", "채널에 맞는 게시"],
  },
  {
    title: "유입",
    copy: "검색과 채널에서 필요한 정보를 찾아 방문으로 이어지게 합니다",
    image: coffee,
    label: "검색과 랜딩",
    items: ["질문에 답하는 페이지", "검색 접근성 점검", "다음 행동 안내"],
  },
  {
    title: "문의",
    copy: "서비스를 이해하고 상담할 수 있도록 문의 접점을 정리합니다",
    image: coffee,
    label: "상담으로 연결",
    items: ["제공 범위 확인", "자료와 질문 준비", "문의 경로 점검"],
  },
];

export function CampaignExperience({
  steps = homeSteps,
  kind = "home",
}: {
  steps?: Step[];
  kind?: string;
}) {
  const [selected, setSelected] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const current = steps[selected];
  return (
    <div className={`mk-experience mk-experience--${kind}`}>
      <div className="mk-flow-label">
        <span className="mk-decor-dot" />
        {kind === "home" ? "운영 흐름 예시" : "제작 방향 예시"}
        <span>실제 운영 데이터가 아닙니다</span>
      </div>
      <div className="mk-scene">
        <div className="mk-ribbon" aria-hidden="true" />
        <div className="mk-photo-panel">
          {failedImages.includes(current.image) ? (
            <div className="mk-image-fallback">
              <strong>{current.label}</strong>
              <p>
                이미지를 불러오지 못했습니다 아래 설명으로 흐름을 확인하세요
              </p>
              <button
                type="button"
                onClick={() =>
                  setFailedImages(
                    failedImages.filter((image) => image !== current.image),
                  )
                }
              >
                이미지 다시 보기
              </button>
            </div>
          ) : (
            <Image
              key={current.image}
              src={current.image}
              alt={
                kind === "ai-influencer"
                  ? "가상 인물 컨텐츠 제작 방향"
                  : "브랜드 컨텐츠 제작 방향 이미지"
              }
              fill
              sizes="(max-width: 767px) 80vw, 420px"
              priority={kind === "home"}
              onError={() =>
                setFailedImages((images) => [...images, current.image])
              }
            />
          )}
          <span className="mk-photo-caption">{current.label}</span>
        </div>
        <div className="mk-result-card">
          <div className="mk-window-bar" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span className="mk-kicker">
            {kind === "seo"
              ? "질문에서 페이지로"
              : kind === "sns"
                ? "채널 게시 계획"
                : kind === "ai-influencer"
                  ? "브랜드 인물 기준"
                  : "고객 접점 설계"}
          </span>
          <strong>{current.title}</strong>
          <ul>
            {current.items.map((item, i) => (
              <li key={item}>
                <span>0{i + 1}</span>
                {item}
              </li>
            ))}
          </ul>
          <span className="mk-result-stamp">계획 → 제작 → 확인</span>
        </div>
      </div>
      <div className="mk-step-buttons" aria-label="예시 단계 선택">
        {steps.map((step, i) => (
          <button
            type="button"
            key={step.title}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            <span>0{i + 1}</span>
            {step.title}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <p className="mk-current-copy" role="status" aria-live="polite">
        {current.copy}
      </p>
      <noscript>
        <div className="mk-noscript">
          {steps.map((step) => (
            <p key={step.title}>
              <strong>{step.title}</strong> · {step.copy} ·{" "}
              {step.items.join(" / ")}
            </p>
          ))}
        </div>
      </noscript>
    </div>
  );
}

export function ServiceExperience({
  service,
  steps,
}: {
  service: string;
  steps: [string, string][];
}) {
  const images =
    service === "ai-influencer"
      ? [creator, creator, creator, creator]
      : service === "seo"
        ? [
            coffee,
            "/creative-v08/marketing-seo.webp",
            coffee,
            "/creative-v08/marketing-seo.webp",
          ]
        : [coffee, coffee, creator, coffee];
  const items: Record<string, string[][]> = {
    integrated: [
      ["고객 질문", "보유 자료", "운영 중인 채널"],
      ["원본 컨텐츠", "사실과 표현 검수", "채널별 재구성"],
      ["짧은 컨텐츠", "이미지와 설명", "게시 일정"],
      ["게시 내역", "확인 가능한 반응", "다음 운영 계획"],
    ],
    sns: [
      ["제품 선택 질문", "사용법 질문", "비교할 정보"],
      ["핵심 장면", "이미지 문구", "브랜드 톤 확인"],
      ["사용 장면", "짧은 설명", "채널 형식 확인"],
      ["쇼츠", "인스타그램", "네이버 블로그"],
    ],
    "ai-influencer": [
      ["외형과 말투", "브랜드의 역할", "이용 권리 확인"],
      ["확인된 제품 정보", "설명할 주제", "장면과 대사"],
      ["인물 일관성", "제품 정보 검수", "30초 기준 구성"],
      ["쇼츠와 인스타그램", "채널별 변형", "다음 주제 확인"],
    ],
    seo: [
      ["누가 이용하나요?", "무엇을 제공하나요?", "어떻게 문의하나요?"],
      ["대상과 제공 범위", "가격 기준과 FAQ", "관련 페이지 연결"],
      ["페이지 본문", "메타와 사이트맵", "구조화 데이터"],
      ["검색 접근성", "링크와 화면", "분석 수집 여부"],
    ],
  };
  return (
    <CampaignExperience
      kind={service}
      steps={steps.map(([title, copy], i) => ({
        title,
        copy,
        image: images[i],
        label:
          service === "ai-influencer"
            ? "가상 인물 제작 예시"
            : "컨텐츠 구성 예시",
        items: items[service][i],
      }))}
    />
  );
}
