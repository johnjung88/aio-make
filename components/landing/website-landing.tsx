"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Stethoscope, Scale, GraduationCap, ShoppingBag,
  UtensilsCrossed, Scissors, Building2, Rocket,
} from "lucide-react";
import { AioNav, AioFooter } from "./aio-nav";
import { TrustNumbers } from "@/components/services/trust-numbers";
import { WebsitePricingSection } from "@/components/services/website-pricing-section";
import { ProcessSteps } from "@/components/services/process-steps";
import { ServiceCta } from "@/components/services/service-cta";
import { servicesData } from "@/lib/services-data";

const ACCENT = "#4DD4AC";
const DARK = "#0D1117";

const service = servicesData.find((s) => s.id === "website")!;

const TRUST = [
  { value: "142", label: "누적 의뢰",  sub: "기업·개인 포함" },
  { value: "98%", label: "재의뢰율",   sub: "142명 중 139명 재의뢰" },
  { value: "23분", label: "평균 응답", sub: "영업일 기준" },
  { value: "1달",  label: "기본 A/S",  sub: "납품 후 무상" },
];

const SHOWCASE = [
  { id: "medical",  label: "병원·의료",  domain: "jaeheon-clinic.com", name: "자연한의원",     kpi: "예약 +120%",    gradient: "linear-gradient(135deg,#0f2a3a 0%,#1a4a6a 50%,#2d8aaf 100%)" },
  { id: "legal",    label: "법률·세무",  domain: "seoul-legal.kr",     name: "서울법무사사무소", kpi: "상담문의 +85%", gradient: "linear-gradient(135deg,#1a1f0a 0%,#2a3a14 50%,#4a6a28 100%)" },
  { id: "startup",  label: "스타트업",   domain: "launch-startup.io",  name: "스타트업 서비스", kpi: "전환율 +63%",   gradient: "linear-gradient(135deg,#1a1a3a 0%,#2d2d6a 50%,#4D4DAC 100%)" },
];

const KPI_CARDS = [
  { client: "자연한의원",       cat: "병원·의료",  kpi: "+120%", label: "예약 증가",  delay: "0s",    color: "#4DD4AC" },
  { client: "서울법무사사무소", cat: "법률·세무",  kpi: "+85%",  label: "상담 문의",  delay: "0.6s",  color: "#79C0FF" },
  { client: "AIO 스튜디오",     cat: "회사소개",   kpi: "+63%",  label: "방문자",     delay: "1.2s",  color: "#FFB347" },
  { client: "아카데미밸리",     cat: "교육·학원",  kpi: "+44%",  label: "수강 등록",  delay: "1.8s",  color: "#D2A8FF" },
  { client: "하이덴탈",         cat: "병원·의료",  kpi: "+38%",  label: "신규 예약",  delay: "0.3s",  color: "#4DD4AC" },
];

const INDUSTRIES = [
  { Icon: Stethoscope,     title: "병원·의료",      desc: "의원·한의원·치과·성형외과 — 예약·진료 안내·의료광고법 대응" },
  { Icon: Scale,           title: "법률·세무",      desc: "변호사·법무사·세무사 — 상담 유도와 전문성 강조에 최적화" },
  { Icon: GraduationCap,   title: "교육·학원",      desc: "학원·과외·온라인 강의 — 강사·시간표·수강 신청 시스템" },
  { Icon: UtensilsCrossed, title: "F&B·카페",      desc: "음식점·카페·베이커리 — 메뉴·매장·주문 흐름" },
  { Icon: Scissors,        title: "뷰티·미용",      desc: "미용실·네일·피부관리 — 시술 메뉴·예약·후기" },
  { Icon: Building2,       title: "부동산",         desc: "중개·분양·임대 — 매물 리스트·지도·문의" },
  { Icon: ShoppingBag,     title: "쇼핑몰·D2C",    desc: "카페24·자사몰 — 상품성과 구매 동선 최적화" },
  { Icon: Rocket,          title: "스타트업·서비스", desc: "빠른 런칭과 전환율 중심의 서비스 랜딩" },
];


export function WebsiteLanding({ locale }: { locale: string }) {
  const isKo = locale === "ko";

  return (
    <div className="wsvc" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .wsvc .ws-hero-txt { text-align: left; }
        @keyframes wsScrollDesktop {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes wsScrollMobile {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.333%); }
        }
        @media (max-width: 768px) {
          .wsvc .ws-hero-txt { text-align: center; }
          .wsvc .ws-hero-txt h1 { max-width: none !important; font-size: clamp(32px,8vw,52px) !important; line-height: 1.15 !important; }
          .wsvc .ws-hero-txt p { max-width: none !important; font-size: 14px !important; }
          .wsvc .ws-badges { justify-content: center !important; }
          .wsvc .ws-phone { display: none !important; }
          .wsvc .ws-macbook { flex: none !important; width: 100% !important; }
          .wsvc .ws-industries { padding: 2rem 1rem !important; }
          .wsvc .ws-ind-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .wsvc .ws-ind-card { padding: 14px 12px !important; border-radius: 10px !important; }
          .wsvc .ws-ind-card h3 { font-size: 13px !important; margin-bottom: 4px !important; }
          .wsvc .ws-ind-card p { font-size: 11px !important; }
          .wsvc .ws-ind-card > div:first-child { width: 32px !important; height: 32px !important; margin-bottom: 10px !important; }
        }
        @media (max-width: 400px) {
          .wsvc .ws-ind-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
      <AioNav locale={locale} level="leaf" sub="website" cat="development" active="service" />

      {/* ── DARK HERO (2열: 좌=팀사진+텍스트, 우=플로팅 KPI 카드) ── */}
      <section className="hero-grid" style={{
        background: DARK, minHeight: "100vh",
        display: "grid", gridTemplateColumns: "55% 45%",
      }}>

        {/* ── 왼쪽: 팀 사진 배경 + 텍스트 ── */}
        <div style={{
          position: "relative", overflow: "hidden", minHeight: "100vh",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "clamp(80px,10vw,120px) clamp(32px,5vw,72px) clamp(60px,8vw,100px)",
        }}>
          {/* 팀 배경 이미지 */}
          <Image
            src="/images/services/website-team.png"
            alt=""
            width={1344}
            height={896}
            priority
            style={{
              position: "absolute", top: 0, left: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
            }}
          />
          {/* 다크 그라디언트 오버레이 — 허브 기준: 좌측 강하게, 우측 이미지 살림 */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(105deg, rgba(13,17,23,0.93) 0%, rgba(13,17,23,0.72) 50%, rgba(13,17,23,0.35) 100%)",
          }} />
          {/* 텍스트 */}
          <div className="ws-hero-txt" style={{ position: "relative", zIndex: 1 }}>
            <p style={{
              fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
              letterSpacing: "0.30em", textTransform: "uppercase",
              color: ACCENT, marginBottom: 24,
            }}>
              WEBSITE · 웹사이트 제작
            </p>
            <h1 style={{
              fontSize: "clamp(36px,4.5vw,72px)", fontWeight: 700,
              letterSpacing: "-0.03em", lineHeight: 1.08,
              color: "#F0F6FC", marginBottom: 24, maxWidth: 560,
            }}>
              스크롤을 멈추게<br />
              만드는 <span style={{ color: ACCENT }}>홈페이지</span>
            </h1>
            <p style={{
              fontSize: "clamp(14px,1.1vw,16px)", color: "rgba(240,246,252,0.58)",
              lineHeight: 1.9, maxWidth: 460, marginBottom: 32,
            }}>
              랜딩페이지·회사 홈페이지·서비스 사이트<br />
              운영 가능한 완성품을 5일 이내 납품합니다
            </p>
            <div className="ws-badges" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
              {["5일 납품","1달 A/S","SEO·AEO 무료 세팅"].map((b) => (
                <span key={b} style={{
                  fontSize: 11, fontWeight: 600, padding: "6px 14px",
                  border: `1px solid ${ACCENT}`, color: ACCENT,
                  borderRadius: 999, letterSpacing: "0.04em",
                }}>
                  {b}
                </span>
              ))}
            </div>
            <Link href={`/${locale}/quote`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", background: ACCENT, color: "#0D1117",
              borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none",
            }}>
              웹사이트 제작 문의 →
            </Link>
          </div>
        </div>

        {/* ── 오른쪽: 플로팅 KPI 카드 ── */}
        <div className="hero-cards" style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "clamp(80px,10vw,120px) clamp(24px,4vw,56px) clamp(60px,8vw,100px) clamp(16px,3vw,32px)",
          gap: 14, position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 80% 60% at 60% 40%,rgba(77,212,172,0.05),transparent 70%)",
          }} />
          {KPI_CARDS.map((card, i) => (
            <div key={card.client} style={{
              marginLeft: [0, 44, 20, 60, 10][i],
              animation: `kpiFloat${i} ${2.4 + i * 0.35}s ease-in-out ${card.delay} infinite`,
              position: "relative", zIndex: 1,
            }}>
              <div style={{
                background: "rgba(22,27,34,0.88)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: `3px solid ${card.color}`,
                borderRadius: 10, padding: "14px 18px",
                backdropFilter: "blur(12px)",
                display: "flex", alignItems: "center", gap: 14,
                minWidth: 220, maxWidth: 280,
                boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
              }}>
                <div style={{
                  background: `${card.color}18`, border: `1px solid ${card.color}35`,
                  borderRadius: 8, width: 48, height: 48, flexShrink: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontFamily: "var(--font-jetbrains,monospace)", fontSize: 15, fontWeight: 700, color: card.color, lineHeight: 1 }}>{card.kpi}</span>
                  <span style={{ fontSize: 10, color: card.color, opacity: 0.7, marginTop: 2 }}>↑</span>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#F0F6FC", marginBottom: 3 }}>{card.client}</p>
                  <p style={{ fontSize: 11, color: "rgba(240,246,252,0.42)", lineHeight: 1.5 }}>{card.cat} · {card.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ── MOCKUP SHOWCASE ── */}
      <section style={{ background: DARK, padding: "60px clamp(16px,5vw,48px) 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{
              fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 700,
              letterSpacing: "-0.025em", color: "#F0F6FC", marginBottom: 12,
            }}>
              결과를 먼저 보고 결정하세요
            </h2>
            <p style={{ fontSize: 15, color: "rgba(240,246,252,0.55)", lineHeight: 1.7 }}>
              데모가 아닙니다 — 실제 운영 중인 사이트입니다
            </p>
          </div>

          {/* 3개 아이템 — 세로 배치, 각 항목에 PC+모바일 롤링 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
            {SHOWCASE.map((s, i) => (
              <div key={s.id} style={{
                background: "rgba(22,27,34,0.88)",
                border: "1px solid rgba(240,246,252,0.08)",
                borderRadius: 20, padding: "24px 20px 20px",
              }}>
                {/* 카드 헤더 */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
                    background: `${ACCENT}22`, color: ACCENT,
                  }}>{s.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#F0F6FC" }}>{s.name}</span>
                  <span style={{
                    fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
                    color: ACCENT, marginLeft: 4,
                  }}>{s.domain}</span>
                  <span style={{
                    marginLeft: "auto", fontSize: 12, fontWeight: 700, color: ACCENT,
                    fontFamily: "var(--font-jetbrains,monospace)",
                  }}>{s.kpi}</span>
                </div>

                {/* PC + 모바일 목업 롤링 */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "3%" }}>

                  {/* 모니터 (PC) */}
                  <div style={{ flex: "1 1 0", minWidth: 0, position: "relative" }}>
                    <div style={{
                      position: "absolute", top: "1.71%", left: "12.01%",
                      width: "76.11%", height: "70.85%",
                      overflow: "hidden", zIndex: 0,
                    }}>
                      <div style={{ width: "100%", animation: `wsScrollDesktop ${12 + i * 4}s linear 0s infinite` }}>
                        <img src={`/images/portfolio/ws-${s.id}-desktop.png`} alt={s.name} style={{ width: "100%", display: "block" }} />
                        <img src={`/images/portfolio/ws-${s.id}-desktop.png`} alt="" aria-hidden style={{ width: "100%", display: "block" }} />
                      </div>
                    </div>
                    <Image
                      src="/mockups/monitor.png" alt="monitor"
                      width={3072} height={2048} unoptimized
                      style={{
                        width: "100%", height: "auto", display: "block",
                        position: "relative", zIndex: 1,
                        filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.22))",
                      }}
                    />
                  </div>

                  {/* 폰 (모바일) */}
                  <div className="ws-phone" style={{ flexShrink: 0, width: "30%", maxWidth: 240 }}>
                    <div style={{ position: "relative" }}>
                      <div style={{
                        position: "absolute", top: "15.79%", left: "18.17%",
                        width: "63.54%", height: "70.87%",
                        overflow: "hidden", zIndex: 0,
                      }}>
                        <div style={{
                          width: "100%",
                          animation: `wsScrollMobile ${10 + i * 2}s linear 0s infinite`,
                        }}>
                          <img src={`/images/portfolio/ws-${s.id}-mobile.png`} alt={s.name + " 모바일"} style={{ width: "100%", display: "block" }} />
                          <img src={`/images/portfolio/ws-${s.id}-mobile.png`} alt="" aria-hidden style={{ width: "100%", display: "block" }} />
                          <img src={`/images/portfolio/ws-${s.id}-mobile.png`} alt="" aria-hidden style={{ width: "100%", display: "block" }} />
                        </div>
                      </div>
                      <img
                        src="/mockups/phone.png" alt="phone"
                        style={{
                          width: "100%", height: "auto", display: "block",
                          position: "relative", zIndex: 1,
                          filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.22))",
                        }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link href={`/${locale}/services/website/portfolio`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 22px",
              border: `1px solid ${ACCENT}`, color: ACCENT,
              borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>
              전체 포트폴리오 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST NUMBERS ── */}
      <TrustNumbers accentColor={ACCENT} items={TRUST} />

      {/* ── INDUSTRIES ── */}
      <section className="ws-industries" style={{ background: "#060D0A", padding: "clamp(40px,6vw,96px) clamp(16px,5vw,48px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p style={{
              fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase",
              color: ACCENT, marginBottom: 12,
            }}>
              Industries
            </p>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: "#F0F6FC", letterSpacing: "-0.02em" }}>
              업종별 전문 제작
            </h2>
          </div>
          <div className="ws-ind-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
            {INDUSTRIES.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="ws-ind-card"
                style={{
                  background: "rgba(77,212,172,0.04)",
                  border: "1px solid rgba(77,212,172,0.14)",
                  borderRadius: 14, padding: "20px 18px",
                  transition: "border-color 0.2s,transform 0.2s,box-shadow 0.2s,background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = ACCENT;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 12px 32px ${ACCENT}22`;
                  e.currentTarget.style.background = "rgba(77,212,172,0.09)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(77,212,172,0.14)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.background = "rgba(77,212,172,0.04)";
                }}
              >
                <div style={{
                  width: 40, height: 40, background: `${ACCENT}18`, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
                }}>
                  <Icon size={18} color={ACCENT} strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F0F6FC", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 12, color: "rgba(240,246,252,0.50)", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO · AEO ── */}
      <section style={{ background: DARK, padding: "clamp(48px,7vw,80px) clamp(16px,5vw,48px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{
              fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase",
              color: ACCENT, marginBottom: 12,
            }}>
              SEO · AEO — 제작 시 무료 세팅
            </p>
            <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 700, color: "#F0F6FC", letterSpacing: "-0.02em", marginBottom: 12 }}>
              구글·AI 검색에서 <span style={{ color: ACCENT }}>먼저 발견</span>되는 사이트
            </h2>
            <p style={{ fontSize: 14, color: "rgba(240,246,252,0.55)", lineHeight: 1.8, maxWidth: "46ch", margin: "0 auto" }}>
              SEO(구글 검색)와 AEO(ChatGPT·Perplexity 등 AI 답변)<br />
              모두 제작 패키지에 무료로 포함됩니다
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, maxWidth: 860, margin: "0 auto" }}>
            {[
              { title: "SEO 기초 세팅", sub: "Search Engine Optimization", items: ["메타 타이틀·디스크립션", "OG 태그·사이트맵", "구조화 데이터(Schema)", "구글 서치콘솔 등록"] },
              { title: "AEO 콘텐츠 구조", sub: "Answer Engine Optimization", items: ["AI 답변 최적화 텍스트", "FAQ 섹션 구성", "E-E-A-T 신호 강화", "ChatGPT·Perplexity 대응"] },
            ].map((card) => (
              <div key={card.title} style={{
                background: "rgba(77,212,172,0.05)", border: `1px solid ${ACCENT}30`,
                borderRadius: 16, padding: "28px 24px",
              }}>
                <p style={{ fontFamily: "var(--font-jetbrains,monospace)", fontSize: 10, color: ACCENT, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>{card.sub}</p>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#F0F6FC", marginBottom: 16 }}>{card.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {card.items.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(240,246,252,0.65)", marginBottom: 8 }}>
                      <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <WebsitePricingSection
        tiers={service.pricing}
        addons={service.addons}
        accentColor={ACCENT}
        ctaHref={`/${locale}/quote`}
        sectionBg="#EEF9F5"
      />

      {/* ── PROCESS ── */}
      <ProcessSteps steps={service.process} accentColor={ACCENT} isKo={isKo} />

      {/* ── CTA ── */}
      <ServiceCta
        accentColor={ACCENT}
        headline="지금 제작 문의하세요"
        sub="24시간 안에 견적 — 5일 안에 첫 화면"
        ctaLabel="웹사이트 제작 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
