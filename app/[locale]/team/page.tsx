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
  exp: "경영 6년",
  note: "PM 관리 · 우선순위 · 위험 · 보고 · 게이트웨이 운영",
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
            exp: "기획 3년",
            body: "목적과 흐름을 먼저 설계합니다",
            career: "IA · 와이어프레임 · 고객 요구사항 분석 · 콘텐츠 구조 설계",
            tags: ["IA", "와이어프레임", "요구사항"],
          },
          {
            mark: "도",
            role: "Web Designer",
            name: "디자인 · 오도윤",
            exp: "UI/UX 4년",
            body: "첫인상과 사용성을 함께 잡습니다",
            career: "Figma · 반응형 UI · 사용자 흐름 설계 · 디자인 시스템",
            tags: ["Figma", "UI/UX", "반응형"],
          },
          {
            mark: "세",
            role: "Developer",
            name: "개발 · 정세호",
            exp: "풀스택 5년",
            body: "운영 가능한 상태로 구현·배포합니다",
            career: "Next.js · TypeScript · Supabase · Vercel · API 연동",
            tags: ["Next.js", "TypeScript", "Supabase"],
          },
          {
            mark: "현",
            role: "QA · Ops",
            name: "검수·운영 · 신현아",
            exp: "검수 3년",
            body: "끝까지 점검하고 유지보수합니다",
            career: "크로스브라우저 테스트 · 기능 검수 · A/S · 유지보수 대응",
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
            exp: "쇼핑몰 기획 3년",
            body: "구매 흐름을 기획합니다",
            career: "카테고리 구조 · 결제 UX · 상품 등록 플로우 · 전환 최적화",
            tags: ["쇼핑몰", "UX", "결제흐름"],
          },
          {
            mark: "태",
            role: "E-commerce Dev",
            name: "개발 · 임태양",
            exp: "쇼핑몰 개발 5년",
            body: "커스텀 쇼핑몰을 구현합니다",
            career: "Cafe24 · Shopify · 커스텀 쇼핑몰 · 재고·주문 API 연동",
            tags: ["Cafe24", "Shopify", "커스텀"],
          },
          {
            mark: "민",
            role: "QA · Ops",
            name: "검수·운영 · 배지민",
            exp: "검수 2년",
            body: "결제부터 운영까지 점검합니다",
            career: "결제 테스트 · 재고 검수 · 주문관리 · 운영 지원",
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
            exp: "자동화 4년",
            body: "반복 업무를 자동으로 처리합니다",
            career: "Python · n8n · Zapier · API 연동 · 자동화 파이프라인 설계",
            tags: ["Python", "n8n", "API"],
          },
          {
            mark: "서",
            role: "App Developer",
            name: "앱 개발 · 황서준",
            exp: "앱 개발 3년",
            body: "iOS·Android 앱을 동시에 개발합니다",
            career: "React Native · Expo · iOS · Android · 스토어 배포",
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
            exp: "상세 디자인 4년",
            body: "스크롤을 멈추게 만드는 상세를 만듭니다",
            career: "전환율 최적화 · 스크롤 스토리텔링 · 제품 비주얼 구성",
            tags: ["상세페이지", "전환", "스토리텔링"],
          },
          {
            mark: "준",
            role: "Copywriter",
            name: "카피 · 문준",
            exp: "카피 3년",
            body: "읽게 만드는 한 줄을 씁니다",
            career: "제품 설득 카피 · 키워드 연구 · 톤 앤 매너 · SEO 카피",
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
            body: "브랜드의 첫 인상을 설계합니다",
            career: "CI/BI · 로고 · 명함 · 브랜드 가이드라인 · 패키지 디자인",
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
            exp: "IR 덱 4년",
            body: "한 눈에 전달되는 슬라이드를 설계합니다",
            career: "투자자 IR 덱 · 공모전 · 비즈니스 제안서 · 키노트·파워포인트",
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
            body: "한 컷의 무게를 압니다",
            career: "브랜드 필름 · 광고 · 인터뷰 · 다큐멘터리 · 현장 연출",
            tags: ["연출", "브랜드필름", "광고"],
          },
          {
            mark: "우",
            role: "Editor",
            name: "편집 · 윤정우",
            exp: "편집 5년",
            body: "리듬과 호흡으로 끝까지 보게 합니다",
            career: "DaVinci Resolve · 컬러그레이딩 · 사운드 믹싱 · 후반작업",
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
            exp: "숏폼 3년",
            body: "첫 1초에 시선을 사로잡습니다",
            career: "릴스 · 쇼츠 · 틱톡 · 바이럴 후킹 편집 · 트렌드 분석",
            tags: ["릴스", "쇼츠", "틱톡"],
          },
          {
            mark: "호",
            role: "Motion Designer",
            name: "모션 · 박지호",
            exp: "모션 4년",
            body: "움직임으로 메시지를 전달합니다",
            career: "After Effects · Premiere Pro · 모션그래픽 · 자막 디자인",
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
            exp: "콘텐츠 4년",
            body: "꾸준히 보이는 운영을 만듭니다",
            career: "블로그 · 인스타그램 · 유튜브 채널 운영 · 콘텐츠 캘린더",
            tags: ["블로그", "SNS", "채널운영"],
          },
          {
            mark: "하",
            role: "SNS Editor",
            name: "SNS · 김도하",
            exp: "SNS 2년",
            body: "피드 하나로 팔로워를 늘립니다",
            career: "숏폼 기획 · 인스타 피드 · 카드뉴스 · 해시태그 전략",
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
            exp: "광고 운영 4년",
            body: "데이터에서 다음 한 수를 봅니다",
            career: "메타 · 구글 · 카카오 광고 · ROAS 최적화 · 타겟 세그먼트",
            tags: ["메타광고", "구글광고", "ROAS"],
          },
          {
            mark: "혁",
            role: "Growth Analyst",
            name: "그로스 · 서준혁",
            exp: "분석 3년",
            body: "숫자가 방향을 알려줍니다",
            career: "GA4 · 맞춤 리포트 · A/B 테스트 · 그로스해킹 · 전환 분석",
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
        <div className="mx-auto max-w-[480px] mb-24 flex flex-col items-center text-center py-10 px-10" style={{ border: "1px solid var(--tone-magazine-ink)" }}>
          <div className="mb-3" style={LABEL}>{CEO.role}</div>
          <div className="mb-1" style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(26px,3.2vw,38px)", color: "var(--tone-magazine-ink)" }}>{CEO.name}</div>
          <div className="mb-4" style={{ fontFamily: "var(--font-jetbrains)", fontSize: "9.5px", letterSpacing: "0.12em", color: "var(--tone-magazine-paper)", background: "var(--tone-magazine-ink-3)", padding: "3px 8px", borderRadius: 2 }}>{CEO.exp}</div>
          <div style={{ ...LEAD, fontSize: "clamp(13px,1vw,15px)", maxWidth: "34ch" }}>{CEO.note}</div>
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
