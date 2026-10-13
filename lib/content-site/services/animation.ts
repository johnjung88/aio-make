/* 애니메이션 서비스 랜딩 데이터. WP0 초안(BRIEF_P2R_SERVICES 2절 카피 그대로) → 이후 WP-A 소유.
 * signature는 WP-A가 채운다(움직이기 전 확인 3탭). */
import { COMMON_FAQ } from "../faq.ts";
import type { ServiceLandingData } from "../types.ts";

export const animation: ServiceLandingData = {
  id: "animation",
  label: "애니메이션",
  seo: {
    title: "애니메이션 제작",
    description:
      "캐릭터와 배경을 설계하고 장면을 이어 30초·60초 브랜드 애니메이션을 만듭니다. 30초 30만 원부터, 부가세 별도.",
  },
  hero: {
    eyebrow: "ANIMATION",
    title: "캐릭터가\n움직이는 장면",
    lead: "캐릭터와 배경을 설계하고 장면을 이어 30초와 60초 애니메이션으로 완성합니다",
    facts: ["30초 · 60초", "캐릭터·배경 설계", "기획안 수정 2회"],
  },
  types: {
    eyebrow: "WHAT WE MAKE",
    title: "이야기에 맞춰\n움직입니다",
    items: [
      {
        title: "캐릭터 애니메이션",
        body: "브랜드 캐릭터의 표정과 행동으로 이야기를 만듭니다.",
      },
      {
        title: "설명 애니메이션",
        body: "보여주기 어려운 과정을 장면과 상황으로 풀어냅니다.",
      },
      {
        title: "숏폼 애니메이션",
        body: "릴스와 쇼츠에 맞는 짧은 장면으로 구성합니다.",
      },
    ],
  },
  process: {
    title: "장면을 확인하며\n만듭니다",
    steps: [
      {
        title: "상담·자료 정리",
        body: "알리고 싶은 내용과 쓰일 곳을 정리합니다.",
        check: "핵심 메시지 확인",
      },
      {
        title: "기획안 전달",
        body: "이야기와 캐릭터, 장면 구성을 담은 기획안을 보내드립니다.",
        check: "기획안 수정 2회",
      },
      {
        title: "제작·최종안",
        body: "확정한 기획안대로 장면을 움직이고 최종안을 보내드립니다.",
        check: "최종안 수정 1회",
      },
      {
        title: "납품",
        body: "확정한 영상을 파일로 전달합니다.",
        check: "완성 파일 확인",
      },
    ],
  },
  scope: {
    included: [
      "30초 또는 60초 애니메이션 1편",
      "캐릭터와 배경 설계",
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
      "길이와 가격은 어떻게 되나요?",
      "30초는 30만 원, 60초는 55만 원입니다. 모두 부가세 별도입니다.",
    ],
    [
      "제작 중에 무엇을 확인하나요?",
      "기획안에서 이야기와 캐릭터, 장면 구성을 먼저 확인합니다. 최종안을 받은 뒤 한 번 더 수정할 수 있습니다.",
    ],
    ...COMMON_FAQ,
  ],
  inquiry: {
    title: "어떤 장면을\n만들고 싶으신가요?",
    lead: "알리고 싶은 내용을 남겨주시면 장면 구성과 견적을 안내합니다",
    placeholder: "예: 브랜드 캐릭터가 제품을 소개하는 30초 영상이 필요해요",
  },
  signature: {},
};
