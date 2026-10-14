/* 애니메이션 서비스 랜딩 데이터(WP-A 소유). 카피는 BRIEF_P2R_SERVICES 2절 초안을 다듬은 것이다.
 * signature 문자열도 카피 테스트 대상이다. 금액은 쓰지 않고 lib/content-pricing.ts로 렌더한다.
 * 이미지 경로·alt는 components/content-site/services/animation/landing.tsx 상단 상수에 둔다. */
import { COMMON_FAQ } from "../faq.ts";
import type { ServiceLandingData } from "../types.ts";

/** 서비스 고유 섹션 문구(그림체 · 움직이기 전 확인 탭) */
export const animationSignature = {
  styles: {
    eyebrow: "STYLE",
    title: "브랜드에 맞는\n그림체를 고릅니다",
    lead: "캐릭터의 생김새부터 배경의 질감까지 브랜드 분위기에 맞춥니다",
    items: [
      {
        title: "입체 캐릭터",
        body: "둥근 형태와 매끈한 재질로 친근한 인상을 만듭니다",
      },
      {
        title: "동화풍 장면",
        body: "빛과 날씨를 살린 배경으로 이야기의 분위기를 잡습니다",
      },
      {
        title: "포근한 질감",
        body: "털과 천의 결을 살려 따뜻한 느낌을 줍니다",
      },
    ],
  },
  beforeMotion: {
    eyebrow: "BEFORE MOTION",
    title: "움직이기 전에\n장면을 맞춥니다",
    lead: "줄거리와 캐릭터 기준, 주요 장면을 확인한 뒤 움직임을 만듭니다",
    tabsLabel: "움직이기 전에 확인하는 것",
    items: [
      {
        title: "이야기",
        body: "누가 무엇을 하는지 한 문장으로 정리하고 장면 순서를 나눕니다",
      },
      {
        title: "캐릭터",
        body: "생김새와 표정, 움직임의 범위를 그림으로 먼저 정합니다",
      },
      {
        title: "장면 구성",
        body: "장면마다 화면 구도와 길이를 정해 기획안에 담습니다",
      },
    ],
    story: {
      label: "한 문장 이야기",
      line: "캐릭터가 겪는 문제와 제품을 만나는 순간을 하나의 이야기로 잇습니다",
      beats: ["시작", "전개", "마무리"],
    },
    views: ["정면", "측면"],
    frames: ["전체", "인물", "제품", "마무리"],
  },
} as const;

export const animation: ServiceLandingData = {
  id: "animation",
  label: "애니메이션",
  seo: {
    title: "애니메이션 제작",
    description:
      "캐릭터와 배경을 설계하고 장면을 이어 30초·60초 브랜드 애니메이션을 제작 · 30초 30만 원부터, 부가세 별도",
  },
  hero: {
    eyebrow: "ANIMATION",
    title: "캐릭터와 장면을\n움직이는 영상으로",
    lead: "캐릭터의 표정과 행동, 배경과 장면 전환을 기획해 30초·60초 애니메이션으로 완성합니다",
  },
  types: {
    eyebrow: "WHAT WE MAKE",
    title: "이야기에 맞춰\n움직입니다",
    items: [
      {
        title: "캐릭터 애니메이션",
        body: "캐릭터가 제품을 만나고 사용하는 상황을 표정과 행동으로 보여줍니다",
      },
      {
        title: "설명 애니메이션",
        body: "서비스의 이용 순서나 눈에 보이지 않는 과정을 장면으로 바꿔 설명합니다",
      },
      {
        title: "숏폼 애니메이션",
        body: "첫 장면부터 이야기가 시작되는 짧은 구성을 만들고 게시할 채널에 맞춰 기획합니다",
      },
    ],
  },
  process: {
    title: "장면을 확인하며\n만듭니다",
    steps: [
      {
        title: "상담·자료 정리",
        body: "알리고 싶은 내용과 쓰일 곳을 정리합니다",
        check: "핵심 메시지 확인",
      },
      {
        title: "기획안 전달",
        body: "이야기와 캐릭터, 장면 구성을 담은 기획안을 보내드립니다",
        check: "기획안 수정 2회",
      },
      {
        title: "제작·최종안",
        body: "확정한 캐릭터와 장면에 표정·동작·화면 전환을 더해 최종안을 전달합니다",
        check: "최종안 수정 1회",
      },
      {
        title: "납품",
        body: "확정한 영상을 파일로 전달합니다",
        check: "완성 파일 확인",
      },
    ],
  },
  scope: {
    included: [
      "30초 또는 60초 애니메이션 1편",
      "캐릭터 · 배경 · 주요 장면 설계",
      "기획안 수정 2회 · 최종안 수정 1회",
    ],
    separate: ["대량·정기 제작"],
    prepare: [
      "알리고 싶은 내용",
      "기존 캐릭터가 있다면 원본 파일",
      "참고하고 싶은 영상 링크",
    ],
  },
  faq: [
    [
      "길이는 어떻게 정하나요?",
      "어디에 올릴 영상인지 듣고 30초와 60초 중에서 고릅니다",
    ],
    [
      "이미 있는 캐릭터로도 만들 수 있나요?",
      "캐릭터 원본 파일을 보내주시면 기획안에서 생김새와 움직임을 먼저 맞춥니다",
    ],
    [
      "그림체는 어떻게 정하나요?",
      "참고 영상과 브랜드 분위기, 사용할 곳을 바탕으로 기획안 단계에서 그림체를 정합니다",
    ],
    ...COMMON_FAQ,
  ],
  inquiry: {
    title: "어떤 장면을\n만들고 싶으신가요?",
    lead: "알리고 싶은 내용을 남겨주시면 장면 구성과 견적을 안내합니다",
    placeholder: "예: 브랜드 캐릭터가 제품을 소개하는 30초 영상이 필요해요",
  },
  signature: animationSignature,
};
