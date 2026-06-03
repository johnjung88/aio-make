"use client";
import type React from "react";
import Image from "next/image";
import { trackContactClick } from "@/lib/analytics/client";

/**
 * AioNav — Dark Premium 공용 네비게이션.
 * level prop으로 페이지 위치별 메뉴 구성 분기.
 *
 *  level="middle" (예: /services/development)
 *    - 서비스 소개(현재 분야 랜딩)
 *    - 카테고리 소개 ▼ (4 소 서비스 드롭다운)
 *    - 팀원 소개 (분야 공용 팀)
 *
 *  level="leaf" (예: /services/website)
 *    - 서비스 소개(현재 소 서비스 상세)
 *    - 포트폴리오
 *    - 카테고리 소개 ▼ (옆 소 서비스 점프)
 *    - 팀원 소개 (분야 공용 팀)
 *
 *  cat: 분야 식별자(development/design/video/marketing) — 분야 공용 팀/허브 라우팅.
 *  active: 현재 활성 메뉴.
 */

const NAV_CSS = `
.aionav{position:sticky;top:0;z-index:60;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);background:rgba(14,13,11,.86);border-bottom:1px solid rgba(239,233,221,.1);font-family:var(--font-pretendard)}
.aionav .in{max-width:1180px;margin:0 auto;padding:0 clamp(20px,5vw,64px);display:flex;align-items:center;height:64px;gap:6px}
.aionav .b{display:inline-flex;align-items:center;gap:10px;text-decoration:none;color:#EFE9DD}
.aionav .b .logo{display:inline-flex;height:36px;width:36px;border-radius:8px;overflow:hidden;background:#EFE9DD}
.aionav .b .logo img{height:100%;width:100%;object-fit:contain}
.aionav .b .bn{font-family:var(--font-fraunces);font-weight:600;font-size:18px;letter-spacing:.02em}
.aionav .b .bn em{font-style:normal;color:var(--nav-accent, #C8A24A)}
.aionav .sp{display:none}
.aionav .navitems{display:flex;align-items:center;justify-content:center;flex:1;gap:2px}
.aionav .item{position:relative}
.aionav .item>a,.aionav .item>span{display:inline-flex;align-items:center;gap:5px;font-family:var(--font-ibm-plex-mono);font-size:11.5px;letter-spacing:.13em;text-transform:uppercase;color:#B7B0A2;padding:10px 13px;border-radius:8px;text-decoration:none;cursor:pointer}
.aionav .item>a:hover,.aionav .item.on>a{color:var(--nav-accent, #C8A24A)}
.aionav .item .ar{font-size:8px;opacity:.7}
.aionav .dd{position:absolute;top:calc(100% - 2px);left:50%;transform:translateX(-50%) translateY(8px);min-width:230px;background:#17150F;border:1px solid rgba(200,162,74,.22);border-radius:10px;padding:8px;opacity:0;visibility:hidden;transition:opacity .2s,transform .2s,visibility .2s;box-shadow:0 22px 54px rgba(0,0,0,.55);z-index:200}
.aionav .item:hover .dd{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
.aionav .dd a{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 12px;border-radius:7px;font-family:var(--font-pretendard);font-size:13.5px;color:#EFE9DD;text-decoration:none}
.aionav .dd a:hover{background:rgba(200,162,74,.12);color:var(--nav-accent, #C8A24A)}
.aionav .dd a .sn{font-family:var(--font-ibm-plex-mono);font-size:10px;color:#6F6A5E;letter-spacing:.1em}
.aionav .dd a.soon{color:#6F6A5E;cursor:default}.aionav .dd a.soon:hover{background:transparent;color:#6F6A5E}
.aionav .cta{font-family:var(--font-pretendard);font-size:13px;font-weight:600;padding:9px 18px;border-radius:999px;background:var(--nav-accent, #C8A24A);color:#0E0D0B;text-decoration:none;margin-left:6px;white-space:nowrap}
@media(max-width:820px){
  .aionav .cta{display:none}
  .aionav .item>a,.aionav .item>span{font-size:10.5px;padding:8px 10px}
}
@media(max-width:600px){
  .aionav .in{height:52px;gap:3px}
  .aionav .b .bn{display:none}
  .aionav .sp{flex:0 0 4px}
  .aionav .navitems{display:flex;gap:0;overflow-x:auto;scrollbar-width:none;flex:1;min-width:0}
  .aionav .navitems::-webkit-scrollbar{display:none}
  .aionav .item>a,.aionav .item>span{font-size:10px;padding:6px 9px;white-space:nowrap}
}
`;

/** 소카테고리 → 서비스 액센트 색상 맵 */
const SUB_ACCENT: Record<string, string> = {
  website: "#4DD4AC",
  "shopping-mall": "#FB923C",
  "automation-app": "#818CF8",
  "detail-page": "#C66060",
  "ppt-design": "#C66060",
};

/** 중카테고리(분야) → 서비스 액센트 색상 맵 */
const CAT_ACCENT: Record<string, string> = {
  development: "#C8A24A",
  design: "#C66060",
  video: "#E8A340",
  marketing: "#8BE0C2",
};

/** 분야별 소 서비스 카탈로그 (소카테고리 드롭다운용). */
const CAT_SUB: Record<string, { label: string; svc: string; pf?: string; sn: string }[]> = {
  development: [
    { label: "웹사이트", svc: "/services/website", pf: "/services/website/portfolio", sn: "Website" },
    { label: "쇼핑몰", svc: "/services/shopping-mall", pf: "/services/shopping-mall/portfolio", sn: "Commerce" },
    { label: "자동화·프로그램", svc: "/services/automation-app", pf: "/services/automation-app/portfolio", sn: "Automation" },
    { label: "앱", svc: "", sn: "Soon" },
  ],
  design: [
    { label: "로고·명함", svc: "", sn: "Soon" },
    { label: "상세페이지", svc: "/services/detail-page", pf: "/services/detail-page/portfolio", sn: "Detail" },
    { label: "PPT 디자인", svc: "/services/ppt-design", pf: "/services/ppt-design/portfolio", sn: "PPT" },
  ],
  video: [
    { label: "브랜드 영상", svc: "/services/video", sn: "Brand" },
    { label: "SNS 영상", svc: "/services/video", sn: "SNS" },
    { label: "마케팅 영상", svc: "/services/video", sn: "Marketing" },
    { label: "유튜브 편집", svc: "/services/video", sn: "Youtube" },
  ],
  marketing: [
    { label: "블로그 운영대행", svc: "/services/marketing", sn: "Blog" },
    { label: "SNS 운영대행", svc: "/services/marketing", sn: "SNS" },
    { label: "영상채널 운영대행", svc: "/services/marketing", sn: "Channel" },
  ],
};

export type AioNavLevel = "middle" | "leaf";
export type AioNavActive = "service" | "portfolio" | "category" | "team";

interface AioNavProps {
  locale: string;
  level: AioNavLevel;
  cat?: "development" | "design" | "video" | "marketing";
  /** Soft-category slug for leaf-level pages (e.g. "website", "shopping-mall"). 서비스 소개/포트폴리오 링크가 이 슬러그를 가리킵니다. */
  sub?: string;
  active: AioNavActive;
  /** 페이지별 액센트 색상. 미입력 시 sub → cat 순으로 자동 결정됨. */
  accentColor?: string;
}

export function AioNav({ locale, level, cat = "development", sub, active, accentColor }: AioNavProps) {
  const base = `/${locale}`;
  const subs = CAT_SUB[cat] || CAT_SUB.development;
  const resolved = accentColor ?? (sub ? SUB_ACCENT[sub] : undefined) ?? CAT_ACCENT[cat] ?? "#C8A24A";
  // leaf 페이지: 서비스 소개·포트폴리오는 현재 소 서비스(sub)를 가리킴. middle 페이지: cat 허브.
  return (
    <nav className="aionav" style={{ "--nav-accent": resolved } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{ __html: NAV_CSS }} />
      <div className="in">
        <a className="b" href={`${base}`} aria-label="AIO 홈으로">
          <span className="logo"><Image src="/brand/aio-logo.png" alt="AIO" width={36} height={36} /></span>
          <span className="bn">A<em>I</em>O</span>
        </a>
        <span className="sp" />
        <div className="navitems">
          {/* 서비스 소개 — 현재 페이지(분야 또는 소서비스) */}
          <div className={"item" + (active === "service" ? " on" : "")}>
            <a href={`${base}/services/${level === "leaf" && sub ? sub : cat}`}>서비스 소개</a>
          </div>

          {/* 포트폴리오 — leaf 일 때만, 현재 소 서비스의 포폴 */}
          {level === "leaf" && (
            <div className={"item" + (active === "portfolio" ? " on" : "")}>
              <a href={`${base}/portfolio/category/${sub || cat}`}>포트폴리오</a>
            </div>
          )}

          {/* 카테고리 소개 — 드롭다운: 소 서비스 목록 */}
          <div className={"item" + (active === "category" ? " on" : "")}>
            <a href={`${base}/services/${cat}`}>카테고리 소개 <span className="ar">▼</span></a>
            <div className="dd">
              {subs.map((s) => s.svc
                ? <a key={s.label} href={`${base}${s.svc}`}>{s.label}<span className="sn">{s.sn}</span></a>
                : <a key={s.label} className="soon">{s.label}<span className="sn">SOON</span></a>)}
            </div>
          </div>

          {/* 팀원 소개 — 분야 공용 팀 (leaf·middle 모두 cat 기준) */}
          <div className={"item" + (active === "team" ? " on" : "")}>
            <a href={`${base}/services/${cat}/team`}>팀원 소개</a>
          </div>
        </div>
        <a className="cta" href={`${base}/quote`}>무료 상담 →</a>
      </div>
    </nav>
  );
}

const FOOT_CSS = `
.aiofoot{background:#F5F0E8;border-top:1px solid #1A1614;color:#4A3F38;font-family:var(--font-pretendard)}
.aiofoot .in{max-width:1400px;margin:0 auto;padding:clamp(40px,6vw,64px) clamp(20px,5vw,48px)}
.aiofoot .top{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px 18px;padding-bottom:24px;margin-bottom:32px;border-bottom:1px solid #C4B6A0;font-family:var(--font-jetbrains);font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#7A6E63}
.aiofoot .top .dot{width:3px;height:3px;border-radius:50%;background:#7A6E63;display:inline-block}
.aiofoot .top .studio{font-family:var(--font-marcellus);letter-spacing:.4em;color:#1A1614}
.aiofoot .cols{display:flex;flex-direction:column;gap:40px;align-items:center;text-align:center}
@media(min-width:768px){.aiofoot .cols{flex-direction:row;align-items:flex-start;justify-content:space-between;text-align:left}}
.aiofoot .brand{display:flex;flex-direction:column;align-items:center;gap:16px;max-width:320px}
@media(min-width:768px){.aiofoot .brand{align-items:flex-start}}
.aiofoot .brand .blogo{display:inline-flex;height:64px;width:64px}
.aiofoot .brand .blogo img{height:100%;width:100%;object-fit:contain}
.aiofoot .brand p{font-family:var(--font-pretendard);font-size:15px;line-height:1.7;color:#4A3F38;font-weight:400;letter-spacing:-.005em}
.aiofoot .links{display:grid;grid-template-columns:1fr 1fr;gap:32px 48px;text-align:center;max-width:680px;width:100%}
@media(min-width:640px){.aiofoot .links{grid-template-columns:repeat(3,minmax(0,1fr));text-align:left}}
.aiofoot .col .h{font-family:var(--font-jetbrains);font-size:10.5px;letter-spacing:.28em;text-transform:uppercase;color:#7A6E63;margin-bottom:12px;display:block}
.aiofoot .col a{display:block;font-family:var(--font-pretendard);font-size:14.5px;font-weight:400;letter-spacing:-.005em;color:#1A1614;text-decoration:none;margin-bottom:10px;transition:color .2s}
.aiofoot .col a:hover{color:#C8472D}
.aiofoot .ctcol{grid-column:1/-1}
@media(min-width:640px){.aiofoot .ctcol{grid-column:auto}}
.aiofoot .biz{margin-top:56px;padding-top:24px;border-top:1px solid #C4B6A0;text-align:center;font-family:var(--font-jetbrains);font-size:clamp(9.5px,.9vw,10.5px);letter-spacing:.18em;color:#7A6E63;line-height:1.85}
`;

export function AioFooter({ locale }: { locale: string }) {
  const base = `/${locale}`;
  return (
    <footer className="aiofoot">
      <style dangerouslySetInnerHTML={{ __html: FOOT_CSS }} />
      <div className="in">
        <div className="top">
          <span>Issue 2026 · May</span>
          <span className="dot" />
          <span className="studio">A&nbsp;·&nbsp;I&nbsp;·&nbsp;O&nbsp;&nbsp;S T U D I O</span>
          <span className="dot" />
          <span>est 2024 · Korea</span>
        </div>
        <div className="cols">
          <div className="brand">
            <span className="blogo"><Image src="/brand/aio-logo.png" alt="AIO" width={64} height={64} /></span>
            <p>분야별 전문가가 직접 만드는 외주 스튜디오 — 개발·디자인·영상·마케팅</p>
          </div>
          <div className="links">
            <div className="col">
              <span className="h">— Services</span>
              <a href={`${base}/services/development`}>개발</a>
              <a href={`${base}/services/design`}>디자인</a>
              <a href={`${base}/services/video`}>영상</a>
              <a href={`${base}/services/marketing`}>마케팅</a>
            </div>
            <div className="col">
              <span className="h">— Company</span>
              <a href={`${base}/about`}>회사 소개</a>
              <a href={`${base}/quote`}>견적 문의</a>
            </div>
            <div className="col ctcol">
              <span className="h">— Contact</span>
              <a href="mailto:aiomake2023@gmail.com" onClick={() => trackContactClick("email")}>aiomake2023@gmail.com</a>
            </div>
          </div>
        </div>
        <div className="biz">
          <p>사업자명: 에이아이오 (AIO) &nbsp;|&nbsp; 사업자번호: 682-01-02748</p>
          <p>통신판매업신고: 제 2026-경기김포-3656 호</p>
          <p>주소: 경기도 김포시 대곶면 흥신로67</p>
          <p>© {new Date().getFullYear()} AIO에이전시. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
