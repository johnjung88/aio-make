import { guideAsset } from "./primitives";
const LAB_DATA = (() => {
  const U = (id) => guideAsset(id);
  const P = "public/portfolio/";
  const services = [
    {
      key: "website",
      no: "01",
      en: "WEBSITE",
      name: "웹사이트 제작",
      tab: "web",
      short: "회사 홈페이지 · 랜딩페이지 · 서비스 사이트",
      desc: "시안이 아닌 완성된 사이트로 납품합니다 검색 기본 설정과 문의 폼 연동까지 마친 상태로 넘겨드립니다",
      stack: ["Next.js", "React", "WordPress", "Vercel"],
      days: "범위별 협의",
      desk: P + "med-ondam/live.png",
      mob: P + "med-ondam/mobile-preview.png",
      url: "ondam.clinic",
    },
    {
      key: "shop",
      no: "02",
      en: "SHOPPING MALL",
      name: "쇼핑몰 제작",
      tab: "web",
      short: "카페24 디자인 복사 · 기본 이미지 세팅",
      desc: "상품 등록, 결제 연동, GA4와 광고 픽셀까지 세팅해 디자인 복사부터 광고를 시작할 수 있게 넘겨드립니다",
      stack: ["카페24", "완성 템플릿", "로고·배너", "범위 확인"],
      days: "범위별 협의",
      desk: "public/images/portfolio/ws-mealkit-scroll.png",
      mob: "public/images/portfolio/ws-shop-mobile.png",
      url: "chefmeal.co.kr",
    },
    {
      key: "automation",
      no: "03",
      en: "AUTOMATION",
      name: "업무 자동화",
      tab: "auto",
      short: "엑셀 · 크롤링 · 알림 · 워크플로",
      desc: "매일 반복하는 엑셀 정리, 데이터 수집, 알림 발송을 코드로 바꿉니다 지금 쓰는 도구는 그대로 둡니다",
      stack: ["Python", "n8n", "Google Sheets", "API"],
      days: "범위별 협의",
      desk: P + "blogautopilot-multinational/real-demo/app-schedule.png",
      url: "autopilot.app/schedule",
    },
    {
      key: "program",
      no: "04",
      en: "PROGRAM",
      name: "프로그램 개발",
      tab: "auto",
      short: "관리자 페이지 · 사내 시스템 · 데스크톱 앱 · 챗봇",
      desc: "우리 업무 방식에 맞춘 도구를 만듭니다 화면 설계부터 서버 배포까지 한 팀이 맡습니다",
      stack: ["Next.js", "Node.js", "Electron", "PostgreSQL"],
      days: "범위별 협의",
      desk: P + "v-aio-admin/dashboard.png",
      url: "admin.v-aio.kr",
    },
  ];
  const posts = [
    {
      slug: "prep",
      cat: "웹사이트",
      date: "제작 가이드",
      title: "홈페이지 제작 전에 준비할 자료 다섯 가지",
      img: U("1498050108023-c5249f4df085"),
      lead: "로고, 원고, 사진, 도메인, 참고 사이트 이 다섯 가지가 준비되어 있으면 제작 기간이 절반으로 줄어듭니다",
    },
    {
      slug: "cafe24",
      cat: "쇼핑몰",
      date: "제작 가이드",
      title: "카페24와 독립몰, 무엇으로 시작할까",
      img: U("1556742049-0cfed4f6a45d"),
      lead: "초기 비용, 운영 편의, 확장성을 기준으로 두 방식을 비교합니다",
    },
    {
      slug: "excel",
      cat: "자동화",
      date: "제작 가이드",
      title: "엑셀 반복 작업, 자동화할 수 있는지 판단하는 법",
      img: U("1551288049-bebda4e38f71"),
      lead: "규칙이 정해져 있고 매주 반복된다면 대부분 자동화할 수 있습니다",
    },
    {
      slug: "domain",
      cat: "웹사이트",
      date: "제작 가이드",
      title: "도메인과 호스팅, 납품 후에 꼭 알아둘 것",
      img: U("1558494949-ef010cbdcc31"),
      lead: "갱신일, 결제 계정, DNS 설정 권한을 누가 가지고 있는지 확인해 두세요",
    },
    {
      slug: "admin",
      cat: "프로그램",
      date: "제작 가이드",
      title: "관리자 페이지가 필요해지는 시점",
      img: U("1460925895917-afdab827c52f"),
      lead: "엑셀 파일이 여러 사람 손을 거치기 시작하면 시스템을 검토할 때입니다",
    },
    {
      slug: "seo",
      cat: "웹사이트",
      date: "제작 가이드",
      title: "새 홈페이지에 검색 기본 설정이 필요한 이유",
      img: U("1432888498266-38ffec3eaf0a"),
      lead: "메타 정보와 사이트맵이 없으면 검색엔진은 새 사이트를 찾는 데 몇 주가 걸립니다",
    },
  ];
  const faqs = [
    [
      "제작 기간이 얼마나 걸리나요?",
      "제작 일정은 자료 준비와 기능 범위를 확인한 뒤 견적 단계에서 협의합니다",
    ],
    [
      "수정은 몇 번까지 가능한가요?",
      "수정 횟수와 오류·누락 대응, 추가 작업 범위는 개별 견적에서 합의합니다",
    ],
    [
      "도메인·호스팅도 포함인가요?",
      "도메인과 호스팅은 기본 패키지에 포함되지 않으며 별도 구매가 필요합니다 — 구매 후 연결 세팅은 모두 지원드립니다",
    ],
    [
      "결제·예약·회원가입 기능도 만들 수 있나요?",
      "가능합니다 — 다만 해당 기능은 기본 패키지 외 별도 견적으로 진행되며 필요한 기능을 말씀해주시면 정확한 비용을 안내드립니다",
    ],
    [
      "착수금은 얼마이고 어떻게 결제하나요?",
      "착수금과 잔금, 결제 방법 및 작업 시작 일정은 개별 견적에서 정합니다",
    ],
    [
      "납품 후 유지보수는 어떻게 되나요?",
      "납품 후 오류 대응·수정·유지보수 범위와 비용은 개별 견적에서 정합니다",
    ],
  ];
  return { services, cases: [], reviews: [], posts, faqs, U };
})();

export default LAB_DATA;
