import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "marketplace", "kmong-portfolio");
const dataPath = path.join(root, "docs", "marketplace", "kmong-portfolio-data.json");
fs.mkdirSync(outDir, { recursive: true });

const portfolios = [
  {
    id: "website",
    title: "반응형 웹사이트 제작 포트폴리오",
    category: "웹사이트",
    tone: ["#07111f", "#0ea5e9", "#22d3ee"],
    summary: "브랜드 소개, 서비스 설명, 문의 전환까지 이어지는 PC·모바일 웹 화면 구성",
    assets: [
      "public/portfolio/aio-design-agency/preview.png",
      "public/portfolio/v-aio-website/live.png",
      "public/portfolio/chueok-korea/live.png",
      "public/portfolio/aio-design-agency/mobile-preview.png"
    ],
    points: ["랜딩/기업 홈페이지", "PC·모바일 반응형", "문의 CTA 흐름"]
  },
  {
    id: "shopping-mall",
    title: "카페24 쇼핑몰 디자인 포트폴리오",
    category: "쇼핑몰",
    tone: ["#062318", "#10b981", "#f59e0b"],
    summary: "상품 진열, 메인 배너, 카테고리 흐름을 구매 동선 기준으로 정리한 쇼핑몰 샘플",
    assets: [
      "public/portfolio/cafe24-design-pack/contact-sheet.png",
      "public/portfolio/cafe24-design-pack/d01-wide.png",
      "public/portfolio/cafe24-design-pack/d04-preview.png",
      "public/portfolio/cafe24-design-pack/d10-preview.png"
    ],
    points: ["카페24 12종 메인", "모바일 상품 진열", "시즌 배너 구성"]
  },
  {
    id: "brand",
    title: "브랜드 로고·명함 디자인 포트폴리오",
    category: "로고·명함",
    tone: ["#22111b", "#ec4899", "#f9a8d4"],
    summary: "업종별 로고, 명함, 사인, 간단 브랜드 적용 이미지를 함께 구성한 브랜드 키트",
    assets: [
      "public/portfolio/logo-showcase/moru-coffee/logo-board.svg",
      "public/portfolio/logo-showcase/vela-skin/mockup-board.svg",
      "public/portfolio/logo-showcase/danchae-table/business-card-mockup.svg",
      "public/portfolio/logo-showcase/flowstack/signage-mockup.svg"
    ],
    points: ["심볼·워드마크", "명함 양면", "실사용 목업"]
  },
  {
    id: "detail-page",
    title: "모바일 상세페이지 디자인 포트폴리오",
    category: "상세페이지",
    tone: ["#261506", "#f97316", "#fde68a"],
    summary: "제품 USP, 사용 장면, 스펙, FAQ를 모바일 구매 흐름대로 배치한 상세페이지",
    assets: [
      "public/portfolio/detail-page-skincare/cover.png",
      "public/portfolio/detail-page-skincare/detail.png",
      "public/portfolio/detail-page-skincare/mobile.png",
      "public/portfolio/cafe24-design-pack/d02-mobile-final.png"
    ],
    points: ["제품 장점 정리", "모바일 가독성", "스펙·FAQ 구성"]
  },
  {
    id: "ppt",
    title: "목적별 PPT 디자인 포트폴리오",
    category: "PPT",
    tone: ["#161126", "#8b5cf6", "#a78bfa"],
    summary: "회사소개서, 제안서, IR, 강의자료를 발표 흐름에 맞게 정리한 PPT 샘플",
    assets: [
      "public/portfolio/ppt-design/brand-proposal/cover.png",
      "public/portfolio/ppt-design/ir-investment/sample-1.png",
      "public/portfolio/ppt-design/government-grant/sample-2.png",
      "public/portfolio/ppt-design/seminar-lecture/sample-3.png"
    ],
    points: ["회사소개서", "IR·제안서", "강의자료"]
  },
  {
    id: "automation-app",
    title: "업무 자동화·앱 MVP 포트폴리오",
    category: "자동화·앱",
    tone: ["#061c18", "#14b8a6", "#60a5fa"],
    summary: "반복 업무, 데이터 처리, 운영 대시보드, MVP 화면을 실제 사용 흐름 기준으로 구성",
    assets: [
      "public/portfolio/blogautopilot-multinational/real-demo/app-dashboard.png",
      "public/portfolio/v-aio-admin/dashboard.png",
      "public/portfolio/v-aio-admin/chatbot.png",
      "public/portfolio/blogautopilot-multinational/published-post-ko.png"
    ],
    points: ["운영 대시보드", "챗봇·DB 흐름", "콘텐츠 자동화"]
  },
  {
    id: "video",
    title: "숏폼·브랜드 영상 포트폴리오",
    category: "영상 콘텐츠",
    tone: ["#081625", "#06b6d4", "#f43f5e"],
    summary: "짧은 시간 안에 메시지가 보이도록 구성한 숏폼, 브랜드 인트로, 홍보 영상 샘플",
    assets: [
      "public/portfolio/video-content-samples/brand-shorts.png",
      "public/portfolio/aio-motion-intro/cover.svg",
      "public/marketplace/video-content-detail-proof.png",
      "public/portfolio/ppt-design/brand-proposal/cover-slide.png"
    ],
    points: ["숏폼 구성", "브랜드 인트로", "자막·썸네일"]
  }
];

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function abs(rel) {
  return path.join(root, rel);
}

function imageDataUri(rel) {
  const file = abs(rel);
  const ext = path.extname(file).toLowerCase();
  const mime = ext === ".svg" ? "image/svg+xml" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`;
}

function wrap(text, maxChars) {
  const lines = [];
  let line = "";
  for (const token of String(text).split(" ")) {
    if ((line + " " + token).trim().length > maxChars) {
      if (line) lines.push(line);
      line = token;
    } else {
      line = (line + " " + token).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

function image(rel, x, y, w, h, rx = 24) {
  const id = `clip-${Math.round(x)}-${Math.round(y)}-${Math.round(w)}-${Math.round(h)}`;
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath>
    <image href="${imageDataUri(rel)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
}

function textLines(lines, x, y, size, weight = 800, fill = "#fff", gap = size * 1.35) {
  return lines.map((line, i) => `<text x="${x}" y="${y + i * gap}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(line)}</text>`).join("");
}

function baseSvg(w, h, tone, body) {
  const [bg, accent, accent2] = tone;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${bg}"/>
        <stop offset="0.55" stop-color="#111827"/>
        <stop offset="1" stop-color="${accent}"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000" flood-opacity="0.32"/>
      </filter>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <circle cx="${w - 120}" cy="120" r="220" fill="${accent2}" opacity="0.14"/>
    <circle cx="110" cy="${h - 110}" r="260" fill="${accent}" opacity="0.14"/>
    <g font-family="Arial, 'Malgun Gothic', sans-serif">${body}</g>
  </svg>`;
}

async function render(svg, target) {
  await sharp(Buffer.from(svg)).png().toFile(target);
}

async function makePortfolio(p) {
  const [, accent, accent2] = p.tone;
  const coverBody = `
    <text x="52" y="70" font-size="20" font-weight="900" fill="${accent2}">AIO PORTFOLIO</text>
    ${textLines(wrap(p.title, 10), 52, 122, 40, 950, "#fff", 48)}
    ${textLines(wrap(p.summary, 17), 52, 260, 19, 650, "#dbeafe", 28)}
    <rect x="52" y="376" width="138" height="42" rx="21" fill="${accent}"/>
    <text x="121" y="403" text-anchor="middle" font-size="18" font-weight="950" fill="#06111f">${esc(p.category)}</text>
    ${image(p.assets[0], 382, 64, 216, 154, 22)}
    ${image(p.assets[1], 382, 238, 100, 118, 18)}
    ${image(p.assets[2], 498, 238, 100, 118, 18)}
  `;
  await render(baseSvg(652, 488, p.tone, coverBody), path.join(outDir, `${p.id}-portfolio-cover.png`));

  const detailBody = `
    <text x="70" y="105" font-size="30" font-weight="900" fill="${accent2}">실제 작업물 묶음</text>
    ${textLines(wrap(p.title, 14), 70, 172, 58, 950, "#fff", 68)}
    <text x="70" y="312" font-size="28" font-weight="650" fill="#dbeafe">${esc(p.summary)}</text>
    ${image(p.assets[0], 70, 400, 500, 350, 30)}
    ${image(p.assets[1], 630, 400, 500, 350, 30)}
    ${image(p.assets[2], 70, 820, 500, 350, 30)}
    ${image(p.assets[3], 630, 820, 500, 350, 30)}
    <rect x="70" y="1245" width="1060" height="250" rx="34" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)"/>
    <text x="110" y="1325" font-size="36" font-weight="950" fill="#fff">구성 포인트</text>
    ${p.points.map((point, i) => `<circle cx="118" cy="${1405 + i * 58}" r="6" fill="${accent2}"/><text x="144" y="${1415 + i * 58}" font-size="31" font-weight="800" fill="#f8fafc">${esc(point)}</text>`).join("")}
  `;
  await render(baseSvg(1200, 1600, p.tone, detailBody), path.join(outDir, `${p.id}-portfolio-detail.png`));
}

for (const portfolio of portfolios) {
  await makePortfolio(portfolio);
}

const output = portfolios.map((p) => ({
  ...p,
  cover: path.join(outDir, `${p.id}-portfolio-cover.png`),
  detail: path.join(outDir, `${p.id}-portfolio-detail.png`)
}));

fs.writeFileSync(dataPath, JSON.stringify(output, null, 2), "utf8");
console.log(`Generated ${output.length} portfolio sets in ${outDir}`);
