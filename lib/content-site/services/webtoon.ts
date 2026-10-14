/* 웹툰 서비스 랜딩 데이터(WP-A 소유). 카피는 BRIEF_P2R_SERVICES 1절 초안을 R6 BRIEF 5절로 다듬은 것이다.
 * signature 문자열도 카피 테스트 대상이다. 금액은 쓰지 않고 lib/content-pricing.ts로 렌더한다.
 * 이미지 경로·alt는 components/content-site/services/webtoon/landing.tsx 상단 상수에 둔다. */
import { COMMON_FAQ } from "../faq.ts";
import type { ServiceLandingData } from "../types.ts";

/** 서비스 고유 섹션 문구(12컷 리더 · 모션코믹). 히어로 표지는 컷 1장이라 문구가 없다 */
export const webtoonSignature = {
  reader: {
    eyebrow: "READ",
    title: "12컷 한 회를\n직접 넘겨보세요",
    lead: "《1억의 구단주》 1회를 책장처럼 한 컷씩 넘기거나 전체를 이어서 읽을 수 있습니다",
    label: "1억의 구단주 12컷 넘겨 보기",
  },
  motionComic: {
    eyebrow: "MOTION COMIC",
    title: "완성한 웹툰을\n영상으로 잇습니다",
    lead: "컷에 움직임과 화면 전환을 더해 영상으로 만듭니다",
    videoLabel: "《1억의 구단주》 소개 영상",
    waysLabel: "맡기는 방법",
    ways: [
      {
        title: "웹툰과 함께 맡길 때",
        body: "12컷은 30초, 24컷은 60초 영상과 묶어 맡길 수 있습니다",
      },
      {
        title: "모션코믹만 맡길 때",
        body: "이미 완성한 웹툰이 있다면 컷별 원본 이미지로 영상만 만듭니다",
      },
    ],
  },
} as const;

export const webtoon: ServiceLandingData = {
  id: "webtoon",
  label: "웹툰",
  seo: {
    title: "브랜드 웹툰 제작",
    description:
      "제품과 브랜드 이야기를 12컷·24컷 웹툰으로 그리고 모션코믹 영상으로 제작 · 웹툰 제작 12컷 10만 원부터, 부가세 별도",
  },
  hero: {
    eyebrow: "WEBTOON",
    title: "제품의 이야기를\n웹툰 한 편으로",
    lead: "제품을 만나는 순간부터 사용하는 장면까지 12컷·24컷 이야기로 엮어 컷별 이미지로 전달합니다",
  },
  process: {
    title: "줄거리에서\n컷별 완성본까지",
    steps: [
      {
        title: "이야기 정리",
        body: "알리고 싶은 제품과 독자를 정하고 이야기의 방향을 잡습니다",
        check: "핵심 메시지 확인",
      },
      {
        title: "기획안 전달",
        body: "줄거리와 컷 나눔, 대사를 담은 콘티를 보내드립니다",
        check: "기획안 수정 2회",
      },
      {
        title: "작화·최종안",
        body: "확정한 콘티대로 그리고 대사를 넣어 최종안을 보내드립니다",
        check: "최종안 수정 1회",
      },
      {
        title: "납품",
        body: "대사와 컷 순서를 확인한 뒤 컷별 완성 이미지를 전달합니다",
        check: "컷별 이미지 확인",
      },
    ],
  },
  scope: {
    included: [
      "12컷 또는 24컷 한 회",
      "줄거리 · 컷별 콘티 · 대사 · 작화",
      "기획안 수정 2회 · 최종안 수정 1회",
    ],
    separate: ["모션코믹 영상화(옵션)", "대량·정기 제작"],
    prepare: [
      "제품 정보와 알리고 싶은 내용",
      "등장시키고 싶은 인물이나 상황",
      "참고하고 싶은 웹툰 링크",
    ],
  },
  faq: [
    [
      "1컷은 어떻게 세나요?",
      "완성 이미지 1장을 1컷으로 세며 한 회는 12컷과 24컷 중에서 고릅니다",
    ],
    [
      "모션코믹은 무엇인가요?",
      "완성한 웹툰을 움직이는 영상으로 바꾸는 작업입니다",
    ],
    [
      "대사는 누가 쓰나요?",
      "대사는 저희가 쓰며 꼭 넣을 문구가 있다면 상담할 때 알려주세요",
    ],
    ...COMMON_FAQ,
  ],
  inquiry: {
    title: "어떤 이야기를\n그리고 싶으신가요?",
    lead: "제품과 독자를 알려주시면 콘티 방향과 견적을 안내합니다",
    placeholder: "예: 우리 제품을 쓰는 직장인 이야기를 12컷으로 그리고 싶어요",
  },
  signature: webtoonSignature,
};
