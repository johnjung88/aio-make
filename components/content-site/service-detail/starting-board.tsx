"use client";

import { useState } from "react";
import {
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
      "기존 웹툰 영상화에 사용할 원본과 장면을 확인합니다 신규 웹툰과 함께 만드는 구성도 비교할 수 있습니다",
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
      "확인된 제품 정보와 필요한 장면·분량을 정합니다 AI 가상인물이 출연하는 연출 영상으로 제작합니다",
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
      "사용할 수 있는 사진·영상과 부족한 장면을 확인합니다 현장 촬영은 별도로 협의합니다",
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
      "시청자와 릴스·쇼츠 등 채널을 확인하고 상세페이지나 문의처로 이어질 마지막 장면을 정합니다 광고 집행은 별도입니다",
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
      lead="지금 가진 자료를 골라보세요 먼저 확인할 내용과 제작 범위를 살펴볼 수 있습니다"
    >
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
      <noscript>
        <ul>
          {DETAIL_COPY[service].prepare.map(([name, text]) => (
            <li key={name}>
              {name} · {text}
            </li>
          ))}
        </ul>
      </noscript>
    </DetailSection>
  );
}
