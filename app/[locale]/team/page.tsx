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
            body: "만들기 전에 방향을 맞춰 수정 비용을 줄입니다",
            career: "요구사항을 정리해 처음부터 제대로 만드는 구조를 세웁니다 — 기획이 명확할수록 제작비가 줄어듭니다",
            tags: ["IA", "와이어프레임", "요구사항"],
          },
          {
            mark: "도",
            role: "Web Designer",
            name: "디자인 · 오도윤",
            exp: "UI/UX 5년",
            body: "처음 온 방문자도 헤매지 않는 화면을 만듭니다",
            career: "어떤 기기에서도 보기 좋고 쓰기 편한 디자인 — 반응형·사용자 흐름·디자인 시스템",
            tags: ["Figma", "UI/UX", "반응형"],
          },
          {
            mark: "세",
            role: "Developer",
            name: "개발 · 정세호",
            exp: "풀스택 5년",
            body: "오픈 당일부터 실제로 동작하는 사이트를 납품합니다",
            career: "느리지 않고 다운되지 않는 구조로 구현합니다 — Next.js · Supabase · Vercel",
            tags: ["Next.js", "TypeScript", "Supabase"],
          },
          {
            mark: "현",
            role: "QA · Ops",
            name: "검수·운영 · 신현아",
            exp: "검수 5년",
            body: "고객이 발견하기 전에 문제를 모두 잡아냅니다",
            career: "납품 후에도 문제가 생기면 바로 대응합니다 — 기능 검수 · 크로스브라우저 · A/S",
            tags: ["QA", "크로스브라우저", "A/S"],
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
            career: "이탈 없는 구매 경험을 기획합니다 — 상품 구조 · 결제 흐름 · 카테고리 설계",
            tags: ["쇼핑몰", "UX", "결제흐름"],
          },
          {
            mark: "태",
            role: "E-commerce Dev",
            name: "개발 · 임태양",
            exp: "쇼핑몰 개발 5년",
            body: "상품이 많아도 빠르고 안정적인 쇼핑몰을 만듭니다",
            career: "재고·주문·결제가 자동으로 연결됩니다 — Cafe24 · Shopify · 커스텀",
            tags: ["Cafe24", "Shopify", "커스텀"],
          },
          {
            mark: "민",
            role: "QA · Ops",
            name: "검수·운영 · 배지민",
            exp: "검수 5년",
            body: "결제 오류 하나 없이 오픈할 수 있도록 점검합니다",
            career: "운영 중 문제가 생겨도 바로 처리합니다 — 결제 테스트 · 재고 검수 · 주문관리",
            tags: ["결제", "재고", "운영"],
          },
        ],
      },
      {
        name: "자동화·앱 조직",
        members: [
          {
            mark: "훈",
            role: "Automation Dev",
            name: "자동화 · 송지훈",
            exp: "자동화 5년",
            body: "매일 반복하는 업무를 시스템이 대신하게 만들어드립니다",
            career: "사람이 하던 일을 자동화해 운영 비용을 줄입니다 — Python · n8n · API 연동",
            tags: ["Python", "n8n", "API"],
          },
          {
            mark: "서",
            role: "App Developer",
            name: "앱 개발 · 황서준",
            exp: "앱 개발 5년",
            body: "iPhone과 Android 앱을 한 번에 만들어 비용을 절반으로 줄입니다",
            career: "iOS·Android 동시 출시, 스토어 배포까지 책임집니다 — React Native · Expo",
            tags: ["React Native", "Expo", "크로스플랫폼"],
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
            mark: "유",
            role: "Detail Designer",
            name: "상세 · 나유나",
            exp: "상세 디자인 5년",
            body: "스크롤할수록 사고 싶어지는 상세페이지를 만듭니다",
            career: "보는 사람이 구매 버튼을 누르게 설계합니다 — 전환율 최적화 · 스크롤 스토리텔링",
            tags: ["상세페이지", "전환", "스토리텔링"],
          },
          {
            mark: "준",
            role: "Copywriter",
            name: "카피 · 문준",
            exp: "카피 5년",
            body: "제품의 가치를 한 줄로 전달해 구매를 결정짓게 합니다",
            career: "검색에도 걸리고, 읽으면 사고 싶어지는 문장을 씁니다 — 설득 카피 · SEO",
            tags: ["카피", "SEO", "설득"],
          },
        ],
      },
      {
        name: "로고·브랜딩 조직",
        members: [
          {
            mark: "결",
            role: "Brand Designer",
            name: "브랜딩 · 강한결",
            exp: "브랜딩 5년",
            body: "처음 본 사람이 바로 기억하는 브랜드를 만들어드립니다",
            career: "어디에 써도 흔들리지 않는 브랜드 체계를 세웁니다 — CI/BI · 로고 · 명함 · 가이드라인",
            tags: ["CI/BI", "로고", "브랜드"],
          },
        ],
      },
      {
        name: "PPT·IR 조직",
        members: [
          {
            mark: "원",
            role: "PPT Designer",
            name: "PPT · 류지원",
            exp: "IR 덱 5년",
            body: "투자자나 고객사가 Yes라고 말하게 만드는 덱을 만듭니다",
            career: "복잡한 내용을 한 슬라이드에 명확히 정리합니다 — IR 덱 · 제안서 · 공모전",
            tags: ["IR", "제안서", "PPT"],
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
            career: "보는 사람이 신뢰하게 만드는 연출 — 브랜드 필름 · 광고 · 인터뷰",
            tags: ["연출", "브랜드필름", "광고"],
          },
          {
            mark: "우",
            role: "Editor",
            name: "편집 · 윤정우",
            exp: "편집 5년",
            body: "끝까지 보게 만드는 편집으로 메시지를 완성합니다",
            career: "브랜드 톤에 맞는 색감과 분위기로 마무리합니다 — 컬러그레이딩 · 사운드 믹싱",
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
            career: "트렌드를 타면서 브랜드 메시지를 함께 전달합니다 — 릴스 · 쇼츠 · 틱톡",
            tags: ["릴스", "쇼츠", "틱톡"],
          },
          {
            mark: "호",
            role: "Motion Designer",
            name: "모션 · 박지호",
            exp: "모션 5년",
            body: "소리 없이 봐도 내용이 전달되는 영상을 만듭니다",
            career: "움직임 하나로 제품의 특장점을 직관적으로 전달합니다 — 모션그래픽 · 자막 디자인",
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
        name: "콘텐츠·SNS 조직",
        members: [
          {
            mark: "영",
            role: "Content Ops",
            name: "콘텐츠 · 최서영",
            exp: "콘텐츠 5년",
            body: "검색에도 나오고 팔로우도 늘어나는 채널 운영을 만듭니다",
            career: "꾸준히 쌓여 유입으로 돌아오는 콘텐츠 전략 — 블로그 · 인스타그램 · 유튜브",
            tags: ["블로그", "SNS", "채널운영"],
          },
          {
            mark: "하",
            role: "SNS Editor",
            name: "SNS · 김도하",
            exp: "SNS 5년",
            body: "콘텐츠 하나가 팔로워를 고객으로 바꾸게 기획합니다",
            career: "피드 하나하나가 브랜드를 설명하게 만듭니다 — 인스타 피드 · 카드뉴스 · 숏폼",
            tags: ["인스타", "카드뉴스", "숏폼"],
          },
        ],
      },
      {
        name: "퍼포먼스 마케팅 조직",
        members: [
          {
            mark: "지",
            role: "Ad Manager",
            name: "광고 · 장지호",
            exp: "광고 운영 5년",
            body: "예산을 낭비 없이 써서 실제 구매로 이어지게 합니다",
            career: "ROAS를 보면서 예산을 계속 최적화합니다 — 메타 · 구글 · 카카오 광고",
            tags: ["메타광고", "구글광고", "ROAS"],
          },
          {
            mark: "혁",
            role: "Growth Analyst",
            name: "그로스 · 서준혁",
            exp: "분석 5년",
            body: "숫자를 보고 다음 달에 뭘 바꿔야 할지 알려드립니다",
            career: "데이터가 다음 마케팅 방향을 결정합니다 — GA4 · A/B 테스트 · 맞춤 리포트",
            tags: ["GA4", "A/B테스트", "그로스"],
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

/* ─── 서브팀 라벨 구분선 ─── */
function SubteamDivider({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-4 mb-6 mt-14 first:mt-0">
      <span style={{ flex: 1, height: 1, background: "var(--tone-magazine-line-2)", display: "block" }} />
      <span style={{ ...LABEL, fontSize: "9.5px", color: "var(--tone-magazine-ink-3)" }}>{name}</span>
      <span style={{ flex: 1, height: 1, background: "var(--tone-magazine-line-2)", display: "block" }} />
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
  const cols = n === 1 ? 1 : n === 3 ? 3 : 2;
  const gridClass =
    cols === 1
      ? "grid-cols-1 max-w-[380px]"
      : cols === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2";

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
            borderRight={col < cols - 1}
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
