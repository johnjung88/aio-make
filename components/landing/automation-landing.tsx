"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FileSpreadsheet, Bell, Globe, MousePointerClick, Monitor,
  Zap, RefreshCw,
} from "lucide-react";
import { AioNav, AioFooter } from "./aio-nav";
import { TrustNumbers } from "@/components/services/trust-numbers";
import { PricingTiers } from "@/components/services/pricing-tiers";
import { ProcessSteps } from "@/components/services/process-steps";
import { ServiceCta } from "@/components/services/service-cta";
import { servicesData } from "@/lib/services-data";

const ACCENT = "#818CF8";
const DARK = "#0D1117";

const service = servicesData.find((s) => s.id === "automation-app")!;

const TRUST = [
  { value: "142",  label: "누적 의뢰",  sub: "자동화 포함" },
  { value: "98%",  label: "재의뢰율",   sub: "142명 중 139명" },
  { value: "5일~", label: "기본 납기",  sub: "단순 자동화 기준" },
  { value: "1달",  label: "기본 A/S",   sub: "납품 후 무상" },
];

const KPI_CARDS = [
  { client: "무역 물류사",      cat: "엑셀 파싱",     kpi: "1,820h", label: "연간 절약",   delay: "0s",   color: "#818CF8" },
  { client: "온라인 쇼핑몰",    cat: "알림 자동화",   kpi: "99.9%",  label: "발송 정확도", delay: "0.6s", color: "#A78BFA" },
  { client: "부동산 중개",      cat: "데이터 크롤링", kpi: "×90",    label: "수집 속도",   delay: "1.2s", color: "#C4B5FD" },
  { client: "병원 예약 시스템", cat: "매크로 자동화", kpi: "0건",    label: "수작업 오류", delay: "1.8s", color: "#818CF8" },
  { client: "제조사 ERP",       cat: "데스크탑 앱",   kpi: "-78%",   label: "처리 시간",   delay: "0.3s", color: "#A78BFA" },
];

type ProcessStatus = "done" | "running" | "scheduled";
type AutoProcess = { icon: string; name: string; status: ProcessStatus; metric: string };
type AutoCase = { id: string; label: string; processes: AutoProcess[] };

const MONITOR_CASES: AutoCase[] = [
  {
    id: "all", label: "전체",
    processes: [
      { icon: "📊", name: "엑셀 파싱 자동화",   status: "done",      metric: "처리 3,241건" },
      { icon: "📨", name: "카카오 알림 발송",    status: "running",   metric: "발송 중..." },
      { icon: "🌐", name: "경쟁사 가격 크롤링",  status: "scheduled", metric: "다음: 09:00" },
      { icon: "⚙️", name: "반복 매크로 실행",    status: "done",      metric: "절약 2.4시간" },
    ],
  },
  {
    id: "excel", label: "엑셀·파싱",
    processes: [
      { icon: "📊", name: "일일 매출 집계 파싱",  status: "done",      metric: "처리 3,241건" },
      { icon: "📋", name: "재고 현황 업데이트",   status: "done",      metric: "1,028행 처리" },
      { icon: "📈", name: "주간 리포트 생성",     status: "scheduled", metric: "다음: 월요일" },
      { icon: "🔢", name: "데이터 정합성 검증",   status: "done",      metric: "오류 0건" },
    ],
  },
  {
    id: "notify", label: "알림·발송",
    processes: [
      { icon: "📨", name: "카카오 주문 알림",     status: "running",   metric: "발송 중..." },
      { icon: "💬", name: "SMS 배송 안내",        status: "done",      metric: "1,204건 발송" },
      { icon: "📧", name: "이메일 뉴스레터",      status: "scheduled", metric: "다음: 18:00" },
      { icon: "🔔", name: "예약 확인 알림",       status: "done",      metric: "정확도 99.9%" },
    ],
  },
  {
    id: "crawl", label: "크롤링",
    processes: [
      { icon: "🌐", name: "경쟁사 가격 수집",     status: "scheduled", metric: "다음: 09:00" },
      { icon: "📰", name: "뉴스·키워드 모니터링", status: "done",      metric: "847건 수집" },
      { icon: "🛒", name: "쇼핑몰 재고 추적",     status: "running",   metric: "수집 중..." },
      { icon: "📊", name: "공공데이터 수집",       status: "done",      metric: "속도 ×90" },
    ],
  },
  {
    id: "macro", label: "매크로·앱",
    processes: [
      { icon: "⚙️", name: "반복 클릭 매크로",     status: "done",      metric: "절약 2.4시간" },
      { icon: "🖥️", name: "데스크탑 앱 자동화",   status: "done",      metric: "오류 0건" },
      { icon: "🔄", name: "ERP 데이터 동기화",     status: "running",   metric: "동기화 중..." },
      { icon: "⏱️", name: "스케줄 작업 관리",      status: "scheduled", metric: "3개 대기중" },
    ],
  },
];

const STATUS_CONFIG: Record<ProcessStatus, { label: string; bg: string; text: string; dot: string }> = {
  done:      { label: "완료",    bg: "#14532d", text: "#4ade80", dot: "#22c55e" },
  running:   { label: "실행 중", bg: "#1e3a5f", text: "#60a5fa", dot: "#3b82f6" },
  scheduled: { label: "스케줄",  bg: "#3b2f00", text: "#fbbf24", dot: "#f59e0b" },
};

const CASES = [
  {
    Icon: FileSpreadsheet,
    title: "엑셀·데이터 파싱",
    before: "매일 2시간 수작업 복사·붙여넣기",
    after: "버튼 한 번으로 3분 완료",
    saving: "1,820시간/년 절약",
  },
  {
    Icon: Bell,
    title: "카카오 알림 자동 발송",
    before: "주문마다 수동 문자 발송",
    after: "조건 충족 시 자동 발송",
    saving: "무한 반복 제거",
  },
  {
    Icon: Globe,
    title: "데이터 크롤링·수집",
    before: "경쟁사 가격 매일 직접 확인",
    after: "매일 자동 수집 → 엑셀 저장",
    saving: "실시간 데이터 확보",
  },
  {
    Icon: MousePointerClick,
    title: "반복 매크로·클릭봇",
    before: "같은 화면 클릭을 매일 반복",
    after: "스케줄 설정 → 자동 실행",
    saving: "야근·실수 제로화",
  },
];

const STACK = [
  { name: "n8n",      desc: "노코드 자동화 플로우",  Icon: RefreshCw },
  { name: "Make",     desc: "API·앱 연동 자동화",    Icon: Zap },
  { name: "Python",   desc: "크롤링·파싱·스크립트",  Icon: FileSpreadsheet },
  { name: "Electron", desc: "데스크탑 프로그램",     Icon: Monitor },
  { name: "매크로",   desc: "반복 클릭·입력 자동화", Icon: MousePointerClick },
];

function WideMonitorMockup({ activeCase }: { activeCase: AutoCase }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
      {/* 대시보드 콘텐츠 — monitor.png 투명 스크린 영역 뒤에 배치 */}
      <div style={{
        position: "absolute", top: "1.71%", left: "12.01%",
        width: "76.11%", height: "70.85%",
        overflow: "hidden", zIndex: 0,
        background: "#0d1117",
      }}>
        {/* 상단 타이틀바 */}
        <div style={{
          background: "#161b22", borderBottom: "1px solid #30363d",
          display: "flex", alignItems: "center", gap: 8, padding: "0 16px", height: 36,
          flexShrink: 0,
        }}>
          {(["#FF5F57","#FEBC2E","#28C840"] as const).map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
          <span style={{ marginLeft: 8, fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11, color: "#58a6ff" }}>
            AIO Automation Dashboard
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontFamily: "var(--font-jetbrains,monospace)", fontSize: 10, color: "#4ade80" }}>실행 중</span>
          </div>
        </div>
        {/* 대시보드 그리드 */}
        <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, height: "calc(100% - 36px)" }}>
          {activeCase.processes.map((proc) => {
            const cfg = STATUS_CONFIG[proc.status];
            return (
              <div key={proc.name} style={{
                background: "#161b22", border: "1px solid #30363d", borderRadius: 8,
                padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>{proc.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-jetbrains,monospace)",
                    fontSize: 11, color: "#f0f6fc", fontWeight: 600,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {proc.name}
                  </p>
                  <p style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>{proc.metric}</p>
                </div>
                <div style={{
                  background: cfg.bg, borderRadius: 6,
                  padding: "3px 8px", display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot }} />
                  <span style={{ fontFamily: "var(--font-jetbrains,monospace)", fontSize: 10, color: cfg.text }}>{cfg.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* monitor.png — 투명 스크린 PNG 오버레이 */}
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

export function AutomationLanding({ locale }: { locale: string }) {
  const isKo = locale === "ko";
  const [activeId, setActiveId] = useState("all");
  const activeCase = MONITOR_CASES.find((c) => c.id === activeId) ?? MONITOR_CASES[0];

  return (
    <div className="autvc" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .autvc .aut-hero-txt { text-align: left; }
        @media (max-width: 768px) {
          .autvc .aut-hero-txt { text-align: center; }
          .autvc .aut-hero-txt h1 { max-width: none !important; font-size: clamp(30px,8vw,48px) !important; line-height: 1.18 !important; word-break: keep-all; }
          .autvc .aut-hero-txt p { max-width: none !important; font-size: 14px !important; line-height: 1.75 !important; word-break: keep-all; }
          .autvc .aut-badges { justify-content: center !important; }
          .autvc .aut-hero-btn { display: flex !important; justify-content: center; }
          .autvc .aut-stack-row { gap: 12px !important; }
          .autvc .aut-stack-card { min-width: 0 !important; flex: 1 1 calc(50% - 6px); max-width: calc(50% - 6px); }
          .autvc .aut-monitor-tabs { gap: 6px !important; }
          .autvc .aut-monitor-tabs button { padding: 6px 12px !important; font-size: 12px !important; }
          .autvc .aut-section-title { font-size: clamp(20px,5.5vw,32px) !important; word-break: keep-all; }
          .autvc .aut-section-sub { font-size: 13px !important; word-break: keep-all; }
          .autvc .aut-ba-card { padding: 16px !important; }
          .autvc .aut-time-h2 { font-size: clamp(22px,6vw,38px) !important; word-break: keep-all; }
          .autvc .aut-time-kpi { font-size: clamp(36px,9vw,60px) !important; }
          .autvc .aut-time-sub { font-size: 13px !important; word-break: keep-all; }
        }
        @media (max-width: 480px) {
          .autvc .aut-stack-card { flex: 1 1 100%; max-width: 100%; }
        }
      ` }} />
      <AioNav locale={locale} level="leaf" sub="automation-app" cat="development" active="service" />

      {/* ── DARK HERO ── */}
      <section className="hero-grid" style={{ background: DARK, minHeight: "100vh", display: "grid", gridTemplateColumns: "55% 45%" }}>

        {/* 왼쪽: 팀사진 배경 + 텍스트 */}
        <div style={{
          position: "relative", overflow: "hidden", minHeight: "100vh",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "clamp(80px,10vw,120px) clamp(32px,5vw,72px) clamp(60px,8vw,100px)",
        }}>
          <Image
            src="/images/services/automation-team.png"
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
            background: "linear-gradient(105deg, rgba(13,17,23,0.78) 0%, rgba(13,17,23,0.50) 50%, rgba(13,17,23,0.18) 100%)",
          }} />
          <div className="aut-hero-txt" style={{ position: "relative", zIndex: 1 }}>
            <p style={{
              fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
              letterSpacing: "0.30em", textTransform: "uppercase",
              color: ACCENT, marginBottom: 24,
            }}>
              AUTOMATION · 자동화·프로그램
            </p>
            <h1 style={{
              fontSize: "clamp(36px,4.5vw,76px)", fontWeight: 700,
              letterSpacing: "-0.03em", lineHeight: 1.0,
              color: "#F0F6FC", marginBottom: 24, maxWidth: 560,
              wordBreak: "keep-all",
            }}>
              반복 업무를<br className="hidden md:block" />
              <span style={{ color: ACCENT }}>코드</span>에게 맡기세요
            </h1>
            <p style={{
              fontSize: "clamp(14px,1.1vw,17px)", color: "rgba(240,246,252,0.58)",
              lineHeight: 1.85, maxWidth: 460, marginBottom: 32,
              wordBreak: "keep-all",
            }}>
              엑셀 파싱·알림 발송·크롤링·매크로·데스크탑 프로그램으로<br className="hidden md:block" />
              수 많은 시간의 반복을 한 번에 없앱니다
            </p>
            <div className="aut-badges" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
              {["5일~ 납기", "Python·n8n·Make", "1달 A/S"].map((b) => (
                <span key={b} style={{
                  fontSize: 11, fontWeight: 600, padding: "6px 14px",
                  border: `1px solid ${ACCENT}`, color: ACCENT,
                  borderRadius: 999, letterSpacing: "0.04em",
                }}>
                  {b}
                </span>
              ))}
            </div>
            <div className="aut-hero-btn">
              <Link href={`/${locale}/quote`} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px", background: ACCENT, color: "#0D1117",
                borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none",
              }}>
                자동화 문의 →
              </Link>
            </div>
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
            background: "radial-gradient(ellipse 80% 60% at 60% 40%,rgba(129,140,248,0.05),transparent 70%)",
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

      {/* ── MONITOR SHOWCASE ── */}
      <section style={{ background: DARK, padding: "60px clamp(16px,5vw,48px) 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 className="aut-section-title" style={{
              fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 700,
              letterSpacing: "-0.025em", color: "#F0F6FC", marginBottom: 12,
              wordBreak: "keep-all",
            }}>
              지금 이 순간도 자동으로 돌아갑니다
            </h2>
            <p className="aut-section-sub" style={{ fontSize: 15, color: "rgba(240,246,252,0.55)", lineHeight: 1.7, wordBreak: "keep-all" }}>
              한 번 세팅하면 — 24시간 365일 알아서 처리합니다
            </p>
          </div>
          <div className="aut-monitor-tabs" style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            {MONITOR_CASES.map((c) => (
              <button
                type="button"
                key={c.id}
                aria-pressed={activeId === c.id}
                onClick={() => setActiveId(c.id)}
                style={{
                  padding: "8px 18px", borderRadius: 999, border: "1px solid",
                  borderColor: activeId === c.id ? ACCENT : "rgba(240,246,252,0.20)",
                  background: activeId === c.id ? ACCENT : "transparent",
                  color: activeId === c.id ? "#0D1117" : "rgba(240,246,252,0.65)",
                  fontSize: 13, fontWeight: activeId === c.id ? 700 : 400,
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <WideMonitorMockup activeCase={activeCase} />
        </div>
      </section>

      {/* ── TRUST NUMBERS ── */}
      <TrustNumbers accentColor={ACCENT} items={TRUST} />

      {/* ── Before / After 케이스 ── */}
      <section style={{ background: "#fff", padding: "clamp(60px,8vw,96px) clamp(16px,5vw,48px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{
              fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase",
              color: ACCENT, marginBottom: 12,
            }}>
              Before / After
            </p>
            <h2 className="aut-section-title" style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: "#111", wordBreak: "keep-all" }}>
              이런 일을 자동화합니다
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {CASES.map((c) => (
              <div key={c.title} className="aut-ba-card" style={{ border: "1px solid #E5E7EB", borderRadius: 16, padding: 24, background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 40, height: 40, background: `${ACCENT}1a`, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <c.Icon size={18} color={ACCENT} strokeWidth={1.8} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{c.title}</h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 12 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>BEFORE</p>
                    <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{c.before}</p>
                  </div>
                  <div style={{ background: `${ACCENT}18`, borderRadius: 10, padding: 12 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: ACCENT, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>AFTER</p>
                    <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{c.after}</p>
                  </div>
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 600, padding: "6px 12px",
                  borderRadius: 999, display: "inline-block",
                  background: `${ACCENT}18`, color: ACCENT,
                }}>
                  💡 {c.saving}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 시간 절약 계산 ── */}
      <section style={{ background: "#111", color: "#fff", padding: "clamp(60px,8vw,96px) clamp(16px,5vw,48px)", textAlign: "center" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
            fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase",
            color: ACCENT, marginBottom: 20,
          }}>
            Time Savings
          </p>
          <h2 className="aut-time-h2" style={{ fontSize: "clamp(24px,4vw,44px)", fontWeight: 700, color: "#fff", marginBottom: 16, wordBreak: "keep-all" }}>
            하루 <span style={{ color: ACCENT }}>3시간</span> × 365일
          </h2>
          <p className="aut-time-kpi" style={{
            fontSize: "clamp(32px,6vw,72px)", fontWeight: 700,
            color: ACCENT, fontFamily: "var(--font-jetbrains,monospace)",
            marginBottom: 16,
          }}>
            = 1,095시간/년
          </p>
          <p className="aut-time-sub" style={{ fontSize: 15, color: "#9CA3AF", maxWidth: "40ch", margin: "0 auto", lineHeight: 1.7, wordBreak: "keep-all" }}>
            그 시간을 매출·성장·쉬는 시간에 쓰세요<br />
            자동화는 한 번 만들면 계속 일합니다
          </p>
        </div>
      </section>

      {/* ── 기술 스택 ── */}
      <section style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(60px,8vw,96px) clamp(16px,5vw,48px)" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{
              fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase",
              color: ACCENT, marginBottom: 12,
            }}>
              Tech Stack
            </p>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: "#111" }}>
              사용하는 기술 스택
            </h2>
          </div>
          <div className="aut-stack-row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            {STACK.map(({ name, desc, Icon }) => (
              <div key={name} className="aut-stack-card" style={{
                border: `1px solid ${ACCENT}44`, borderRadius: 12,
                padding: "20px 24px", textAlign: "center", minWidth: 130, background: "#fff",
              }}>
                <div style={{
                  width: 40, height: 40, background: `${ACCENT}1a`, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px",
                }}>
                  <Icon size={18} color={ACCENT} strokeWidth={1.8} />
                </div>
                <p style={{
                  fontSize: 15, fontWeight: 700, color: ACCENT,
                  fontFamily: "var(--font-jetbrains,monospace)", marginBottom: 4,
                }}>
                  {name}
                </p>
                <p style={{ fontSize: 11, color: "#6B7280" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <PricingTiers tiers={service.pricing} accentColor={ACCENT} isKo={isKo} ctaHref={`/${locale}/quote`} />

      {/* ── PROCESS ── */}
      <ProcessSteps steps={service.process} accentColor={ACCENT} isKo={isKo} />

      {/* ── 포트폴리오 바로가기 ── */}
      <div style={{ textAlign: "center", padding: "0 0 clamp(40px,6vw,64px)" }}>
        <Link
          href={`/${locale}/services/automation-app/portfolio`}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 28px", border: `1.5px solid ${ACCENT}`,
            color: ACCENT, borderRadius: 999, fontSize: 14, fontWeight: 600,
            textDecoration: "none", transition: "background .2s, color .2s",
          }}
        >
          전체 포트폴리오 보기 →
        </Link>
      </div>

      {/* ── CTA ── */}
      <ServiceCta
        accentColor={ACCENT}
        headline="지금 자동화할 업무가 있나요?"
        sub="24시간 안에 견적 · 빠르면 1일 안에 결과물"
        ctaLabel="자동화 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
