/* 브랜드 홍보 영상 서비스 랜딩 데이터(WP-C 소유, BRIEF_P2R_SERVICES 5절).
 * signature = 배경 영상 히어로 문구 · 이야기 순서 · 길이별 구성 예시. 현장 촬영 포함 여부는 쓰지 않는다(Q6).
 * 길이별 구성의 length 값은 lib/content-pricing.ts 플랜 라벨("30초"·"60초")과 같아야 금액·상담 링크가 이어진다. */
import { COMMON_FAQ } from "../faq.ts";
import type { ServiceLandingData } from "../types.ts";

export const brandFilmSignature = {
  hero: {
    videoLabel: "브랜드 홍보 영상 연출 예시 · 보라색 유리 곡면이 천천히 흐르는 무음 영상",
    pause: "영상 일시정지",
    play: "영상 재생",
  },
  story: {
    eyebrow: "STORY",
    title: "이야기 순서부터\n정합니다",
    lead: "세 가지 질문에 차례로 답하는 구성으로 기획안을 씁니다",
    rows: [
      {
        statement: "왜 시작했는지",
        body: "브랜드가 풀고 싶은 고객의 문제를 먼저 정리합니다.",
      },
      {
        statement: "지금 무엇을 하는지",
        body: "제품과 서비스가 하는 일을 장면으로 보여줍니다.",
      },
      {
        statement: "다음에 무엇을 할지",
        body: "영상을 본 사람이 이어서 볼 정보와 문의 경로를 담습니다.",
      },
    ],
    mediaAlt: "보라색 천이 흐르는 물 위에 놓인 향수병 연출 예시",
  },
  length: {
    eyebrow: "LENGTH",
    title: "30초와 60초\n이렇게 나눕니다",
    note: "길이별 구성 예시입니다. 실제 구성은 기획안에서 정합니다.",
    rows: [
      { length: "30초", parts: ["도입", "핵심 메시지", "마무리"] },
      {
        length: "60초",
        parts: ["도입", "고객의 문제", "제품과 서비스", "일하는 방식", "마무리"],
      },
    ],
  },
};

export type BrandFilmSignature = typeof brandFilmSignature;

export const brandFilm: ServiceLandingData = {
  id: "brand-film",
  label: "브랜드 홍보 영상",
  seo: {
    title: "브랜드 홍보 영상 제작",
    description:
      "홈페이지와 회사 소개에 쓸 30초·60초 브랜드 홍보 영상을 기획부터 편집까지 만듭니다. 30초 25만 원부터, 부가세 별도.",
  },
  hero: {
    eyebrow: "BRAND FILM",
    title: "한 편의 영상에\n브랜드를 담습니다",
    lead: "브랜드 자료와 제품 정보를 정리해 30초와 60초 홍보 영상으로 만듭니다",
    facts: ["30초 · 60초", "기획안 수정 2회", "최종안 수정 1회"],
  },
  types: {
    eyebrow: "WHAT WE MAKE",
    title: "쓰는 곳에 맞춰\n만듭니다",
    items: [
      {
        title: "회사 소개 영상",
        body: "회사가 하는 일과 일하는 방식을 한 편으로 정리합니다.",
      },
      {
        title: "제품·서비스 소개",
        body: "제품이 해결하는 문제와 쓰는 장면을 보여줍니다.",
      },
      {
        title: "홈페이지·전시용 영상",
        body: "홈페이지 첫 화면이나 행사장에서 반복해 틀 영상을 만듭니다.",
      },
    ],
  },
  process: {
    title: "자료 정리부터\n함께합니다",
    steps: [
      {
        title: "자료 정리",
        body: "회사 소개서와 제품 정보에서 전할 내용을 고릅니다.",
        check: "브랜드 자료 전달",
      },
      {
        title: "기획안 전달",
        body: "이야기 순서와 문구, 장면 구성을 담은 기획안을 보내드립니다.",
        check: "기획안 수정 2회",
      },
      {
        title: "제작·최종안",
        body: "확정한 기획안대로 영상을 만들어 최종안을 보내드립니다.",
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
      "30초 또는 60초 영상 1편",
      "이야기 구성과 문구 기획",
      "기획안 수정 2회 · 최종안 수정 1회",
    ],
    separate: ["대량·정기 제작", "기본 구성 밖의 추가 작업"],
    prepare: [
      "회사 소개서나 제품 정보",
      "로고와 브랜드 색",
      "참고하고 싶은 영상 링크",
    ],
  },
  faq: [
    [
      "길이와 가격은 어떻게 되나요?",
      "30초와 60초 두 가지로 만듭니다. 30초는 25만 원, 60초는 45만 원이며 부가세 별도입니다.",
    ],
    [
      "무엇을 준비하면 되나요?",
      "회사 소개서와 제품 정보, 로고 파일이 있으면 좋습니다. 자료가 적으면 상담에서 필요한 내용을 함께 정리합니다.",
    ],
    ...COMMON_FAQ,
  ],
  inquiry: {
    title: "어떤 이야기를\n담고 싶으신가요?",
    lead: "회사와 제품을 알려주시면 이야기 구성과 견적을 안내합니다",
    placeholder: "예: 회사 소개용 60초 영상을 홈페이지에 올리고 싶어요",
  },
  signature: brandFilmSignature,
};
