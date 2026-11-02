"use client";

const deckTypes = [
  {
    code: "IR",
    name: "IR 덱",
    nameEn: "Investor Deck",
    desc: "시드 · Series A · 크라우드펀딩. 투자자 시선에서 역설계한 구조.",
    tags: ["Problem/Solution", "Traction", "팀 구성", "재무 전망"],
    highlight: true,
  },
  {
    code: "BIZ",
    name: "사업 제안서",
    nameEn: "Business Proposal",
    desc: "공공입찰·B2B 영업·파트너십. 한 장 요약부터 100장 보고서까지.",
    tags: ["Executive Summary", "사업 계획", "ROI 분석"],
    highlight: false,
  },
  {
    code: "RPT",
    name: "컨설팅 보고서",
    nameEn: "Consulting Report",
    desc: "현황 분석 · 전략 제언. McKinsey 스타일 피라미드 구조.",
    tags: ["Issue Tree", "데이터 시각화", "실행 로드맵"],
    highlight: false,
  },
  {
    code: "CORP",
    name: "회사 소개서",
    nameEn: "Company Deck",
    desc: "영업·채용·파트너십. 브랜드 아이덴티티와 사업 강점 중심.",
    tags: ["브랜드", "실적", "팀 소개"],
    highlight: false,
  },
  {
    code: "EDU",
    name: "교육 · 세미나",
    nameEn: "Educational Deck",
    desc: "강의·워크숍·컨퍼런스 발표. 청중 참여를 높이는 시각 구성.",
    tags: ["핵심 메시지", "다이어그램", "Q&A 슬라이드"],
    highlight: false,
  },
  {
    code: "ETC",
    name: "맞춤 제작",
    nameEn: "Custom",
    desc: "위 카테고리에 없는 경우. 목적·청중·분량 상담 후 맞춤 구성.",
    tags: ["1:1 상담", "맞춤 설계"],
    highlight: false,
  },
];

export function ConsultTypes() {
  return (
    <section
      className="mx-auto"
      style={{ padding: "clamp(64px, 10vw, 96px) clamp(16px, 3vw, 24px)", maxWidth: 1280 }}
    >
      {/* Head */}
      <div className="mx-auto mb-14 max-w-[760px] text-center">
        <div
          className="inline-flex items-center gap-[14px] mb-[22px] text-[11.5px] tracking-[0.3em] uppercase font-medium"
          style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--tone-consult-navy)" }}
        >
          <span style={{ width: 28, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
          Deck Types · 6 Formats
        </div>
        <h2
          className="font-bold mb-4"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(28px, 4.8vw, 68px)",
            letterSpacing: "-0.028em",
            lineHeight: 1.0,
            color: "var(--tone-consult-ink)",
          }}
        >
          목적에 맞는{" "}
          <em
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "var(--tone-consult-navy)",
              fontWeight: 500,
            }}
          >덱</em>이 있습니다
        </h2>
        <p
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: "16.5px",
            color: "var(--tone-consult-ink-2)",
            lineHeight: 1.6,
          }}
        >
          IR부터 교육 자료까지.{" "}
          <strong style={{ color: "var(--tone-consult-ink)", fontWeight: 600 }}>청중과 목적</strong>에 맞게 처음부터 설계합니다.
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}
      >
        {deckTypes.map((deck) => (
          <div
            key={deck.code}
            className={`group transition-all duration-200 cursor-default ${
              !deck.highlight
                ? "hover:!border-[var(--tone-consult-navy)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(14,26,43,0.08)]"
                : ""
            }`}
            style={{
              background: deck.highlight ? "var(--tone-consult-navy)" : "var(--tone-consult-paper)",
              border: `1px solid ${deck.highlight ? "var(--tone-consult-navy)" : "var(--tone-consult-line)"}`,
              padding: "20px 22px",
              position: "relative",
            }}
          >
            {deck.highlight && (
              <div
                className="absolute top-0 right-0 px-3 py-[5px] text-[9.5px] font-semibold tracking-[0.16em] uppercase"
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  background: "var(--tone-consult-gold)",
                  color: "var(--tone-consult-ink)",
                }}
              >
                Most Popular
              </div>
            )}

            <div
              className="mb-[6px] text-[11px] font-semibold tracking-[0.12em]"
              style={{
                fontFamily: "var(--font-ibm-plex-mono)",
                color: deck.highlight ? "var(--tone-consult-gold)" : "var(--tone-consult-navy)",
              }}
            >
              {deck.code}
            </div>

            <h3
              className="font-bold mb-1"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 18,
                letterSpacing: "-0.015em",
                color: deck.highlight ? "white" : "var(--tone-consult-ink)",
              }}
            >
              {deck.name}
            </h3>
            <div
              className="mb-3 text-[11.5px] font-medium"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                color: deck.highlight ? "rgba(255,255,255,0.55)" : "var(--tone-consult-ink-3)",
              }}
            >
              {deck.nameEn}
            </div>

            <p
              className="mb-4 text-[13.5px]"
              style={{
                fontFamily: "var(--font-pretendard)",
                color: deck.highlight ? "rgba(255,255,255,0.75)" : "var(--tone-consult-ink-2)",
                lineHeight: 1.6,
              }}
            >
              {deck.desc}
            </p>

            <div className="flex flex-wrap gap-[6px]">
              {deck.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-[4px] text-[11px]"
                  style={{
                    fontFamily: "var(--font-inter)",
                    background: deck.highlight ? "rgba(255,255,255,0.1)" : "var(--tone-consult-paper-2)",
                    border: `1px solid ${deck.highlight ? "rgba(255,255,255,0.18)" : "var(--tone-consult-line)"}`,
                    color: deck.highlight ? "rgba(255,255,255,0.8)" : "var(--tone-consult-ink-2)",
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
