"use client";
import { useState } from "react";
import Link from "next/link";

interface Props { locale: string }

const cats = [
  { id: "all", label: "전체", count: 13 },
  { id: "story", label: "Story", count: 3 },
  { id: "ir", label: "IR·투자", count: 3 },
  { id: "visual", label: "Visual", count: 3 },
  { id: "delivery", label: "발표 스킬", count: 2 },
  { id: "basics", label: "기본기", count: 2 },
];

const resources = [
  { cat: "story",    vol: "01", stamp: "S", tag: "Guide · 28 pages",      title: "설득되는 ", titleEm: "스토리라인", titleEnd: " 7패턴",        desc: "투자유치·내부보고·세일즈피치 — 청중·목적별 슬라이드 흐름 7개 패턴.", meta: ["PDF", "2.4 MB", "'26.05"] },
  { cat: "story",    vol: "02", stamp: "M", tag: "Workbook · 14 pages",   title: "핵심 메시지 ", titleEm: "응축법",    titleEnd: "",              desc: "긴 자료에서 한 문장 추출 — One-message Slide의 5단계 응축 공식.", meta: ["PDF", "1.6 MB", "'26.05"] },
  { cat: "story",    vol: "03", stamp: "O", tag: "Guide · 16 pages",      title: "오프닝·클로징 ", titleEm: "20문장",  titleEnd: "",              desc: "청중 사로잡는 첫 30초 + 임팩트 있는 마지막 30초 — 즉시 쓰는 20문장.", meta: ["PDF", "1.4 MB", "'26.05"] },
  { cat: "ir",       vol: "04", stamp: "I", tag: "Checklist · 18 pages",  title: "IR Deck ", titleEm: "구성 체크리스트", titleEnd: "",            desc: "Problem·Solution·Market·Traction·Team·Ask — VC 미팅 전 11개 항목.", meta: ["PDF", "1.8 MB", "'26.05"] },
  { cat: "ir",       vol: "05", stamp: "$", tag: "Template · 12 pages",   title: "Series A ", titleEm: "밸류 산정", titleEnd: " 템플릿",          desc: "유사 거래·DCF·SOM 추론 — VC가 인정하는 밸류에이션 슬라이드 6장.", meta: ["PPTX", "3.2 MB", "'26.05"] },
  { cat: "ir",       vol: "06", stamp: "Q", tag: "Workbook · 14 pages",   title: "VC ", titleEm: "예상 질문 30개", titleEnd: " 대비",             desc: "실리콘밸리·국내 VC가 자주 묻는 30개 질문과 답변 슬라이드 카드.", meta: ["PDF", "1.6 MB", "'26.05"] },
  { cat: "visual",   vol: "07", stamp: "V", tag: "Library · 40 shapes",   title: "발표용 ", titleEm: "도형·차트 라이브러리", titleEnd: "",         desc: "조직도·로드맵·매트릭스·KPI 카드 — 카피만 바꿔 즉시 쓰는 .pptx 도형 40종.", meta: ["PPTX", "5.6 MB", "'26.05"] },
  { cat: "visual",   vol: "08", stamp: "C", tag: "Guide · 16 pages",      title: "프로 슬라이드 ", titleEm: "컬러 시스템", titleEnd: "",           desc: "맥킨지·BCG·삼성SDS 톤 — 발표 분위기에 맞는 컬러 팔레트 12조합.", meta: ["PDF", "2.0 MB", "'26.05"] },
  { cat: "visual",   vol: "09", stamp: "T", tag: "Guide · 12 pages",      title: "한글 ", titleEm: "발표용 폰트", titleEnd: " 가이드",             desc: "Pretendard·SUIT·이롭게·G마켓산스 — 무료 상업용 8종 비교와 조합법.", meta: ["PDF", "3.0 MB", "'26.05"] },
  { cat: "delivery", vol: "10", stamp: "D", tag: "Workbook · 22 pages",   title: "10분 안에 ", titleEm: "설득하는 발표법", titleEnd: "",           desc: "오프닝 30초·핵심 3가지·클로징 — 슬라이드당 30초 룰 + Q&A 카드 템플릿.", meta: ["PDF", "2.1 MB", "'26.05"] },
  { cat: "delivery", vol: "11", stamp: "R", tag: "Guide · 12 pages",      title: "발표 ", titleEm: "리허설 체크리스트", titleEnd: "",              desc: "D-3·D-1·당일 — 시간 측정·기기 점검·복장·마인드 셋 단계별 체크.", meta: ["PDF", "1.4 MB", "'26.05"] },
  { cat: "basics",   vol: "12", stamp: "B", tag: "Brief · 6 pages",       title: "외주 의뢰서 ", titleEm: "템플릿", titleEnd: "",                 desc: "의뢰 전 정리할 12가지 — 청중·목적·자료·일정·예산 채우는 빈 양식.", meta: ["DOCX + PDF", "6 pages"] },
  { cat: "basics",   vol: "13", stamp: "G", tag: "Guide · 10 pages",      title: "Google Slides vs ", titleEm: "PowerPoint", titleEnd: "",         desc: "협업·호환성·디자인 자유도 — 우리 회사에 맞는 슬라이드 도구 결정표.", meta: ["PDF", "1.2 MB", "'26.05"] },
];

export function ConsultResources({ locale }: Props) {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? resources : resources.filter((r) => r.cat === active);

  return (
    <>
      {/* Hero */}
      <section style={{ padding: "80px 24px 0", maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11.5, color: "var(--tone-consult-navy)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 14, fontWeight: 500 }}>
          <span style={{ width: 28, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
          §&nbsp;V · Field Guide · Free
          <span style={{ width: 28, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
        </div>
        <h1 style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(40px,6.4vw,88px)", fontWeight: 700, letterSpacing: "-0.032em", lineHeight: 0.98, marginBottom: 22, color: "var(--tone-consult-ink)", maxWidth: 1100, margin: "0 auto 22px" }}>
          발표 5분 전,<br />
          <em style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: "var(--tone-consult-navy)", fontWeight: 500 }}>슬라이드</em>가 가벼워지는<br />
          <span style={{ color: "var(--tone-consult-ink-3)", fontWeight: 600 }}>13편의 가이드</span>
        </h1>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 16, lineHeight: 1.65, color: "var(--tone-consult-ink-2)", maxWidth: 660, margin: "22px auto 20px" }}>
          의뢰 전 알아두면 좋은 것들 — 156개 슬라이드 덱을 만들면서 갈고 닦은{" "}
          <em style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: "var(--tone-consult-navy)" }}>실전 가이드</em>를 무료로 다운로드하세요.
        </p>
        <div style={{ display: "inline-flex", gap: 26, fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, color: "var(--tone-consult-ink-3)", letterSpacing: "0.16em", textTransform: "uppercase", flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }}>
          {["이메일 인증 X", "월 1편 발행", "실제 발표 케이스"].map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "var(--tone-consult-gold)", fontWeight: 600 }}>§</span>{t}
            </span>
          ))}
        </div>

        {/* Filter bar — square, no border-radius */}
        <div style={{ display: "inline-flex", flexWrap: "wrap", border: "1px solid var(--tone-consult-ink)", justifyContent: "center" }}>
          {cats.map((c, i) => (
            <button key={c.id} onClick={() => setActive(c.id)} style={{ padding: "10px 18px", border: 0, borderRight: i < cats.length - 1 ? "1px solid var(--tone-consult-line-2)" : 0, background: active === c.id ? "var(--tone-consult-ink)" : "transparent", color: active === c.id ? "white" : "var(--tone-consult-ink-2)", fontFamily: "var(--font-inter)", fontSize: 12.5, cursor: "pointer", fontWeight: active === c.id ? 600 : 500, transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 8 }}>
              {c.label}
              <span style={{ opacity: active === c.id ? 0.85 : 0.55, fontSize: 10, fontFamily: "var(--font-ibm-plex-mono)", color: active === c.id ? "var(--tone-consult-gold)" : "inherit" }}>{c.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section style={{ padding: "24px 24px 0", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", position: "relative", background: "var(--tone-consult-paper)", border: "1px solid var(--tone-consult-ink)", overflow: "hidden" }}>
          {/* Gold top bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--tone-consult-gold)", zIndex: 5 }} />
          {/* Cover */}
          <div style={{ aspectRatio: "16/10", position: "relative", padding: "26px 30px", background: "linear-gradient(135deg,#1B3B5F 0%,#0E1A2B 60%,#050A14 100%)", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {/* Grid overlay */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.5, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 18, right: 18, padding: "5px 12px", background: "var(--tone-consult-gold)", fontFamily: "var(--font-inter)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1A1408", zIndex: 3 }}>★ Editor</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2, color: "rgba(255,255,255,0.9)" }}>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 700, letterSpacing: "-0.005em" }}>AIO Studio · Field Guide</span>
              <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 9.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)" }}>Vol 01 / 13</span>
            </div>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 9.5, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--tone-consult-gold)", marginBottom: 14, paddingLeft: 22, position: "relative", fontWeight: 500 }}>
                <span style={{ position: "absolute", left: 0, top: "50%", width: 16, height: 1, background: "var(--tone-consult-gold)", transform: "translateY(-50%)" }} />
                Storyline · 28 pages
              </div>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, letterSpacing: "-0.026em", lineHeight: 1.05, color: "white" }}>
                설득되는{" "}
                <em style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: "var(--tone-consult-gold)", fontWeight: 500 }}>스토리라인</em>
                <br />7가지 패턴
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 2, fontFamily: "var(--font-ibm-plex-mono)", fontSize: 9.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
              <span>aio · presentation studio</span>
              <span>&apos;26 · 05</span>
            </div>
          </div>
          {/* Body */}
          <div style={{ padding: "36px 40px 32px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, borderLeft: "1px solid var(--tone-consult-line)" }}>
            <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10.5, color: "var(--tone-consult-gold)", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600 }}>Guide · 28 pages · 2.4 MB</span>
            <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.2, color: "var(--tone-consult-ink)" }}>
              설득되는{" "}
              <em style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: "var(--tone-consult-navy)", fontWeight: 500 }}>스토리라인</em>{" "}
              7가지 패턴
            </h3>
            <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 14.5, color: "var(--tone-consult-ink-2)", lineHeight: 1.7 }}>
              투자유치·내부보고·세일즈피치·R&D 발표 — 청중과 목적에 맞는 슬라이드 흐름{" "}
              <em style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: "var(--tone-consult-navy)" }}>7개 패턴</em>과 적용 예시 28페이지. 실제 IR Deck 12건 분석 기반.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 14, borderTop: "1px solid var(--tone-consult-line)", fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10.5, color: "var(--tone-consult-ink-3)", flexWrap: "wrap", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {["§ PDF", "§ 28 pages", "§ '26.05 update", "★ 4.9 (2,140)"].map((m) => (
                <span key={m} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{m}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6, alignItems: "center" }}>
              <span style={{ padding: "13px 26px", background: "var(--tone-consult-paper-3)", color: "var(--tone-consult-ink-3)", border: "1px solid var(--tone-consult-line-2)", fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, cursor: "not-allowed" }}>
                준비 중
                <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--tone-consult-gold)", fontWeight: 700 }}>SOON</span>
              </span>
              <span style={{ fontFamily: "var(--font-pretendard)", fontSize: 12.5, color: "var(--tone-consult-ink-3)", letterSpacing: "-0.005em" }}>
                자료 준비가 완료되면 공개됩니다
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: "56px 24px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap", paddingBottom: 14, borderBottom: "1px solid var(--tone-consult-ink)" }}>
          <h3 style={{ fontFamily: "var(--font-inter)", fontSize: 22, fontWeight: 700, color: "var(--tone-consult-ink)", letterSpacing: "-0.018em" }}>
            전체 가이드{" "}
            <em style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: "var(--tone-consult-navy)", fontWeight: 500 }}>— </em>
            Field Guide {cats.find((c) => c.id === active)?.count ?? 13}편
          </h3>
          <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, color: "var(--tone-consult-ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>No. 01 — {cats.find((c) => c.id === active)?.count ?? 13}</span>
        </div>
        {/* Borderless grid — borders via container left/top + card right/bottom */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderLeft: "1px solid var(--tone-consult-line)", borderTop: "1px solid var(--tone-consult-line)" }}>
          {filtered.map((r, i) => (
            <div key={i} style={{ padding: "24px 24px 22px", background: "var(--tone-consult-paper)", borderRight: "1px solid var(--tone-consult-line)", borderBottom: "1px solid var(--tone-consult-line)", display: "flex", flexDirection: "column", gap: 12, textAlign: "left", position: "relative" }}>
              {/* Gold hover indicator (static show at 0) */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--tone-consult-gold)", opacity: 0, transition: "opacity 0.2s" }} />
              {/* Head */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, paddingBottom: 12, borderBottom: "1px dashed var(--tone-consult-line-2)" }}>
                <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--tone-consult-ink-3)" }}>
                  Vol <span style={{ color: "var(--tone-consult-navy)", fontWeight: 700 }}>{r.vol}</span> · {r.cat === "story" ? "Story" : r.cat === "ir" ? "IR" : r.cat === "visual" ? "Visual" : r.cat === "delivery" ? "Delivery" : "Basics"}
                </span>
                {/* Circular gold stamp */}
                <div style={{ width: 38, height: 38, border: "1.4px solid var(--tone-consult-gold)", borderRadius: "50%", display: "grid", placeItems: "center", fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: 16, fontWeight: 500, color: "var(--tone-consult-gold)", transform: "rotate(-8deg)", flexShrink: 0 }}>
                  {r.stamp}
                </div>
              </div>
              <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, color: "var(--tone-consult-gold)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>{r.tag}</span>
              <h4 style={{ fontFamily: "var(--font-inter)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.25, color: "var(--tone-consult-ink)" }}>
                {r.title}<em style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: "var(--tone-consult-navy)", fontWeight: 500 }}>{r.titleEm}</em>{r.titleEnd}
              </h4>
              <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 13, color: "var(--tone-consult-ink-2)", lineHeight: 1.65, flex: 1 }}>{r.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 10, borderTop: "1px solid var(--tone-consult-line)", fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, color: "var(--tone-consult-ink-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {r.meta.map((m, j) => (
                  <span key={j} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    {j > 0 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tone-consult-ink-faint)", display: "block" }} />}
                    {m}
                  </span>
                ))}
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", background: "var(--tone-consult-paper-3)", color: "var(--tone-consult-ink-3)", border: "1px solid var(--tone-consult-line-2)", fontFamily: "var(--font-inter)", fontSize: 11.5, fontWeight: 600, alignSelf: "flex-start", marginTop: 4, cursor: "not-allowed" }}>
                준비 중 <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 9, letterSpacing: "0.16em", color: "var(--tone-consult-gold)", marginLeft: 2 }}>SOON</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter — Coming Soon */}
      <section style={{ padding: "70px 24px", maxWidth: 980, margin: "0 auto", textAlign: "center", borderTop: "2px solid var(--tone-consult-ink)", background: "var(--tone-consult-paper-2)" }}>
        <div style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--tone-consult-navy)", marginBottom: 18, display: "inline-flex", alignItems: "center", gap: 14, fontWeight: 500 }}>
          <span style={{ width: 24, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
          Subscribe · Coming Soon
          <span style={{ width: 24, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(28px,4vw,48px)", fontWeight: 700, letterSpacing: "-0.026em", lineHeight: 1.05, marginBottom: 14, color: "var(--tone-consult-ink)" }}>
          새 가이드,{" "}
          <em style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: "var(--tone-consult-navy)", fontWeight: 500 }}>곧 시작</em>
          합니다
        </h2>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 15, color: "var(--tone-consult-ink-2)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 22px" }}>
          월 1편씩 새 Field Guide가 발행될 예정입니다.
          <br />
          구독 시스템이 준비되면 공개됩니다 — 그동안 견적 문의를 통해 미리 받아보실 수 있습니다.
        </p>
        <Link
          href={`/${locale}/quote`}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px", background: "var(--tone-consult-ink)", color: "white", border: "1px solid var(--tone-consult-ink)", fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: "-0.005em" }}
        >
          견적 문의로 받기 →
        </Link>
      </section>

      {/* CTA */}
      <section style={{ padding: "70px 24px 56px", maxWidth: 1180, margin: "0 auto", textAlign: "center", borderTop: "1px solid var(--tone-consult-line)" }}>
        <h2 style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(32px,4.6vw,64px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 0.96, marginBottom: 20, color: "var(--tone-consult-ink)" }}>
          <span style={{ color: "var(--tone-consult-ink-3)" }}>launch</span><br />
          <em style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: "var(--tone-consult-navy)", fontWeight: 500 }}>your_deck</em>
        </h2>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 15, color: "var(--tone-consult-ink-2)", marginBottom: 28 }}>1시간 답변 · 24시간 견적 · 5일 결과물</p>
        <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href={`/${locale}/quote`} style={{ padding: "14px 26px", background: "var(--tone-consult-navy)", color: "white", border: "1px solid var(--tone-consult-navy)", fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>견적 시작 →</Link>
          <Link href={`/${locale}/services/ppt-design`} style={{ padding: "14px 26px", background: "transparent", color: "var(--tone-consult-ink)", border: "1px solid var(--tone-consult-ink)", fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>← services</Link>
        </div>
      </section>
    </>
  );
}
