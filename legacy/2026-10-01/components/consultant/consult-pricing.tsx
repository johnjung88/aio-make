import Link from "next/link";

interface Props {
  locale: string;
}

const packages = [
  {
    name: "Light",
    price: "4.0만~",
    days: "1 DAY",
    slides: "10장 이하",
    desc: "핵심 메시지 중심 단일 덱",
    features: ["10장 이하", "기본 레이아웃 적용", "폰트·컬러 정리", "수정 1회"],
    featured: false,
  },
  {
    name: "Standard",
    price: "9.0만~",
    days: "2-3 DAYS",
    slides: "15-25장",
    desc: "비즈니스 제안·IR 덱",
    features: ["15-25장", "커스텀 다이어그램", "데이터 시각화", "인포그래픽 3종", "수정 2회"],
    featured: true,
  },
  {
    name: "Premium",
    price: "19만~",
    days: "3-5 DAYS",
    slides: "25장+",
    desc: "컨설팅 보고서·브랜드 덱",
    features: ["25장+", "전략 구조 설계 포함", "애니메이션 효과", "인포그래픽 무제한", "수정 3회", "60일 A/S"],
    featured: false,
  },
];

const addons = [
  { label: "추가 슬라이드 (5장 단위)", price: "+3만" },
  { label: "영문 버전 추가", price: "+4.0만~" },
  { label: "긴급 납품 (24h)", price: "+3만" },
  { label: "화자 노트 작성", price: "+2.0만~" },
  { label: "Keynote 변환", price: "+2만" },
  { label: "인쇄용 PDF 최적화", price: "+1만" },
];

export function ConsultPricing({ locale }: Props) {
  return (
    <section
      className="mx-auto"
      style={{ padding: "clamp(56px, 8vw, 80px) clamp(16px, 3vw, 24px)", maxWidth: 1100 }}
    >
      {/* Head */}
      <div className="mx-auto mb-12 max-w-[640px] text-center">
        <div
          className="inline-flex items-center gap-[14px] mb-[22px] text-[11.5px] tracking-[0.3em] uppercase font-medium"
          style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--tone-consult-navy)" }}
        >
          <span style={{ width: 28, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
          Pricing · 투명 견적
        </div>
        <h2
          className="font-bold mb-4"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(26px, 4.8vw, 64px)",
            letterSpacing: "-0.030em",
            lineHeight: 1.0,
            color: "var(--tone-consult-ink)",
          }}
        >
          발표 목적에 맞는{" "}
          <em
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "var(--tone-consult-navy)",
              fontWeight: 500,
            }}
          >
            패키지
          </em>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: 16,
            color: "var(--tone-consult-ink-2)",
            lineHeight: 1.6,
          }}
        >
          장 수·복잡도·납기에 따라 조정됩니다.
        </p>
      </div>

      {/* Cards — items-stretch 보장 + flex flex-col + 버튼 mt-auto */}
      <div
        className="grid mb-8 items-stretch"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 0 }}
      >
        {packages.map((pkg, i) => (
          <div
            key={pkg.name}
            className="flex flex-col h-full"
            style={{
              background: pkg.featured ? "var(--tone-consult-navy)" : "var(--tone-consult-paper)",
              border: "1px solid var(--tone-consult-line)",
              borderLeft: i === 0 ? "1px solid var(--tone-consult-line)" : "none",
              padding: "28px 22px",
              position: "relative",
            }}
          >
            {pkg.featured && (
              <div
                className="absolute top-0 left-0 right-0 py-[6px] text-center text-[9.5px] font-semibold tracking-[0.18em] uppercase"
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  background: "var(--tone-consult-gold)",
                  color: "var(--tone-consult-ink)",
                }}
              >
                Most Popular
              </div>
            )}

            <div style={{ paddingTop: pkg.featured ? 20 : 0 }}>
              <div
                className="mb-1 text-[11px] tracking-[0.1em]"
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  color: pkg.featured ? "rgba(255,255,255,0.55)" : "var(--tone-consult-ink-3)",
                }}
              >
                ▸ {pkg.days} · {pkg.slides}
              </div>
              <div
                className="font-semibold mb-1"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 22,
                  letterSpacing: "-0.02em",
                  color: pkg.featured ? "white" : "var(--tone-consult-ink)",
                }}
              >
                {pkg.name}
              </div>
              <div
                className="font-bold mb-3"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "clamp(30px, 3.2vw, 36px)",
                  letterSpacing: "-0.03em",
                  color: pkg.featured ? "var(--tone-consult-gold)" : "var(--tone-consult-navy)",
                  lineHeight: 1,
                }}
              >
                {pkg.price}
              </div>
              <div
                className="mb-5 text-[13px]"
                style={{
                  fontFamily: "var(--font-pretendard)",
                  color: pkg.featured ? "rgba(255,255,255,0.65)" : "var(--tone-consult-ink-2)",
                }}
              >
                {pkg.desc}
              </div>

              <ul className="flex flex-col gap-[10px] mb-8">
                {pkg.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-[10px] text-[13.5px]"
                    style={{
                      fontFamily: "var(--font-pretendard)",
                      color: pkg.featured ? "rgba(255,255,255,0.8)" : "var(--tone-consult-ink-2)",
                    }}
                  >
                    <span
                      className="w-[5px] h-[5px] rounded-full shrink-0"
                      style={{ background: pkg.featured ? "var(--tone-consult-gold)" : "var(--tone-consult-navy)" }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* 선택 버튼 — 카드 하단으로 (mt-auto가 외부 flex flex-col 에 작용) */}
            <Link
              href={`/${locale}/quote`}
              className="block text-center py-[14px] text-[13.5px] font-semibold transition-all hover:-translate-y-0.5 mt-auto"
              style={{
                fontFamily: "var(--font-inter)",
                background: pkg.featured ? "var(--tone-consult-gold)" : "var(--tone-consult-ink)",
                color: pkg.featured ? "var(--tone-consult-ink)" : "var(--tone-consult-paper)",
                textDecoration: "none",
                letterSpacing: "-0.005em",
              }}
            >
              선택
            </Link>
          </div>
        ))}
      </div>

      {/* Add-ons — 3×2 fixed grid */}
      <div
        className="p-6"
        style={{
          background: "var(--tone-consult-paper-2)",
          border: "1px solid var(--tone-consult-line)",
        }}
      >
        <div
          className="mb-3 text-[10.5px] tracking-[0.2em] uppercase font-medium"
          style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--tone-consult-ink-3)" }}
        >
          Add-ons
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 items-stretch">
          {addons.map((a) => (
            <div
              key={a.label}
              className="flex justify-between items-center px-4 py-3 h-full"
              style={{
                background: "var(--tone-consult-paper)",
                border: "1px solid var(--tone-consult-line)",
                fontFamily: "var(--font-pretendard)",
                fontSize: 13,
              }}
            >
              <span
                style={{
                  color: "var(--tone-consult-ink-2)",
                }}
              >
                {a.label}
              </span>
              <span
                style={{
                  color: "var(--tone-consult-navy)",
                  fontWeight: 600,
                  fontFamily: "var(--font-inter)",
                }}
              >
                {a.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
