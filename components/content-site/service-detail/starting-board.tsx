"use client";

import Image from "next/image";
import { homeCardMedia } from "@/lib/content-home";
import { useState } from "react";
import {
  ANIMATION_STARTING_SCENES,
  DETAIL_COPY,
  DETAIL_SCOPE,
} from "@/lib/content-site/service-detail-content";
import type { ContentServiceId } from "@/lib/content-site/types";
import { DetailSection } from "./shared";

const starts: Record<ContentServiceId, [string, string, string][]> = {
  webtoon: [
    [
      "아이디어가 있어요",
      "이야기와 읽을 사람부터",
      "전하고 싶은 내용과 활용처를 정리하고 원고·캐릭터가 필요한 범위를 함께 정합니다",
    ],
    [
      "원고·캐릭터가 있어요",
      "보유 자료와 장면 구성부터",
      "원고와 캐릭터의 사용 조건을 확인하고 페이지별 장면·대사·분량을 정합니다",
    ],
    [
      "완성 웹툰이 있어요",
      "영상으로 옮길 장면부터",
      "기존 웹툰 영상화에 사용할 원본과 장면을 확인합니다\n신규 웹툰과 함께 만드는 구성도 비교할 수 있습니다",
    ],
  ],
  animation: [
    [
      "캐릭터부터 필요해요",
      "브랜드와 캐릭터의 역할부터",
      "브랜드의 특징과 보여줄 행동을 확인하고 새 캐릭터 구축 범위를 정합니다",
    ],
    [
      "캐릭터가 있어요",
      "표정·포즈와 행동부터",
      "보유 캐릭터의 원본·사용 조건을 확인하고 장면에 필요한 표정과 동작을 정합니다",
    ],
    [
      "장면이 정해져 있어요",
      "장면과 길이부터",
      "장면 순서와 행동의 복잡도, 필요한 대사·음성을 확인해 제작 범위를 정합니다",
    ],
  ],
  "ai-influencer": [
    [
      "새 인물이 필요해요",
      "브랜드와 기준 인상부터",
      "활용할 제품과 원하는 인상·스타일을 확인하고 기준 얼굴과 전신을 정합니다",
    ],
    [
      "기준 이미지가 있어요",
      "기준 이미지와 사용 조건부터",
      "제공한 이미지의 사용 조건과 인물의 특징을 확인하고 장면별 검수 기준을 정합니다",
    ],
    [
      "제품영상이 필요해요",
      "제품 정보와 장면부터",
      "확인된 제품 정보와 필요한 장면·분량을 정합니다\nAI 가상인물이 출연하는 연출 영상으로 제작합니다",
    ],
  ],
  "motion-graphics": [
    [
      "로고·사진이 있어요",
      "자료와 핵심 문구부터",
      "로고 원본·제품 이미지·문구를 확인하고 단순형으로 표현할 장면을 정합니다",
    ],
    [
      "캐릭터가 필요해요",
      "브랜드 전용 캐릭터부터",
      "맞춤형의 전용 캐릭터 포함 범위를 확인하고 캐릭터와 문구가 연결되는 장면을 정합니다",
    ],
    [
      "활용처가 정해져 있어요",
      "길이와 화면비부터",
      "홈페이지·행사·SNS 중 사용할 곳을 확인하고 필요한 길이와 추가 화면비 범위를 정합니다",
    ],
  ],
  "brand-film": [
    [
      "소개서가 있어요",
      "시청자와 소개할 메시지부터",
      "소개서에서 먼저 전할 내용을 고르고 회사·브랜드·제품의 장면 순서를 정합니다",
    ],
    [
      "사진·영상이 있어요",
      "보유 장면과 추가 자료부터",
      "사용할 수 있는 사진·영상과 부족한 장면을 확인합니다\n현장 촬영은 별도로 협의합니다",
    ],
    [
      "활용처가 정해져 있어요",
      "소개할 자리와 길이부터",
      "홈페이지·행사·거래처 소개 등 시청 환경과 희망 길이, 음성·음악 범위를 확인합니다",
    ],
  ],
  ad: [
    [
      "제품 사진이 있어요",
      "제품 하나와 핵심 메시지부터",
      "제품 이미지와 확인된 제품 정보를 바탕으로 세로 화면의 도입과 설명 장면을 정합니다",
    ],
    [
      "문구가 정해져 있어요",
      "무음으로 읽히는 흐름부터",
      "꼭 넣을 문구와 제품명을 확인하고 도입·제품 설명·마지막 안내에 맞춰 자막을 구성합니다",
    ],
    [
      "게시 채널이 정해져 있어요",
      "채널과 다음 행동부터",
      "시청자와 릴스·쇼츠 등 채널을 확인하고 상세페이지나 문의처로 이어질 마지막 장면을 정합니다\n광고 집행은 별도입니다",
    ],
  ],
};

export function StartingBoard({ service }: { service: ContentServiceId }) {
  const [selected, setSelected] = useState(0);
  const options = starts[service];
  const [label, title, body] = options[selected];
  return (
    <DetailSection
      id="starting-point"
      eyebrow="YOUR STARTING POINT"
      title="준비된 자료에서 시작합니다"
      lead="자료를 고르면 확인할 내용과 제작 범위를 볼 수 있습니다"
    >
      <StartingVisual service={service} selected={selected} />
      <div className="cr-starting">
        <div className="cr-start-options" aria-label="보유 자료 선택">
          {options.map(([name], index) => (
            <button
              type="button"
              key={name}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <span>0{index + 1}</span>
              {name}
              <span aria-hidden="true">{selected === index ? "✓" : "↗"}</span>
            </button>
          ))}
        </div>
        <div className="cr-start-result" aria-live="polite">
          <p className="sd-eyebrow">
            0{selected + 1} / {label}
          </p>
          <h3>{title}</h3>
          <p>{body}</p>
          <div className="cr-start-scope">
            <div>
              <h4>제작 구성</h4>
              <ul>
                {DETAIL_SCOPE[service].included.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>상담에서 확인</h4>
              <ul>
                {DETAIL_SCOPE[service].confirm.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="sd-actions">
            <a
              className="sd-button"
              href="#inquiry"
              data-material={label}
              data-entry="starting-point"
            >
              이 자료로 제작 상담 ↗
            </a>
            <a className="sd-text-link" href="#pricing">
              구성·가격 확인 ↓
            </a>
          </div>
        </div>
      </div>
      <div id="prepare" className="cr-prepare">
        <h3>준비하면 좋은 것</h3>
        <p>
          준비된 내용부터 알려주세요
          <br />
          자료와 분량은 상담하면서 정해도 됩니다
        </p>
        <dl>
          {DETAIL_COPY[service].prepare.map(([name, text]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </DetailSection>
  );
}

function StartingVisual({
  service,
  selected,
}: {
  service: ContentServiceId;
  selected: number;
}) {
  if (service === "webtoon")
    return (
      <figure className="cr-visual cr-comic">
        <div className="cr-comic-step">
          <span>01 · 콘티 구성 예시</span>
          <svg
            viewBox="0 0 280 400"
            role="img"
            aria-label="인물의 얼굴, 대화, 경기 장면을 세 칸으로 나눈 콘티 설명 스케치"
          >
            <rect x="8" y="8" width="264" height="146" />
            <path d="M24 142Q40 94 88 94T156 142 M63 62Q63 28 88 28T113 62Q113 94 88 94T63 62 M164 28H250V72H190L174 90V72H164Z M8 170H272V260H8Z M8 278H272V392H8Z M24 248L72 195L130 248 M152 190H254V225H180L165 240V225H152Z M24 365L252 300 M24 385L252 320 M104 338L130 306L153 327L137 351L162 377 M130 306L149 288 M104 338L78 324 M137 351L112 379" />
            <circle cx="154" cy="290" r="10" />
          </svg>
        </div>
        <div className="cr-comic-step">
          <span>02 · 완성 페이지</span>
          <Image
            src="/service-detail-v14/webtoon-07.webp"
            width={280}
            height={400}
            alt={homeCardMedia.webtoon.caseLabel + " 완성 페이지 07"}
          />
        </div>
        <figcaption>
          콘티 도해 → 실제 완성 페이지 · 콘티는 제작 흐름을 설명하는 예시입니다
        </figcaption>
      </figure>
    );
  if (service === "animation")
    return (
      <figure className="cr-visual cr-poses">
        <div>
          {ANIMATION_STARTING_SCENES.map((scene, i) => (
            <div key={scene} data-active={selected === i}>
              <Image
                src={scene}
                width={240}
                height={240}
                alt={
                  homeCardMedia.animation.caseLabel +
                  " 영상 구성 장면 " +
                  (i + 1)
                }
              />
              <span>SCENE 0{i + 1}</span>
            </div>
          ))}
        </div>
        <figcaption>
          영상의 도입·마지막 안내와 다른 표현 시안 ·{" "}
          {homeCardMedia.animation.caseLabel}
        </figcaption>
      </figure>
    );
  if (service === "ai-influencer")
    return (
      <figure className="cr-visual cr-persona">
        {["cleanser-02", "cleanser-12"].map((name, i) => (
          <div key={name}>
            <Image
              src={`/content-fb3/${name}.webp`}
              width={400}
              height={520}
              alt={
                homeCardMedia["ai-influencer"].caseLabel +
                (i === 0 ? " 제품 소개 장면" : " 제품 사용 장면")
              }
            />
            <span>
              {i === 0 ? "같은 인물 · 제품 소개" : "같은 인물 · 제품 사용"}
            </span>
          </div>
        ))}
        <figcaption>
          {homeCardMedia["ai-influencer"].caseLabel} · 클렌저 제품영상의 다른
          활용 장면
        </figcaption>
      </figure>
    );
  if (service === "motion-graphics")
    return (
      <figure className="cr-visual cr-keyframes">
        <div className="cr-scene-strip">
          {[5, 15, 20].map((time, i) => (
            <div key={time} data-active={selected === i}>
              <Image
                src={`/content-fb3/motion-${String(time).padStart(2, "0")}.webp`}
                width={480}
                height={270}
                alt={`${homeCardMedia["motion-graphics"].caseLabel} ${time}초 장면`}
              />
              <span>
                {
                  [
                    "05초 · 제형과 타이포",
                    "15초 · 제품에 가까이",
                    "20초 · 여러 제품 연결",
                  ][i]
                }
              </span>
            </div>
          ))}
        </div>
        <figcaption>
          {homeCardMedia["motion-graphics"].caseLabel} · 실제 본편의 제형 → 제품
          → 제품 구성
        </figcaption>
      </figure>
    );
  if (service === "brand-film")
    return (
      <figure className="cr-visual cr-storyboard">
        <ol>
          {["소개", "핵심 메시지", "마지막 안내"].map((label, i) => (
            <li key={label} data-active={selected === i}>
              <span>SCENE 0{i + 1}</span>
              <svg
                viewBox="0 0 240 135"
                role="img"
                aria-label={label + " 장면 구성 도해"}
              >
                {i === 0 ? (
                  <>
                    <path d="M20 112V48L75 20L130 48V112 M42 112V65H108V112 M148 45H220 M148 65H207 M148 85H220" />
                    <path d="M58 45H92" />
                  </>
                ) : i === 1 ? (
                  <>
                    <rect x="25" y="28" width="70" height="82" rx="8" />
                    <path d="M39 28V18H81V28 M40 60H80 M40 77H80 M120 36H220 M120 58H200 M120 80H220 M120 102H185" />
                  </>
                ) : (
                  <>
                    <rect x="30" y="30" width="180" height="75" rx="8" />
                    <path d="M55 53H185 M55 69H149 M55 86H130 M164 78L180 86L164 94" />
                  </>
                )}
              </svg>
              <b>{label}</b>
            </li>
          ))}
        </ol>
        <figcaption>
          스토리보드 구성 예시 · 소개할 내용을 장면 순서로 정리합니다
        </figcaption>
      </figure>
    );
  return (
    <figure className="cr-visual cr-formats">
      <div>
        {[
          ["릴스", "9:16", "cplus-04"],
          ["피드", "4:5", "cplus-12"],
          ["유튜브", "16:9", "cplus-16"],
        ].map(([channel, ratio, image], i) => (
          <div key={channel} data-format={i}>
            <div className="cr-format-image">
              <Image
                src={`/content-f5/${image}.webp`}
                width={480}
                height={854}
                alt={
                  homeCardMedia.ad.caseLabel +
                  " · " +
                  channel +
                  " 화면 크롭 예시"
                }
              />
            </div>
            <span>
              {channel} · {ratio}
            </span>
          </div>
        ))}
      </div>
      <figcaption>
        C Plus 시안의 서로 다른 장면을 활용한 채널별 크롭 예시 · 추가 규격은
        상담에서 확인합니다
      </figcaption>
    </figure>
  );
}
