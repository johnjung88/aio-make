export function MagazineBanner() {
  const items = [
    "결과를 먼저 보고 맡기는 외주",
    "1시간 응답",
    "5일 납품",
    "1개월 무상 A/S",
    "의뢰인 평점 4.9",
    "각 분야 전문가가 직접",
  ];

  const track = (
    <span className="inline-flex items-center gap-14 px-14">
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-8">
          <span>{item}</span>
          <span
            style={{
              color: "var(--tone-magazine-red)",
              fontFamily: "var(--font-marcellus)",
              fontSize: 14,
            }}
          >
            ✦
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <section
      className="overflow-hidden py-4"
      style={{ background: "var(--tone-magazine-ink)", color: "var(--tone-magazine-paper)" }}
      aria-hidden="true"
    >
      <div className="inline-flex whitespace-nowrap animate-marquee">
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          {track}
          {track}
        </span>
      </div>
    </section>
  );
}
