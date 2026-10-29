// Server-only, single-case exception authorized for the company main page.
// This does not publish the private work catalog or change its review gate.
// AFTER is the matching PC/mobile HOME design v03, not the v06 product-detail
// mobile screenshot that used to be paired with the home PC capture.
import "server-only";
import type { DevProject } from "./home-journey.ts";

export const companyMainDevProject: DevProject = {
  title: "DR’s Secret 쇼핑몰",
  detail: {
    title: "DR’s Secret 쇼핑몰 디자인 시안",
    status: "PC·모바일 디자인 시안 v03",
    description:
      "브랜드 소개와 제품 탐색을 연결한 쇼핑몰 디자인 시안입니다\n실제 주문과 결제는 받지 않는 레퍼런스입니다",
    purpose:
      "스킨케어 브랜드의 분위기를 유지하면서 제품과 사용 순서를 살펴볼 수 있도록 구성했습니다",
    scope:
      "브랜드 소개, 제품 탐색과 상세 화면, PC·모바일 반응형 디자인을 제작했습니다\n비교 화면은 같은 홈 디자인 시안 v03의 PC·모바일 캡처입니다",
  },
  after: {
    kind: "image",
    src: "/company-main-20261019-v11/development/after-home-pc-v03.png",
    width: 1440,
    height: 1000,
    alt: "DR’s Secret 쇼핑몰 홈 디자인 시안 v03 PC 화면",
  },
  afterMobile: {
    kind: "image",
    src: "/company-main-20261019-v11/development/after-home-mobile-v03.png",
    width: 390,
    height: 1000,
    alt: "DR’s Secret 쇼핑몰 홈 디자인 시안 v03 모바일 화면",
  },
  before: {
    pc: {
      kind: "image",
      src: "/company-main-20261019-v11/development/before-home-pc.webp",
      width: 1440,
      height: 900,
      alt: "기존 DR’s Secret 공식몰 홈 PC 화면 · 2026-10-10 수집 캡처",
    },
    mobile: {
      kind: "image",
      src: "/company-main-20261019-v11/development/before-home-mobile.webp",
      width: 390,
      height: 844,
      alt: "기존 DR’s Secret 공식몰 홈 모바일 화면 · 2026-10-10 수집 캡처",
    },
  },
};
