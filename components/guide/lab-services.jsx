"use client";
/* Generated from the preserved design by scripts/restore-guide.py.
 * Layout and copy changes belong in the compiler adaptation or shared primitives.
 * No DC interpreter, eval, HTML injection, editor runtime or stock video ships. */
/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-unused-vars */
import React from "react";
import {
  GuideLogic,
  GuideImage,
  GuideMedia,
  GuideLink,
  GuideNav,
  ServiceTabs,
  GuideCloud,
  GuideEffects,
  GuideOffer,
  developmentOffer,
  guideAsset,
  guideServiceHref,
  guideContactKey,
  adaptGuideValues,
  marketingExamples,
} from "./primitives";
import { InquiryBridge } from "./inquiry-bridge";
import LAB_DATA from "./lab-data";

const SV = {
  website: {
    intro:
      "회사 홈페이지, 랜딩페이지, 서비스 사이트를 만듭니다 검색 기본 설정과 문의 폼 연동까지 마친 상태로 넘겨드립니다",
    scopeNote: "기본 작업 기준이며, 예약·결제·회원 기능은 별도 견적입니다",
    scope: [
      "요구사항·메뉴 구조 정리",
      "화면 디자인",
      "반응형 (PC·모바일) 개발",
      "문의 폼·알림 연동",
      "SEO 기본 세팅 (메타·사이트맵)",
      "구조화 데이터·FAQ",
      "구글 서치콘솔 등록",
      "GA4 설치",
      "도메인·호스팅 연결 지원",
      "수정 방법 안내 문서",
    ],
    factors: [
      "페이지 수",
      "예약·결제·회원 같은 기능 포함 여부",
      "모션·영상 포함 여부",
    ],
    steps: [
      [
        "상담",
        "상담·견적",
        "참고 사이트와 요청 내용 정리",
        "페이지 수와 기능 범위 확정",
      ],
      [
        "작업 전",
        "범위·일정 공유",
        "메뉴 구조와 화면 초안 생성",
        "화면 흐름과 문구 배치를 정해 공유",
      ],
      [
        "제작",
        "설계·개발",
        "반복 컴포넌트와 원고 초안 작성",
        "반응형 개발과 핵심 화면 구현",
      ],
      [
        "작업 후",
        "결과 공유·검수",
        "화면 깨짐과 링크 오류 점검",
        "기기별 테스트 후 결과 공유, 도메인 연결",
      ],
      [
        "견적 시 협의",
        "납품 후 지원",
        "오류 로그 모니터링",
        "오류 수정, 문구·이미지 교체",
      ],
    ],
    faqs: [
      [
        "홈페이지 원고는 직접 써야 하나요?",
        "회사 소개 자료나 기존 홍보물을 주시면 원고 초안을 만들어 드립니다 최종 문구는 함께 확인한 뒤 반영합니다",
      ],
      [
        "WordPress와 Next.js 중 무엇으로 만드나요?",
        "직접 글을 자주 올려야 하면 WordPress, 빠른 속도와 검색 최적화가 중요하면 Next.js를 권해드립니다 상담 때 운영 방식을 듣고 정합니다",
      ],
    ],
    ctaNote: "참고 사이트와 필요한 페이지 수를 알려주시면 견적을 안내드립니다",
  },
  shop: {
    intro:
      "카페24 완성 템플릿의 디자인 복사와 기본 이미지 제작·적용을 제공합니다 상품등록·PG·배송 등 오픈설정은 포함되지 않습니다",
    scopeNote:
      "단순 복사와 풀 세팅의 범위를 구분하며, 독립몰·추가 기능은 별도 문의입니다",
    scope: [
      "카페24 완성 템플릿 디자인 복사",
      "메인·상품 목록·상세 화면",
      "상품등록·오픈설정 제외",
      "선택 템플릿 적용",
      "기본 로고·배너 제작 (풀 세팅)",
      "템플릿 기본 화면 구성 검수",
      "PC·모바일 표시 범위 확인",
      "자료·이미지 적용 검수",
      "모바일 최적화",
      "운영 방법 안내",
    ],
    factors: [
      "선택 템플릿과 적용할 기본 이미지 목록",
      "디자인 복사 또는 풀 세팅 선택",
      "추가 디자인 수정·외부 기능 범위",
    ],
    steps: [
      [
        "상담",
        "상담·견적",
        "템플릿·기본 이미지 자료 정리",
        "복사·풀 세팅 범위 확정",
      ],
      [
        "작업 전",
        "범위·일정 공유",
        "메인·카테고리 구성 초안 생성",
        "구매 동선과 화면 구성을 정해 공유",
      ],
      [
        "제작",
        "구축",
        "로고·배너 등 기본 이미지 제작",
        "선택 템플릿과 합의한 이미지 적용",
      ],
      [
        "작업 후",
        "검수·인계",
        "이미지·레이아웃 오류 점검",
        "화면·링크 검수 후 결과와 수정 방법 인계",
      ],
      [
        "견적 시 협의",
        "납품 후 지원",
        "화면·이미지 표시 확인",
        "오류 수정, 배너·이미지 교체",
      ],
    ],
    faqs: [
      [
        "PG 결제 가입도 도와주시나요?",
        "PG 신청·배송 등 오픈설정은 디자인 복사·풀 세팅 상품에 포함되지 않습니다 필요한 경우 별도로 문의해주세요",
      ],
      [
        "상품이 많아도 등록해주나요?",
        "상품등록은 디자인 복사·풀 세팅 상품에 포함되지 않습니다 상품 자료와 필요한 작업을 별도로 확인합니다",
      ],
    ],
    ctaNote: "선택 템플릿과 필요한 기본 이미지 목록을 알려주시면 안내드립니다",
  },
  automation: {
    intro:
      "엑셀 정리, 데이터 수집, 알림 발송을 코드로 바꿉니다 지금 쓰는 도구와 파일 형식은 그대로 두고 반복 구간만 자동화합니다",
    scopeNote: "범위별 협의 기준이며, 연동할 시스템이 많으면 일정을 협의합니다",
    scope: [
      "현재 업무 흐름 분석",
      "엑셀·구글 시트 자동화",
      "웹 데이터 수집 (크롤링)",
      "카카오톡·메일·슬랙 알림",
      "n8n 워크플로 구성",
      "외부 API 연동",
      "예약 실행 (스케줄러)",
      "실행 기록·오류 알림",
      "사용 설명서",
      "소스 코드 전달",
    ],
    factors: [
      "연동할 시스템과 사이트 수",
      "예외 규칙의 복잡도",
      "실행 환경 (내 PC 또는 서버)",
    ],
    steps: [
      [
        "상담",
        "업무 확인",
        "샘플 파일과 작업 순서 분석",
        "자동화할 범위와 예외 규칙 확정",
      ],
      [
        "작업 전",
        "설계·일정 공유",
        "처리 흐름 초안 생성",
        "입력·출력 형식과 일정을 정해 공유",
      ],
      [
        "제작",
        "개발",
        "변환·수집 코드 초안 작성",
        "예외 처리와 실제 데이터 테스트",
      ],
      [
        "작업 후",
        "적용·교육",
        "실행 기록 자동 점검",
        "결과 공유, 설치, 사용법 안내",
      ],
      [
        "견적 시 협의",
        "납품 후 지원",
        "실행 오류 모니터링",
        "사이트 구조 변경 등 오류 대응",
      ],
    ],
    faqs: [
      [
        "자동화할 수 있는 작업인지 모르겠어요",
        "지금 쓰는 파일과 작업 순서를 보내주시면 자동화할 수 있는 부분과 없는 부분을 먼저 나눠 안내드립니다",
      ],
      [
        "수집 대상 사이트가 바뀌면 어떻게 되나요?",
        "사이트 구조 변경에 대한 대응과 납품 후 지원 범위는 개별 견적에서 정합니다",
      ],
    ],
    ctaNote:
      "반복하는 작업 순서와 샘플 파일을 보내주시면 자동화 가능 여부부터 안내드립니다",
  },
  program: {
    intro:
      "관리자 페이지, 사내 업무 시스템, 데스크톱 프로그램, 상담 챗봇을 만듭니다 화면 설계부터 서버 배포까지 한 팀이 맡습니다",
    scopeNote: "기능 범위에 따라 일정과 견적을 함께 정합니다",
    scope: [
      "요구사항 정의서",
      "화면 설계 (와이어프레임)",
      "관리자 대시보드",
      "회원·권한 관리",
      "데이터베이스 설계",
      "외부 API 연동",
      "데스크톱 앱 (Electron)",
      "AI 챗봇 연동",
      "서버 배포·세팅",
      "소스 코드·운영 문서",
    ],
    factors: [
      "기능 수와 화면 수",
      "회원·권한 구조",
      "연동할 외부 API와 배포 환경",
    ],
    steps: [
      [
        "상담",
        "요구사항 정의",
        "기존 업무와 데이터 구조 정리",
        "기능 목록과 우선순위 확정",
      ],
      [
        "작업 전",
        "화면 설계·일정 공유",
        "와이어프레임 초안 생성",
        "화면 흐름과 권한 구조를 정해 공유",
      ],
      [
        "제작",
        "개발",
        "반복 코드와 테스트 코드 작성",
        "핵심 기능 개발, 진행 상황 시연",
      ],
      [
        "작업 후",
        "검수·배포",
        "자동 테스트와 보안 점검",
        "실데이터 테스트 후 서버 배포, 결과 공유",
      ],
      [
        "견적 시 협의",
        "납품 후 지원",
        "오류 로그 모니터링",
        "오류 수정, 운영 안정화",
      ],
    ],
    faqs: [
      [
        "개발 기간은 얼마나 걸리나요?",
        "자동화와 프로그램은 요구사항에 따라 기간이 달라집니다 기능 목록을 정리한 뒤 범위에 맞는 일정을 안내드립니다",
      ],
      [
        "소스 코드도 받을 수 있나요?",
        "네, 납품 시 소스 코드와 운영 문서를 함께 드립니다 서버 계정도 고객 명의로 세팅합니다",
      ],
    ],
    ctaNote:
      "지금 쓰는 엑셀이나 업무 순서를 알려주시면 필요한 기능부터 함께 정리합니다",
  },
};
const DAYS = {
  website: "범위별 협의",
  shop: "범위별 협의",
  automation: "범위별 협의",
  program: "범위별 협의",
};
const KEYS = Object.keys(SV);
const q = () => {
  try {
    const v = new URLSearchParams(location.search).get("s");
    return KEYS.includes(v) ? v : null;
  } catch (e) {
    return null;
  }
};
class Component extends GuideLogic {
  state = {
    ready: !!LAB_DATA,
    key: this.props.service || "website",
    open: 0,
    tk: 0,
    ws: 0,
    th: 0,
    cart: [0, 0, 0],
    pm: 0,
    row: 0,
    perm: [true, true, false, true, true, false, true, false, false],
    integ: [true, true, true, false],
  };
  componentDidMount() {
    if (!this.state.ready)
      this.iv = setInterval(() => {
        if (LAB_DATA) {
          clearInterval(this.iv);
          this.setState({ ready: true });
        }
      }, 50);
    this.tick = setInterval(
      () => this.setState((s) => ({ tk: s.tk + 1 })),
      1200,
    );
  }
  componentWillUnmount() {
    clearInterval(this.iv);
    clearInterval(this.tick);
  }
  pick(key) {
    this.setState({ key, open: 0 });
    location.assign(guideServiceHref("lab", key));
  }
  renderVals() {
    const D = LAB_DATA || { services: [], faqs: [] };
    const S = this.state,
      k = S.key,
      base = D.services.find((x) => x.key === k) || {},
      d = SV[k],
      tk = S.tk;
    const s = {
      ...base,
      ...d,
      steps: d.steps.map(([tag, title, ai, pro]) => ({ tag, title, ai, pro })),
    };
    const N = (a, f) => a.map((x, i) => ({ no: "0" + (i + 1), ...f(x, i) }));
    const step = tk % 7,
      st6 = tk % 6;
    const TH = [
      {
        bg: "#F4F3EF",
        ink: "#0D0D12",
        card: "#FFFFFF",
        line: "#DAD8D1",
        ac: "#6B4DFF",
        acFg: "#FFFFFF",
      },
      {
        bg: "#16161C",
        ink: "#F4F3EF",
        card: "#1C1C22",
        line: "#2E2E38",
        ac: "#A99BFF",
        acFg: "#0D0D12",
      },
      {
        bg: "#6B4DFF",
        ink: "#FFFFFF",
        card: "#7C61FF",
        line: "#A99BFF",
        ac: "#0D0D12",
        acFg: "#FFFFFF",
      },
    ];
    const th = TH[S.th];
    const PR = [
      ["데일리 키트", 18000, "#A99BFF"],
      ["선물 세트", 32000, "#6B4DFF"],
      ["정기배송 플랜", 24000, "#D9D6CE"],
    ];
    const cartN = S.cart.reduce((a, c) => a + c, 0),
      total = S.cart.reduce((a, c, i) => a + c * PR[i][1], 0);
    const W = [
      [
        "깔끔한 스타일",
        "정보를 빠르게 전달하는 사이트",
        [
          "회사 소개, 서비스 안내, 문의 전환이 목적일 때",
          "여백과 타이포 중심이라 수정과 운영이 쉽습니다",
        ],
      ],
      [
        "모션 스타일",
        "브랜드 인상을 남기는 사이트",
        [
          "첫인상과 브랜드 분위기가 중요할 때",
          "모바일에서도 끊기지 않는 범위에서만 모션을 씁니다",
        ],
      ],
    ];
    const MODS = [
      ["대시보드", "24"],
      ["회원·권한", "3"],
      ["외부 연동", "4"],
      ["알림·로그", ""],
    ];
    const TT = ["대시보드", "회원·권한 관리", "외부 연동", "알림·로그"];
    const ST = {
      접수: ["#23232B", "#B5B5BD"],
      진행: ["rgba(107,77,255,.3)", "#C9BFFF"],
      완료: ["#6B4DFF", "#FFFFFF"],
    };
    const CH = [14, 22, 18, 30, 26, 38, 34],
      ln = CH.map((v, i) => i * 50 + "," + (84 - v * 2)).join(" ");
    const sw = (on) => ({
      selected: on,
      bg: on ? "#6B4DFF" : "#3A3A46",
      x: on ? "19px" : "3px",
    });
    return {
      s,
      contactHref: "Lab 문의 v3.dc.html?s=" + k,
      isWeb: k === "website",
      isShop: k === "shop",
      isAuto: k === "automation",
      isProg: k === "program",
      facts: [
        ["평균 납기", DAYS[k]],
        ["진행 공유", "작업 전 · 작업 후"],
        ["납품 후 지원", "견적 시 협의"],
      ].map(([kk, v]) => ({ k: kk, v })),
      wstyles: W.map(([t, dd, pts], i) => ({
        no: "0" + (i + 1),
        t,
        d: dd,
        pts,
        bd: S.ws === i ? "#A99BFF" : "transparent",
        bg: S.ws === i ? "#16161C" : "transparent",
        pick: () => this.setState({ ws: i }),
      })),
      isClean: S.ws === 0,
      isMotion: S.ws === 1,
      webCheck: N(
        [
          ["모바일·PC 화면", "주요 기기에서 화면이 깨지지 않는지 확인합니다"],
          ["문의 연결", "문의 폼을 제출하면 알림이 오는지 실제로 테스트합니다"],
          [
            "검색 기본 설정",
            "메타 정보, 사이트맵, 구조화 데이터가 들어갔는지 확인합니다",
          ],
          ["수정 방법", "문구와 이미지를 직접 바꾸는 방법을 문서로 드립니다"],
        ],
        ([t, dd]) => ({ t, d: dd }),
      ),
      shopFeat: N(
        [
          ["상품 옵션·재고", "색상·사이즈 옵션과 품절 표시"],
          ["쿠폰·적립금", "할인과 적립 정책 설정"],
          ["PG 결제", "카드·간편결제 연동"],
          ["정기배송", "주기 선택과 자동 결제 (범위 협의)"],
          ["회원 등급", "등급별 혜택 구성"],
          ["배송 조회", "송장 연동과 주문 상태 안내"],
          ["GA4 이커머스", "구매 전환 기록"],
          ["광고 픽셀", "메타·네이버 전환 추적"],
        ],
        ([t, dd]) => ({ t, d: dd }),
      ),
      themes: ["밝은 톤", "어두운 톤", "포인트 컬러"].map((label, i) => ({
        label,
        bd: S.th === i ? "#A99BFF" : "#3A3A46",
        bg: S.th === i ? "#A99BFF" : "transparent",
        fg: S.th === i ? "#0D0D12" : "#F4F3EF",
        pick: () => this.setState({ th: i }),
      })),
      th,
      cartN,
      total: total.toLocaleString() + "원",
      products: PR.map(([t, p, tone], i) => ({
        t,
        price: p.toLocaleString() + "원",
        tone,
        n: S.cart[i] ? "(" + S.cart[i] + ")" : "",
        add: () =>
          this.setState((z) => {
            const c = z.cart.slice();
            c[i]++;
            return { cart: c };
          }),
      })),
      skin: N(
        [
          [
            "메인",
            "선택 템플릿의 기본 관리 기능과 배너 적용 범위를 확인합니다",
            2,
          ],
          ["상품 목록", "카테고리와 정렬, 필터를 구성합니다", 3],
          [
            "상품 상세",
            "옵션 선택과 구매 버튼이 한 화면에서 이어지게 만듭니다",
            2,
          ],
          [
            "주문서",
            "선택 템플릿의 주문서 화면을 확인합니다 PG 등 오픈설정은 제외합니다",
            1,
          ],
          [
            "마이페이지",
            "선택 템플릿의 기본 마이페이지 표시 범위를 확인합니다",
            1,
          ],
        ],
        ([t, dd, h]) => ({ t, d: dd, h1: h }),
      ),
      ex1: ["A-1021", "A-1022", "A-1023", "A-1024", "A-1025"].map((a, i) => {
        const done = i < step,
          cur = i === step;
        return {
          a,
          st: done ? "완료" : "대기",
          cb: done ? "#6B4DFF" : "#23232B",
          cf: done ? "#fff" : "#B5B5BD",
          b: done ? "KR-" + (3810 + i * 7) : "—",
          tf: done ? "#F4F3EF" : "#8A8A94",
          bg: cur ? "#1C1C22" : "transparent",
          bd: cur ? "#A99BFF" : "transparent",
        };
      }),
      ex2src: [0, 1, 2, 3, 4].map((i) => ({
        bd: i === tk % 5 ? "#A99BFF" : "#2E2E38",
      })),
      ex2dst: [
        ["상품 A", "12,900"],
        ["상품 B", "8,500"],
        ["상품 C", "21,000"],
        ["상품 D", "15,400"],
        ["상품 E", "9,800"],
      ].map(([a, b], i) => {
        const on = i < step;
        return { a, b, op: on ? 1 : 0, y: on ? "0px" : "6px" };
      }),
      ex3: ["주문 접수", "시트에 기록", "카카오톡 발송"].map((t, i) => {
        const on = i <= Math.min(st6, 2),
          cur = i === st6;
        return {
          t,
          bd: cur ? "#A99BFF" : "#2E2E38",
          bg: cur ? "#1C1C22" : "transparent",
          fg: on ? "#F4F3EF" : "#8A8A94",
          dot: on ? "#A99BFF" : "#3A3A46",
        };
      }),
      ex3op: st6 >= 3 ? 1 : 0,
      ex3y: st6 >= 3 ? "0px" : "8px",
      autoCheck: N(
        [
          [
            "규칙이 정해져 있는가",
            "누가 해도 같은 순서로 처리한다면 대부분 자동화할 수 있습니다",
          ],
          [
            "정기적으로 반복하는가",
            "매일, 매주 반복하는 작업일수록 자동화의 효과가 큽니다",
          ],
          [
            "입력 형식이 일정한가",
            "파일과 화면의 형식이 바뀌지 않아야 안정적으로 실행됩니다",
          ],
        ],
        ([t, dd]) => ({ t, d: dd }),
      ),
      mods: MODS.map(([t, badge], i) => {
        const on = S.pm === i;
        return {
          t,
          badge,
          bg: on ? "#1C1C22" : "transparent",
          fg: on ? "#fff" : "#B5B5BD",
          bd: on ? "#A99BFF" : "transparent",
          bd2: on ? "#A99BFF" : "#3A3A46",
          pick: () => this.setState({ pm: i }),
        };
      }),
      modTitle: TT[S.pm],
      isV0: S.pm === 0,
      isV1: S.pm === 1,
      isV2: S.pm === 2,
      isV3: S.pm === 3,
      kpis: [
        ["신규 문의", "24", "+4 어제 대비"],
        ["진행 중", "11", "3건 오늘 마감"],
        ["완료", "38", "이번 주"],
      ].map(([l, v, dd]) => ({ l, v, d: dd })),
      line: ln,
      area: ln + " 300,90 0,90",
      rows: [
        ["김○○", "홈페이지", "진행", "박 매니저"],
        ["이○○", "카카오톡", "접수", "—"],
        ["최○○", "전화", "완료", "박 매니저"],
        ["정○○", "홈페이지", "접수", "김 매니저"],
      ].map(([n, ch, st, who], i) => ({
        n,
        ch,
        st,
        who,
        sb: ST[st][0],
        sf: ST[st][1],
        bg: S.row === i ? "#1C1C22" : "transparent",
        pick: () => this.setState({ row: i }),
      })),
      perm: ["관리자", "매니저", "조회"].map((role, r) => ({
        role,
        cells: [0, 1, 2].map((c) => {
          const i = r * 3 + c,
            on = S.perm[i];
          return {
            label: role + " " + ["보기", "수정", "삭제"][c],
            ...sw(on),
            toggle: () =>
              this.setState((z) => {
                const p = z.perm.slice();
                p[i] = !p[i];
                return { perm: p };
              }),
          };
        }),
      })),
      integ: [
        ["카카오 알림톡", "문의 접수 시 자동 발송"],
        ["구글 시트", "상담 기록을 시트로 내보내기"],
        ["결제 PG", "결제 내역 동기화"],
        ["이메일", "접수 확인 메일 발송"],
      ].map(([t, dd], i) => {
        const on = S.integ[i];
        return {
          t,
          d: dd,
          ...sw(on),
          dot: on ? "#A99BFF" : "#3A3A46",
          st: on ? "연결됨" : "꺼짐",
          fg: on ? "#A99BFF" : "#8A8A94",
          toggle: () =>
            this.setState((z) => {
              const p = z.integ.slice();
              p[i] = !p[i];
              return { integ: p };
            }),
        };
      }),
      logs: [
        ["09:00:02", "INFO", "문의 3건이 접수되었습니다"],
        ["09:00:03", "INFO", "담당자에게 알림을 발송했습니다"],
        ["09:12:40", "INFO", "구글 시트로 내보내기 완료"],
        ["09:30:11", "WARN", "결제 PG 응답 지연 · 재시도 1회"],
        ["09:30:15", "INFO", "재시도 성공"],
      ].map(([ts, lv, t]) => ({
        ts,
        lv,
        t,
        c: lv === "WARN" ? "#F5A524" : "#A99BFF",
      })),
      progFlow: N(
        [
          [
            "요구사항 정의",
            "기존 업무와 데이터를 정리하고 기능 목록을 확정합니다",
          ],
          ["화면 설계", "와이어프레임으로 화면 흐름과 권한 구조를 정합니다"],
          ["개발", "핵심 기능부터 만들고 진행 상황을 시연합니다"],
          ["검수·배포", "실데이터로 테스트한 뒤 서버에 배포합니다"],
        ],
        ([t, dd]) => ({ t, d: dd }),
      ),
      tabs: D.services.map((x, i) => {
        const on = x.key === k;
        return {
          no: "0" + (i + 1),
          label: x.name,
          fg: on ? "#fff" : "#B5B5BD",
          nc: on ? "#A99BFF" : "#8A8A94",
          bd: on ? "#A99BFF" : "transparent",
          pick: () => this.pick(x.key),
        };
      }),
      faqs: [...d.faqs, ...D.faqs.slice(0, 4)].map(([q2, a2], i) => ({
        q: q2,
        a: a2,
        open: S.open === i,
        sign: S.open === i ? "−" : "+",
        toggle: () => this.setState({ open: S.open === i ? -1 : i }),
      })),
    };
  }

  render() {
    const values = adaptGuideValues(
      "lab-services",
      this.renderVals(),
      this.props,
    );
    const {
      area,
      autoCheck,
      cartN,
      contactHref,
      ex1,
      ex2dst,
      ex2src,
      ex3,
      ex3op,
      ex3y,
      facts,
      faqs,
      integ,
      isAuto,
      isClean,
      isMotion,
      isProg,
      isShop,
      isV0,
      isV1,
      isV2,
      isV3,
      isWeb,
      kpis,
      line,
      logs,
      modTitle,
      mods,
      perm,
      products,
      progFlow,
      rows,
      s,
      shopFeat,
      skin,
      tabs,
      th,
      themes,
      total,
      webCheck,
      wstyles,
    } = values;
    return (
      <div className="guide-page guide-lab-services">
        <GuideEffects />
        <div
          style={{
            background: "#0D0D12",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: "0",
          }}
        >
          <GuideCloud />
          <GuideNav division="lab" active="services" />
          <div style={{ borderBottom: "1px solid #2E2E38" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "0 clamp(20px,4vw,56px)",
                display: "flex",
                gap: "clamp(18px,2.6vw,40px)",
                flexWrap: "wrap",
              }}
            >
              <ServiceTabs division="lab" />
            </div>
          </div>
          {isWeb ? (
            <React.Fragment>
              <section style={{ borderBottom: "1px solid #2E2E38" }}>
                <div
                  style={{
                    maxWidth: "1440px",
                    margin: "0 auto",
                    padding: "clamp(48px,6vw,96px) clamp(20px,4vw,56px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(40px,5vw,72px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "28px",
                      maxWidth: "920px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "13px",
                        letterSpacing: ".12em",
                        color: "#A99BFF",
                      }}
                    >
                      {"01 · WEBSITE"}
                    </span>
                    <h1
                      style={{
                        margin: "0",
                        fontSize: "clamp(38px,5.6vw,88px)",
                        lineHeight: "1.12",
                        letterSpacing: "-.05em",
                        fontWeight: "800",
                      }}
                    >
                      <span style={{ display: "block", color: "#B5B5BD" }}>
                        {"시안이 아닌"}
                      </span>
                      <span style={{ display: "block" }}>
                        {"배포된 사이트로 납품합니다"}
                      </span>
                    </h1>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "clamp(17px,1.4vw,19px)",
                        lineHeight: "1.8",
                        color: "#B5B5BD",
                        maxWidth: "50ch",
                      }}
                    >
                      {s.intro}
                    </p>
                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      <GuideLink
                        href={contactHref}
                        style={{
                          background: "#6B4DFF",
                          color: "#fff",
                          padding: "18px 30px",
                          fontWeight: "600",
                        }}
                        className="gh-59b0af27"
                        context="lab"
                      >
                        {"견적 문의"}
                      </GuideLink>
                      <GuideLink
                        href="#process"
                        style={{
                          border: "1.5px solid #F4F3EF",
                          color: "#F4F3EF",
                          padding: "16.5px 28px",
                          fontWeight: "600",
                        }}
                        className="gh-21e28941"
                        context="lab"
                      >
                        {"진행 과정 보기"}
                      </GuideLink>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "32px clamp(32px,4vw,64px)",
                      alignItems: "stretch",
                    }}
                  >
                    <div
                      style={{
                        flex: "1 1 320px",
                        minWidth: "0",
                        display: "flex",
                        flexDirection: "column",
                        borderTop: "1.5px solid #F4F3EF",
                      }}
                    >
                      {(wstyles || []).map((w, __index6) => (
                        <React.Fragment key={__index6}>
                          <button
                            onClick={w.pick}
                            style={{
                              all: "unset",
                              cursor: "pointer",
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                              padding: "26px 0 26px 20px",
                              borderBottom: "1px solid #2E2E38",
                              borderLeft: "3px solid " + w.bd,
                              background: w.bg,
                              transition: "all .25s",
                            }}
                            type="button"
                          >
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: "12px",
                                letterSpacing: ".1em",
                                color: "#A99BFF",
                              }}
                            >
                              {"STYLE "}
                              {w.no}
                            </span>
                            <strong
                              style={{
                                fontSize: "clamp(22px,2vw,28px)",
                                letterSpacing: "-.03em",
                              }}
                            >
                              {w.t}
                            </strong>
                            <span
                              style={{
                                fontSize: "16px",
                                lineHeight: "1.7",
                                color: "#B5B5BD",
                              }}
                            >
                              {w.d}
                            </span>
                            <ul
                              style={{
                                margin: "4px 0 0",
                                padding: "0",
                                listStyle: "none",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                              }}
                            >
                              {(w.pts || []).map((p, __index9) => (
                                <React.Fragment key={__index9}>
                                  <li
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      fontSize: "15px",
                                      lineHeight: "1.6",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#A99BFF",
                                        fontFamily:
                                          "'JetBrains Mono',monospace",
                                      }}
                                    >
                                      {"+"}
                                    </span>
                                    {p}
                                  </li>
                                </React.Fragment>
                              ))}
                            </ul>
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                    <div
                      style={{
                        flex: "1.6 1 480px",
                        minWidth: "0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          background: "#0D0D12",
                          border: "1px solid #2E2E38",
                          boxShadow: "0 30px 70px rgba(0,0,0,.45)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "10px 12px",
                            borderBottom: "1px solid #2E2E38",
                          }}
                        >
                          <span
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              background: "#3A3A46",
                              display: "block",
                            }}
                          ></span>
                          <span
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              background: "#3A3A46",
                              display: "block",
                            }}
                          ></span>
                          <span
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              background: "#3A3A46",
                              display: "block",
                            }}
                          ></span>
                          <span
                            style={{
                              marginLeft: "10px",
                              flex: "1",
                              background: "#1C1C22",
                              padding: "4px 10px",
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: "11.5px",
                              color: "#B5B5BD",
                            }}
                          >
                            {"https://example.com"}
                          </span>
                        </div>
                        <div
                          style={{
                            aspectRatio: "16/10",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {isClean ? (
                            <React.Fragment>
                              <div
                                style={{
                                  position: "absolute",
                                  inset: "0",
                                  background: "#F4F3EF",
                                  color: "#0D0D12",
                                  display: "flex",
                                  flexDirection: "column",
                                  padding: "4% 6%",
                                  boxSizing: "border-box",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    fontSize: "clamp(9px,1.1vw,13px)",
                                  }}
                                >
                                  <strong style={{ letterSpacing: ".06em" }}>
                                    {"STUDIO"}
                                  </strong>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "clamp(10px,2vw,28px)",
                                    }}
                                  >
                                    <span>{"소개"}</span>
                                    <span>{"작업"}</span>
                                    <span
                                      style={{
                                        borderBottom: "1px solid #0D0D12",
                                      }}
                                    >
                                      {"문의"}
                                    </span>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    flex: "1",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    gap: "clamp(8px,1.4vw,18px)",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "clamp(8px,.9vw,11px)",
                                      letterSpacing: ".14em",
                                      color: "#6E6E78",
                                    }}
                                  >
                                    {"BRAND SITE"}
                                  </span>
                                  <strong
                                    style={{
                                      fontSize: "clamp(20px,3.6vw,50px)",
                                      lineHeight: "1.15",
                                      letterSpacing: "-.045em",
                                      fontWeight: "800",
                                    }}
                                  >
                                    {"조용하고 또렷한"}
                                    <br />
                                    {"브랜드 사이트"}
                                  </strong>
                                  <span
                                    style={{
                                      fontSize: "clamp(9px,1.05vw,13px)",
                                      color: "#3A3A42",
                                      maxWidth: "30ch",
                                      lineHeight: "1.6",
                                    }}
                                  >
                                    {
                                      "필요한 정보만 남기고 여백으로 읽는 순서를 만듭니다"
                                    }
                                  </span>
                                  <span
                                    style={{
                                      width: "fit-content",
                                      background: "#0D0D12",
                                      color: "#fff",
                                      padding:
                                        "clamp(6px,.9vw,11px) clamp(12px,1.6vw,22px)",
                                      fontSize: "clamp(9px,1vw,13px)",
                                    }}
                                  >
                                    {"문의하기"}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3,1fr)",
                                    gap: "clamp(8px,1.4vw,18px)",
                                  }}
                                >
                                  <div
                                    style={{
                                      borderTop: "1px solid #0D0D12",
                                      paddingTop: "8px",
                                      fontSize: "clamp(8px,.95vw,12px)",
                                    }}
                                  >
                                    {"서비스 소개"}
                                  </div>
                                  <div
                                    style={{
                                      borderTop: "1px solid #0D0D12",
                                      paddingTop: "8px",
                                      fontSize: "clamp(8px,.95vw,12px)",
                                    }}
                                  >
                                    {"진행 방식"}
                                  </div>
                                  <div
                                    style={{
                                      borderTop: "1px solid #0D0D12",
                                      paddingTop: "8px",
                                      fontSize: "clamp(8px,.95vw,12px)",
                                    }}
                                  >
                                    {"자주 묻는 질문"}
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          ) : null}
                          {isMotion ? (
                            <React.Fragment>
                              <div
                                style={{
                                  position: "absolute",
                                  inset: "0",
                                  background: "#101018",
                                  color: "#F4F3EF",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    position: "absolute",
                                    left: "0",
                                    right: "0",
                                    top: "0",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "4% 6%",
                                    fontSize: "clamp(9px,1.1vw,13px)",
                                    zIndex: "3",
                                  }}
                                >
                                  <strong style={{ letterSpacing: ".06em" }}>
                                    {"MOTION LAB"}
                                  </strong>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "clamp(10px,2vw,28px)",
                                    }}
                                  >
                                    <span>{"Work"}</span>
                                    <span>{"About"}</span>
                                    <span>{"Contact"}</span>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    position: "absolute",
                                    right: "9%",
                                    top: "16%",
                                    width: "40%",
                                    aspectRatio: "1",
                                    background: "#6B4DFF",
                                    animation:
                                      "labBlob 7s ease-in-out infinite,labFloat 5s ease-in-out infinite",
                                  }}
                                ></div>
                                <div
                                  style={{
                                    position: "absolute",
                                    right: "3%",
                                    top: "8%",
                                    width: "52%",
                                    aspectRatio: "1",
                                    border: "1.5px dashed #A99BFF",
                                    borderRadius: "50%",
                                    animation: "labSpin 22s linear infinite",
                                  }}
                                ></div>
                                <div
                                  style={{
                                    position: "absolute",
                                    left: "6%",
                                    top: "30%",
                                    zIndex: "3",
                                    fontFamily: "Unbounded,sans-serif",
                                    fontWeight: "800",
                                    fontSize: "clamp(22px,4.6vw,64px)",
                                    lineHeight: "1.05",
                                    letterSpacing: "-.04em",
                                  }}
                                >
                                  {"MOVE"}
                                  <br />
                                  {"WITH"}
                                  <br />
                                  {"IDEA"}
                                </div>
                                <div
                                  style={{
                                    position: "absolute",
                                    left: "0",
                                    right: "0",
                                    bottom: "0",
                                    borderTop: "1px solid #3A3A46",
                                    borderBottom: "1px solid #3A3A46",
                                    overflow: "hidden",
                                    background: "#101018",
                                    zIndex: "3",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      width: "max-content",
                                      animation: "labMarq 16s linear infinite",
                                      fontFamily: "Unbounded,sans-serif",
                                      fontSize: "clamp(10px,1.4vw,18px)",
                                      letterSpacing: ".08em",
                                      padding: "clamp(8px,1.2vw,14px) 0",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    <span style={{ paddingRight: "2em" }}>
                                      {
                                        "DESIGN · MOTION · CODE · LAUNCH · DESIGN · MOTION · CODE · LAUNCH ·"
                                      }
                                    </span>
                                    <span style={{ paddingRight: "2em" }}>
                                      {
                                        "DESIGN · MOTION · CODE · LAUNCH · DESIGN · MOTION · CODE · LAUNCH ·"
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          ) : null}
                        </div>
                      </div>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: "12px",
                          color: "#B5B5BD",
                        }}
                      >
                        {
                          "스타일을 보여주기 위한 예시 화면입니다 실제 작업물이 아닙니다"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </section>
              <section style={{ borderBottom: "1px solid #2E2E38" }}>
                <div
                  style={{
                    maxWidth: "1440px",
                    margin: "0 auto",
                    padding: "clamp(72px,9vw,128px) clamp(20px,4vw,56px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(32px,4vw,56px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "12px",
                        letterSpacing: ".14em",
                        color: "#A99BFF",
                      }}
                    >
                      {"DELIVERY CHECK"}
                    </span>
                    <h2
                      style={{
                        margin: "0",
                        fontSize: "clamp(30px,4vw,56px)",
                        letterSpacing: "-.045em",
                        fontWeight: "800",
                        lineHeight: "1.15",
                      }}
                    >
                      {"납품 전 이 네 가지를 확인합니다"}
                    </h2>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit,minmax(min(100%,240px),1fr))",
                      gap: "0",
                      borderTop: "1.5px solid #F4F3EF",
                    }}
                  >
                    {(webCheck || []).map((c, __index5) => (
                      <React.Fragment key={__index5}>
                        <div
                          style={{
                            padding: "26px 24px 30px 0",
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                            borderBottom: "1px solid #2E2E38",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Unbounded,sans-serif",
                              fontSize: "32px",
                              fontWeight: "600",
                              color: "#A99BFF",
                            }}
                          >
                            {c.no}
                          </span>
                          <strong
                            style={{
                              fontSize: "20px",
                              letterSpacing: "-.02em",
                            }}
                          >
                            {c.t}
                          </strong>
                          <span
                            style={{
                              fontSize: "15.5px",
                              lineHeight: "1.7",
                              color: "#B5B5BD",
                            }}
                          >
                            {c.d}
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </section>
            </React.Fragment>
          ) : null}
          {isShop ? (
            <React.Fragment>
              <section style={{ borderBottom: "1px solid #2E2E38" }}>
                <div
                  style={{
                    maxWidth: "1440px",
                    margin: "0 auto",
                    padding: "clamp(48px,6vw,96px) clamp(20px,4vw,56px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(40px,5vw,72px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: "28px",
                      maxWidth: "920px",
                      margin: "0 auto",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "13px",
                        letterSpacing: ".12em",
                        color: "#A99BFF",
                      }}
                    >
                      {"02 · SHOPPING MALL"}
                    </span>
                    <h1
                      style={{
                        margin: "0",
                        fontSize: "clamp(38px,5.6vw,88px)",
                        lineHeight: "1.12",
                        letterSpacing: "-.05em",
                        fontWeight: "800",
                      }}
                    >
                      <span style={{ display: "block", color: "#B5B5BD" }}>
                        {"디자인 복사부터"}
                      </span>
                      <span style={{ display: "block" }}>
                        {"기본 이미지 세팅까지"}
                      </span>
                    </h1>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "clamp(17px,1.4vw,19px)",
                        lineHeight: "1.8",
                        color: "#B5B5BD",
                        maxWidth: "50ch",
                      }}
                    >
                      {s.intro}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      <GuideLink
                        href={contactHref}
                        style={{
                          background: "#6B4DFF",
                          color: "#fff",
                          padding: "18px 30px",
                          fontWeight: "600",
                        }}
                        className="gh-59b0af27"
                        context="lab"
                      >
                        {"견적 문의"}
                      </GuideLink>
                      <GuideLink
                        href="#process"
                        style={{
                          border: "1.5px solid #F4F3EF",
                          color: "#F4F3EF",
                          padding: "16.5px 28px",
                          fontWeight: "600",
                        }}
                        className="gh-21e28941"
                        context="lab"
                      >
                        {"진행 과정 보기"}
                      </GuideLink>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "32px clamp(32px,4vw,64px)",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flex: "1 1 300px",
                        minWidth: "0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: "12px",
                          letterSpacing: ".14em",
                          color: "#A99BFF",
                        }}
                      >
                        {"FEATURES"}
                      </span>
                      <h2
                        style={{
                          margin: "0",
                          fontSize: "clamp(26px,3vw,40px)",
                          letterSpacing: "-.04em",
                          fontWeight: "800",
                          lineHeight: "1.2",
                        }}
                      >
                        {"추가 기능 예시 · 범위별 상담"}
                      </h2>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          borderTop: "1.5px solid #F4F3EF",
                        }}
                      >
                        {(shopFeat || []).map((f, __index7) => (
                          <React.Fragment key={__index7}>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "32px minmax(0,1fr)",
                                gap: "12px",
                                padding: "15px 0",
                                borderBottom: "1px solid #2E2E38",
                                alignItems: "baseline",
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: "12px",
                                  color: "#A99BFF",
                                }}
                              >
                                {f.no}
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "3px",
                                }}
                              >
                                <strong
                                  style={{
                                    fontSize: "16.5px",
                                    letterSpacing: "-.02em",
                                  }}
                                >
                                  {f.t}
                                </strong>
                                <span
                                  style={{
                                    fontSize: "14px",
                                    lineHeight: "1.6",
                                    color: "#B5B5BD",
                                  }}
                                >
                                  {f.d}
                                </span>
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: "1.7 1 480px",
                        minWidth: "0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: "12px",
                            color: "#B5B5BD",
                            marginRight: "6px",
                          }}
                        >
                          {"DESIGN"}
                        </span>
                        {(themes || []).map((t, __index7) => (
                          <React.Fragment key={__index7}>
                            <button
                              onClick={t.pick}
                              style={{
                                cursor: "pointer",
                                padding: "9px 16px",
                                fontSize: "14px",
                                borderRadius: "999px",
                                border: "1px solid " + t.bd,
                                background: t.bg,
                                color: t.fg,
                              }}
                              type="button"
                            >
                              {t.label}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                      <div
                        style={{
                          background: "#0D0D12",
                          border: "1px solid #2E2E38",
                          boxShadow: "0 30px 70px rgba(0,0,0,.45)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "10px 12px",
                            borderBottom: "1px solid #2E2E38",
                          }}
                        >
                          <span
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              background: "#3A3A46",
                              display: "block",
                            }}
                          ></span>
                          <span
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              background: "#3A3A46",
                              display: "block",
                            }}
                          ></span>
                          <span
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              background: "#3A3A46",
                              display: "block",
                            }}
                          ></span>
                          <span
                            style={{
                              marginLeft: "10px",
                              flex: "1",
                              background: "#1C1C22",
                              padding: "4px 10px",
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: "11.5px",
                              color: "#B5B5BD",
                            }}
                          >
                            {"https://shop.example.com"}
                          </span>
                        </div>
                        <div
                          style={{
                            background: th.bg,
                            color: th.ink,
                            padding: "clamp(14px,2.4vw,28px)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "clamp(14px,2vw,24px)",
                            transition: "background .4s,color .4s",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <strong
                              style={{
                                letterSpacing: ".08em",
                                fontSize: "15px",
                              }}
                            >
                              {"SHOP"}
                            </strong>
                            <span
                              style={{
                                fontSize: "13.5px",
                                border: "1px solid " + th.line,
                                padding: "6px 12px",
                              }}
                            >
                              {"장바구니 "}
                              <strong>{cartN}</strong>
                            </span>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit,minmax(min(100%,150px),1fr))",
                              gap: "12px",
                            }}
                          >
                            {(products || []).map((p, __index9) => (
                              <React.Fragment key={__index9}>
                                <div
                                  style={{
                                    background: th.card,
                                    border: "1px solid " + th.line,
                                    padding: "12px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                    transition: "background .4s",
                                  }}
                                >
                                  <div
                                    style={{
                                      aspectRatio: "1",
                                      background: p.tone,
                                    }}
                                  ></div>
                                  <strong style={{ fontSize: "15px" }}>
                                    {p.t}
                                  </strong>
                                  <span
                                    style={{
                                      fontSize: "13.5px",
                                      opacity: ".8",
                                    }}
                                  >
                                    {p.price}
                                  </span>
                                  <button
                                    onClick={p.add}
                                    style={{
                                      cursor: "pointer",
                                      border: "none",
                                      background: th.ac,
                                      color: th.acFg,
                                      padding: "10px",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                    }}
                                    type="button"
                                  >
                                    {"담기 "}
                                    {p.n}
                                  </button>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "12px",
                              flexWrap: "wrap",
                              borderTop: "1px solid " + th.line,
                              paddingTop: "14px",
                              fontSize: "14px",
                            }}
                          >
                            <span>
                              {"합계 "}
                              <strong style={{ fontSize: "17px" }}>
                                {total}
                              </strong>
                            </span>
                            <span
                              style={{
                                background: th.ac,
                                color: th.acFg,
                                padding: "10px 22px",
                                fontWeight: "600",
                              }}
                            >
                              {"결제하기"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: "12px",
                          color: "#B5B5BD",
                        }}
                      >
                        {
                          "기능·금액 예시입니다 PG·배송 등 오픈설정은 복사·풀 세팅 상품에 포함되지 않습니다"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </section>
              <section style={{ borderBottom: "1px solid #2E2E38" }}>
                <div
                  style={{
                    maxWidth: "1440px",
                    margin: "0 auto",
                    padding: "clamp(72px,9vw,128px) clamp(20px,4vw,56px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(32px,4vw,56px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: "12px",
                          letterSpacing: ".14em",
                          color: "#A99BFF",
                        }}
                      >
                        {"CAFE24 SKIN"}
                      </span>
                      <h2
                        style={{
                          margin: "0",
                          fontSize: "clamp(30px,4vw,56px)",
                          letterSpacing: "-.045em",
                          fontWeight: "800",
                          lineHeight: "1.15",
                        }}
                      >
                        {"카페24 스킨 구조에 맞춰"}
                        <br />
                        {"화면별로 만듭니다"}
                      </h2>
                    </div>
                    <span
                      style={{
                        fontSize: "16px",
                        lineHeight: "1.7",
                        color: "#B5B5BD",
                        maxWidth: "34ch",
                      }}
                    >
                      {
                        "선택한 템플릿의 기본 화면과 관리자에서 변경할 수 있는 범위를 확인합니다"
                      }
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit,minmax(min(100%,210px),1fr))",
                      gap: "12px",
                    }}
                  >
                    {(skin || []).map((k, __index5) => (
                      <React.Fragment key={__index5}>
                        <div
                          style={{
                            background: "#16161C",
                            border: "1px solid #2E2E38",
                            padding: "18px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                          }}
                        >
                          <div
                            style={{
                              background: "#0D0D12",
                              border: "1px solid #2E2E38",
                              aspectRatio: "4/5",
                              padding: "12px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                              boxSizing: "border-box",
                            }}
                          >
                            <span
                              style={{
                                height: "10px",
                                background: "#3A3A46",
                                display: "block",
                                width: "40%",
                              }}
                            ></span>
                            <span
                              style={{
                                flex: k.h1,
                                background: "#23232B",
                                display: "block",
                                border: "1px dashed #A99BFF",
                              }}
                            ></span>
                            <span
                              style={{
                                height: "8px",
                                background: "#3A3A46",
                                display: "block",
                                width: "70%",
                              }}
                            ></span>
                            <span
                              style={{
                                height: "8px",
                                background: "#3A3A46",
                                display: "block",
                                width: "55%",
                              }}
                            ></span>
                            <span
                              style={{
                                height: "22px",
                                background: "#6B4DFF",
                                display: "block",
                                width: "45%",
                              }}
                            ></span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px",
                            }}
                          >
                            <strong
                              style={{
                                fontSize: "17px",
                                letterSpacing: "-.02em",
                              }}
                            >
                              {k.t}
                            </strong>
                            <span
                              style={{
                                fontSize: "14px",
                                lineHeight: "1.65",
                                color: "#B5B5BD",
                              }}
                            >
                              {k.d}
                            </span>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </section>
            </React.Fragment>
          ) : null}
          {isAuto ? (
            <React.Fragment>
              <section style={{ borderBottom: "1px solid #2E2E38" }}>
                <div
                  style={{
                    maxWidth: "1440px",
                    margin: "0 auto",
                    padding: "clamp(48px,6vw,96px) clamp(20px,4vw,56px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(40px,5vw,72px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "28px",
                      maxWidth: "920px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "13px",
                        letterSpacing: ".12em",
                        color: "#A99BFF",
                      }}
                    >
                      {"03 · AUTOMATION"}
                    </span>
                    <h1
                      style={{
                        margin: "0",
                        fontSize: "clamp(38px,5.6vw,88px)",
                        lineHeight: "1.12",
                        letterSpacing: "-.05em",
                        fontWeight: "800",
                      }}
                    >
                      <span style={{ display: "block", color: "#B5B5BD" }}>
                        {"매일 반복하는 작업을"}
                      </span>
                      <span style={{ display: "block" }}>
                        {"코드로 넘깁니다"}
                      </span>
                    </h1>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "clamp(17px,1.4vw,19px)",
                        lineHeight: "1.8",
                        color: "#B5B5BD",
                        maxWidth: "50ch",
                      }}
                    >
                      {s.intro}
                    </p>
                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      <GuideLink
                        href={contactHref}
                        style={{
                          background: "#6B4DFF",
                          color: "#fff",
                          padding: "18px 30px",
                          fontWeight: "600",
                        }}
                        className="gh-59b0af27"
                        context="lab"
                      >
                        {"견적 문의"}
                      </GuideLink>
                      <GuideLink
                        href="#process"
                        style={{
                          border: "1.5px solid #F4F3EF",
                          color: "#F4F3EF",
                          padding: "16.5px 28px",
                          fontWeight: "600",
                        }}
                        className="gh-21e28941"
                        context="lab"
                      >
                        {"진행 과정 보기"}
                      </GuideLink>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "12px",
                        letterSpacing: ".14em",
                        color: "#A99BFF",
                      }}
                    >
                      {"EXAMPLES"}
                    </span>
                    <h2
                      style={{
                        margin: "0",
                        fontSize: "clamp(26px,3vw,40px)",
                        letterSpacing: "-.04em",
                        fontWeight: "800",
                        lineHeight: "1.2",
                      }}
                    >
                      {"이런 작업을 자동화합니다"}
                    </h2>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit,minmax(min(100%,340px),1fr))",
                      gap: "16px",
                      marginTop: "calc(clamp(40px,5vw,72px) * -0.4)",
                    }}
                  >
                    <div
                      style={{
                        background: "#16161C",
                        border: "1px solid #2E2E38",
                        padding: "22px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: "11px",
                            letterSpacing: ".12em",
                            color: "#A99BFF",
                          }}
                        >
                          {"EXAMPLE 01"}
                        </span>
                        <strong
                          style={{ fontSize: "21px", letterSpacing: "-.03em" }}
                        >
                          {"엑셀 정리"}
                        </strong>
                      </div>
                      <div
                        style={{
                          background: "#0D0D12",
                          border: "1px solid #2E2E38",
                          padding: "10px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          fontSize: "13px",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1.1fr .8fr 1.1fr",
                            gap: "8px",
                            padding: "6px 8px",
                            color: "#8A8A94",
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: "11px",
                          }}
                        >
                          <span>{"주문번호"}</span>
                          <span>{"상태"}</span>
                          <span>{"송장"}</span>
                        </div>
                        {(ex1 || []).map((r, __index7) => (
                          <React.Fragment key={__index7}>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1.1fr .8fr 1.1fr",
                                gap: "8px",
                                padding: "8px",
                                background: r.bg,
                                borderLeft: "2px solid " + r.bd,
                                alignItems: "center",
                                transition: "all .4s",
                              }}
                            >
                              <span>{r.a}</span>
                              <span
                                style={{
                                  width: "fit-content",
                                  padding: "2px 8px",
                                  fontSize: "11.5px",
                                  background: r.cb,
                                  color: r.cf,
                                }}
                              >
                                {r.st}
                              </span>
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: "11.5px",
                                  color: r.tf,
                                }}
                              >
                                {r.b}
                              </span>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                      <span
                        style={{
                          fontSize: "14.5px",
                          lineHeight: "1.7",
                          color: "#B5B5BD",
                        }}
                      >
                        {
                          "주문 엑셀을 열어 송장을 붙여 넣던 작업을 규칙대로 자동 정리합니다"
                        }
                      </span>
                    </div>
                    <div
                      style={{
                        background: "#16161C",
                        border: "1px solid #2E2E38",
                        padding: "22px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: "11px",
                            letterSpacing: ".12em",
                            color: "#A99BFF",
                          }}
                        >
                          {"EXAMPLE 02"}
                        </span>
                        <strong
                          style={{ fontSize: "21px", letterSpacing: "-.03em" }}
                        >
                          {"웹 데이터 수집"}
                        </strong>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "minmax(0,1fr) 28px minmax(0,1fr)",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            background: "#0D0D12",
                            border: "1px solid #2E2E38",
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              height: "8px",
                              background: "#3A3A46",
                              display: "block",
                              width: "50%",
                            }}
                          ></span>
                          {(ex2src || []).map((r, __index8) => (
                            <React.Fragment key={__index8}>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "6px",
                                  alignItems: "center",
                                  padding: "5px",
                                  border: "1px solid " + r.bd,
                                  transition: "border-color .4s",
                                }}
                              >
                                <span
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    background: "#3A3A46",
                                    display: "block",
                                    flex: "none",
                                  }}
                                ></span>
                                <span
                                  style={{
                                    height: "6px",
                                    background: "#3A3A46",
                                    display: "block",
                                    flex: "1",
                                  }}
                                ></span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                        <span
                          style={{
                            color: "#A99BFF",
                            textAlign: "center",
                            fontSize: "18px",
                          }}
                        >
                          {"›"}
                        </span>
                        <div
                          style={{
                            background: "#0D0D12",
                            border: "1px solid #2E2E38",
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            fontSize: "12.5px",
                          }}
                        >
                          <span
                            style={{
                              color: "#8A8A94",
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: "11px",
                            }}
                          >
                            {"수집 결과"}
                          </span>
                          {(ex2dst || []).map((r, __index8) => (
                            <React.Fragment key={__index8}>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr auto",
                                  gap: "6px",
                                  padding: "6px 8px",
                                  background: "#16161C",
                                  opacity: r.op,
                                  transform: "translateY(" + r.y + ")",
                                  transition: "all .5s",
                                }}
                              >
                                <span>{r.a}</span>
                                <span
                                  style={{
                                    fontFamily: "'JetBrains Mono',monospace",
                                    color: "#A99BFF",
                                  }}
                                >
                                  {r.b}
                                </span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "14.5px",
                          lineHeight: "1.7",
                          color: "#B5B5BD",
                        }}
                      >
                        {
                          "여러 사이트의 정보를 복사하던 작업을 정해진 시각에 수집해 시트에 쌓습니다"
                        }
                      </span>
                    </div>
                    <div
                      style={{
                        background: "#16161C",
                        border: "1px solid #2E2E38",
                        padding: "22px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: "11px",
                            letterSpacing: ".12em",
                            color: "#A99BFF",
                          }}
                        >
                          {"EXAMPLE 03"}
                        </span>
                        <strong
                          style={{ fontSize: "21px", letterSpacing: "-.03em" }}
                        >
                          {"알림 발송"}
                        </strong>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {(ex3 || []).map((n, __index7) => (
                          <React.Fragment key={__index7}>
                            <div
                              style={{
                                display: "flex",
                                gap: "12px",
                                alignItems: "center",
                                padding: "11px 14px",
                                border: "1px solid " + n.bd,
                                background: n.bg,
                                color: n.fg,
                                fontSize: "14.5px",
                                transition: "all .4s",
                              }}
                            >
                              <span
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  background: n.dot,
                                  display: "block",
                                  flex: "none",
                                }}
                              ></span>
                              {n.t}
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                      <div
                        style={{
                          minHeight: "74px",
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            background: "#FEE500",
                            color: "#191919",
                            padding: "10px 14px",
                            fontSize: "14px",
                            lineHeight: "1.5",
                            maxWidth: "85%",
                            opacity: ex3op,
                            transform: "translateY(" + ex3y + ")",
                            transition: "all .5s",
                          }}
                        >
                          <strong>{"새 주문이 접수되었습니다"}</strong>
                          <br />
                          {"주문번호 A-1024 · 송장 등록 완료"}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "14.5px",
                          lineHeight: "1.7",
                          color: "#B5B5BD",
                        }}
                      >
                        {
                          "주문이 들어올 때마다 사람이 보내던 알림을 자동으로 발송합니다"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </section>
              <section style={{ borderBottom: "1px solid #2E2E38" }}>
                <div
                  style={{
                    maxWidth: "1440px",
                    margin: "0 auto",
                    padding: "clamp(72px,9vw,128px) clamp(20px,4vw,56px)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "40px clamp(40px,6vw,96px)",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      flex: "1 1 320px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "12px",
                        letterSpacing: ".14em",
                        color: "#A99BFF",
                      }}
                    >
                      {"CHECK"}
                    </span>
                    <h2
                      style={{
                        margin: "0",
                        fontSize: "clamp(30px,4vw,56px)",
                        letterSpacing: "-.045em",
                        fontWeight: "800",
                        lineHeight: "1.15",
                      }}
                    >
                      {"자동화할 수 있는 작업인지"}
                      <br />
                      {"먼저 확인합니다"}
                    </h2>
                  </div>
                  <div
                    style={{
                      flex: "1.4 1 460px",
                      display: "flex",
                      flexDirection: "column",
                      borderTop: "1.5px solid #F4F3EF",
                    }}
                  >
                    {(autoCheck || []).map((c, __index5) => (
                      <React.Fragment key={__index5}>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "44px minmax(0,1fr)",
                            gap: "16px",
                            padding: "26px 0",
                            borderBottom: "1px solid #2E2E38",
                            alignItems: "baseline",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: "13px",
                              color: "#A99BFF",
                            }}
                          >
                            {c.no}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px",
                            }}
                          >
                            <strong
                              style={{
                                fontSize: "21px",
                                letterSpacing: "-.025em",
                              }}
                            >
                              {c.t}
                            </strong>
                            <span
                              style={{
                                fontSize: "15.5px",
                                lineHeight: "1.7",
                                color: "#B5B5BD",
                              }}
                            >
                              {c.d}
                            </span>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </section>
            </React.Fragment>
          ) : null}
          {isProg ? (
            <React.Fragment>
              <section style={{ borderBottom: "1px solid #2E2E38" }}>
                <div
                  style={{
                    maxWidth: "1440px",
                    margin: "0 auto",
                    padding: "clamp(48px,6vw,96px) clamp(20px,4vw,56px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(40px,5vw,72px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "28px",
                      maxWidth: "920px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "13px",
                        letterSpacing: ".12em",
                        color: "#A99BFF",
                      }}
                    >
                      {"04 · PROGRAM"}
                    </span>
                    <h1
                      style={{
                        margin: "0",
                        fontSize: "clamp(38px,5.6vw,88px)",
                        lineHeight: "1.12",
                        letterSpacing: "-.05em",
                        fontWeight: "800",
                      }}
                    >
                      <span style={{ display: "block", color: "#B5B5BD" }}>
                        {"우리 업무에 맞춘 도구를"}
                      </span>
                      <span style={{ display: "block" }}>
                        {"처음부터 끝까지 만듭니다"}
                      </span>
                    </h1>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "clamp(17px,1.4vw,19px)",
                        lineHeight: "1.8",
                        color: "#B5B5BD",
                        maxWidth: "50ch",
                      }}
                    >
                      {s.intro}
                    </p>
                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      <GuideLink
                        href={contactHref}
                        style={{
                          background: "#6B4DFF",
                          color: "#fff",
                          padding: "18px 30px",
                          fontWeight: "600",
                        }}
                        className="gh-59b0af27"
                        context="lab"
                      >
                        {"견적 문의"}
                      </GuideLink>
                      <GuideLink
                        href="#process"
                        style={{
                          border: "1.5px solid #F4F3EF",
                          color: "#F4F3EF",
                          padding: "16.5px 28px",
                          fontWeight: "600",
                        }}
                        className="gh-21e28941"
                        context="lab"
                      >
                        {"진행 과정 보기"}
                      </GuideLink>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        background: "#0D0D12",
                        border: "1px solid #2E2E38",
                        boxShadow: "0 30px 70px rgba(0,0,0,.45)",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "12px 16px",
                          borderBottom: "1px solid #2E2E38",
                        }}
                      >
                        <span style={{ display: "flex", gap: "6px" }}>
                          <span
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              background: "#3A3A46",
                              display: "block",
                            }}
                          ></span>
                          <span
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              background: "#3A3A46",
                              display: "block",
                            }}
                          ></span>
                          <span
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              background: "#3A3A46",
                              display: "block",
                            }}
                          ></span>
                        </span>
                        <strong
                          style={{ fontSize: "14px", letterSpacing: "-.01em" }}
                        >
                          {"관리자 · 상담 현황"}
                        </strong>
                        <span
                          style={{
                            marginLeft: "auto",
                            background: "#16161C",
                            border: "1px solid #2E2E38",
                            padding: "6px 12px",
                            fontSize: "12.5px",
                            color: "#8A8A94",
                            minWidth: "clamp(90px,16vw,190px)",
                          }}
                        >
                          {"검색"}
                        </span>
                        <span
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "50%",
                            background: "#6B4DFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {"A"}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "clamp(132px,19%,210px) minmax(0,1fr)",
                          minHeight: "440px",
                        }}
                      >
                        <div
                          style={{
                            borderRight: "1px solid #2E2E38",
                            padding: "16px 10px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            background: "#101015",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: "10.5px",
                              letterSpacing: ".14em",
                              color: "#8A8A94",
                              padding: "0 10px 10px",
                            }}
                          >
                            {"MENU"}
                          </span>
                          {(mods || []).map((m, __index8) => (
                            <React.Fragment key={__index8}>
                              <button
                                onClick={m.pick}
                                style={{
                                  all: "unset",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  padding: "11px 10px",
                                  fontSize: "14px",
                                  background: m.bg,
                                  color: m.fg,
                                  borderLeft: "2px solid " + m.bd,
                                  transition: "all .25s",
                                }}
                                className="gh-e6d00278"
                                type="button"
                              >
                                <span
                                  style={{
                                    width: "14px",
                                    height: "14px",
                                    border: "1.5px solid " + m.bd2,
                                    display: "block",
                                    flex: "none",
                                  }}
                                ></span>
                                <span style={{ flex: "1" }}>{m.t}</span>
                                <span
                                  style={{
                                    fontFamily: "'JetBrains Mono',monospace",
                                    fontSize: "11px",
                                    color: "#8A8A94",
                                  }}
                                >
                                  {m.badge}
                                </span>
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                        <div
                          style={{
                            padding: "clamp(16px,2vw,26px)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "18px",
                            minWidth: "0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "baseline",
                              gap: "12px",
                              flexWrap: "wrap",
                            }}
                          >
                            <strong
                              style={{
                                fontSize: "clamp(18px,1.6vw,22px)",
                                letterSpacing: "-.02em",
                              }}
                            >
                              {modTitle}
                            </strong>
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: "11px",
                                color: "#8A8A94",
                                border: "1px solid #2E2E38",
                                padding: "3px 8px",
                              }}
                            >
                              {"예시 데이터"}
                            </span>
                          </div>
                          {isV0 ? (
                            <React.Fragment>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "repeat(auto-fit,minmax(min(100%,150px),1fr))",
                                  gap: "12px",
                                }}
                              >
                                {(kpis || []).map((k, __index10) => (
                                  <React.Fragment key={__index10}>
                                    <div
                                      style={{
                                        background: "#16161C",
                                        border: "1px solid #2E2E38",
                                        padding: "16px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "13px",
                                          color: "#B5B5BD",
                                        }}
                                      >
                                        {k.l}
                                      </span>
                                      <span
                                        style={{
                                          fontFamily: "Unbounded,sans-serif",
                                          fontSize: "clamp(24px,2.4vw,32px)",
                                          fontWeight: "600",
                                          letterSpacing: "-.02em",
                                        }}
                                      >
                                        {k.v}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: "12px",
                                          color: "#A99BFF",
                                          fontFamily:
                                            "'JetBrains Mono',monospace",
                                        }}
                                      >
                                        {k.d}
                                      </span>
                                    </div>
                                  </React.Fragment>
                                ))}
                              </div>
                              <div
                                style={{
                                  background: "#16161C",
                                  border: "1px solid #2E2E38",
                                  padding: "16px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "8px",
                                }}
                              >
                                <span
                                  style={{ fontSize: "13px", color: "#B5B5BD" }}
                                >
                                  {"주간 문의 추이"}
                                </span>
                                <svg
                                  preserveAspectRatio="none"
                                  style={{
                                    width: "100%",
                                    height: "110px",
                                    display: "block",
                                  }}
                                  viewBox="0 0 300 90"
                                >
                                  <polygon
                                    fill="rgba(107,77,255,.25)"
                                    points={area}
                                  ></polygon>
                                  <polyline
                                    fill="none"
                                    points={line}
                                    stroke="#A99BFF"
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                  ></polyline>
                                </svg>
                              </div>
                              <div
                                style={{
                                  background: "#16161C",
                                  border: "1px solid #2E2E38",
                                  display: "flex",
                                  flexDirection: "column",
                                  fontSize: "13.5px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "1.2fr .9fr .8fr .8fr",
                                    gap: "10px",
                                    padding: "11px 14px",
                                    color: "#8A8A94",
                                    fontFamily: "'JetBrains Mono',monospace",
                                    fontSize: "11px",
                                    borderBottom: "1px solid #2E2E38",
                                  }}
                                >
                                  <span>{"문의자"}</span>
                                  <span>{"채널"}</span>
                                  <span>{"상태"}</span>
                                  <span>{"담당"}</span>
                                </div>
                                {(rows || []).map((r, __index10) => (
                                  <React.Fragment key={__index10}>
                                    <button
                                      onClick={r.pick}
                                      style={{
                                        all: "unset",
                                        cursor: "pointer",
                                        display: "grid",
                                        gridTemplateColumns:
                                          "1.2fr .9fr .8fr .8fr",
                                        gap: "10px",
                                        padding: "12px 14px",
                                        borderBottom: "1px solid #23232B",
                                        alignItems: "center",
                                        background: r.bg,
                                        transition: "background .25s",
                                      }}
                                      className="gh-e6d00278"
                                      type="button"
                                    >
                                      <span>{r.n}</span>
                                      <span style={{ color: "#B5B5BD" }}>
                                        {r.ch}
                                      </span>
                                      <span
                                        style={{
                                          width: "fit-content",
                                          padding: "2px 9px",
                                          fontSize: "12px",
                                          background: r.sb,
                                          color: r.sf,
                                        }}
                                      >
                                        {r.st}
                                      </span>
                                      <span style={{ color: "#B5B5BD" }}>
                                        {r.who}
                                      </span>
                                    </button>
                                  </React.Fragment>
                                ))}
                              </div>
                            </React.Fragment>
                          ) : null}
                          {isV1 ? (
                            <React.Fragment>
                              <div
                                style={{
                                  background: "#16161C",
                                  border: "1px solid #2E2E38",
                                  display: "flex",
                                  flexDirection: "column",
                                  fontSize: "14px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "1.2fr repeat(3,1fr)",
                                    gap: "10px",
                                    padding: "12px 16px",
                                    color: "#8A8A94",
                                    fontFamily: "'JetBrains Mono',monospace",
                                    fontSize: "11px",
                                    borderBottom: "1px solid #2E2E38",
                                  }}
                                >
                                  <span>{"역할"}</span>
                                  <span>{"보기"}</span>
                                  <span>{"수정"}</span>
                                  <span>{"삭제"}</span>
                                </div>
                                {(perm || []).map((r, __index10) => (
                                  <React.Fragment key={__index10}>
                                    <div
                                      style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                          "1.2fr repeat(3,1fr)",
                                        gap: "10px",
                                        padding: "14px 16px",
                                        borderBottom: "1px solid #23232B",
                                        alignItems: "center",
                                      }}
                                    >
                                      <strong style={{ fontWeight: "600" }}>
                                        {r.role}
                                      </strong>
                                      {(r.cells || []).map((c, __index12) => (
                                        <React.Fragment key={__index12}>
                                          <button
                                            onClick={c.toggle}
                                            style={{
                                              all: "unset",
                                              cursor: "pointer",
                                              width: "38px",
                                              height: "22px",
                                              background: c.bg,
                                              borderRadius: "11px",
                                              position: "relative",
                                              transition: "background .25s",
                                            }}
                                            type="button"
                                            aria-label={c.label}
                                            aria-pressed={c.selected}
                                          >
                                            <span
                                              style={{
                                                position: "absolute",
                                                top: "3px",
                                                left: c.x,
                                                width: "16px",
                                                height: "16px",
                                                borderRadius: "50%",
                                                background: "#fff",
                                                transition: "left .25s",
                                                display: "block",
                                              }}
                                            ></span>
                                          </button>
                                        </React.Fragment>
                                      ))}
                                    </div>
                                  </React.Fragment>
                                ))}
                              </div>
                              <span
                                style={{
                                  fontSize: "14px",
                                  lineHeight: "1.7",
                                  color: "#B5B5BD",
                                }}
                              >
                                {
                                  "역할별로 볼 수 있는 화면과 수정·삭제 권한을 나눕니다 스위치를 눌러 보세요"
                                }
                              </span>
                            </React.Fragment>
                          ) : null}
                          {isV2 ? (
                            <React.Fragment>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                }}
                              >
                                {(integ || []).map((i, __index10) => (
                                  <React.Fragment key={__index10}>
                                    <div
                                      style={{
                                        background: "#16161C",
                                        border: "1px solid #2E2E38",
                                        padding: "16px 18px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          width: "10px",
                                          height: "10px",
                                          borderRadius: "50%",
                                          background: i.dot,
                                          display: "block",
                                          flex: "none",
                                        }}
                                      ></span>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "3px",
                                          flex: "1",
                                          minWidth: "0",
                                        }}
                                      >
                                        <strong style={{ fontSize: "15.5px" }}>
                                          {i.t}
                                        </strong>
                                        <span
                                          style={{
                                            fontSize: "13.5px",
                                            color: "#B5B5BD",
                                          }}
                                        >
                                          {i.d}
                                        </span>
                                      </div>
                                      <span
                                        style={{
                                          fontFamily:
                                            "'JetBrains Mono',monospace",
                                          fontSize: "11.5px",
                                          color: i.fg,
                                        }}
                                      >
                                        {i.st}
                                      </span>
                                      <button
                                        onClick={i.toggle}
                                        style={{
                                          all: "unset",
                                          cursor: "pointer",
                                          width: "38px",
                                          height: "22px",
                                          background: i.bg,
                                          borderRadius: "11px",
                                          position: "relative",
                                          transition: "background .25s",
                                        }}
                                        type="button"
                                        aria-label={i.t + " 연결"}
                                        aria-pressed={i.selected}
                                      >
                                        <span
                                          style={{
                                            position: "absolute",
                                            top: "3px",
                                            left: i.x,
                                            width: "16px",
                                            height: "16px",
                                            borderRadius: "50%",
                                            background: "#fff",
                                            transition: "left .25s",
                                            display: "block",
                                          }}
                                        ></span>
                                      </button>
                                    </div>
                                  </React.Fragment>
                                ))}
                              </div>
                            </React.Fragment>
                          ) : null}
                          {isV3 ? (
                            <React.Fragment>
                              <div
                                style={{
                                  background: "#16161C",
                                  border: "1px solid #2E2E38",
                                  padding: "16px 18px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: "13px",
                                }}
                              >
                                {(logs || []).map((l, __index10) => (
                                  <React.Fragment key={__index10}>
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "16px",
                                        alignItems: "baseline",
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: "#8A8A94",
                                          flex: "none",
                                        }}
                                      >
                                        {l.ts}
                                      </span>
                                      <span style={{ color: l.c }}>{l.lv}</span>
                                      <span
                                        style={{
                                          color: "#F4F3EF",
                                          fontFamily:
                                            "var(--font-body),sans-serif",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {l.t}
                                      </span>
                                    </div>
                                  </React.Fragment>
                                ))}
                              </div>
                            </React.Fragment>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "12px",
                        color: "#B5B5BD",
                      }}
                    >
                      {
                        "메뉴와 항목을 눌러 보세요 화면 구성을 보여주기 위한 예시입니다"
                      }
                    </span>
                  </div>
                </div>
              </section>
              <section style={{ borderBottom: "1px solid #2E2E38" }}>
                <div
                  style={{
                    maxWidth: "1440px",
                    margin: "0 auto",
                    padding: "clamp(72px,9vw,128px) clamp(20px,4vw,56px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(32px,4vw,56px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "12px",
                        letterSpacing: ".14em",
                        color: "#A99BFF",
                      }}
                    >
                      {"FLOW"}
                    </span>
                    <h2
                      style={{
                        margin: "0",
                        fontSize: "clamp(30px,4vw,56px)",
                        letterSpacing: "-.045em",
                        fontWeight: "800",
                        lineHeight: "1.15",
                      }}
                    >
                      {"요구사항에서 시작해 순서대로 만듭니다"}
                    </h2>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit,minmax(min(100%,230px),1fr))",
                      gap: "12px",
                    }}
                  >
                    {(progFlow || []).map((c, __index5) => (
                      <React.Fragment key={__index5}>
                        <div
                          style={{
                            background: "#16161C",
                            border: "1px solid #2E2E38",
                            padding: "26px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Unbounded,sans-serif",
                              fontSize: "30px",
                              fontWeight: "600",
                              color: "#A99BFF",
                            }}
                          >
                            {c.no}
                          </span>
                          <strong
                            style={{
                              fontSize: "20px",
                              letterSpacing: "-.02em",
                            }}
                          >
                            {c.t}
                          </strong>
                          <span
                            style={{
                              fontSize: "15px",
                              lineHeight: "1.7",
                              color: "#B5B5BD",
                            }}
                          >
                            {c.d}
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </section>
            </React.Fragment>
          ) : null}
          <section style={{ borderBottom: "1px solid #2E2E38" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(28px,3vw,40px) clamp(20px,4vw,56px)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,260px),1fr))",
                gap: "20px 40px",
              }}
            >
              {(facts || []).map((p, __index3) => (
                <React.Fragment key={__index3}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      fontFamily: "'JetBrains Mono',monospace",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#B5B5BD" }}>
                      {p.k}
                    </span>
                    <strong style={{ fontSize: "18px" }}>{p.v}</strong>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </section>
          <section>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexWrap: "wrap",
                gap: "56px clamp(40px,6vw,96px)",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  flex: "1 1 320px",
                  position: "sticky",
                  top: "120px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: "12px",
                    letterSpacing: ".14em",
                    color: "#A99BFF",
                  }}
                >
                  {"DELIVERABLES"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4vw,56px)",
                    letterSpacing: "-.045em",
                    fontWeight: "800",
                    lineHeight: "1.15",
                  }}
                >
                  {"납품물과 인수인계"}
                </h2>
                <p
                  style={{
                    margin: "0",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    color: "#B5B5BD",
                    maxWidth: "34ch",
                  }}
                >
                  {s.scopeNote}
                </p>
              </div>
              <div
                style={{
                  flex: "1.6 1 520px",
                  minWidth: "0",
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1.5px solid #F4F3EF",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(90px,140px) minmax(0,1fr)",
                    gap: "8px 24px",
                    padding: "24px 0",
                    borderBottom: "1px solid #2E2E38",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: "12px",
                      letterSpacing: ".1em",
                      color: "#A99BFF",
                      paddingTop: "4px",
                    }}
                  >
                    {"SCOPE"}
                  </span>
                  <ul
                    style={{
                      margin: "0",
                      padding: "0",
                      listStyle: "none",
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit,minmax(min(100%,230px),1fr))",
                      gap: "12px 28px",
                    }}
                  >
                    {(s.scope || []).map((x, __index6) => (
                      <React.Fragment key={__index6}>
                        <li
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "baseline",
                            fontSize: "16px",
                            lineHeight: "1.55",
                            fontWeight: "500",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              background: "#A99BFF",
                              display: "block",
                              flex: "none",
                              transform: "translateY(-3px)",
                            }}
                          ></span>
                          {x}
                        </li>
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(90px,140px) minmax(0,1fr)",
                    gap: "8px 24px",
                    padding: "24px 0",
                    borderBottom: "1px solid #2E2E38",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: "12px",
                      letterSpacing: ".1em",
                      color: "#A99BFF",
                      paddingTop: "6px",
                    }}
                  >
                    {"STACK"}
                  </span>
                  <div
                    style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                  >
                    {(s.stack || []).map((t, __index6) => (
                      <React.Fragment key={__index6}>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: "13px",
                            padding: "6px 11px",
                            background: "#23232B",
                            color: "#F4F3EF",
                          }}
                        >
                          {t}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(90px,140px) minmax(0,1fr)",
                    gap: "8px 24px",
                    padding: "24px 0",
                    borderBottom: "1px solid #2E2E38",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: "12px",
                      letterSpacing: ".1em",
                      color: "#A99BFF",
                      paddingTop: "4px",
                    }}
                  >
                    {"HANDOVER"}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "18px",
                        lineHeight: "1.5",
                        letterSpacing: "-.02em",
                      }}
                    >
                      {"고객 대행 건은 모두 인수인계합니다"}
                    </strong>
                    <span
                      style={{
                        fontSize: "15.5px",
                        lineHeight: "1.75",
                        color: "#B5B5BD",
                      }}
                    >
                      {
                        "소스 코드, 관리자 계정, 서버 계정을 고객 명의로 넘겨드립니다 납품 후 지원은 고객과 합의한 접근 방식으로 진행합니다"
                      }
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(90px,140px) minmax(0,1fr)",
                    gap: "8px 24px",
                    padding: "24px 0",
                    borderBottom: "1px solid #2E2E38",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: "12px",
                      letterSpacing: ".1em",
                      color: "#A99BFF",
                      paddingTop: "4px",
                    }}
                  >
                    {"QUOTE"}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <GuideOffer service={s.key} />
                    <span
                      style={{
                        fontSize: "15.5px",
                        lineHeight: "1.75",
                        color: "#B5B5BD",
                      }}
                    >
                      {"아래 항목이 견적에 영향을 줍니다"}
                    </span>
                    <ul
                      style={{
                        margin: "0",
                        padding: "0",
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {(s.factors || []).map((f, __index7) => (
                        <React.Fragment key={__index7}>
                          <li
                            style={{
                              fontSize: "15.5px",
                              lineHeight: "1.65",
                              display: "flex",
                              gap: "10px",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono',monospace",
                                color: "#A99BFF",
                              }}
                            >
                              {"+"}
                            </span>
                            {f}
                          </li>
                        </React.Fragment>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="process" style={{ borderTop: "1px solid #2E2E38" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexWrap: "wrap",
                gap: "56px clamp(40px,6vw,96px)",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  flex: "1 1 320px",
                  position: "sticky",
                  top: "120px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: "12px",
                    letterSpacing: ".14em",
                    color: "#A99BFF",
                  }}
                >
                  {"PROCESS"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4vw,56px)",
                    letterSpacing: "-.045em",
                    fontWeight: "800",
                    lineHeight: "1.15",
                  }}
                >
                  {"진행 과정"}
                </h2>
                <p
                  style={{
                    margin: "0",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    color: "#B5B5BD",
                    maxWidth: "32ch",
                  }}
                >
                  {
                    "작업 전에 범위와 일정을 공유하고, 작업이 끝나면 결과를 공유한 뒤 검수합니다"
                  }
                </p>
              </div>
              <ol
                data-cloud="nodes"
                style={{
                  flex: "1.6 1 520px",
                  margin: "0",
                  padding: "0",
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1.5px solid #F4F3EF",
                }}
              >
                {(s.steps || []).map((p, __index4) => (
                  <React.Fragment key={__index4}>
                    <li
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "clamp(84px,9vw,124px) minmax(0,1fr)",
                        gap: "8px 24px",
                        alignItems: "baseline",
                        padding: "26px 0",
                        borderBottom: "1px solid #2E2E38",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: "clamp(14px,1.3vw,17px)",
                          fontWeight: "500",
                          color: "#A99BFF",
                          width: "fit-content",
                          height: "fit-content",
                          padding: "8px 12px",
                        }}
                      >
                        <span data-node="" style={{ display: "block" }}>
                          {p.tag}
                        </span>
                      </span>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        <strong
                          style={{
                            fontSize: "clamp(20px,1.8vw,24px)",
                            letterSpacing: "-.03em",
                            lineHeight: "1.35",
                          }}
                        >
                          {p.title}
                        </strong>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit,minmax(min(100%,220px),1fr))",
                            gap: "12px 28px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: "11px",
                                letterSpacing: ".12em",
                                color: "#A99BFF",
                              }}
                            >
                              {"AI"}
                            </span>
                            <span
                              style={{
                                fontSize: "15px",
                                lineHeight: "1.65",
                                color: "#B5B5BD",
                              }}
                            >
                              {p.ai}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: "11px",
                                letterSpacing: ".12em",
                              }}
                            >
                              {"DEVELOPER"}
                            </span>
                            <span
                              style={{
                                fontSize: "15px",
                                lineHeight: "1.65",
                                fontWeight: "500",
                              }}
                            >
                              {p.pro}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  </React.Fragment>
                ))}
              </ol>
            </div>
          </section>
          <section style={{ borderTop: "1px solid #2E2E38" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,420px),1fr))",
                gap: "48px clamp(40px,6vw,96px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: "12px",
                    letterSpacing: ".14em",
                    color: "#A99BFF",
                  }}
                >
                  {"FAQ"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4vw,56px)",
                    letterSpacing: "-.045em",
                    fontWeight: "800",
                    lineHeight: "1.15",
                  }}
                >
                  {"자주 묻는 질문"}
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1.5px solid #F4F3EF",
                }}
              >
                {(faqs || []).map((f, __index4) => (
                  <React.Fragment key={__index4}>
                    <div style={{ borderBottom: "1px solid #2E2E38" }}>
                      <button
                        onClick={f.toggle}
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "26px 0",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "20px",
                          fontSize: "18px",
                          lineHeight: "1.5",
                          fontWeight: "600",
                        }}
                        type="button"
                        aria-expanded={f.open}
                      >
                        {f.q}
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontWeight: "400",
                            color: "#A99BFF",
                            flex: "none",
                          }}
                        >
                          {f.sign}
                        </span>
                      </button>
                      {f.open ? (
                        <React.Fragment>
                          <p
                            style={{
                              margin: "0 0 28px",
                              color: "#B5B5BD",
                              fontSize: "16px",
                              lineHeight: "1.85",
                              maxWidth: "56ch",
                            }}
                          >
                            {f.a}
                          </p>
                        </React.Fragment>
                      ) : null}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section style={{ borderTop: "1px solid #2E2E38" }}>
            <div
              style={{
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "clamp(28px,4vw,48px)",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "12px",
                  letterSpacing: ".14em",
                  color: "#A99BFF",
                }}
              >
                {"CONTACT"}
              </span>
              <h2
                style={{
                  margin: "0",
                  fontSize: "clamp(36px,5.6vw,84px)",
                  letterSpacing: "-.05em",
                  fontWeight: "800",
                  lineHeight: "1.14",
                }}
              >
                {s.name}
                {","}
                <br />
                {"견적부터 받아보세요"}
              </h2>
              <GuideLink
                data-cloud="outline"
                href={contactHref}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#16161C",
                  color: "#F4F3EF",
                  padding: "clamp(18px,2vw,26px) clamp(20px,2.4vw,32px)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  textAlign: "left",
                  fontSize: "clamp(16px,1.5vw,20px)",
                }}
                className="gh-bbc019b2"
                context="lab"
              >
                <span style={{ color: "#B5B5BD" }}>{s.ctaNote}</span>
                <span
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: "#6B4DFF",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                    fontSize: "22px",
                  }}
                >
                  {"→"}
                </span>
              </GuideLink>
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "12px",
                  color: "#B5B5BD",
                }}
              >
                {"범위 확인 후 견적 · 납기·지원 범위는 견적 시 합의"}
              </span>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Component;
