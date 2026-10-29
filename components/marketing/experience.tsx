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
                이미지를 불러오지 못했습니다
                <br />
                아래 설명으로 흐름을 확인하세요
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
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState(false);
  const items: Record<string, string[][]> = {
    integrated: [
      ["고객 질문", "보유 자료", "운영 중인 채널"],
      ["원본 컨텐츠", "사실과 표현 검수", "채널별 재구성"],
      ["짧은 컨텐츠", "이미지와 설명", "게시 일정"],
      ["게시 내역", "확인 가능한 반응", "다음 운영 계획"],
    ],
    sns: [
      ["서비스 선택 질문", "이용 방법 질문", "비교할 정보"],
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
  const currentItems = items[service][selected];
  const labels: Record<string, string> = {
    integrated: "통합 운영 지도",
    sns: "게시 일정과 피드",
    "ai-influencer": "가상 인물 제작 보드",
    seo: "검색과 AI 답변 설계",
  };
  return (
    <div className={`mk-experience mk-experience--${service}`}>
      <div className="mk-flow-label">
        <span className="mk-decor-dot" />
        제작 방향 예시<span>실제 운영 데이터가 아닙니다</span>
      </div>
      <div
        className={`mk-service-scene mk-board--${service}`}
        data-stage={selected}
      >
        <div className="mk-board-heading">
          <span className="mk-kicker">{labels[service]}</span>
          <strong>{steps[selected][0]}</strong>
        </div>
        {service === "integrated" && (
          <div className="mk-channel-map">
            <div className="mk-map-source">
              <span>브랜드의 고객 질문</span>
              <strong>
                {selected === 0
                  ? "어떤 상황에서 이용하나요?"
                  : "이용 장면을 설명하는 원본"}
              </strong>
              <small>
                {selected === 0
                  ? "질문과 자료를 한곳에"
                  : "월 원본 20개 기준 · 계약 조건"}
              </small>
            </div>
            <div className="mk-map-connector" aria-hidden="true">
              ↓
            </div>
            <div className="mk-channel-nodes">
              {["쇼츠", "인스타그램", "블로그", "지도·검색", "문의 접점"]
                .slice(0, selected < 2 ? 1 : 5)
                .map((channel, i) => (
                  <div key={channel}>
                    <span>0{i + 1}</span>
                    <strong>{selected < 2 ? "원본 준비" : channel}</strong>
                    <small>
                      {selected === 3
                        ? "게시 내역 → 다음 기획"
                        : selected === 2
                          ? "길이·문구·형식 재구성"
                          : currentItems[selected]}
                    </small>
                  </div>
                ))}
            </div>
            <p className="mk-board-note">
              {selected === 3
                ? "5개 채널 합산 100건 기준 · 채널별 배분은 월간 합의"
                : selected === 2
                  ? "원본과 채널별 게시 건수는 다릅니다"
                  : "자료 확인 → 원본 제작 → 채널 연결 → 운영 확인"}
            </p>
          </div>
        )}
        {service === "sns" && (
          <div className="mk-social-board">
            <div className="mk-calendar">
              <span>게시 계획 예시 · 날짜 미지정</span>
              <div>
                {["월", "화", "수", "목", "금"].map((day, i) => (
                  <div
                    key={day}
                    className={i === selected ? "is-selected" : ""}
                  >
                    <b>{day}</b>
                    <small>
                      {["질문", "이미지", "컨텐츠", "게시", "검토"][i]}
                    </small>
                  </div>
                ))}
              </div>
            </div>
            {selected === 0 ? (
              <div className="mk-question-stack">
                {currentItems.map((item) => (
                  <p key={item}>↳ {item}</p>
                ))}
              </div>
            ) : (
              <div className={`mk-feed-preview mk-feed-preview--${selected}`}>
                <div className="mk-feed-media">
                  {failed ? (
                    <div className="mk-image-fallback">
                      <strong>컨텐츠 구성 예시</strong>
                      <p>
                        이미지를 불러오지 못했습니다
                        <br />
                        설명과 게시 계획을 확인하세요
                      </p>
                      <button type="button" onClick={() => setFailed(false)}>
                        이미지 다시 보기
                      </button>
                    </div>
                  ) : (
                    <Image
                      src={coffee}
                      alt="기존 커피 소재를 활용한 SNS 제작 예시"
                      fill
                      sizes="(max-width: 767px) 85vw, 320px"
                      onError={() => setFailed(true)}
                    />
                  )}
                  <span>
                    {selected === 1
                      ? "이미지 문구 배치"
                      : selected === 2
                        ? "짧은 컨텐츠 장면 구성"
                        : "채널별 게시 미리보기"}
                  </span>
                </div>
                <div>
                  <span className="mk-kicker">
                    {selected === 3 ? "채널 배치" : "제작 구성"}
                  </span>
                  {currentItems.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            )}
            <p className="mk-board-note">
              이미지 원본 월 12개 · 컨텐츠 원본 월 4개 기준
            </p>
          </div>
        )}
        {service === "ai-influencer" && (
          <div className={`mk-creator-board mk-creator-stage-${selected}`}>
            {selected === 1 ? (
              <div className="mk-storyboard">
                <span className="mk-kicker">컨텐츠 장면 기획 예시</span>
                {[
                  "도입 · 고객의 질문",
                  "설명 · 확인된 브랜드 정보",
                  "마무리 · 다음 행동 안내",
                ].map((scene, i) => (
                  <div key={scene}>
                    <span>SCENE 0{i + 1}</span>
                    <strong>{scene}</strong>
                    <p>
                      {
                        [
                          "어떤 점이 궁금하신가요?",
                          "핵심 정보와 이용 장면을 설명합니다",
                          "제공 범위와 문의 방법을 확인하세요",
                        ][i]
                      }
                    </p>
                  </div>
                ))}
              </div>
            ) : selected === 3 ? (
              <div className="mk-publish-preview">
                <span className="mk-kicker">채널별 변형 예시</span>
                {["쇼츠 · 세로형 구성", "인스타그램 · 피드 구성"].map(
                  (channel) => (
                    <div key={channel}>
                      <strong>{channel}</strong>
                      <p>인물과 말투 유지</p>
                      <small>자막·표지·게시 문구 확인</small>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="mk-creator-portrait">
                {failed ? (
                  <div className="mk-image-fallback">
                    <strong>가상 인물 예시</strong>
                    <p>이미지를 불러오지 못했습니다</p>
                    <button type="button" onClick={() => setFailed(false)}>
                      이미지 다시 보기
                    </button>
                  </div>
                ) : (
                  <Image
                    src={creator}
                    alt="브랜드 전용 가상 인물 제작 방향 예시"
                    fill
                    sizes="(max-width: 767px) 85vw, 320px"
                    onError={() => setFailed(true)}
                  />
                )}
                <span>
                  {
                    [
                      "인물 기준",
                      "장면 기획",
                      "검수용 프레임",
                      "채널 미리보기",
                    ][selected]
                  }
                </span>
                {selected === 2 && (
                  <div className="mk-frame-review">
                    <strong>정보·표현 검수용</strong>
                    <span>00:00 / 00:30 · 구성 예시</span>
                  </div>
                )}
              </div>
            )}
            <div className="mk-creator-script">
              <span className="mk-kicker">
                {
                  [
                    "외형과 말투 설정",
                    "장면과 대사 구성",
                    "생성 후 검수",
                    "게시와 다음 주제",
                  ][selected]
                }
              </span>
              {currentItems.map((item, i) => (
                <div key={item}>
                  <span>0{i + 1}</span>
                  <strong>{item}</strong>
                  <small>
                    {
                      [
                        "기준 합의",
                        "기획안 확인",
                        "사실·권리 확인",
                        "운영 내역 확인",
                      ][selected]
                    }
                  </small>
                </div>
              ))}
            </div>
            <p className="mk-board-note">
              가상 인물 예시 · 구축비 없음 · 월 원본 8개 · 30초 기준
            </p>
          </div>
        )}
        {service === "seo" && (
          <div className="mk-search-board">
            <div className="mk-search-query">
              <span>검색 질문 예시</span>
              <strong>이 서비스는 누구에게 필요한가요?</strong>
            </div>
            {selected === 0 ? (
              <div className="mk-search-questions">
                {currentItems.map((item) => (
                  <p key={item}>
                    {item} <span>→</span>
                  </p>
                ))}
              </div>
            ) : selected === 1 ? (
              <div className="mk-answer-outline">
                <span className="mk-kicker">답변 페이지 뼈대</span>
                {currentItems.map((item, i) => (
                  <p key={item}>
                    <span>H{i + 1}</span>
                    {item}
                  </p>
                ))}
              </div>
            ) : selected === 2 ? (
              <div className="mk-source-preview">
                <span className="mk-kicker">소스와 CMS 적용안</span>
                {currentItems.map((item) => (
                  <p key={item}>
                    <code>
                      &lt;
                      {item === "페이지 본문"
                        ? "article"
                        : item === "메타와 사이트맵"
                          ? "meta"
                          : "schema"}
                      &gt;
                    </code>
                    {item}
                  </p>
                ))}
              </div>
            ) : (
              <div className="mk-search-result">
                <span className="mk-kicker">검색 결과 · AI 답변 인용 예시</span>
                <strong>서비스 대상과 제공 범위 안내</strong>
                <p>대상·범위·문의 방법을 확인할 수 있는 페이지</p>
                <div className="mk-ai-citation">
                  AI 답변의 참고 자료 → 서비스 안내 페이지
                </div>
                <small>검색 노출·인용은 보장하지 않습니다</small>
              </div>
            )}
            <p className="mk-board-note">
              {selected === 3
                ? currentItems.join(" · ")
                : "질문 수집 → 답변 설계 → 실제 적용 → 검수"}
            </p>
          </div>
        )}
      </div>
      <div className="mk-step-buttons" aria-label="예시 단계 선택">
        {steps.map(([title], i) => (
          <button
            type="button"
            key={title}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            <span>0{i + 1}</span>
            {title}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <p className="mk-current-copy" role="status" aria-live="polite">
        {steps[selected][1]}
      </p>
      <noscript>
        <div className="mk-noscript">
          {steps.map(([title, copy]) => (
            <p key={title}>
              <strong>{title}</strong> · {copy}
            </p>
          ))}
        </div>
      </noscript>
    </div>
  );
}
