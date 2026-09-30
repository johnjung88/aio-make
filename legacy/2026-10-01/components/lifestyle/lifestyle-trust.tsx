"use client";

const trustItems = [
  { num: "42", label: "상세페이지 납품" },
  { num: "+42%", label: "평균 전환율 향상" },
  { num: "1-3일", label: "빠른 납기" },
  { num: "4.9", label: "의뢰인 평점" },
  { num: "30일", label: "무상 A/S" },
];

export function LifestyleTrust() {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
      style={{
        padding: "clamp(24px, 3.5vw, 48px) clamp(16px, 3vw, 36px)",
        maxWidth: 1480,
        margin: "0 auto",
        borderTop: "1px solid var(--tone-life-line)",
        borderBottom: "1px solid var(--tone-life-line)",
        background: "var(--tone-life-cream-2)",
      }}
    >
      {trustItems.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-3 py-4"
        >
          <div
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "var(--tone-life-ink)",
              fontWeight: 600,
              fontSize: "clamp(34px, 4vw, 52px)",
              letterSpacing: "-0.028em",
              lineHeight: 1,
            }}
          >
            {item.num}
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "clamp(9.5px, 0.85vw, 11px)",
              color: "var(--tone-life-ink-2)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
