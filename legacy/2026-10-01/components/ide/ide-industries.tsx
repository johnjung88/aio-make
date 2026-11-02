"use client";

const industries = [
  {
    name: "병원 · 의료",
    desc: "의원·한의원·치과·성형외과. 예약·진료 안내·블로그.",
    tags: ["예약", "진료시간", "의료광고법"],
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" width="18" height="18">
        <path d="M19 11h-4V7a3 3 0 0 0-6 0v4H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="16" r="2"/>
      </svg>
    ),
  },
  {
    name: "법률 · 세무",
    desc: "변호사·법무사·세무사·노무사. 상담·약도.",
    tags: ["상담", "업무분야", "전문가"],
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" width="18" height="18">
        <rect x="3" y="6" width="18" height="14" rx="2"/>
        <path d="M3 10h18M8 2v4M16 2v4"/>
      </svg>
    ),
  },
  {
    name: "교육 · 학원",
    desc: "학원·과외·온라인 강의. 강사·시간표·수강 신청.",
    tags: ["강사", "시간표", "수강 신청"],
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" width="18" height="18">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    name: "쇼핑몰 · D2C",
    desc: "카페24·자사몰. 메인·상세·결제·배송 흐름.",
    tags: ["카페24", "Stripe", "모바일 우선"],
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" width="18" height="18">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    name: "F&B · 카페",
    desc: "음식점·카페·베이커리. 메뉴·매장·주문·인스타.",
    tags: ["메뉴", "매장", "주문"],
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" width="18" height="18">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4zM3 19a2 2 0 0 0 2 2h1v-6H3v4z"/>
      </svg>
    ),
  },
  {
    name: "뷰티 · 미용",
    desc: "미용실·네일샵·피부관리. 시술·예약·후기.",
    tags: ["예약", "시술 메뉴", "후기"],
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" width="18" height="18">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    name: "부동산",
    desc: "중개·분양·임대. 매물·상세·지도·문의.",
    tags: ["매물", "지도", "문의"],
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" width="18" height="18">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    name: "일반 · 기타",
    desc: "스타트업·자영업·NGO. 분야 무관 일반 사이트.",
    tags: ["맞춤 기획", "1:1 상담"],
    icon: (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" width="18" height="18">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
];

export function IdeIndustries() {
  return (
    <section
      className="mx-auto"
      style={{ padding: "80px clamp(16px,3vw,24px)", maxWidth: 1280 }}
    >
      {/* Head */}
      <div className="mx-auto mb-14 max-w-[760px] text-center">
        <div
          className="mb-[14px] inline-flex items-center gap-2 text-[12px]"
          style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-ide-mint)" }}
        >
          <span style={{ color: "var(--tone-ide-fg-3)" }}>$</span>
          <span style={{ color: "var(--tone-ide-syntax-string)" }}>aio modules</span>
          <span style={{ color: "var(--tone-ide-amber)" }}>--by-industry</span>
        </div>
        <h2
          className="font-bold mb-[14px]"
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "clamp(30px,4.2vw,52px)",
            letterSpacing: "-0.022em",
            lineHeight: 1.08,
            color: "var(--tone-ide-fg)",
          }}
        >
          업종마다{" "}
          <span style={{ color: "var(--tone-ide-mint)" }}>다른 답</span>이 있습니다
        </h2>
        <p
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: "16.5px",
            color: "var(--tone-ide-fg-2)",
            lineHeight: 1.6,
          }}
        >
          병원엔{" "}
          <code style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.9em", background: "var(--tone-ide-bg-3)", border: "1px solid var(--tone-ide-line)", padding: "2px 8px", borderRadius: 4, color: "var(--tone-ide-mint)" }}>예약</code>
          , 법률엔{" "}
          <code style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.9em", background: "var(--tone-ide-bg-3)", border: "1px solid var(--tone-ide-line)", padding: "2px 8px", borderRadius: 4, color: "var(--tone-ide-mint)" }}>상담폼</code>
          , 쇼핑몰엔{" "}
          <code style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.9em", background: "var(--tone-ide-bg-3)", border: "1px solid var(--tone-ide-line)", padding: "2px 8px", borderRadius: 4, color: "var(--tone-ide-mint)" }}>결제</code>
          .{" "}
          <strong style={{ color: "var(--tone-ide-fg)", fontWeight: 600 }}>업종별 핵심 기능</strong>을 미리 설계해 시작합니다.
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        {industries.map((ind) => (
          <div
            key={ind.name}
            className="group transition-all duration-200 cursor-default"
            style={{
              background: "var(--tone-ide-bg-2)",
              border: "1px solid var(--tone-ide-line)",
              borderRadius: 6,
              padding: "20px 22px",
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className="flex items-center justify-center w-10 h-10"
                style={{
                  background: "var(--tone-ide-bg-3)",
                  border: "1px solid var(--tone-ide-line-2)",
                  borderRadius: 6,
                  color: "var(--tone-ide-mint)",
                }}
              >
                {ind.icon}
              </div>
              <span
                className="text-[10px] tracking-[0.1em]"
                style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-ide-fg-3)" }}
              >
                .tsx
              </span>
            </div>

            <h3
              className="font-bold mb-2"
              style={{
                fontFamily: "var(--font-pretendard)",
                fontSize: 15,
                color: "var(--tone-ide-fg)",
              }}
            >
              {ind.name}
            </h3>
            <p
              className="mb-3 text-[13px] leading-relaxed"
              style={{
                fontFamily: "var(--font-pretendard)",
                color: "var(--tone-ide-fg-2)",
                lineHeight: 1.55,
              }}
            >
              {ind.desc}
            </p>

            <div className="flex flex-wrap gap-[6px]">
              {ind.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-[9px] py-[3px] text-[11px]"
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    background: "var(--tone-ide-bg-3)",
                    border: "1px solid var(--tone-ide-line-2)",
                    borderRadius: 3,
                    color: "var(--tone-ide-fg-3)",
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
