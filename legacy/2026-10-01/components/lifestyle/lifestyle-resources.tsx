"use client";
import { useState } from "react";
import Link from "next/link";

interface Props { locale: string }

const filters = [
  { id: "all", label: "전체", count: 12 },
  { id: "conversion", label: "전환·CRO", count: 3 },
  { id: "vertical", label: "업종별", count: 4 },
  { id: "copy", label: "카피", count: 3 },
  { id: "basics", label: "기본기", count: 2 },
];

type Cover = "beauty" | "food" | "fashion" | "health" | "living" | "kids" | "tech" | "copy" | "basic";

const coverGrads: Record<Cover, string> = {
  beauty:  "linear-gradient(135deg,#F5C2C7,#E8889A)",
  food:    "linear-gradient(135deg,#fcecc8,#d4a574)",
  fashion: "linear-gradient(135deg,#D6DCD0,#A8B8A4)",
  health:  "linear-gradient(135deg,#d4e8d0,#7B8E3F)",
  living:  "linear-gradient(135deg,#ece0c4,#a88a6c)",
  kids:    "linear-gradient(135deg,#FFE0A0,#FFB347)",
  tech:    "linear-gradient(135deg,#d0d8e0,#6a7888)",
  copy:    "linear-gradient(135deg,#e0c8d8,#B07B98)",
  basic:   "linear-gradient(135deg,#faf5ee,#ece0c4)",
};
const coverTextColor: Record<Cover, string> = {
  beauty: "#3A1A18", food: "#3A2008", fashion: "#1a2018", health: "#1a2418",
  living: "#2a1a08", kids: "#2a1408", tech: "#1a1c20", copy: "#2a0e1a", basic: "#2A2418",
};

const resources = [
  { cat: "conversion", vol: "Vol. 01", cover: "beauty" as Cover, num: "5", lbl: "전환 조건",   seal: "conversion guide", tag: "Guide · 24 pages", title: "전환율 2배 올리는 ", titleEm: "5조건", desc: "후킹·신뢰·가독성·CTA·A/B — 실제 매출 사례 8건과 BAD/GOOD 비교.", foot: "PDF · 24p · 3.2MB" },
  { cat: "conversion", vol: "Vol. 02", cover: "copy" as Cover,   num: "A/B", lbl: "테스트법",  seal: "cro workbook",     tag: "Workbook · 14 pages", title: "혼자 하는 ", titleEm: "A/B 테스트 입문", desc: "셀러 혼자 GA4·Hotjar로 단순 A/B 돌리는 법 — 도구 선택·표본·해석.", foot: "PDF · 14p · 2.0MB" },
  { cat: "conversion", vol: "Vol. 03", cover: "health" as Cover, num: "M", lbl: "모바일 UX",  seal: "mobile checklist",  tag: "Checklist · 10 pages", title: "모바일 가독성 ", titleEm: "16가지", desc: "엄지존·스크롤 깊이·로딩 속도·CTA 크기 — 모바일 70% 매출 사이트 필수.", foot: "PDF · 10p · 1.4MB" },
  { cat: "vertical",   vol: "Vol. 04", cover: "beauty" as Cover, num: "B", lbl: "Beauty",      seal: "vertical template", tag: "Template · 12 pages", title: "뷰티·코스메틱 ", titleEm: "구조 템플릿", desc: "성분·임상·전후·리뷰·세트가 — 뷰티 셀러 매출 1억 페이지의 8단 구조.", foot: "PDF · 12p · 2.4MB" },
  { cat: "vertical",   vol: "Vol. 05", cover: "food" as Cover,   num: "F", lbl: "Food",         seal: "vertical template", tag: "Template · 12 pages", title: "식품·F&B ", titleEm: "구조 템플릿", desc: "원재료·식약처·맛 표현·배송·재구매 — 신선식품·간편식 분리해서 정리.", foot: "PDF · 12p · 2.6MB" },
  { cat: "vertical",   vol: "Vol. 06", cover: "fashion" as Cover,num: "F", lbl: "Fashion",      seal: "vertical template", tag: "Template · 12 pages", title: "패션·잡화 ", titleEm: "구조 템플릿", desc: "사이즈 가이드·소재·핏 컷·코디 제안·반품 — 패션 매출 페이지의 9단.", foot: "PDF · 12p · 2.8MB" },
  { cat: "vertical",   vol: "Vol. 07", cover: "living" as Cover, num: "L", lbl: "Living",        seal: "vertical template", tag: "Template · 10 pages", title: "리빙·인테리어 ", titleEm: "구조 템플릿", desc: "크기 비교·공간 연출·조립·A/S — 가구·소품 매출 사이트의 7단 구조.", foot: "PDF · 10p · 2.2MB" },
  { cat: "copy",       vol: "Vol. 08", cover: "copy" as Cover,   num: "50", lbl: "Hook",         seal: "copywriting workbook", tag: "Workbook · 20 pages", title: "후킹 카피 ", titleEm: "50문장 사전", desc: "헤드라인·서브카피·CTA — USP만 채우면 즉시 쓰는 빈칸 카피 50문장.", foot: "PDF · 20p · 1.8MB" },
  { cat: "copy",       vol: "Vol. 09", cover: "kids" as Cover,   num: "CTA", lbl: "버튼 카피",   seal: "cta library",      tag: "Library · 8 pages", title: "구매 버튼 카피 ", titleEm: "30선", desc: '"지금 사기"는 그만 — 업종별 전환 잘 되는 CTA 버튼 카피 30개와 적용 예.', foot: "PDF · 8p · 1.0MB" },
  { cat: "copy",       vol: "Vol. 10", cover: "tech" as Cover,   num: "FAQ", lbl: "답변 공식",   seal: "faq formula",      tag: "Guide · 12 pages", title: "FAQ ", titleEm: "설계 공식", desc: "반품·배송·결제·사이즈 — 매출 깎아먹는 7개 질문에 신뢰 주는 답변 공식.", foot: "PDF · 12p · 1.6MB" },
  { cat: "basics",     vol: "Vol. 11", cover: "basic" as Cover,  num: "📷", lbl: "사진 가이드",  seal: "photo checklist",  tag: "Checklist · 16 pages", title: "제품 사진 ", titleEm: "준비 가이드", desc: "셀러가 직접 찍을 때 — 조명·각도·소품·해상도와 BAD/GOOD 비교 컷.", foot: "PDF · 16p · 4.2MB" },
  { cat: "basics",     vol: "Vol. 12", cover: "basic" as Cover,  num: "📦", lbl: "의뢰 준비",    seal: "brief template",   tag: "Brief · 6 pages", title: "외주 의뢰서 ", titleEm: "템플릿", desc: "의뢰 전 정리할 12가지 — USP·타겟·레퍼런스·일정·예산 채우는 빈 양식.", foot: "DOCX + PDF · 6p" },
];

export function LifestyleResources({ locale }: Props) {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? resources : resources.filter((r) => r.cat === active);

  return (
    <>
      {/* Hero */}
      <section style={{ padding: "80px 24px 32px", maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11.5, color: "var(--tone-life-rose)", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 22, display: "inline-flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 28, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />
          Field Notes · 무료 다운로드
          <span style={{ width: 28, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />
        </div>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(40px,6vw,88px)", fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.0, color: "var(--tone-life-ink)", marginBottom: 22 }}>
          상세페이지 한 장이<br />
          <em style={{ fontStyle: "italic", color: "var(--tone-life-rose)" }}>매출</em>을 바꿉니다
        </h1>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 16.5, lineHeight: 1.65, color: "var(--tone-life-ink-2)", maxWidth: 660, margin: "0 auto 28px" }}>
          의뢰 전 알아두면 좋은 것들 — 89개 커머스 상세페이지를 만들면서 갈고 닦은{" "}
          <em style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", color: "var(--tone-life-rose)", fontWeight: 500 }}>실전 가이드 12편</em>을 무료로 다운로드하세요.
        </p>
        <div style={{ display: "inline-flex", gap: 28, fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-life-ink-3)", letterSpacing: "0.12em", textTransform: "uppercase", flexWrap: "wrap", justifyContent: "center" }}>
          {["이메일 인증 X","월 1편 신규 발행","실제 매출 케이스 기반"].map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "var(--tone-life-rose)", fontSize: 8 }}>◆</span>{t}
            </span>
          ))}
        </div>

        <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap", marginTop: 36, padding: 6, background: "var(--tone-life-cream-2)", border: "1px solid var(--tone-life-line)", borderRadius: 100, justifyContent: "center" }}>
          {filters.map((f) => (
            <button key={f.id} onClick={() => setActive(f.id)} style={{ padding: "9px 16px", borderRadius: 100, border: "1px solid transparent", background: active === f.id ? "var(--tone-life-rose)" : "transparent", color: active === f.id ? "white" : "var(--tone-life-ink-2)", fontFamily: "var(--font-jakarta)", fontSize: 12.5, cursor: "pointer", fontWeight: active === f.id ? 600 : 500, transition: "all 0.2s" }}>
              {f.label} <span style={{ opacity: 0.55, fontSize: 10, fontFamily: "var(--font-jetbrains)" }}>{f.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section style={{ padding: "24px 24px 0", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", background: "var(--tone-life-cream-2)", border: "1px solid var(--tone-life-line)", borderRadius: 14, overflow: "hidden", textAlign: "left" }}>
          <div style={{ aspectRatio: "3/4", position: "relative", padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "linear-gradient(135deg,#F5C2C7,#E8889A 50%,#C5475F)", overflow: "hidden" }}>
            <span style={{ position: "absolute", top: 18, right: 18, padding: "6px 14px", background: "var(--tone-life-ink)", color: "var(--tone-life-cream)", fontFamily: "var(--font-jakarta)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: 100, zIndex: 2 }}>★ Editor&apos;s Pick</span>
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(58,26,24,0.85)", position: "relative", zIndex: 1 }}>aio · field notes <strong>vol. 01</strong></span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "clamp(80px,11vw,140px)", fontWeight: 500, lineHeight: 0.85, color: "#3A1A18", letterSpacing: "-0.04em" }}>5</div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(20px,2.2vw,28px)", fontWeight: 500, color: "#3A1A18", marginTop: 6, letterSpacing: "-0.01em" }}>조건으로 본 전환율</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(58,26,24,0.7)", position: "relative", zIndex: 1 }}>
              <span>★ 4.9 / 1,840</span><span>&apos;26 · 05</span>
            </div>
          </div>
          <div style={{ padding: "40px 40px 36px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, color: "var(--tone-life-rose)", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600 }}>Conversion Guide · 24 pages</span>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.022em", color: "var(--tone-life-ink)" }}>
              전환율 2배 올리는 <em style={{ fontStyle: "italic", color: "var(--tone-life-rose)" }}>5조건</em>
            </h2>
            <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 15, color: "var(--tone-life-ink-2)", lineHeight: 1.7 }}>
              후킹 카피 · 신뢰 신호 · 모바일 가독성 · CTA 위치 · A/B 테스트 — 실제 사례 8건의 BAD vs GOOD 비교 컷과 함께 구성된 24페이지 가이드.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 16, borderTop: "1px dashed var(--tone-life-line-2)", fontFamily: "var(--font-jetbrains)", fontSize: 10.5, color: "var(--tone-life-ink-3)", flexWrap: "wrap" }}>
              <span>📄 PDF</span><span>📅 &apos;26.05 업데이트</span><span>📊 매출 케이스 8건</span><span>★ 4.9</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ padding: "13px 26px", background: "var(--tone-life-cream-3)", color: "var(--tone-life-ink-3)", border: "1px solid var(--tone-life-line-2)", fontFamily: "var(--font-jakarta)", fontSize: 13, fontWeight: 600, borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, cursor: "not-allowed" }}>
                준비 중
                <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--tone-life-rose)", fontWeight: 700 }}>SOON</span>
              </span>
              <span style={{ fontFamily: "var(--font-pretendard)", fontSize: 12.5, color: "var(--tone-life-ink-3)", letterSpacing: "-0.005em" }}>
                자료 준비가 완료되면 공개됩니다
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Resource grid */}
      <section style={{ padding: "56px 24px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap", paddingBottom: 14, borderBottom: "1px solid var(--tone-life-line)" }}>
          <h3 style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, fontWeight: 500, fontStyle: "italic", color: "var(--tone-life-ink)", letterSpacing: "-0.012em" }}>
            전체 가이드 <em style={{ color: "var(--tone-life-rose)" }}>—</em> Field Notes {filtered.length}편
          </h3>
          <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-life-ink-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>No. 01 — 12</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 22 }}>
          {filtered.map((r, i) => {
            const bg = coverGrads[r.cover];
            const tc = coverTextColor[r.cover];
            return (
              <div key={i} style={{ background: "var(--tone-life-cream)", border: "1px solid var(--tone-life-line)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", textAlign: "left" }}>
                <div style={{ aspectRatio: "3/4", position: "relative", padding: "18px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: bg, overflow: "hidden" }}>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9.5, letterSpacing: "0.2em", textTransform: "uppercase", color: tc }}>{r.vol}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "clamp(48px,7vw,72px)", fontWeight: 500, lineHeight: 0.85, letterSpacing: "-0.02em", color: tc }}>{r.num}</div>
                    <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 14, fontWeight: 500, marginTop: 4, color: tc }}>{r.lbl}</div>
                  </div>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 8.5, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7, color: tc }}>{r.seal}</span>
                </div>
                <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "var(--tone-life-ink-3)", letterSpacing: "0.18em", textTransform: "uppercase" }}>{r.tag}</span>
                  <h3 style={{ fontFamily: "var(--font-fraunces)", fontSize: 18, fontWeight: 500, letterSpacing: "-0.012em", lineHeight: 1.25, color: "var(--tone-life-ink)" }}>
                    {r.title}<em style={{ fontStyle: "italic", color: "var(--tone-life-rose)" }}>{r.titleEm}</em>
                  </h3>
                  <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 13, color: "var(--tone-life-ink-2)", lineHeight: 1.6, flex: 1 }}>{r.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--tone-life-line)", marginTop: 4 }}>
                    <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, color: "var(--tone-life-ink-3)", letterSpacing: "0.06em" }}>{r.foot}</span>
                    <span style={{ fontFamily: "var(--font-pretendard)", fontSize: 12.5, fontWeight: 600, color: "var(--tone-life-ink-faint)", display: "inline-flex", alignItems: "center", gap: 6 }}>준비 중 <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, letterSpacing: "0.18em", color: "var(--tone-life-rose)" }}>SOON</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: "70px 24px", maxWidth: 980, margin: "0 auto", textAlign: "center", borderTop: "1px solid var(--tone-life-line)" }}>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--tone-life-rose)", marginBottom: 18, display: "inline-flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 22, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />Subscribe
          <span style={{ width: 22, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(28px,4vw,48px)", fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.05, marginBottom: 14, color: "var(--tone-life-ink)" }}>
          새 가이드, <em style={{ fontStyle: "italic", color: "var(--tone-life-rose)" }}>구독자 우선</em>
        </h2>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 15, color: "var(--tone-life-ink-2)", lineHeight: 1.65, maxWidth: 580, margin: "0 auto 28px" }}>
          월 1편씩 새 Field Notes가 발행됩니다. 메일링 구독 시 발행 즉시 받아보고, 광고 메일 없이 자료 1편 + 한 달치 작업 인사이트만 보내드립니다.
        </p>
        <Link
            href={`/${locale}/quote`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 26px",
              background: "var(--tone-life-ink)",
              color: "var(--tone-life-cream)",
              border: "1px solid var(--tone-life-ink)",
              fontFamily: "var(--font-jakarta)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "-0.005em",
              borderRadius: 999,
            }}
          >
            견적 문의로 받기 →
          </Link>
        <p style={{ marginTop: 16, fontFamily: "var(--font-pretendard)", fontSize: 12.5, color: "var(--tone-life-ink-3)" }}>언제든 1-click 구독 해지 가능</p>
      </section>
    </>
  );
}
