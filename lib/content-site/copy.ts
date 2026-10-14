/* 컨텐츠 사이트 셸·공통 블록의 고정 문구 카피 테스트(tests/content-site.test.mjs) 대상이다
 * 서비스마다 다른 문구는 lib/content-site/services/<id>.ts에 둔다 */

export const CS_COPY = {
  skip: "본문 바로가기",
  header: {
    studio: "CONTENT STUDIO",
    homeLabel: "AIO MAKE 컨텐츠 홈",
    navLabel: "컨텐츠 서비스",
    sheetButton: "서비스",
    sheetOpen: "서비스 메뉴 열기",
    sheetClose: "서비스 메뉴 닫기",
    cta: "상담 신청",
  },
  motion: {
    pause: "화면 움직임 멈추기",
    play: "화면 움직임 다시 재생",
  },
  footer: {
    line: "웹툰부터 SNS 광고 영상까지 기획과 제작을 한 팀이 맡습니다",
    servicesLabel: "컨텐츠 서비스",
    contact: "상담 신청",
    privacy: "개인정보처리방침",
    terms: "이용약관",
    home: "AIO MAKE 홈",
  },
  mobileBar: {
    label: "빠른 상담",
    cta: "상담 신청",
  },
  hero: {
    primary: "상담 신청",
    secondary: "가격 보기",
    factsLabel: "기본 구성",
  },
  types: { fallbackEyebrow: "WHAT WE MAKE" },
  works: {
    eyebrow: "WORKS",
    title: "제작 사례",
    more: "사례 자세히 보기",
  },
  pricing: {
    eyebrow: "PRICING",
    title: "제작 가격",
    vat: "부가세 별도",
    bundle: "함께 제작",
    cta: "이 구성으로 상담",
  },
  process: {
    eyebrow: "PROCESS",
    check: "함께 확인",
  },
  scope: {
    eyebrow: "SCOPE",
    title: "포함 범위",
    included: "기본 포함",
    separate: "별도 상담",
    prepare: "준비하면 좋은 자료",
  },
  faq: {
    eyebrow: "FAQ",
    title: "자주 묻는 질문",
  },
  inquiry: {
    eyebrow: "CONTACT",
    steps: ["상담 신청", "기획안과 견적 안내", "제작 시작"],
    stepsLabel: "진행 순서",
    /** 서비스 없이 제출했을 때(InquiryBridge unselectedMessage). 문의 페이지 안내와 같은 문장 */
    serviceMissing: "요청 서비스를 하나 골라주세요",
    fields: {
      name: "성함",
      company: "회사·브랜드",
      email: "이메일",
      phone: "전화번호",
      plan: "희망 구성",
      schedule: "희망 일정",
      reference: "참고 링크",
      message: "만들고 싶은 컨텐츠",
      consent: "개인정보 수집·이용에 동의합니다 (필수)",
      required: "필수",
    },
    planUndecided: "아직 정하지 않았어요",
    schedules: ["2주 안에", "1개월 안에", "상담 후 정할게요"],
    submit: "상담 신청하기",
    homeLabel: "컨텐츠 홈으로",
  },
  related: {
    eyebrow: "MORE SERVICES",
    title: "다른 컨텐츠 서비스",
  },
} as const;
