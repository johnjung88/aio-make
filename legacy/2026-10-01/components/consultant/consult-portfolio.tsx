"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  locale: string;
}

interface Deck {
  slug: string;
  cat: "govt" | "ir" | "proposal" | "seminar" | "school";
  catLabel: string;
  title: string;
  titleEm?: string;
  client: string;
  desc: string;
  pages: string;
  tone: string;
}

/* 실제 작업물 — public/portfolio/ppt-design/{slug}/ 디렉토리에 cover.png + deck.pptx + planning.md 보유 */
const decks: Deck[] = [
  // 정부지원사업 (3)
  {
    slug: "government-grant",
    cat: "govt",
    catLabel: "예비창업패키지",
    title: "㈜실버케어랩 ",
    titleEm: "사업계획서",
    client: "예비창업패키지 · 2026",
    desc: "AI 기반 시니어 일상·복약·낙상 케어 통합 앱 — K-Startup PSST 4단 구조, 사업화 자금 1억 원 신청",
    pages: "30p",
    tone: "K-Startup PSST",
  },
  {
    slug: "tips-vibestack",
    cat: "govt",
    catLabel: "TIPS",
    title: "㈜바이브스택 ",
    titleEm: "TIPS 일반트랙",
    client: "TIPS · ㈜패스트벤처스 추천",
    desc: "AI 코딩 스튜디오 SaaS — R&D 5억 + 사업화 2억 + 마케팅 1억 = 총 8억 원, 기술성·사업성 양축",
    pages: "30p",
    tone: "기술성·사업성 양축",
  },
  {
    slug: "youngceo-greenpet",
    cat: "govt",
    catLabel: "청년창업사관학교",
    title: "㈜그린펫 ",
    titleEm: "청년창업사관학교 17기",
    client: "청년창업사관학교 17기",
    desc: "프리미엄 펫푸드·헬스 D2C — 대표자 역량 가중 30%, 사업화 자금 1억 + 1년 입교 신청",
    pages: "25p",
    tone: "대표자 역량 가중",
  },

  // IR / 투자 (3)
  {
    slug: "ir-investment",
    cat: "ir",
    catLabel: "Seed",
    title: "㈜솔로엔진 ",
    titleEm: "Seed IR",
    client: "Seed ₩5억 · Pre $4M",
    desc: "1인 창업자 워크플로우 자동화 AI SaaS — Bold Maximalist 톤, 시드 엔젤·VC 대상",
    pages: "20p",
    tone: "Bold Maximalist",
  },
  {
    slug: "prea-silvercarelab",
    cat: "ir",
    catLabel: "Pre-A",
    title: "㈜실버케어랩 ",
    titleEm: "Pre-A IR",
    client: "Pre-A ₩15억 · Pre ₩60억",
    desc: "검증된 PMF + 명확한 그로스 엔진 + 시장 사이즈 정량화 — Magazine Editorial 톤",
    pages: "30p",
    tone: "Magazine Editorial",
  },
  {
    slug: "seriesa-greenpet",
    cat: "ir",
    catLabel: "Series A",
    title: "㈜그린펫 ",
    titleEm: "Series A IR",
    client: "Series A ₩50억 · Pre ₩220억",
    desc: "프리미엄 펫푸드 D2C — Bold Maximalist 톤, 시장 진입 3개년 로드맵 포함",
    pages: "30p",
    tone: "Bold Maximalist",
  },

  // 브랜드 / 제안서 (3)
  {
    slug: "vibestack-company-profile",
    cat: "proposal",
    catLabel: "회사 소개서",
    title: "㈜바이브스택 ",
    titleEm: "Company Profile",
    client: "VC·예비 협력사 대상",
    desc: "AI 코딩 스튜디오 회사소개서 — About · Services · Cases · Pricing 풀 패키지",
    pages: "20p",
    tone: "Modern Tech Editorial",
  },
  {
    slug: "brand-proposal",
    cat: "proposal",
    catLabel: "스튜디오 소개서",
    title: "㈜리빙랩 ",
    titleEm: "Studio Profile",
    client: "신규 상담·B2B 협력",
    desc: "인테리어 디자인 스튜디오 회사소개서 — 우드·크림·딥그린 매거진 에디토리얼 톤",
    pages: "20p",
    tone: "Magazine Editorial",
  },
  {
    slug: "beanbrew-b2b-proposal",
    cat: "proposal",
    catLabel: "B2B 제안서",
    title: "㈜빈앤브루 ",
    titleEm: "프랜차이즈 가맹 제안서",
    client: "카페 프랜차이즈 가맹주 대상",
    desc: "About · Coffee Lineup · Pricing Tiers · Onboarding — 우드·크림·브라운 매거진 에디토리얼",
    pages: "20p",
    tone: "Magazine Editorial",
  },

  // 세미나 / 강연 (3)
  {
    slug: "ai-automation-seminar",
    cat: "seminar",
    catLabel: "사내 세미나",
    title: "ChatGPT·Claude로 ",
    titleEm: "업무 자동화",
    client: "사내 직원 30~50명",
    desc: "디지털 친숙도 中 청자 — AI 도구 실전 활용, Modern Tech Editorial",
    pages: "10p",
    tone: "Modern Tech Editorial",
  },
  {
    slug: "solopreneur-talk",
    cat: "seminar",
    catLabel: "TED 스타일",
    title: "1인 창업의 시대 ",
    titleEm: "— TED 강연",
    client: "컨퍼런스 청중 200명",
    desc: "창업 관심 일반인 대상 임팩트 토크 — Bold Maximalist TED 톤",
    pages: "10p",
    tone: "Bold Maximalist (TED)",
  },
  {
    slug: "seminar-lecture",
    cat: "seminar",
    catLabel: "CEO 강연",
    title: "ESG 경영, ",
    titleEm: "다음 10년",
    client: "중견기업 대표·임원 100명",
    desc: "ESG 경영 키노트 — 안정·신뢰 톤 매거진 에디토리얼",
    pages: "12p",
    tone: "Magazine Editorial",
  },

  // 학교 과제 (3)
  {
    slug: "academic-paper",
    cat: "school",
    catLabel: "학회 논문",
    title: "학회 논문 ",
    titleEm: "발표 슬라이드",
    client: "대학 학회 · 12분 발표",
    desc: "Magazine 학술 미니멀 톤 — 12분 발표 + 3분 Q&A 학술 발표용",
    pages: "12p",
    tone: "Magazine 학술 미니멀",
  },
  {
    slug: "capstone-recycleme",
    cat: "school",
    catLabel: "졸업 캡스톤",
    title: "RecycleMe ",
    titleEm: "— 졸업 캡스톤",
    client: "캡스톤 프로젝트",
    desc: "AI 재활용 분류 앱 캡스톤 발표 — Magazine Editorial 톤",
    pages: "10p",
    tone: "Magazine Editorial",
  },
  {
    slug: "school-assignment",
    cat: "school",
    catLabel: "자기 PR",
    title: "진로 탐색 ",
    titleEm: "· 자기 PR",
    client: "학교 과제",
    desc: "Bold Maximalist 자신감 톤 — 진로 탐색·자기 PR 발표",
    pages: "10p",
    tone: "Bold Maximalist",
  },

  // 정부지원사업 추가 (2)
  {
    slug: "kstartup-luminex",
    cat: "govt",
    catLabel: "K-Startup 글로벌",
    title: "㈜루미넥스 ",
    titleEm: "K-Startup 글로벌",
    client: "K-Startup · 동남아 4개국 진출",
    desc: "K-뷰티 클린 코스메틱 D2C 글로벌 진출 — 5천만 원 + 도쿄 액셀러레이팅 6개월 신청",
    pages: "25p",
    tone: "Bold Maximalist · Navy",
  },
  {
    slug: "rnd-neuralwave",
    cat: "govt",
    catLabel: "정부 R&D",
    title: "㈜뉴럴웨이브 ",
    titleEm: "정부 R&D 과제",
    client: "정부 R&D · 의료 AI",
    desc: "의료 영상 AI 분석 솔루션 (X-ray·CT 자동 판독) — 정부 R&D 과제 사업계획서",
    pages: "30p",
    tone: "Technical · Detailed",
  },

  // IR / 투자 추가 (2)
  {
    slug: "seriesb-flowdesk",
    cat: "ir",
    catLabel: "Series B",
    title: "㈜플로우데스크 ",
    titleEm: "Series B IR",
    client: "Series B ₩200억 · Pre $200M",
    desc: "원격 협업 SaaS — Series B Pre-money $200M / Post $230M, Modern Tech Editorial",
    pages: "30p",
    tone: "Modern Tech Editorial",
  },
  {
    slug: "demoday-noderush",
    cat: "ir",
    catLabel: "데모데이",
    title: "NodeRush ",
    titleEm: "5분 피칭",
    client: "데모데이 · 5분 피칭",
    desc: "엣지 컴퓨팅 스타트업 데모데이 — 5분 임팩트 피칭 덱, Bold Maximalist",
    pages: "10p",
    tone: "Bold Maximalist",
  },

  // 브랜드 / 제안서 추가 (2)
  {
    slug: "growthpie-marketing",
    cat: "proposal",
    catLabel: "에이전시 제안",
    title: "㈜그로스파이 ",
    titleEm: "마케팅 영업 제안서",
    client: "디지털 마케팅 에이전시 → 클라이언트",
    desc: "퍼포먼스 마케팅 에이전시 B2B 영업 제안서 — 네이비·라임 임팩트 톤",
    pages: "20p",
    tone: "Bold Maximalist (Navy·Lime)",
  },
  {
    slug: "lifecare-insurance",
    cat: "proposal",
    catLabel: "보험 상품 설명",
    title: "㈜라이프케어 ",
    titleEm: "보험 상품 설명서",
    client: "보험 고객 대상",
    desc: "보험 상품 설명 자료 — 안정감·신뢰 톤 Magazine Editorial",
    pages: "15p",
    tone: "Magazine Editorial (안정감)",
  },

  // 세미나 / 강연 추가 (2)
  {
    slug: "marketing-keynote",
    cat: "seminar",
    catLabel: "컨퍼런스 키노트",
    title: "2026 디지털 마케팅 ",
    titleEm: "트렌드 키노트",
    client: "마케팅 디렉터·CMO 500명",
    desc: "디지털 마케팅 트렌드 컨퍼런스 키노트 — Bold Maximalist 임팩트 톤",
    pages: "15p",
    tone: "Bold Maximalist",
  },
  {
    slug: "data-intro-seminar",
    cat: "seminar",
    catLabel: "사내 세미나",
    title: "데이터 분석 ",
    titleEm: "입문 세미나",
    client: "비개발 직군 30명 (마케팅·기획·CS)",
    desc: "SQL·GA4·Looker로 시작하는 데이터 분석 — Modern Tech Editorial",
    pages: "12p",
    tone: "Modern Tech Editorial",
  },

  // 학교 과제 추가 (2)
  {
    slug: "teamproject-coffee",
    cat: "school",
    catLabel: "팀 프로젝트",
    title: "캠퍼스 카페 ",
    titleEm: "매출 분석 팀 프로젝트",
    client: "팀 프로젝트 발표",
    desc: "캠퍼스 카페 5곳 매출 데이터 분석·개선 제안 — Modern Tech 학생 활기 톤",
    pages: "12p",
    tone: "Modern Tech (학생)",
  },
  {
    slug: "internship-report",
    cat: "school",
    catLabel: "인턴십 결과",
    title: "인턴십 ",
    titleEm: "결과 보고",
    client: "12주 인턴십 결과 보고",
    desc: "광고 운영·데이터 분석·보고서 작성 12주 인턴십 발표 — Magazine Editorial",
    pages: "10p",
    tone: "Magazine Editorial",
  },
];

const cats = [
  { id: "all", label: "전체" },
  { id: "govt", label: "정부 지원" },
  { id: "ir", label: "IR · 투자" },
  { id: "proposal", label: "회사·제안" },
  { id: "seminar", label: "세미나·강연" },
  { id: "school", label: "학교 과제" },
] as const;

export function ConsultPortfolio({ locale }: Props) {
  const [active, setActive] = useState<(typeof cats)[number]["id"]>("all");
  const filtered = active === "all" ? decks : decks.filter((d) => d.cat === active);

  const countFor = (id: string) =>
    id === "all" ? decks.length : decks.filter((d) => d.cat === id).length;

  return (
    <>
      {/* Hero */}
      <section
        style={{
          padding: "80px clamp(20px,3vw,24px) 32px",
          maxWidth: 1280,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-ibm-plex-mono)",
            fontSize: 11.5,
            color: "var(--tone-consult-navy)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 24,
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            fontWeight: 500,
          }}
        >
          <span style={{ width: 28, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
          Portfolio · {decks.length} decks
        </div>
        <h1
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(32px, 6.4vw, 96px)",
            fontWeight: 700,
            letterSpacing: "-0.032em",
            lineHeight: 0.98,
            color: "var(--tone-consult-ink)",
            marginBottom: 22,
          }}
        >
          실제 발표에 쓰인
          <br />
          <em
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "var(--tone-consult-navy)",
              fontWeight: 500,
            }}
          >
            {decks.length}개
          </em>
          의 슬라이드 덱
        </h1>
        <p
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: "clamp(15px, 1.3vw, 17px)",
            lineHeight: 1.7,
            color: "var(--tone-consult-ink-2)",
            maxWidth: 640,
            margin: "0 auto 36px",
          }}
        >
          예비창업패키지·TIPS·Seed·Series A·세미나·강연·학교 과제까지
          <br className="hidden sm:inline" />
          {" "}실제 발표가 일어난 작업물만 모았습니다.
        </p>

        {/* Filter bar — square, no border-radius */}
        <div
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            border: "1px solid var(--tone-consult-ink)",
            justifyContent: "center",
          }}
        >
          {cats.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              style={{
                padding: "10px 18px",
                border: 0,
                borderRight: i < cats.length - 1 ? "1px solid var(--tone-consult-line-2)" : "0",
                background: active === c.id ? "var(--tone-consult-ink)" : "transparent",
                color: active === c.id ? "white" : "var(--tone-consult-ink-2)",
                fontFamily: "var(--font-inter)",
                fontSize: 12.5,
                cursor: "pointer",
                fontWeight: active === c.id ? 600 : 500,
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {c.label}
              <span
                style={{
                  opacity: active === c.id ? 0.85 : 0.55,
                  fontSize: 10,
                  fontFamily: "var(--font-ibm-plex-mono)",
                  color: active === c.id ? "var(--tone-consult-gold)" : "inherit",
                }}
              >
                {countFor(c.id)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section
        style={{
          padding: "24px clamp(20px,3vw,24px) 80px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7"
        >
          {filtered.map((d) => (
            <article
              key={d.slug}
              className="flex flex-col group transition-all"
              style={{
                background: "var(--tone-consult-paper)",
                border: "1px solid var(--tone-consult-line)",
              }}
            >
              {/* Cover image */}
              <div
                className="relative overflow-hidden"
                style={{
                  aspectRatio: "16/9",
                  borderBottom: "1px solid var(--tone-consult-line)",
                  background: "var(--tone-consult-paper-2)",
                }}
              >
                <Image
                  src={`/portfolio/ppt-design/${d.slug}/cover.png`}
                  alt={`${d.title}${d.titleEm ?? ""} cover`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ objectPosition: "center top" }}
                />
                {/* Top-left badge */}
                <div
                  className="absolute top-3 left-3 px-2.5 py-1"
                  style={{
                    background: "var(--tone-consult-gold)",
                    color: "var(--tone-consult-ink)",
                    fontFamily: "var(--font-ibm-plex-mono)",
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {d.catLabel}
                </div>
                {/* Top-right page count */}
                <div
                  className="absolute top-3 right-3 px-2.5 py-1"
                  style={{
                    background: "rgba(14,26,43,0.85)",
                    color: "white",
                    fontFamily: "var(--font-ibm-plex-mono)",
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                  }}
                >
                  {d.pages}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 gap-3 p-5 md:p-6">
                <div
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--tone-consult-ink-3)",
                  }}
                >
                  {d.client}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "clamp(16px, 1.7vw, 22px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.25,
                    color: "var(--tone-consult-ink)",
                  }}
                >
                  {d.title}
                  <em
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontStyle: "italic",
                      color: "var(--tone-consult-navy)",
                      fontWeight: 500,
                    }}
                  >
                    {d.titleEm}
                  </em>
                </h3>
                <p
                  className="flex-1"
                  style={{
                    fontFamily: "var(--font-pretendard)",
                    fontSize: 13.5,
                    color: "var(--tone-consult-ink-2)",
                    lineHeight: 1.65,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {d.desc}
                </p>

                {/* Meta row */}
                <div
                  className="flex items-center justify-between gap-3 pt-3 mt-2"
                  style={{
                    borderTop: "1px solid var(--tone-consult-line)",
                    fontFamily: "var(--font-ibm-plex-mono)",
                    fontSize: 10,
                    color: "var(--tone-consult-ink-3)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>§ {d.tone}</span>
                  <span style={{ color: "var(--tone-consult-gold)", fontWeight: 600 }}>
                    PPTX · Live Work
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "70px clamp(20px,3vw,24px) 56px",
          maxWidth: 1180,
          margin: "0 auto",
          textAlign: "center",
          borderTop: "1px solid var(--tone-consult-line)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(32px,4.6vw,64px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 0.96,
            marginBottom: 14,
            color: "var(--tone-consult-ink)",
          }}
        >
          비슷한 발표를{" "}
          <em
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "var(--tone-consult-navy)",
              fontWeight: 500,
            }}
          >
            맡기시나요?
          </em>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: 15,
            color: "var(--tone-consult-ink-2)",
            marginBottom: 28,
          }}
        >
          1시간 답변 · 24시간 견적 · 1-5일 결과물
        </p>
        <div
          style={{
            display: "inline-flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href={`/${locale}/quote`}
            style={{
              padding: "14px 26px",
              background: "var(--tone-consult-ink)",
              color: "white",
              border: "1px solid var(--tone-consult-ink)",
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              letterSpacing: "-0.005em",
            }}
          >
            견적 시작 →
          </Link>
          <Link
            href={`/${locale}/services/ppt-design`}
            style={{
              padding: "14px 26px",
              background: "transparent",
              color: "var(--tone-consult-ink)",
              border: "1px solid var(--tone-consult-ink)",
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              letterSpacing: "-0.005em",
            }}
          >
            ← services
          </Link>
        </div>
      </section>
    </>
  );
}
