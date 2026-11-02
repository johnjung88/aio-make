import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "quote-service-detail");
const logoPath = path.join(root, "public", "brand", "aio-agency-logo-final", "aio-agency-site-lockup-dark.svg");

const W = 1080;
const H = 2760;

const services = [
  {
    id: "website",
    fileBase: "AIO_웹사이트제작_견적용이미지",
    title: "웹사이트 제작",
    category: "랜딩페이지 · 회사 홈페이지 · 포트폴리오",
    headline: ["문의 전환까지", "설계하는 웹사이트"],
    sub: "예쁜 화면에서 끝나지 않고, 첫 화면 메시지·신뢰 요소·CTA 동선까지 견적 단계에서 함께 정리합니다.",
    accent: "#1BB8F0",
    bg: "#071522",
    cover: "website-cover.png",
    refs: ["website-detail-01-proof.png", "website-detail-02-conversion.png", "website-detail-03-process.png"],
    actualRefs: [
      "public/portfolio/aio-design-agency/live.png",
      "public/portfolio/chueok-korea/live.png",
      "public/portfolio/v-aio-website/site.png",
    ],
    refLabels: ["AIO 포트폴리오", "추억코리아", "V-AIO 웹"],
    problems: ["홈페이지는 필요한데 구성부터 막힘", "모바일에서 화면이 어색함", "문의 버튼까지 이어지는 흐름이 약함"],
    strengths: ["반응형 UI", "문의 CTA", "SEO 기본", "배포 가이드"],
    packages: [["랜딩 1P", "5만원~", "1일"], ["홈페이지 5P", "30만원~", "3일"], ["상세 10P", "80만원~", "5일"]],
    cta: "참고 사이트와 업종만 알려주시면 첫 화면 구조부터 제안합니다.",
  },
  {
    id: "shopping-mall",
    fileBase: "AIO_쇼핑몰제작_견적용이미지",
    title: "쇼핑몰 제작",
    category: "카페24 · 브랜드몰 · 상품 진열",
    headline: ["상품이 잘 보이고", "구매가 쉬운 쇼핑몰"],
    sub: "메인 배너, 카테고리, 베스트 상품, 모바일 구매 흐름을 실제 판매 화면 기준으로 설계합니다.",
    accent: "#18B66E",
    bg: "#071D14",
    cover: "shopping-mall-cover.png",
    refs: ["shopping-mall-detail-01-proof.png", "shopping-mall-detail-02-conversion.png", "shopping-mall-detail-03-process.png"],
    actualRefs: [
      "public/portfolio/cafe24-design-pack/d01-wide.png",
      "public/portfolio/cafe24-design-pack/d04-wide.png",
      "public/portfolio/cafe24-design-pack/d07-wide.png",
    ],
    refLabels: ["카페24 메인", "상품 진열", "모바일 흐름"],
    problems: ["메인 화면이 비어 보임", "상품 진열이 산만함", "모바일 구매 흐름이 약함"],
    strengths: ["카페24 메인", "상품 진열", "배너 세트", "운영 가이드"],
    packages: [["쇼핑몰 메인", "15만원~", "2일"], ["풀세팅", "30만원~", "3~5일"], ["풀커스텀", "100만원~", "7~10일"]],
    cta: "판매 상품과 브랜드 분위기만 주셔도 업종별 메인 구성을 잡아드립니다.",
  },
  {
    id: "logo-business-card",
    fileBase: "AIO_로고및명함_견적용이미지",
    title: "로고 및 명함",
    category: "로고 · 심볼 · 명함 · 프로필 키트",
    headline: ["첫인상부터", "정돈된 브랜드 키트"],
    sub: "로고, 심볼, 명함, 프로필 이미지를 온라인과 인쇄물에 바로 사용할 수 있게 정리합니다.",
    accent: "#C89A3A",
    bg: "#18110A",
    cover: "logo-business-card-cover.png",
    refs: ["logo-business-card-detail-01-proof.png", "logo-business-card-detail-02-conversion.png", "logo-business-card-detail-03-process.png"],
    actualRefs: [
      "public/portfolio/logo-showcase/moru-coffee/premium-business-card-detail.jpg",
      "public/portfolio/logo-showcase/onda-hair/premium-presentation.jpg",
      "public/portfolio/logo-showcase/promptly-ai/premium-logo-detail.jpg",
    ],
    refLabels: ["명함 목업", "사인 목업", "로고 시스템"],
    problems: ["로고가 임시처럼 보임", "명함 인쇄 파일이 없음", "프로필 이미지가 통일되지 않음"],
    strengths: ["로고 시스템", "양면 명함", "프로필 키트", "브랜드 기준"],
    packages: [["입문형 로고·명함", "₩29,000", "1일"], ["실속형 로고 3안·명함", "₩49,000", "1~2일"], ["창업형 브랜드 키트", "₩99,000", "2~3일"]],
    cta: "상호명과 업종만 있어도 1차 브랜드 방향을 빠르게 잡아드립니다.",
  },
  {
    id: "detail-page",
    fileBase: "AIO_상세페이지제작_견적용이미지",
    title: "상세페이지 제작",
    category: "상품 상세 · 서비스 상세 · 플랫폼 등록용",
    headline: ["스크롤을 내릴수록", "구매 이유가 쌓이는 상세페이지"],
    sub: "후킹 문구, 문제 제기, 이미지 흐름, 가격 설득, FAQ까지 한 장 안에서 구매 결정을 돕게 만듭니다.",
    accent: "#FF6548",
    bg: "#20100B",
    cover: "detail-page-cover.png",
    refs: ["detail-page-detail-01-proof.png", "detail-page-detail-02-conversion.png", "detail-page-detail-03-process.png"],
    actualRefs: [
      "public/portfolio/detail-page/ampoule-anti-aging/cover.png",
      "public/portfolio/detail-page/premium-mealkit/cover.png",
      "public/portfolio/detail-page/linen-onepiece/cover.png",
    ],
    refLabels: ["뷰티 상세", "식품 상세", "패션 상세"],
    problems: ["이미지는 있는데 설득이 약함", "후킹 문구가 밋밋함", "섹션 순서가 판매와 안 맞음"],
    strengths: ["후킹 카피", "이미지 흐름", "모바일 최적화", "판매 구조"],
    packages: [["상세 1장", "3만원~", "1일"], ["5장 세트", "12만원~", "2~3일"], ["기획+디자인", "25만원~", "3~5일"]],
    cta: "상품 사진이 부족해도 콘셉트 이미지와 카피를 함께 잡아드립니다.",
  },
  {
    id: "ppt-design",
    fileBase: "AIO_PPT디자인_견적용이미지",
    title: "PPT 디자인",
    category: "회사소개서 · 제안서 · 피치덱",
    headline: ["말하지 않아도", "흐름이 보이는 발표자료"],
    sub: "복잡한 내용을 구조화하고, 도식화와 레이아웃으로 바로 발표 가능한 PPTX/PDF를 제작합니다.",
    accent: "#7B61FF",
    bg: "#120D2A",
    cover: "ppt-design-cover.png",
    refs: ["ppt-design-detail-01-proof.png", "ppt-design-detail-02-conversion.png", "ppt-design-detail-03-process.png"],
    actualRefs: [
      "public/portfolio/ppt-design/brand-proposal/cover.png",
      "public/portfolio/ppt-design/government-grant/sample-1.png",
      "public/portfolio/ppt-design/ir-investment/sample-1.png",
    ],
    refLabels: ["브랜드 제안서", "지원사업 PPT", "IR 피치덱"],
    problems: ["자료가 많지만 흐름이 없음", "슬라이드가 촌스러움", "발표용/제출용 구분이 안 됨"],
    strengths: ["스토리라인", "도식화", "PPTX 원본", "PDF 납품"],
    packages: [["PPT 10P", "5만원~", "1~2일"], ["PPT 20P", "10만원~", "2일"], ["PPT 30P+", "25만원~", "3~5일"]],
    cta: "기존 자료를 보내주시면 발표 흐름부터 다시 정리합니다.",
  },
  {
    id: "automation-app",
    fileBase: "AIO_자동화및앱_견적용이미지",
    title: "자동화 및 앱",
    category: "업무 자동화 · 크롤링 · MVP 앱 · 대시보드",
    headline: ["반복 업무는 줄이고", "운영 결과는 자동으로"],
    sub: "반복 입력, 데이터 수집, 알림, 대시보드, MVP 앱을 실제 업무 흐름에 맞춰 빠르게 구축합니다.",
    accent: "#22B7F2",
    bg: "#061B28",
    cover: "automation-app-cover.png",
    refs: ["automation-app-detail-01-proof.png", "automation-app-detail-02-conversion.png", "automation-app-detail-03-process.png"],
    actualRefs: [
      "public/portfolio/v-aio-admin/dashboard.png",
      "public/portfolio/blogautopilot-multinational/real-demo/app-dashboard.png",
      "public/portfolio/v-aio-admin/chatbot.png",
    ],
    refLabels: ["운영 대시보드", "콘텐츠 자동화", "챗봇 관리"],
    problems: ["반복 작업에 시간이 낭비됨", "데이터가 흩어져 있음", "앱 검증을 빠르게 해보고 싶음"],
    strengths: ["크롤링", "API/DB 연동", "대시보드", "운영 가이드"],
    packages: [["단순 자동화", "10만원~", "1일"], ["일반 자동화", "80만원~", "5일"], ["앱 MVP", "150만원~", "5~7일"]],
    cta: "반복 업무 화면이나 엑셀만 보여주셔도 자동화 가능 범위를 판단합니다.",
  },
  {
    id: "video-content",
    fileBase: "AIO_영상콘텐츠_견적용이미지",
    title: "영상 콘텐츠",
    category: "홍보 영상 · 쇼츠/릴스 · 브랜드 인트로",
    headline: ["짧게 봐도", "이해되는 영상 콘텐츠"],
    sub: "서비스 소개, 제품 홍보, 쇼츠/릴스, 튜토리얼을 플랫폼 비율과 메시지에 맞춰 제작합니다.",
    accent: "#F24E5F",
    bg: "#25080D",
    cover: "video-content-cover.png",
    refs: ["video-content-detail-01-proof.png", "video-content-detail-02-conversion.png", "video-content-detail-03-process.png"],
    actualRefs: [
      "public/portfolio/video-content-samples/brand-shorts.png",
      "public/portfolio/aio-motion-intro/cover.svg",
      "public/portfolio/youtube-autopilot/cover.svg",
    ],
    refLabels: ["브랜드 숏폼", "모션 인트로", "영상 자동화"],
    problems: ["내용은 있는데 영상 구성이 안 됨", "자막/썸네일이 약함", "플랫폼별 비율 대응이 번거로움"],
    strengths: ["숏폼 구성", "자막/BGM", "썸네일", "비율별 출력"],
    packages: [["30초 숏폼", "10만원~", "1~3일"], ["60초/3개", "25만원~", "2~3일"], ["브랜드 세트", "60만원~", "3~7일"]],
    cta: "레퍼런스 링크와 핵심 메시지만 주시면 바로 구성안을 잡습니다.",
  },
];

function esc(v) {
  return String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function uri(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === ".svg" ? "image/svg+xml" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : ext === ".webp" ? "image/webp" : "image/png";
  return `data:${mime};base64,${readFileSync(filePath).toString("base64")}`;
}

function wrap(text, max) {
  const src = String(text);
  const out = [];
  let line = "";
  for (const ch of src) {
    const next = line + ch;
    if (next.length > max && line) {
      out.push(line);
      line = ch;
    } else {
      line = next;
    }
  }
  if (line) out.push(line);
  return out;
}

function t(lines, x, y, { size = 28, weight = 700, fill = "#0F172A", gap = Math.round(size * 1.32), anchor = "" } = {}) {
  const arr = Array.isArray(lines) ? lines : [lines];
  return `<text x="${x}" y="${y}" font-family="Pretendard, Malgun Gothic, Apple SD Gothic Neo, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" ${anchor ? `text-anchor="${anchor}"` : ""}>${arr.map((line, i) => `<tspan x="${x}" dy="${i ? gap : 0}">${esc(line)}</tspan>`).join("")}</text>`;
}

function img(href, x, y, w, h, id, fit = "slice", r = 28) {
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#E8EEF6"/>
  <image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid ${fit}" clip-path="url(#${id})"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="#D7DFEA" stroke-width="2"/>`;
}

function problemCard(x, y, text, i, color) {
  return `<rect x="${x}" y="${y}" width="292" height="112" rx="24" fill="#FFFFFF" stroke="#DFE6F0"/>
    <text x="${x + 24}" y="${y + 36}" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="18" font-weight="950" fill="${color}">0${i + 1}</text>
    ${t(wrap(text, 12).slice(0, 2), x + 24, y + 72, { size: 23, weight: 850, fill: "#111827", gap: 28 })}`;
}

function strengthCard(x, y, text, i, color) {
  return `<rect x="${x}" y="${y}" width="218" height="94" rx="22" fill="#F8FAFC" stroke="#DDE5EF"/>
    <circle cx="${x + 30}" cy="${y + 47}" r="9" fill="${color}"/>
    <text x="${x + 52}" y="${y + 56}" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="23" font-weight="900" fill="#111827">${esc(text)}</text>`;
}

function packageCard(x, y, p, color, active = false) {
  const [name, price, duration] = p;
  return `<rect x="${x}" y="${y}" width="292" height="136" rx="26" fill="${active ? color : "#FFFFFF"}" stroke="${active ? color : "#DDE5EF"}"/>
    <text x="${x + 26}" y="${y + 38}" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="24" font-weight="950" fill="${active ? "#FFFFFF" : "#111827"}">${esc(name)}</text>
    <text x="${x + 26}" y="${y + 84}" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="38" font-weight="950" fill="${active ? "#FFFFFF" : color}">${esc(price)}</text>
    <text x="${x + 26}" y="${y + 114}" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="19" font-weight="800" fill="${active ? "rgba(255,255,255,.78)" : "#64748B"}">${esc(duration)} 제작 기준</text>`;
}

function refCard(x, y, href, label, id, color) {
  return `<rect x="${x}" y="${y}" width="296" height="394" rx="28" fill="#FFFFFF" stroke="#DDE5EF"/>
    <rect x="${x + 18}" y="${y + 18}" width="210" height="42" rx="21" fill="#0F172A"/>
    <text x="${x + 36}" y="${y + 45}" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="17" font-weight="950" fill="#FFFFFF">${esc(label)}</text>
    ${img(href, x + 18, y + 82, 260, 260, id, "meet", 18)}
    <circle cx="${x + 38}" cy="${y + 362}" r="8" fill="${color}"/>
    <text x="${x + 56}" y="${y + 369}" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="17" font-weight="850" fill="#334155">실제 결과물 캡처</text>`;
}

function heroShot(x, y, w, h, href, label, id, color, fit = "meet") {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="#FFFFFF" stroke="rgba(226,232,240,.9)"/>
    <rect x="${x + 18}" y="${y + 18}" width="${Math.max(138, label.length * 16 + 42)}" height="42" rx="21" fill="#0F172A"/>
    <circle cx="${x + 40}" cy="${y + 39}" r="6" fill="${color}"/>
    <text x="${x + 56}" y="${y + 46}" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="16" font-weight="950" fill="#FFFFFF">${esc(label)}</text>
    ${img(href, x + 18, y + 76, w - 36, h - 98, id, fit, 16)}
  </g>`;
}

function heroWall(s, refs, labels) {
  const heroRefs = s.id === "detail-page" ? [refs[1], refs[0], refs[2]] : refs;
  const heroLabels = s.id === "detail-page" ? [labels[1], labels[0], labels[2]] : labels;
  const mainFit = s.heroMainFit || "meet";
  const sideFit = s.heroSideFit || "meet";
  return `<g filter="url(#shadow)">
    <rect x="124" y="550" width="832" height="622" rx="34" fill="#E8EEF6" stroke="#D7DFEA" stroke-width="2"/>
    <rect x="154" y="584" width="196" height="48" rx="24" fill="rgba(15,23,42,.92)"/>
    <text x="252" y="615" text-anchor="middle" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="18" font-weight="950" fill="#FFFFFF">실제 작업 화면</text>
    ${heroShot(154, 650, 442, 452, heroRefs[0], heroLabels[0], `hero-main-${s.id}`, s.accent, mainFit)}
    ${heroShot(626, 650, 300, 206, heroRefs[1], heroLabels[1], `hero-sub1-${s.id}`, s.accent, sideFit)}
    ${heroShot(626, 884, 300, 218, heroRefs[2], heroLabels[2], `hero-sub2-${s.id}`, s.accent, sideFit)}
  </g>`;
}

function serviceSvg(s) {
  const logo = uri(logoPath);
  const refs = (s.actualRefs || s.refs.map((r) => path.join("public", "marketplace", "kmong-premium", r))).map((r) => uri(path.join(root, r)));
  const labels = s.refLabels || ["실제 결과 01", "실제 결과 02", "실제 결과 03"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="top-${s.id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${s.bg}"/>
      <stop offset="1" stop-color="#101827"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#0F172A" flood-opacity=".16"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#F4F7FB"/>
  <rect x="0" y="0" width="${W}" height="1190" fill="url(#top-${s.id})"/>
  <rect x="0" y="1180" width="${W}" height="1580" fill="#F4F7FB"/>

  <g transform="translate(64 44)">
    <rect width="952" height="96" rx="28" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.13)"/>
    <image href="${logo}" x="18" y="-2" width="142" height="100" preserveAspectRatio="xMidYMid meet"/>
    <text x="178" y="42" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="22" font-weight="950" fill="#FFFFFF">AIO MAKE</text>
    <text x="178" y="70" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="16" font-weight="700" fill="rgba(255,255,255,.62)">견적 상담 시 함께 보내는 서비스 안내 이미지</text>
    <rect x="742" y="24" width="178" height="48" rx="24" fill="${s.accent}"/>
    <text x="831" y="55" text-anchor="middle" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="18" font-weight="950" fill="#FFFFFF">빠른 상담 가능</text>
  </g>

  ${t(s.category, 70, 204, { size: 24, weight: 950, fill: s.accent })}
  ${t(s.headline, 70, 294, { size: 58, weight: 950, fill: "#FFFFFF", gap: 68 })}
  ${t(wrap(s.sub, 36), 70, 450, { size: 24, weight: 650, fill: "rgba(255,255,255,.76)", gap: 36 })}

  ${heroWall(s, refs, labels)}

  <g transform="translate(64 1250)">
    <rect width="952" height="216" rx="34" fill="#FFFFFF" stroke="#DDE5EF"/>
    ${t("이런 요청이라면 바로 보내주세요", 34, 50, { size: 27, weight: 950 })}
    ${s.problems.map((p, i) => problemCard(34 + i * 310, 82, p, i, s.accent)).join("")}
  </g>

  <g transform="translate(64 1538)">
    <text x="0" y="0" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="30" font-weight="950" fill="#111827">실제 작업 레퍼런스</text>
    <text x="0" y="36" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="18" font-weight="700" fill="#64748B">실제 포트폴리오 결과물 화면을 기준으로 작업 톤과 완성도를 보여드립니다.</text>
    <g filter="url(#shadow)">
      ${refCard(0, 76, refs[0], `01 ${labels[0]}`, `ref1-${s.id}`, s.accent)}
      ${refCard(328, 76, refs[1], `02 ${labels[1]}`, `ref2-${s.id}`, s.accent)}
      ${refCard(656, 76, refs[2], `03 ${labels[2]}`, `ref3-${s.id}`, s.accent)}
    </g>
  </g>

  <g transform="translate(64 2180)">
    <text x="0" y="0" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="30" font-weight="950" fill="#111827">AIO가 먼저 정리하는 것</text>
    ${s.strengths.map((st, i) => strengthCard((i % 4) * 238, 34, st, i, s.accent)).join("")}
  </g>

  <g transform="translate(64 2348)">
    <rect width="952" height="256" rx="34" fill="#FFFFFF" stroke="#DDE5EF"/>
    ${t("대표 패키지", 32, 54, { size: 28, weight: 950 })}
    ${s.packages.map((p, i) => packageCard(32 + i * 306, 86, p, s.accent, i === 1)).join("")}
  </g>

  <g transform="translate(64 2630)">
    <rect width="952" height="66" rx="33" fill="${s.accent}"/>
    <text x="476" y="43" text-anchor="middle" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="25" font-weight="950" fill="#FFFFFF">${esc(s.cta)}</text>
  </g>
  <text x="70" y="2730" font-family="Pretendard, Malgun Gothic, Arial, sans-serif" font-size="18" font-weight="750" fill="#64748B">정확한 최종 견적은 작업 범위와 난이도 확인 후 확정됩니다. aio-make.com/ko</text>
</svg>`;
}

function indexHtml() {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AIO 견적용 서비스 상세 이미지</title><style>
  body{margin:0;background:#f4f7fb;color:#101827;font-family:Pretendard,Malgun Gothic,sans-serif}
  main{max-width:1180px;margin:0 auto;padding:46px 24px}h1{font-size:38px;margin:0 0 10px}p{color:#64748b}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;margin-top:26px}
  a{display:block;background:white;border:1px solid #dfe7f0;border-radius:22px;overflow:hidden;color:#101827;text-decoration:none;box-shadow:0 16px 38px rgba(15,23,42,.08)}
  img{display:block;width:100%}b{display:block;padding:14px 16px}
  </style></head><body><main><h1>AIO 견적용 서비스 상세 이미지</h1><p>숨고·크몽 견적 메시지에 바로 첨부할 서비스별 PNG입니다.</p><div class="grid">${services.map((s) => `<a href="./${encodeURI(s.fileBase)}.png"><img src="./${encodeURI(s.fileBase)}.png" alt="${esc(s.title)}"><b>${esc(s.title)}</b></a>`).join("")}</div></main></body></html>`;
}

await fs.mkdir(outDir, { recursive: true });

for (const s of services) {
  const svg = serviceSvg(s);
  await fs.writeFile(path.join(outDir, `${s.fileBase}.svg`), svg, "utf8");
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(outDir, `${s.fileBase}.png`));
  console.log(`created ${s.fileBase}`);
}

await fs.writeFile(path.join(outDir, "index.html"), indexHtml(), "utf8");
console.log(`created index`);
