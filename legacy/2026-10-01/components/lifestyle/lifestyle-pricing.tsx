import Link from "next/link";

interface Props {
  locale: string;
}

const packages = [
  {
    name: "Light",
    price: "4.9만~",
    days: "1 DAY",
    desc: "단일 상품 상세페이지",
    features: ["1개 상품", "기본 섹션 6–8단", "모바일 최적화", "수정 1회"],
    featured: false,
  },
  {
    name: "Standard",
    price: "9.9만~",
    days: "2-3 DAYS",
    desc: "전환율 중심 상세페이지",
    features: ["1개 상품", "풀 섹션 10–14단", "Before/After 구성", "리뷰 섹션", "수정 2회"],
    featured: true,
  },
  {
    name: "Premium",
    price: "17.9만~",
    days: "3 DAYS",
    desc: "브랜드형 상세페이지",
    features: ["1개 상품", "브랜드 스토리", "상세 성분/소재 분석", "동영상 삽입 구성", "수정 3회", "60일 A/S"],
    featured: false,
  },
];

const addons = [
  { label: "추가 상품 (동일 포맷)", price: "+2만/개" },
  { label: "카피라이팅 강화", price: "+3만~" },
  { label: "긴급 작업 (24h)", price: "+2만" },
  { label: "영상 스크립트", price: "+3만~" },
];

export function LifestylePricing({ locale }: Props) {
  return (
    <section
      className="mx-auto"
      style={{ padding: "clamp(56px, 8vw, 80px) clamp(16px, 3vw, 24px)", maxWidth: 1100 }}
    >
      {/* Head */}
      <div className="mx-auto mb-12 max-w-[640px] text-center">
        <div
          className="inline-flex items-center gap-[14px] mb-[22px] text-[11.5px] tracking-[0.28em] uppercase"
          style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-life-rose)" }}
        >
          <span style={{ width: 28, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />
          Pricing · 투명 견적
          <span style={{ width: 28, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />
        </div>
        <h2
          className="font-medium mb-4"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(28px, 5vw, 64px)",
            letterSpacing: "-0.025em",
            lineHeight: 1.0,
            color: "var(--tone-life-ink)",
          }}
        >
          <em style={{ fontStyle: "italic", color: "var(--tone-life-rose)" }}>결과</em>에 맞는 가격
        </h2>
        <p
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: 16,
            color: "var(--tone-life-ink-2)",
            lineHeight: 1.6,
          }}
        >
          단일 상품부터 브랜드형까지. 목표에 맞는 패키지를 선택하세요.
        </p>
      </div>

      {/* Package cards */}
      <div
        className="grid mb-8 items-stretch"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}
      >
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="flex flex-col rounded-xl overflow-hidden h-full"
            style={{
              background: pkg.featured ? "var(--tone-life-ink)" : "var(--tone-life-cream)",
              border: `1.5px solid ${pkg.featured ? "var(--tone-life-ink)" : "var(--tone-life-line)"}`,
              boxShadow: pkg.featured ? "0 20px 60px rgba(42,36,24,0.18)" : "none",
              position: "relative",
            }}
          >
            {pkg.featured && (
              <div
                className="text-center py-[6px] text-[10.5px] font-semibold tracking-[0.18em] uppercase"
                style={{
                  fontFamily: "var(--font-jakarta)",
                  background: "var(--tone-life-rose)",
                  color: "white",
                }}
              >
                Most Popular
              </div>
            )}

            <div className="p-6 flex flex-col flex-1">
              <div
                className="mb-1 text-[11px] tracking-[0.12em]"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  color: pkg.featured ? "rgba(250,245,238,0.55)" : "var(--tone-life-ink-3)",
                }}
              >
                ▸ {pkg.days}
              </div>
              <div
                className="font-medium mb-1"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontSize: 20,
                  color: pkg.featured ? "rgba(250,245,238,0.9)" : "var(--tone-life-ink-2)",
                  fontStyle: "italic",
                }}
              >
                {pkg.name}
              </div>
              <div
                className="font-semibold mb-2"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontSize: "clamp(28px,3.5vw,40px)",
                  letterSpacing: "-0.025em",
                  color: pkg.featured ? "var(--tone-life-cream)" : "var(--tone-life-ink)",
                  fontStyle: "italic",
                }}
              >
                {pkg.price}
              </div>
              <div
                className="mb-6 text-[13px]"
                style={{
                  fontFamily: "var(--font-pretendard)",
                  color: pkg.featured ? "rgba(250,245,238,0.7)" : "var(--tone-life-ink-2)",
                }}
              >
                {pkg.desc}
              </div>

              <ul className="flex flex-col gap-[8px] mb-6 flex-1">
                {pkg.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-[10px] text-[13.5px]"
                    style={{
                      fontFamily: "var(--font-pretendard)",
                      color: pkg.featured ? "rgba(250,245,238,0.85)" : "var(--tone-life-ink-2)",
                    }}
                  >
                    <span
                      className="w-[14px] h-[14px] rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold"
                      style={{
                        background: pkg.featured ? "var(--tone-life-rose)" : "var(--tone-life-cream-2)",
                        color: pkg.featured ? "white" : "var(--tone-life-rose)",
                        border: pkg.featured ? "none" : "1px solid var(--tone-life-rose)",
                      }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/quote`}
                className="block text-center py-[12px] text-[13.5px] font-semibold rounded-full transition-all hover:-translate-y-0.5 mt-auto"
                style={{
                  fontFamily: "var(--font-jakarta)",
                  background: pkg.featured ? "var(--tone-life-rose)" : "var(--tone-life-ink)",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                선택
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <div
        className="p-5 rounded-xl"
        style={{
          background: "var(--tone-life-cream-2)",
          border: "1px solid var(--tone-life-line)",
        }}
      >
        <div
          className="mb-3 text-[11.5px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-life-ink-3)" }}
        >
          Add-ons
        </div>
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}
        >
          {addons.map((a) => (
            <div
              key={a.label}
              className="flex justify-between items-center px-4 py-[10px] rounded-lg"
              style={{
                background: "var(--tone-life-cream)",
                border: "1px solid var(--tone-life-line)",
                fontFamily: "var(--font-pretendard)",
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--tone-life-ink-2)" }}>{a.label}</span>
              <span style={{ color: "var(--tone-life-rose)", fontWeight: 600 }}>{a.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
