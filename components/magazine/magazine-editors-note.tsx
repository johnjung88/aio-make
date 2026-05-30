import { MagazineEyebrow } from "./magazine-eyebrow";

const pillars = [
  {
    num: "1",
    label: "No 01 · Speed",
    title: "빠른",
    titleEm: "응대",
    body: "1시간 안에 답하고, 24시간 안에 견적을 보냅니다 — 의뢰인이 다음 일을 바로 시작할 수 있도록",
    metric: { label: "평균 응답", value: "23분" },
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    num: "2",
    label: "No 02 · Output",
    title: "빠른",
    titleEm: "결과물",
    body: "5일 안에 전달하고, 매일 진행 상황을 공유합니다 — 완성까지 기다리는 시간을 줄입니다",
    metric: { label: "평균 납기", value: "4.6일" },
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    num: "3",
    label: "No 03 · Quality",
    title: "높은",
    titleEm: "완성도",
    body: "운영 중인 사이트가 곧 우리의 결과물입니다 — 데모가 아닌 실제 결과를 보고 결정하세요",
    metric: { label: "만족도", value: "4.9 / 5" },
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    num: "4",
    label: "No 04 · Care",
    title: "꾸준한",
    titleEm: "유지보수",
    body: "납품 후 1개월 무상 A/S, 텔레그램으로 언제든 연락주세요 — 납품이 끝이 아니라 운영의 시작입니다",
    metric: { label: "재의뢰율", value: "98%" },
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export function MagazineEditorsNote() {
  return (
    <section
      id="editors"
      className="max-w-[1200px] mx-auto relative text-center"
      style={{ padding: "var(--space-section) var(--space-edge)" }}
    >
      {/* Eyebrow */}
      <MagazineEyebrow className="mb-4 md:mb-6">Editor&apos;s Note · 04 Pillars</MagazineEyebrow>

      {/* H2 — 토큰 */}
      <h2
        className="font-normal mx-auto mb-5 md:mb-7 max-w-[1100px]"
        style={{ fontFamily: "var(--font-marcellus)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-display)", letterSpacing: "-0.014em", color: "var(--tone-magazine-ink)" }}
      >
        의뢰 전 가장
        <br />
        궁금한{" "}
        <em style={{ fontFamily: "var(--font-fraunces)", fontStyle: "normal", fontWeight: 500 }}>네 가지</em>
      </h2>

      {/* Lede */}
      <p
        className="mx-auto mb-12 md:mb-20"
        style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: "var(--leading-body)", color: "var(--tone-magazine-ink-2)", maxWidth: "42ch", fontWeight: 400 }}
      >
        속도 · 결과물 · 완성도 · 유지보수
        <br />
        외주 결정의 네 축에서,{" "}
        <strong style={{ color: "var(--tone-magazine-ink)", fontWeight: 600 }}>평균 이상의 답</strong>을 드립니다
      </p>

      {/* 2x2 Grid */}
      <div
        className="grid grid-cols-2 mx-auto max-w-[880px]"
        style={{
          border: "1px solid var(--tone-magazine-ink)",
        }}
      >
        {pillars.map((p, i) => (
          <div
            key={i}
            className={`flex flex-col items-center group cursor-default transition-colors duration-500 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : "border-b-0"}`}
            style={{
              padding: "clamp(18px, 3vw, 40px) clamp(12px, 2vw, 28px)",
              borderColor: "var(--tone-magazine-line-2)",
            }}
          >
            {/* Illust */}
            <div className="relative w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-[18px] shrink-0">
              <div
                className="absolute inset-0 rounded-full transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-105"
                style={{ border: "1px solid var(--tone-magazine-ink)" }}
              />
              <div
                className="absolute text-[var(--tone-magazine-ink)]"
                style={{ inset: "clamp(10px, 2.5vw, 16px)" }}
              >
                {p.icon}
              </div>
              <div
                className="absolute -top-1 -right-1 w-[18px] h-[18px] md:w-[22px] md:h-[22px] rounded-full grid place-items-center"
                style={{
                  background: "var(--tone-magazine-ink)",
                  color: "var(--tone-magazine-paper)",
                  fontFamily: "var(--font-marcellus)",
                  fontSize: 11,
                  lineHeight: 1,
                }}
              >
                {p.num}
              </div>
            </div>

            <div
              className="mb-2 md:mb-3"
              style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(9px, 1vw, 10.5px)", color: "var(--tone-magazine-ink-2)", letterSpacing: "0.22em", textTransform: "uppercase" }}
            >
              {p.label}
            </div>

            <h3
              className="font-normal mb-3"
              style={{ fontFamily: "var(--font-marcellus)", fontSize: "var(--text-h3)", lineHeight: "var(--leading-head)", letterSpacing: "-0.01em", color: "var(--tone-magazine-ink)" }}
            >
              {p.title}{" "}
              <em style={{ fontFamily: "var(--font-fraunces)", fontStyle: "normal", fontWeight: 500 }}>
                {p.titleEm}
              </em>
            </h3>

            <p
              className="mb-3 md:mb-[18px] max-w-[280px]"
              style={{ fontFamily: "var(--font-pretendard)", fontSize: "clamp(12px, 1.3vw, 14px)", lineHeight: 1.75, color: "var(--tone-magazine-ink-2)", fontWeight: 400 }}
            >
              {p.body}
            </p>

            <div
              className="inline-flex items-baseline gap-2.5 pt-[14px] flex-wrap justify-center mt-auto"
              style={{
                borderTop: "1px solid var(--tone-magazine-line)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "clamp(9px, 1vw, 10.5px)",
                  color: "var(--tone-magazine-ink-3)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                → {p.metric.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-marcellus)",
                  fontSize: "clamp(17px, 2vw, 28px)",
                  color: "var(--tone-magazine-ink)",
                  letterSpacing: "-0.012em",
                  lineHeight: 1,
                }}
              >
                {p.metric.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
