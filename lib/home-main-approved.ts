// Server-only, single-case exception authorized for the company main page.
// This does not publish the private work catalog or change its review gate.
// 10/30 user direction: the development step shows our own portfolio sample
// 여백결 (fictional brand) instead of the customer store. BEFORE is the brand
// guide home mockup, AFTER is the built site's first screen at the same size.
import "server-only";
import type { DevProject } from "./home-journey.ts";

const base = "/company-main-20261019-v11/development/";

export const companyMainDevProject: DevProject = {
  title: "여백결 건축 스튜디오",
  detail: {
    title: "여백결 건축 스튜디오 웹사이트",
    status: "디자인 시안 → 완성 사이트",
    description:
      "포트폴리오용 가상 브랜드로 만든 건축·인테리어 스튜디오 웹사이트입니다\n시안에서 정한 장면을 실제 화면으로 옮겼습니다",
    purpose:
      "빛과 재료의 결이 먼저 보이도록 큰 공간 사진과 짧은 문장으로 첫 화면을 구성했습니다",
    scope:
      "브랜드 가이드, 홈 시안, 빛·재료·자리 비교 인터랙션, PC·모바일 반응형 개발까지 진행했습니다\n비교 화면은 홈 시안과 완성 사이트의 같은 첫 화면입니다",
  },
  after: {
    kind: "image",
    src: `${base}yeobakgyeol-live-pc.webp`,
    width: 2880,
    height: 1800,
    alt: "여백결 완성 사이트 첫 화면 PC",
  },
  afterMobile: {
    kind: "image",
    src: `${base}yeobakgyeol-live-mobile.webp`,
    width: 390,
    height: 844,
    alt: "여백결 완성 사이트 첫 화면 모바일",
  },
  before: {
    pc: {
      kind: "image",
      src: `${base}yeobakgyeol-mockup-pc.webp`,
      width: 1504,
      height: 940,
      alt: "여백결 홈 디자인 시안 PC",
    },
    mobile: {
      kind: "image",
      src: `${base}yeobakgyeol-mockup-mobile.webp`,
      width: 390,
      height: 844,
      alt: "여백결 홈 디자인 시안 모바일",
    },
  },
};
