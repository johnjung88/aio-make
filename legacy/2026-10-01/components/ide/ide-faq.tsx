"use client";

import { useState } from "react";

const faqs = [
  { num: "Q.01", q: "병원·법률 사무소처럼 전문 업종 사이트도 가능한가요?",        a: "네, 가능합니다. 의료광고법·표시광고법 등 업종별 가이드라인을 인지하고 작업합니다. 의원·한의원·치과·변호사·세무사·법무사·노무사 등 20개+ 전문 업종 사이트 경험이 있습니다." },
  { num: "Q.02", q: "5일 납품이 정말 가능한가요? 퀄리티가 떨어지지 않나요?",     a: "대부분의 의뢰는 5일 안에 끝납니다. 비결은 업종별 검증된 패턴을 기반으로 시작하기 때문입니다. 의뢰인 만족도 4.9/5를 유지하고 있습니다." },
  { num: "Q.03", q: "웹사이트와 쇼핑몰 견적은 왜 따로 나뉘나요?",                a: "구축 체계가 다릅니다. 웹사이트는 페이지 수와 다국어·CMS 위주로, 쇼핑몰은 결제·배송·회원 시스템 같은 기능 단위로 결정됩니다." },
  { num: "Q.04", q: "결제 시스템이나 예약 시스템도 만들 수 있나요?",              a: "결제는 Stripe·카카오페이·토스, 예약은 구글 캘린더 연동·자체 예약 시스템 모두 가능합니다. 추가 옵션으로 견적이 산출됩니다." },
  { num: "Q.05", q: "호스팅·도메인은 별도인가요?",                               a: "호스팅·도메인은 별도입니다. 구입·연동까지 도와드립니다 (.com 약 1.5만/년)." },
  { num: "Q.06", q: "코드 소스도 받을 수 있나요?",                               a: "네, 전체 소스코드를 GitHub로 인계해드립니다. 운영 가이드 영상도 함께 제공하므로 인수인계가 쉽습니다." },
  { num: "Q.07", q: "1개월 무상 A/S는 어떤 범위까지인가요?",                     a: "납품 후 30일간 발생하는 버그 수정·반응형 미세 조정·콘텐츠 교체는 무료입니다. 신규 기능 추가나 디자인 전면 수정은 별도 견적입니다." },
  { num: "Q.08", q: "지방에서도 작업 가능한가요?",                               a: "전국 어디든 가능합니다. 모든 작업은 화상·메신저로 진행되어 의뢰인이 서울에 계시지 않아도 됩니다. 텔레그램으로 24/7 즉시 응대 가능합니다." },
];

export function IdeFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section style={{ padding: "80px clamp(16px,3vw,24px)", maxWidth: 980, margin: "0 auto" }}>
      {/* heading */}
      <div style={{ margin: "0 auto 40px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-mint)", marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--tone-ide-fg-3)" }}>$</span>
          <span style={{ color: "var(--tone-ide-syntax-string)" }}>aio faq</span>
          <span style={{ color: "var(--tone-ide-amber)" }}>--all</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(30px,4.2vw,52px)", fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.08, color: "var(--tone-ide-fg)", marginBottom: 14 }}>
          자주 묻는 <span style={{ color: "var(--tone-ide-mint)" }}>질문</span>
        </h2>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 15.5, color: "var(--tone-ide-fg-2)", lineHeight: 1.6, maxWidth: 540, margin: "0 auto" }}>
          결정 전에 가장 많이 받는 8가지.
        </p>
      </div>

      {/* FAQ list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.num}
              style={{ background: "var(--tone-ide-bg-2)", border: `1px solid ${isOpen ? "var(--tone-ide-mint)" : "var(--tone-ide-line)"}`, borderRadius: 6, overflow: "hidden", transition: "border-color 0.2s" }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                style={{ width: "100%", padding: "16px 22px", fontFamily: "var(--font-jetbrains)", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, background: "transparent", border: "none", color: "var(--tone-ide-fg)", textAlign: "left" }}
              >
                <span style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1 }}>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-mint)", flexShrink: 0, paddingTop: 2 }}>{f.num}</span>
                  <span>{f.q}</span>
                </span>
                <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 14, color: isOpen ? "var(--tone-ide-mint)" : "var(--tone-ide-fg-3)", transition: "transform 0.3s, color 0.2s", transform: isOpen ? "rotate(45deg)" : "none", lineHeight: 1, flexShrink: 0 }}>+</span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 22px 18px 50px", fontFamily: "var(--font-pretendard)", fontSize: 13.5, color: "var(--tone-ide-fg-2)", lineHeight: 1.7 }}>
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
