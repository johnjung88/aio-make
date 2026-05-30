import type { Metadata } from "next";
import Link from "next/link";
import { MagazineEyebrow } from "@/components/magazine/magazine-eyebrow";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/team",
    title: isKo ? "팀원 소개 — AIO" : "Team — AIO",
    description: isKo
      ? "AIO에이전시의 조직과 분야별 전문가 팀 — 의사결정부터 제작·검수·운영까지"
      : "AIO Agency org and team — from decisions to craft, QA, and care.",
  });
}

/* ─── 데이터 ─── */
const CEO = {
  role: "AIO CEO",
  name: "이진우",
};

const DIRECTORS = [
  {
    dept: "Development",
    title: "개발 이사",
    name: "박성민",
    exp: "풀스택 7년",
    note: "Next.js · Python · Supabase — 외부 코드 AIO화 · MVP 개발 총괄",
  },
  {
    dept: "Design",
    title: "디자인 이사",
    name: "김지수",
    exp: "UI/UX 6년",
    note: "Figma · Adobe — 전체 디자인 품질 · 핸드오프 기준 수립",
  },
  {
    dept: "Video",
    title: "영상 이사",
    name: "최민준",
    exp: "연출 8년",
    note: "브랜드 필름 · 광고 · 숏폼 — 영상 조직 총괄",
  },
  {
    dept: "Marketing",
    title: "마케팅 이사",
    name: "이서연",
    exp: "디지털 마케팅 5년",
    note: "유입 · 브랜드 · 콘텐츠 · 분석 — 운영대행 총괄",
  },
];

type Member = {
  mark: string;
  role: string;
  name: string;
  exp: string;
  body: string;
  career: string;
  tags: string[];
};
type Subteam = { name: string; members: Member[] };
type Team = { cat: string; eyebrow: string; subteams: Subteam[] };

const TEAMS: Team[] = [
  {
    cat: "개발",
    eyebrow: "Team · Development",
    subteams: [
      {
        name: "웹사이트 조직",
        members: [
          {
            mark: "리",
            role: "Planner",
            name: "기획 · 한리아",
            exp: "기획 5년",
            body: "만들기 전에 구조를 맞춰 수정 비용을 줄입니다",
            career: "IA · 사이트맵 · URL 설계 — 요구사항 정리부터 제작 구조 수립까지",
            tags: ["IA", "사이트맵", "요구사항"],
          },
          {
            mark: "연",
            role: "Copywriter",
            name: "카피 · 박서연",
            exp: "카피 5년",
            body: "검색에 걸리고 읽으면 행동하게 만드는 문장을 씁니다",
            career: "히어로 카피 · SEO · CTA — 섹션별 전환 카피부터 OG 문구까지",
            tags: ["카피", "SEO", "CTA"],
          },
          {
            mark: "도",
            role: "Web Designer",
            name: "디자인 · 오도윤",
            exp: "UI/UX 5년",
            body: "처음 온 방문자도 헤매지 않는 화면을 만듭니다",
            career: "반응형 · UI/UX · 디자인 시스템 — 어떤 기기에서도 보기 좋고 쓰기 편한 화면",
            tags: ["Figma", "UI/UX", "반응형"],
          },
          {
            mark: "세",
            role: "Developer",
            name: "개발 · 정세호",
            exp: "풀스택 5년",
            body: "오픈 당일부터 실제로 동작하는 사이트를 납품합니다",
            career: "Next.js · Supabase · Vercel — 느리지 않고 다운되지 않는 구조로 구현",
            tags: ["Next.js", "TypeScript", "Supabase"],
          },
          {
            mark: "현",
            role: "QA · 검수",
            name: "검수 · 신현아",
            exp: "검수 5년",
            body: "고객이 발견하기 전에 문제를 모두 잡아냅니다",
            career: "반응형 · 링크 · 폼 · OG 전수 검수 — 배포 전 롤백 포인트까지 점검",
            tags: ["QA", "크로스브라우저", "OG"],
          },
          {
            mark: "은",
            role: "Ops · 납품운영",
            name: "운영 · 강지은",
            exp: "운영 5년",
            body: "납품 후에도 문제가 생기면 바로 대응합니다",
            career: "배포 · 도메인 · A/S — 납품 패키지부터 1개월 무상 유지보수까지",
            tags: ["배포", "도메인", "A/S"],
          },
        ],
      },
      {
        name: "쇼핑몰 조직",
        members: [
          {
            mark: "준",
            role: "E-commerce Planner",
            name: "기획 · 윤준서",
            exp: "쇼핑몰 기획 5년",
            body: "장바구니 담은 상품이 결제까지 이어지도록 설계합니다",
            career: "상품 구조 · 결제 흐름 · 카테고리 설계 — 이탈 없는 구매 경험을 기획",
            tags: ["쇼핑몰", "UX", "결제흐름"],
          },
          {
            mark: "수",
            role: "Copywriter",
            name: "카피 · 임수아",
            exp: "카피 5년",
            body: "상품이 팔리게 만드는 카피와 배너 문구를 씁니다",
            career: "상품 카피 · 배너 · CTA — 브랜드 슬로건부터 이벤트 프로모션 문구까지",
            tags: ["상품카피", "배너", "CTA"],
          },
          {
            mark: "미",
            role: "Designer",
            name: "디자인 · 박미소",
            exp: "디자인 5년",
            body: "스킨·배너·상품 이미지를 브랜드에 맞게 제작합니다",
            career: "쇼핑몰 스킨 · 배너 · 상세 이미지 — 모바일/PC 비주얼 최적화",
            tags: ["Cafe24스킨", "배너", "상품이미지"],
          },
          {
            mark: "태",
            role: "E-commerce Dev",
            name: "개발 · 임태양",
            exp: "쇼핑몰 개발 5년",
            body: "상품이 많아도 빠르고 안정적인 쇼핑몰을 만듭니다",
            career: "Cafe24 · Shopify · 커스텀 — 재고·주문·결제 자동 연결 구조 구현",
            tags: ["Cafe24", "Shopify", "PG연동"],
          },
          {
            mark: "민",
            role: "QA · Ops",
            name: "검수·운영 · 배지민",
            exp: "검수 5년",
            body: "결제 오류 하나 없이 오픈할 수 있도록 점검합니다",
            career: "결제·재고·배송 전수 테스트 — 운영 중 문제 즉시 처리",
            tags: ["결제테스트", "재고", "운영"],
          },
        ],
      },
      {
        name: "자동화 조직",
        members: [
          {
            mark: "훈",
            role: "Automation Dev",
            name: "자동화 · 송지훈",
            exp: "자동화 5년",
            body: "매일 반복하는 업무를 시스템이 대신하게 만들어드립니다",
            career: "Python · n8n · API 연동 — 알림·보고서·데이터 자동화 설계·구현",
            tags: ["Python", "n8n", "API"],
          },
          {
            mark: "재",
            role: "Ops · 요구분석",
            name: "분석 · 이재원",
            exp: "운영분석 5년",
            body: "고객 업무를 단계별로 정리해 자동화 범위를 정확히 설계합니다",
            career: "현행 업무 절차 분석 · 예외 케이스 정리 · 사용법 문서 작성",
            tags: ["요구분석", "프로세스", "문서화"],
          },
          {
            mark: "아",
            role: "QA · 검수",
            name: "검수 · 최민아",
            exp: "검수 5년",
            body: "반복 실행해도 오류 없이 동작하는지 검증합니다",
            career: "반복 실행·예외 케이스 검증 · 보안 위험 검토 — PASS/WARN/FAIL 보고",
            tags: ["QA", "보안검토", "검수"],
          },
        ],
      },
    ],
  },
  {
    cat: "디자인",
    eyebrow: "Team · Design",
    subteams: [
      {
        name: "상세페이지 조직",
        members: [
          {
            mark: "설",
            role: "Analyst",
            name: "분석기획 · 김설아",
            exp: "기획 5년",
            body: "상품의 강점을 분석해 전환으로 이어지는 구조를 설계합니다",
            career: "시장 분석 · 경쟁사 벤치마킹 · 기획 — 전환 구조·섹션 흐름 설계",
            tags: ["시장분석", "기획", "구조설계"],
          },
          {
            mark: "유",
            role: "Detail Designer",
            name: "디자인 · 나유나",
            exp: "상세 디자인 5년",
            body: "스크롤할수록 사고 싶어지는 상세페이지를 만듭니다",
            career: "전환율 최적화 · 스크롤 스토리텔링 — 시선→정보→증거→CTA 흐름 설계",
            tags: ["상세페이지", "전환", "스토리텔링"],
          },
          {
            mark: "문",
            role: "Copywriter",
            name: "카피 · 문준",
            exp: "카피 5년",
            body: "제품의 가치를 한 줄로 전달해 구매를 결정짓게 합니다",
            career: "설득 카피 · SEO — 히어로 헤드라인부터 FAQ 문구까지",
            tags: ["카피", "SEO", "설득"],
          },
          {
            mark: "나",
            role: "QA · Ops",
            name: "검수·운영 · 이하나",
            exp: "검수 5년",
            body: "납품 전 전수 검수하고, 고객이 바로 쓸 수 있게 정리합니다",
            career: "링크·이미지·폰트·레이아웃 전수 검수 — 납품 패키지 준비·수정 대응",
            tags: ["QA", "크로스브라우저", "납품"],
          },
        ],
      },
      {
        name: "PPT·IR 조직",
        members: [
          {
            mark: "기",
            role: "Analyst",
            name: "분석기획 · 박기원",
            exp: "기획 5년",
            body: "발표 목적과 청중을 분석해 슬라이드 구조를 정확히 설계합니다",
            career: "발표 목적·청중·메시지 분석 — 슬라이드 구조·목차·흐름 기획",
            tags: ["구조분석", "메시지", "기획"],
          },
          {
            mark: "원",
            role: "PPT Designer",
            name: "디자인 · 류지원",
            exp: "IR 덱 5년",
            body: "투자자나 고객사가 Yes라고 말하게 만드는 덱을 만듭니다",
            career: "IR 덱 · 제안서 · 공모전 — 복잡한 내용을 한 슬라이드에 명확히 정리",
            tags: ["IR", "제안서", "PPT"],
          },
          {
            mark: "진",
            role: "Copywriter",
            name: "카피 · 오유진",
            exp: "카피 5년",
            body: "숫자와 논리를 설득력 있는 문장으로 바꿉니다",
            career: "IR 카피 · 제안 내러티브 — 핵심 메시지부터 발표 스크립트까지",
            tags: ["IR카피", "내러티브", "스크립트"],
          },
          {
            mark: "호",
            role: "QA · Ops",
            name: "검수·운영 · 한재호",
            exp: "검수 5년",
            body: "납품 전 전수 검수하고 파일 포맷·호환성까지 챙깁니다",
            career: "슬라이드·폰트·링크 전수 검수 — PPT/PDF/Keynote 포맷 호환 점검",
            tags: ["QA", "포맷호환", "납품"],
          },
        ],
      },
    ],
  },
  {
    cat: "영상",
    eyebrow: "Team · Video",
    subteams: [
      {
        name: "브랜드 영상 조직",
        members: [
          {
            mark: "민",
            role: "Director",
            name: "감독 · 조민재",
            exp: "연출 7년",
            body: "영상 한 편으로 브랜드가 왜 다른지 설명합니다",
            career: "브랜드 필름 · 광고 · 인터뷰 — 보는 사람이 신뢰하게 만드는 연출",
            tags: ["연출", "브랜드필름", "광고"],
          },
          {
            mark: "우",
            role: "Editor",
            name: "편집 · 윤정우",
            exp: "편집 5년",
            body: "끝까지 보게 만드는 편집으로 메시지를 완성합니다",
            career: "컬러그레이딩 · 사운드 믹싱 — 브랜드 톤에 맞는 색감과 분위기로 마무리",
            tags: ["편집", "컬러그레이딩", "DaVinci"],
          },
        ],
      },
      {
        name: "SNS·숏폼 조직",
        members: [
          {
            mark: "은",
            role: "Shorts Specialist",
            name: "숏폼 · 이서은",
            exp: "숏폼 5년",
            body: "스크롤을 멈추게 만드는 첫 1초를 설계합니다",
            career: "릴스 · 쇼츠 · 틱톡 — 트렌드를 타면서 브랜드 메시지를 함께 전달",
            tags: ["릴스", "쇼츠", "틱톡"],
          },
          {
            mark: "호",
            role: "Motion Designer",
            name: "모션 · 박지호",
            exp: "모션 5년",
            body: "소리 없이 봐도 내용이 전달되는 영상을 만듭니다",
            career: "모션그래픽 · 자막 디자인 — 움직임 하나로 제품 특장점을 직관적으로 전달",
            tags: ["After Effects", "모션", "자막"],
          },
        ],
      },
    ],
  },
  {
    cat: "마케팅",
    eyebrow: "Team · Marketing",
    subteams: [
      {
        name: "SNS 운영 대행 조직",
        members: [
          {
            mark: "영",
            role: "SNS Ops PM",
            name: "운영PM · 최서영",
            exp: "SNS 운영 5년",
            body: "채널 전략부터 일정 관리까지 SNS 운영 전체를 총괄합니다",
            career: "콘텐츠 기획 · 운영 캘린더 · 채널 전략 — 월간 키워드·방향 설계",
            tags: ["SNS전략", "운영캘린더", "채널관리"],
          },
          {
            mark: "하",
            role: "SNS Editor",
            name: "에디터 · 김도하",
            exp: "SNS 에디팅 5년",
            body: "피드 하나하나가 브랜드를 설명하게 만듭니다",
            career: "인스타 피드 · 카드뉴스 · 숏폼 — 채널별 비주얼 포맷·템플릿 제작",
            tags: ["카드뉴스", "인스타", "숏폼"],
          },
          {
            mark: "혁",
            role: "Growth Analyst",
            name: "분석 · 서준혁",
            exp: "분석 5년",
            body: "데이터를 보고 다음 달 방향을 정확하게 잡아드립니다",
            career: "GA4 · A/B 테스트 · 맞춤 리포트 — 채널 성장 실험·데이터 기반 액션 제안",
            tags: ["GA4", "A/B테스트", "그로스"],
          },
        ],
      },
      {
        name: "블로그 운영 대행 조직",
        members: [
          {
            mark: "진",
            role: "Blog Content",
            name: "콘텐츠 · 이진희",
            exp: "블로그 5년",
            body: "검색에 걸리고 읽히는 포스팅을 꾸준히 발행합니다",
            career: "SEO 블로그 · 키워드 전략 · 콘텐츠 제작 — 월간 콘텐츠 캘린더 운영",
            tags: ["SEO블로그", "키워드", "콘텐츠"],
          },
          {
            mark: "슬",
            role: "Growth Ops",
            name: "그로스 · 박슬기",
            exp: "SEO 5년",
            body: "유입 데이터를 분석해 더 잘 검색되는 구조로 개선합니다",
            career: "키워드 분석 · 순위 추적 · 채널 최적화 — 월간 성과 리포트·개선 제안",
            tags: ["키워드분석", "순위추적", "SEO최적화"],
          },
          {
            mark: "지",
            role: "QA · Ops",
            name: "검수·운영 · 장지호",
            exp: "검수 5년",
            body: "발행 전 전수 검수하고, 운영 이슈도 즉시 처리합니다",
            career: "맞춤법·링크·이미지 검수 — SEO 메타·구조화 데이터 점검",
            tags: ["검수", "SEO메타", "운영"],
          },
        ],
      },
    ],
  },
];

/* ─── 스타일 토큰 ─── */
const H1 = { fontFamily: "var(--font-marcellus)", fontSize: "clamp(42px,7vw,96px)", lineHeight: 1.02, letterSpacing: "-0.012em", color: "var(--tone-magazine-ink)", fontWeight: 400 as const, wordBreak: "keep-all" as const, overflowWrap: "break-word" as const };
const H2 = { fontFamily: "var(--font-marcellus)", fontSize: "clamp(28px,4.6vw,58px)", lineHeight: 1.04, letterSpacing: "-0.012em", color: "var(--tone-magazine-ink)", fontWeight: 400 as const, wordBreak: "keep-all" as const };
const LEAD = { fontFamily: "var(--font-pretendard)", fontSize: "clamp(14.5px,1.25vw,17.5px)", lineHeight: 1.85, color: "var(--tone-magazine-ink-2)", letterSpacing: "-0.005em", fontWeight: 400 as const, wordBreak: "keep-all" as const };
const LABEL = { fontFamily: "var(--font-jetbrains)", fontSize: "10.5px", color: "var(--tone-magazine-ink-3)", letterSpacing: "0.22em", textTransform: "uppercase" as const };
const EM_CORM = { fontFamily: "var(--font-fraunces)", fontStyle: "normal" as const, fontWeight: 500 as const };

/* ─── 서브팀 구분 헤더 ─── */
function SubteamDivider({ name }: { name: string }) {
  return (
    <div
      className="flex items-center justify-between mt-20 mb-0 first:mt-0 px-7 py-5"
      style={{
        background: "var(--tone-magazine-ink)",
        color: "var(--tone-magazine-paper)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "clamp(20px, 2.2vw, 28px)",
          letterSpacing: "0.02em",
          lineHeight: 1,
          color: "var(--tone-magazine-paper)",
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: "9px",
          letterSpacing: "0.28em",
          textTransform: "uppercase" as const,
          color: "var(--tone-magazine-paper)",
          opacity: 0.45,
        }}
      >
        Org
      </span>
    </div>
  );
}

/* ─── 멤버 카드 ─── */
function MemberCard({ p, borderRight, borderBottom }: { p: Member; borderRight: boolean; borderBottom: boolean }) {
  return (
    <div
      className="flex flex-col items-center text-center"
      style={{
        padding: "clamp(24px,3vw,38px) clamp(16px,2vw,26px)",
        borderRight: borderRight ? "1px solid var(--tone-magazine-line-2)" : "none",
        borderBottom: borderBottom ? "1px solid var(--tone-magazine-line-2)" : "none",
      }}
    >
      {/* 아바타 */}
      <div
        className="mb-4 flex items-center justify-center shrink-0"
        style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--tone-magazine-ink)", color: "var(--tone-magazine-paper)", fontFamily: "var(--font-marcellus)", fontSize: 19 }}
      >
        {p.mark}
      </div>

      {/* 역할 + 경력 */}
      <div className="flex items-center gap-2 mb-2 flex-wrap justify-center">
        <span style={LABEL}>{p.role}</span>
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "9px",
            letterSpacing: "0.1em",
            color: "var(--tone-magazine-paper)",
            background: "var(--tone-magazine-ink-3)",
            padding: "2px 6px",
            borderRadius: 2,
          }}
        >
          {p.exp}
        </span>
      </div>

      {/* 이름 */}
      <div className="mb-2" style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(16px,1.8vw,20px)", color: "var(--tone-magazine-ink)" }}>
        {p.name}
      </div>

      {/* 한 줄 소개 */}
      <div className="mb-2" style={{ ...LEAD, fontSize: "13.5px", maxWidth: "24ch" }}>
        {p.body}
      </div>

      {/* 경력 상세 */}
      <div
        className="mb-4"
        style={{
          fontFamily: "var(--font-pretendard)",
          fontSize: "11.5px",
          lineHeight: 1.7,
          color: "var(--tone-magazine-ink-3)",
          maxWidth: "28ch",
          letterSpacing: "-0.003em",
        }}
      >
        {p.career}
      </div>

      {/* 태그 */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
        {p.tags.map((t) => (
          <span key={t} style={{ ...LABEL, fontSize: 9, padding: "3px 7px", border: "1px solid var(--tone-magazine-line-2)" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── 서브팀 그리드 ─── */
function SubteamGrid({ members }: { members: Member[] }) {
  const n = members.length;
  const cols = n === 1 ? 1 : n === 2 ? 2 : n === 4 ? 2 : 3;
  const gridClass =
    cols === 1
      ? "grid-cols-1 max-w-[380px]"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-3";

  return (
    <div
      className={`grid gap-0 mx-auto ${gridClass}`}
      style={{ border: "1px solid var(--tone-magazine-ink)" }}
    >
      {members.map((p, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const totalRows = Math.ceil(n / cols);
        return (
          <MemberCard
            key={p.role + i}
            p={p}
            borderRight={col < cols - 1 && i + 1 < n}
            borderBottom={row < totalRows - 1}
          />
        );
      })}
    </div>
  );
}

/* ─── 페이지 ─── */
export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const base = `/${locale}`;
  return (
    <main style={{ background: "var(--tone-magazine-paper)", paddingTop: "clamp(48px,7vw,96px)", paddingBottom: "clamp(60px,8vw,100px)" }}>
      <div className="mx-auto w-full max-w-[1180px] px-5 md:px-10 lg:px-14 text-center">

        {/* Hero */}
        <MagazineEyebrow className="mb-6">No 02 · The People</MagazineEyebrow>
        <h1 className="mb-8" style={H1}>
          AIO를 만드는<br /><span style={EM_CORM}>사람들</span>
        </h1>
        <p className="mx-auto mb-20" style={{ ...LEAD, maxWidth: 640 }}>
          분야별 전문가가 의뢰의 시작부터 운영까지 함께합니다 — 의사결정부터 제작·검수·운영까지, 각자의 자리에서 책임집니다
        </p>

        {/* CEO */}
        <MagazineEyebrow className="mb-6">Leadership</MagazineEyebrow>
        <h2 className="mb-14" style={H2}>운영을 <span style={EM_CORM}>이끄는 한 사람</span></h2>
        <div className="mx-auto max-w-[380px] mb-24 flex flex-col items-center text-center py-10 px-10" style={{ border: "1px solid var(--tone-magazine-ink)" }}>
          <div className="mb-4" style={LABEL}>{CEO.role}</div>
          <div style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(26px,3.2vw,38px)", color: "var(--tone-magazine-ink)" }}>{CEO.name}</div>
        </div>

        {/* Directors */}
        <MagazineEyebrow className="mb-6">Directors · 04</MagazineEyebrow>
        <h2 className="mb-14" style={H2}>분야의 <span style={EM_CORM}>책임자</span></h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-0 mx-auto max-w-[880px] mb-24"
          style={{ border: "1px solid var(--tone-magazine-ink)" }}
        >
          {DIRECTORS.map((d, i) => (
            <div
              key={d.dept}
              className="flex flex-col items-center text-center"
              style={{
                padding: "clamp(24px,3vw,40px) clamp(18px,2.2vw,32px)",
                borderRight: i % 2 === 0 ? "1px solid var(--tone-magazine-line-2)" : "none",
                borderBottom: i < 2 ? "1px solid var(--tone-magazine-line-2)" : "none",
              }}
            >
              <div className="mb-3" style={LABEL}>{d.dept}</div>
              <div className="mb-1" style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(20px,2.4vw,28px)", color: "var(--tone-magazine-ink)" }}>{d.title}</div>
              <div className="mb-3" style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(15px,1.6vw,18px)", color: "var(--tone-magazine-ink-2)" }}>{d.name}</div>
              <div className="mb-3" style={{ fontFamily: "var(--font-jetbrains)", fontSize: "9px", letterSpacing: "0.12em", color: "var(--tone-magazine-paper)", background: "var(--tone-magazine-ink-3)", padding: "2px 7px", borderRadius: 2, display: "inline-block" }}>{d.exp}</div>
              <div style={{ ...LEAD, fontSize: "13px", maxWidth: "28ch" }}>{d.note}</div>
            </div>
          ))}
        </div>

        {/* Teams */}
        {TEAMS.map((team) => (
          <section key={team.cat} className="mb-28">
            <MagazineEyebrow className="mb-6">{team.eyebrow}</MagazineEyebrow>
            <h2 className="mb-14" style={H2}>{team.cat} <span style={EM_CORM}>팀</span></h2>
            <div className="mx-auto max-w-[1080px]">
              {team.subteams.map((st, si) => (
                <div key={st.name}>
                  <SubteamDivider name={st.name} />
                  <SubteamGrid members={st.members} />
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="mt-12">
          <h2 className="mb-6" style={H2}>같이 만들 <span style={EM_CORM}>차례입니다</span></h2>
          <p className="mx-auto mb-10" style={{ ...LEAD, maxWidth: 520 }}>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 결과물</p>
          <Link
            href={`${base}/quote`}
            className="inline-flex items-center"
            style={{ padding: "14px 30px", border: "1px solid var(--tone-magazine-ink)", fontFamily: "var(--font-jetbrains)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--tone-magazine-ink)", textDecoration: "none" }}
          >
            견적 문의 →
          </Link>
        </section>
      </div>
    </main>
  );
}
