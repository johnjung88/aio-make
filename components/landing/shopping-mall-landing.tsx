"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Sparkles, Leaf, Shirt, Sofa, Baby, Dumbbell, PawPrint, Cpu,
  Package, CreditCard, Smartphone, BarChart3, Target, Wrench,
} from "lucide-react";
import { AioNav, AioFooter } from "./aio-nav";
import { TrustNumbers } from "@/components/services/trust-numbers";
import { PricingTiers } from "@/components/services/pricing-tiers";
import { ProcessSteps } from "@/components/services/process-steps";
import { ServiceCta } from "@/components/services/service-cta";
import { servicesData } from "@/lib/services-data";

const ACCENT = "#FB923C";
const DARK = "#0D1117";

const service = servicesData.find((s) => s.id === "shopping-mall")!;

const TRUST = [
  { value: "142",   label: "누적 의뢰",    sub: "쇼핑몰 포함" },
  { value: "98%",   label: "재의뢰율",     sub: "142명 중 139명" },
  { value: "1달",   label: "기본 A/S",     sub: "납품 후 무상" },
  { value: "카페24", label: "전문 파트너", sub: "공식 구축 경험" },
];

const KPI_CARDS = [
  { client: "셰프밀 식품몰", cat: "식품·건강",     kpi: "+45%", label: "매출 증가",  delay: "0s",   color: "#FB923C" },
  { client: "루나 뷰티",    cat: "뷰티·화장품",   kpi: "+32%", label: "전환율",     delay: "0.6s", color: "#F97316" },
  { client: "모던리빙",     cat: "리빙·인테리어", kpi: "3.2x", label: "ROAS",       delay: "1.2s", color: "#FDBA74" },
  { client: "스타일온",     cat: "패션·의류",     kpi: "+28%", label: "재구매율",   delay: "1.8s", color: "#FB923C" },
  { client: "그린팜",       cat: "농산물·건강",   kpi: "+18%", label: "객단가",     delay: "0.3s", color: "#F97316" },
];

const SHOWCASE = [
  { id: "beauty",  label: "뷰티·화장품", domain: "luna-beauty.kr",  name: "루나 뷰티", kpi: "전환율 +32%",   gradient: "linear-gradient(135deg,#2a0a1a 0%,#5a1a3a 50%,#d97706 100%)" },
  { id: "food",    label: "식품·건강",   domain: "greenfarm.co.kr", name: "그린팜",    kpi: "객단가 +18%",   gradient: "linear-gradient(135deg,#0a2a0a 0%,#1a5a1a 50%,#4a9a4a 100%)" },
  { id: "fashion", label: "패션·의류",   domain: "styleon.co.kr",   name: "스타일온",  kpi: "재구매율 +28%", gradient: "linear-gradient(135deg,#0a1a2a 0%,#1a3a5a 50%,#3a7aaa 100%)" },
];

type ShowcaseItem = (typeof SHOWCASE)[number];

const INDUSTRIES = [
  { Icon: Sparkles,  title: "뷰티·화장품",     desc: "스킨케어·메이크업·향수 전문몰" },
  { Icon: Leaf,      title: "식품·건강",        desc: "농산물·건강기능식품·밀키트 전문몰" },
  { Icon: Shirt,     title: "패션·의류",        desc: "여성복·남성복·액세서리 전문몰" },
  { Icon: Sofa,      title: "리빙·인테리어",    desc: "가구·조명·생활용품 전문몰" },
  { Icon: Baby,      title: "유아·완구",        desc: "출산용품·교육완구·유아의류 전문몰" },
  { Icon: Dumbbell,  title: "스포츠·아웃도어",  desc: "운동기구·아웃도어·레저용품" },
  { Icon: PawPrint,  title: "반려동물",         desc: "사료·간식·용품·의류 전문몰" },
  { Icon: Cpu,       title: "디지털·가전",      desc: "전자기기·액세서리·IT용품 전문몰" },
];

const INCLUDES = [
  { Icon: Package,    title: "상품 등록",      desc: "상품 사진·설명·옵션·가격 세팅" },
  { Icon: CreditCard, title: "결제 연동",      desc: "카드·계좌·간편결제 연동 및 테스트" },
  { Icon: Smartphone, title: "모바일 최적화",  desc: "모바일 쇼핑 흐름 우선 설계" },
  { Icon: BarChart3,  title: "GA4 설치",       desc: "구매 퍼널 분석·전환 추적 세팅" },
  { Icon: Target,     title: "광고 픽셀 설치", desc: "Meta·카카오 픽셀 연동으로 광고 최적화" },
  { Icon: Wrench,     title: "14일 A/S",       desc: "납품 후 무상 유지보수 포함" },
];

function ScreenContent({ item, device }: { item: ShowcaseItem; device: "desktop" | "mobile" }) {
  const [err, setErr] = useState(false);
  const src = `/images/portfolio/sm-${item.id}-${device}.jpg`;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: item.gradient }}>
      {!err && (
        <Image
          key={src}
          src={src}
          alt={item.name}
          fill
          unoptimized
          style={{ objectFit: "cover", objectPosition: "top center" }}
          onError={() => setErr(true)}
        />
      )}
    </div>
  );
}

function MacbookMockup({ item }: { item: ShowcaseItem }) {
  return (
    <div className="sm-macbook" style={{ flex: "1 1 0", minWidth: 0, position: "relative" }}>
      <div style={{
        position: "absolute", top: "1.71%", left: "12.01%",
        width: "76.11%", height: "70.85%",
        overflow: "hidden", zIndex: 0,
      }}>
        <ScreenContent key={`desktop-${item.id}`} item={item} device="desktop" />
      </div>
      <Image
        src="/mockups/monitor.png"
        alt="monitor"
        width={3072}
        height={2048}
        unoptimized
        style={{
          width: "100%", height: "auto", display: "block",
          position: "relative", zIndex: 1,
          filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.22))",
        }}
      />
    </div>
  );
}

function PhoneMockup({ item }: { item: ShowcaseItem }) {
  return (
    <div className="sm-phone" style={{ flexShrink: 0, width: "30%", maxWidth: 240 }}>
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", top: "15.79%", left: "18.17%",
          width: "63.54%", height: "70.87%",
          overflow: "hidden", zIndex: 0,
        }}>
          <ScreenContent key={`mobile-${item.id}`} item={item} device="mobile" />
        </div>
        <img
          src="/mockups/phone.png"
          alt="phone"
          style={{
            width: "100%", height: "auto", display: "block",
            position: "relative", zIndex: 1,
            filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.22))",
          }}
        />
      </div>
    </div>
  );
}

export function ShoppingMallLanding({ locale }: { locale: string }) {
  const isKo = locale === "ko";
  const [activeId, setActiveId] = useState("beauty");
  const activeItem = SHOWCASE.find((s) => s.id === activeId) ?? SHOWCASE[0];

  return (
    <div className="smvc" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .smvc .sm-hero-txt { text-align: left; }
        @media (max-width: 768px) {
          .smvc .sm-hero-txt { text-align: center; }
          .smvc .sm-hero-txt h1 { max-width: none !important; font-size: clamp(30px,8vw,50px) !important; line-height: 1.15 !important; }
          .smvc .sm-hero-txt p { max-width: none !important; font-size: 14px !important; }
          .smvc .sm-badges { justify-content: center !important; }
          .smvc .sm-phone { display: none !important; }
          .smvc .sm-macbook { flex: none !important; width: 100% !important; }
          .smvc .sm-funnel-row { flex-direction: column !important; align-items: center !important; }
          .smvc .sm-funnel-row > div:has(span) { display: none !important; }
          .smvc .sm-industries { padding: 2rem 1rem !important; }
          .smvc .sm-ind-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .smvc .sm-ind-card { padding: 14px 12px !important; border-radius: 10px !important; }
          .smvc .sm-ind-card h3 { font-size: 13px !important; margin-bottom: 4px !important; }
          .smvc .sm-ind-card p { font-size: 11px !important; }
          .smvc .sm-ind-card > div:first-child { width: 32px !important; height: 32px !important; margin-bottom: 10px !important; }
        }
        @media (max-width: 640px) {
          .smvc .sm-funnel-card { min-width: 0 !important; width: 100%; }
        }
        @media (max-width: 400px) {
          .smvc .sm-ind-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
      <AioNav locale={locale} level="leaf" sub="shopping-mall" cat="development" active="service" />

      {/* ── DARK HERO ── */}
      <section className="hero-grid" style={{ background: DARK, minHeight: "100vh", display: "grid", gridTemplateColumns: "55% 45%" }}>

        {/* 왼쪽: 팀사진 배경 + 텍스트 */}
        <div style={{
          position: "relative", overflow: "hidden", minHeight: "100vh",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "clamp(80px,10vw,120px) clamp(32px,5vw,72px) clamp(60px,8vw,100px)",
        }}>
          <Image
            src="/images/services/shopping-mall-team.png"
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
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(105deg, rgba(13,17,23,0.93) 0%, rgba(13,17,23,0.72) 50%, rgba(13,17,23,0.35) 100%)",
          }} />
          <div className="sm-hero-txt" style={{ position: "relative", zIndex: 1 }}>
            <p style={{
              fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
              letterSpacing: "0.30em", textTransform: "uppercase",
              color: ACCENT, marginBottom: 24,
            }}>
              SHOPPING MALL · 쇼핑몰 구축
            </p>
            <h1 style={{
              fontSize: "clamp(32px,4.5vw,72px)", fontWeight: 700,
              letterSpacing: "-0.03em", lineHeight: 1.08,
              color: "#F0F6FC", marginBottom: 24, maxWidth: 560,
            }}>
              팔리는 쇼핑몰을<br />
              <span style={{ color: ACCENT }}>구축</span>합니다
            </h1>
            <p style={{
              fontSize: "clamp(14px,1.1vw,16px)", color: "rgba(240,246,252,0.58)",
              lineHeight: 1.9, maxWidth: 460, marginBottom: 32,
            }}>
              카페24·독립몰 등 전문 쇼핑몰부터<br />
              배너·상품 등록·결제 연동까지 원스톱 제작
            </p>
            <div className="sm-badges" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
              {["카페24 전문", "결제연동 포함", "1달 A/S"].map((b) => (
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
              쇼핑몰 제작 문의 →
            </Link>
          </div>
        </div>

        {/* 오른쪽: 플로팅 KPI 카드 */}
        <div className="hero-cards" style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "clamp(80px,10vw,120px) clamp(24px,4vw,56px) clamp(60px,8vw,100px) clamp(16px,3vw,32px)",
          gap: 14, position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 80% 60% at 60% 40%,rgba(251,146,60,0.05),transparent 70%)",
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
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{
              fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 700,
              letterSpacing: "-0.025em", color: "#F0F6FC", marginBottom: 12,
            }}>
              결과를 먼저 보고 결정하세요
            </h2>
            <p style={{ fontSize: 15, color: "rgba(240,246,252,0.55)", lineHeight: 1.7 }}>
              데모가 아닙니다 — 실제 운영 중인 쇼핑몰입니다
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            {SHOWCASE.map((s) => (
              <button
                type="button"
                key={s.id}
                aria-pressed={activeId === s.id}
                onClick={() => setActiveId(s.id)}
                style={{
                  padding: "8px 18px", borderRadius: 999, border: "1px solid",
                  borderColor: activeId === s.id ? ACCENT : "rgba(240,246,252,0.20)",
                  background: activeId === s.id ? ACCENT : "transparent",
                  color: activeId === s.id ? "#0D1117" : "rgba(240,246,252,0.65)",
                  fontSize: 13, fontWeight: activeId === s.id ? 700 : 400,
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="sm-showcase-wrap" style={{ display: "flex", alignItems: "flex-end", gap: "3%", maxWidth: 960, margin: "0 auto" }}>
            <MacbookMockup item={activeItem} />
            <PhoneMockup item={activeItem} />
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <p style={{ fontFamily: "var(--font-jetbrains,monospace)", fontSize: 12, color: ACCENT, marginBottom: 4 }}>{activeItem.domain}</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#F0F6FC", marginBottom: 4 }}>{activeItem.name}</p>
            <p style={{ fontSize: 13, color: "rgba(240,246,252,0.55)" }}>{activeItem.kpi}</p>
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href={`/${locale}/services/shopping-mall/portfolio`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 22px", border: `1px solid ${ACCENT}`, color: ACCENT,
              borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>
              전체 포트폴리오 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST NUMBERS ── */}
      <TrustNumbers accentColor={ACCENT} items={TRUST} />

      {/* ── 업종별 전문 ── */}
      <section className="sm-industries" style={{ background: "#0D1117", padding: "clamp(40px,6vw,96px) clamp(16px,5vw,48px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{
              fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase",
              color: ACCENT, marginBottom: 12,
            }}>
              Industries
            </p>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: "#F0F6FC", letterSpacing: "-0.02em" }}>
              업종별 전문 쇼핑몰
            </h2>
          </div>
          <div className="sm-ind-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
            {INDUSTRIES.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="sm-ind-card"
                style={{
                  background: `${ACCENT}08`, border: `1px solid ${ACCENT}22`,
                  borderRadius: 14, padding: "20px 18px",
                  transition: "border-color 0.2s,transform 0.2s,box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = ACCENT;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${ACCENT}30`;
                  e.currentTarget.style.background = `${ACCENT}14`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${ACCENT}22`;
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.background = `${ACCENT}08`;
                }}
              >
                <div style={{
                  width: 40, height: 40, background: `${ACCENT}1a`, borderRadius: 10,
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

      {/* ── 포함 내역 ── */}
      <section style={{ background: "#F5F0E8", borderTop: "1px solid #E8DFD0", borderBottom: "1px solid #E8DFD0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(60px,8vw,96px) clamp(16px,5vw,48px)" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{
              fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase",
              color: ACCENT, marginBottom: 12,
            }}>
              Includes
            </p>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: "#1A1614" }}>
              기본 패키지에 모두 포함
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
            {INCLUDES.map(({ Icon, title, desc }) => (
              <div key={title} style={{
                border: "1px solid #E8DFD0", borderRadius: 16,
                padding: "24px 20px", textAlign: "center", background: "#fff",
              }}>
                <div style={{
                  width: 48, height: 48, background: `${ACCENT}1a`, borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
                }}>
                  <Icon size={20} color={ACCENT} strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 구매 동선 최적화 ── */}
      <section style={{ background: "#111", color: "#fff", padding: "clamp(60px,8vw,96px) clamp(16px,5vw,48px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{
              fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase",
              color: ACCENT, marginBottom: 12,
            }}>
              Conversion Optimization
            </p>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
              구매자 동선에 맞는 <span style={{ color: ACCENT }}>최적의 세팅</span>까지
            </h2>
            <p style={{ fontSize: 14, color: "#9CA3AF", maxWidth: "52ch", margin: "0 auto", lineHeight: 1.75 }}>
              단순 구축이 아닙니다 — 방문자가 상품을 발견하고 결제까지<br />
              이탈 없이 이어지도록 구매 퍼널 전 단계를 설계합니다
            </p>
          </div>
          <div className="sm-funnel-row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 40 }}>
            {[
              { step: "01", label: "상품 발견",  sub: "SEO·광고 유입" },
              { step: "02", label: "상품 페이지", sub: "전환 유도 구성" },
              { step: "03", label: "장바구니",   sub: "이탈 최소화" },
              { step: "04", label: "결제",       sub: "간편결제 연동" },
              { step: "05", label: "구매 완료",  sub: "리타게팅 픽셀" },
            ].map((f, i, arr) => (
              <div key={f.step} style={{ display: "flex", alignItems: "center" }}>
                <div className="sm-funnel-card" style={{
                  textAlign: "center", padding: "16px 24px", borderRadius: 12,
                  border: "1px solid #333", background: "#1a1a1a", minWidth: 100,
                }}>
                  <p style={{ fontFamily: "var(--font-jetbrains,monospace)", fontSize: 10, fontWeight: 700, color: ACCENT, marginBottom: 4 }}>{f.step}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{f.label}</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{f.sub}</p>
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: "#555", fontSize: 20, margin: "0 4px" }}>→</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {[
              { Icon: BarChart3,  title: "GA4 구매 퍼널 분석",    desc: "어느 단계에서 이탈하는지 데이터로 파악. 구매 전환율을 높이는 기반 세팅" },
              { Icon: Target,     title: "Meta·카카오 광고 픽셀", desc: "장바구니 담기·결제 완료 이벤트를 픽셀로 추적. 리타게팅 광고 즉시 집행 가능" },
              { Icon: Smartphone, title: "구매 동선 UX 설계",     desc: "상품 진열 순서, 배너 위치, CTA 문구까지 — 매출로 이어지는 구조로 세팅" },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ border: "1px solid #2a2a2a", borderRadius: 16, padding: 24, background: "#1a1a1a" }}>
                <div style={{
                  width: 44, height: 44, background: `${ACCENT}18`, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
                }}>
                  <Icon size={20} color={ACCENT} strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <div className="sm-pricing-wrap">
        <PricingTiers tiers={service.pricing} accentColor={ACCENT} isKo={isKo} ctaHref={`/${locale}/quote`} />
      </div>

      {/* ── PROCESS ── */}
      <ProcessSteps steps={service.process} accentColor={ACCENT} isKo={isKo} />

      {/* ── CTA ── */}
      <ServiceCta
        accentColor={ACCENT}
        headline="팔리는 쇼핑몰, 지금 시작하세요"
        sub="24시간 안에 견적 · 2-5일 안에 운영 가능한 완성몰"
        ctaLabel="쇼핑몰 제작 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
