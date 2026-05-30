"use client";
import Image from "next/image";

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
.aionav .b .bn em{font-style:normal;color:#C8A24A}
.aionav .sp{flex:1}
.aionav .item{position:relative}
.aionav .item>a,.aionav .item>span{display:inline-flex;align-items:center;gap:5px;font-family:var(--font-ibm-plex-mono);font-size:11.5px;letter-spacing:.13em;text-transform:uppercase;color:#B7B0A2;padding:10px 13px;border-radius:8px;text-decoration:none;cursor:pointer}
.aionav .item>a:hover,.aionav .item.on>a{color:#C8A24A}
.aionav .item .ar{font-size:8px;opacity:.7}
.aionav .dd{position:absolute;top:calc(100% - 2px);left:0;min-width:230px;background:#17150F;border:1px solid rgba(200,162,74,.22);border-radius:10px;padding:8px;opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .2s,transform .2s,visibility .2s;box-shadow:0 22px 54px rgba(0,0,0,.55);z-index:5}
.aionav .item:hover .dd{opacity:1;visibility:visible;transform:none}
.aionav .dd a{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 12px;border-radius:7px;font-family:var(--font-pretendard);font-size:13.5px;color:#EFE9DD;text-decoration:none}
.aionav .dd a:hover{background:rgba(200,162,74,.12);color:#C8A24A}
.aionav .dd a .sn{font-family:var(--font-ibm-plex-mono);font-size:10px;color:#6F6A5E;letter-spacing:.1em}
.aionav .dd a.soon{color:#6F6A5E;cursor:default}.aionav .dd a.soon:hover{background:transparent;color:#6F6A5E}
.aionav .cta{font-family:var(--font-pretendard);font-size:13px;font-weight:600;padding:9px 18px;border-radius:999px;background:#C8A24A;color:#0E0D0B;text-decoration:none;margin-left:6px;white-space:nowrap}
.aionav .navitems{display:contents}
@media(max-width:820px){
  .aionav .in{height:auto;flex-wrap:wrap;padding-top:10px;padding-bottom:10px;row-gap:2px;gap:4px}
  .aionav .sp{flex-basis:100%;height:0;order:1}
  .aionav .b{order:0}.aionav .cta{display:none}
  .aionav .navitems{order:2;flex-basis:100%;display:flex;justify-content:center;gap:2px;overflow-x:auto;scrollbar-width:none}
  .aionav .navitems::-webkit-scrollbar{display:none}
  .aionav .dd{position:static;opacity:1;visibility:visible;transform:none;display:none;min-width:0;box-shadow:none;background:transparent;border:0;padding:0}
  .aionav .item>a,.aionav .item>span{font-size:10.5px;padding:8px 10px}
}
`;

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
}

export function AioNav({ locale, level, cat = "development", sub, active }: AioNavProps) {
  const base = `/${locale}`;
  const subs = CAT_SUB[cat] || CAT_SUB.development;
  // leaf 페이지: 서비스 소개·포트폴리오는 현재 소 서비스(sub)를 가리킴. middle 페이지: cat 허브.
  return (
    <nav className="aionav">
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
.aiofoot{background:#0E0D0B;border-top:1px solid rgba(200,162,74,.2);color:#B7B0A2;font-family:var(--font-pretendard)}
.aiofoot .in{max-width:1400px;margin:0 auto;padding:clamp(40px,6vw,64px) clamp(20px,5vw,48px)}
.aiofoot .top{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 18px;align-items:center;padding-bottom:24px;margin-bottom:32px;border-bottom:1px solid rgba(239,233,221,.1);font-family:var(--font-ibm-plex-mono);font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#6F6A5E}
.aiofoot .top b{font-family:var(--font-fraunces);letter-spacing:.4em;color:#EFE9DD;font-weight:600}
.aiofoot .top .dot{width:3px;height:3px;border-radius:50%;background:#C8A24A}
.aiofoot .cols{display:flex;flex-direction:column;gap:36px;align-items:center;text-align:center}
.aiofoot .brand{display:flex;flex-direction:column;align-items:center;gap:12px}
.aiofoot .brand .blogo{display:inline-flex;height:56px;width:56px;border-radius:12px;background:#17150F;overflow:hidden;align-items:center;justify-content:center}
.aiofoot .brand .blogo img{height:100%;width:100%;object-fit:contain}
.aiofoot .brand .bn{font-family:var(--font-fraunces);font-size:24px;font-weight:600;color:#EFE9DD}
.aiofoot .brand .bn em{font-style:normal;color:#C8A24A}
.aiofoot .brand p{font-size:14px;line-height:1.7;color:#B7B0A2;max-width:36ch}
.aiofoot .links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:30px 40px;width:100%;max-width:680px;text-align:center}
.aiofoot .col .h{font-family:var(--font-ibm-plex-mono);font-size:10.5px;letter-spacing:.26em;text-transform:uppercase;color:#6F6A5E;margin-bottom:14px}
.aiofoot .col a{display:block;font-size:14px;color:#EFE9DD;text-decoration:none;margin-bottom:10px}
.aiofoot .col a:hover{color:#C8A24A}
.aiofoot .biz{margin-top:38px;padding-top:24px;border-top:1px solid rgba(239,233,221,.1);text-align:center;font-family:var(--font-ibm-plex-mono);font-size:10.5px;letter-spacing:.04em;color:#6F6A5E;line-height:2}
@media(max-width:600px){.aiofoot .links{grid-template-columns:1fr;gap:24px}}
`;

export function AioFooter({ locale }: { locale: string }) {
  const base = `/${locale}`;
  return (
    <footer className="aiofoot">
      <style dangerouslySetInnerHTML={{ __html: FOOT_CSS }} />
      <div className="in">
        <div className="top">
          <span>Issue 2026</span><span className="dot" /><b>A · I · O&nbsp;&nbsp;STUDIO</b><span className="dot" /><span>est 2024 · Korea</span>
        </div>
        <div className="cols">
          <div className="brand">
            <span className="blogo"><Image src="/brand/aio-logo.png" alt="AIO" width={56} height={56} /></span>
            <div className="bn">A<em>I</em>O</div>
            <p>분야별 전문가가 직접 만드는 외주 스튜디오 — 개발·디자인·영상·마케팅</p>
          </div>
          <div className="links">
            <div className="col">
              <div className="h">Services</div>
              <a href={`${base}/services/development`}>개발</a>
              <a href={`${base}/services/design`}>디자인</a>
              <a href={`${base}/services/video`}>영상</a>
              <a href={`${base}/services/marketing`}>마케팅</a>
            </div>
            <div className="col">
              <div className="h">Company</div>
              <a href={`${base}/about`}>회사 소개</a>
              <a href={`${base}/team`}>전체 팀원</a>
              <a href={`${base}/quote`}>견적 문의</a>
            </div>
            <div className="col">
              <div className="h">Contact</div>
              <a href="mailto:aiomake2023@gmail.com">aiomake2023@gmail.com</a>
            </div>
          </div>
        </div>
        <div className="biz">
          <p>사업자명: 에이아이오 (AIO) &nbsp;|&nbsp; 사업자번호: 682-01-02748 &nbsp;|&nbsp; 통신판매업신고: 제 2026-경기김포-3656 호</p>
          <p>주소: 경기도 김포시 대곶면 흥신로67 &nbsp;|&nbsp; © 2026 AIO에이전시. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
