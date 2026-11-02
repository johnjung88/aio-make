"use client";

const trustItems = [
  { num: "38", label: "PPT 납품" },
  { num: "$2M+", label: "투자 유치 지원" },
  { num: "1-3일", label: "빠른 납기" },
  { num: "4.9", label: "의뢰인 평점" },
];

export function ConsultTrust() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4"
      style={{
        padding: "clamp(28px,3vw,40px) clamp(20px,3vw,36px)",
        maxWidth: 1480,
        margin: "0 auto",
        borderTop: "1px solid var(--tone-consult-ink)",
        borderBottom: "1px solid var(--tone-consult-ink)",
      }}
    >
      {trustItems.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-3 py-4"
        >
          <div
            style={{
              fontFamily: "var(--font-inter)",
              color: "var(--tone-consult-ink)",
              fontWeight: 700,
              fontSize: "clamp(36px, 4vw, 52px)",
              letterSpacing: "-0.028em",
              lineHeight: 1,
            }}
          >
            {item.num}
          </div>
          <div
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "clamp(9.5px, 0.85vw, 11px)",
              color: "var(--tone-consult-ink-2)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
