import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "marketplace");
fs.mkdirSync(outDir, { recursive: true });

const services = [
  {
    id: "website",
    title: "웹사이트 제작",
    subtitle: "브랜드 신뢰와 문의 전환을 위한 맞춤형 반응형 사이트",
    accent: "#22d3ee",
    dark: "#082f49",
    points: ["기획 구조 정리", "PC·모바일 반응형", "문의 동선 설계"],
    thumbnails: [
      "public/portfolio/aio-design-agency/preview.png",
      "public/portfolio/chueok-korea/live.png",
      "public/portfolio/v-aio-website/live.png",
    ],
  },
  {
    id: "shopping-mall",
    title: "쇼핑몰 디자인",
    subtitle: "카페24·브랜드몰 첫 화면과 상품 흐름을 정리합니다",
    accent: "#34d399",
    dark: "#064e3b",
    points: ["메인 화면 설계", "배너·상품 진열", "모바일 쇼핑 최적화"],
    thumbnails: [
      "public/portfolio/cafe24-design-pack/d01-wide.png",
      "public/portfolio/cafe24-design-pack/d04-wide.png",
      "public/portfolio/cafe24-design-pack/d07-wide.png",
    ],
  },
  {
    id: "logo-business-card",
    title: "로고·명함",
    subtitle: "작은 브랜드도 바로 쓰기 좋은 로고와 인쇄 파일 세트",
    accent: "#f472b6",
    dark: "#831843",
    points: ["로고 시스템", "명함 디자인", "온라인 프로필 키트"],
    thumbnails: [
      "public/portfolio/logo-showcase/moru-coffee/logo-board.svg",
      "public/portfolio/logo-showcase/vela-skin/mockup-board.svg",
      "public/portfolio/logo-showcase/breath-pilates/business-card-mockup.svg",
    ],
  },
  {
    id: "detail-page",
    title: "상세페이지",
    subtitle: "제품 장점을 구매 흐름으로 바꾸는 세로형 판매 페이지",
    accent: "#fb923c",
    dark: "#7c2d12",
    points: ["핵심 카피 정리", "모바일 가독성", "이미지 흐름 설계"],
    thumbnails: [
      "public/portfolio/detail-page-skincare/cover.png",
      "public/portfolio/detail-page-skincare/detail.png",
      "public/portfolio/detail-page-skincare/mobile.png",
    ],
  },
  {
    id: "ppt-design",
    title: "PPT 디자인",
    subtitle: "제안서·회사소개서·발표자료를 바로 전달 가능한 원본으로",
    accent: "#a78bfa",
    dark: "#4c1d95",
    points: ["스토리 구조", "도식화·가독성", "PPTX·PDF 납품"],
    thumbnails: [
      "public/portfolio/ppt-design/brand-proposal/cover-slide.png",
      "public/portfolio/ppt-design/government-grant/sample-1.png",
      "public/portfolio/ppt-design/ir-investment/sample-1.png",
    ],
  },
  {
    id: "automation-app",
    title: "자동화·앱",
    subtitle: "반복 업무, MVP, 운영 대시보드를 실제로 쓰는 화면까지",
    accent: "#60a5fa",
    dark: "#1e3a8a",
    points: ["업무 흐름 분석", "DB·API 연동", "운영 가이드"],
    thumbnails: [
      "public/portfolio/v-aio-admin/dashboard.png",
      "public/portfolio/v-aio-admin/chatbot.png",
      "public/portfolio/blogautopilot-multinational/published-post-ko.png",
    ],
  },
  {
    id: "video-content",
    title: "영상 콘텐츠",
    subtitle: "브랜드 인트로·홍보 영상·숏폼을 목적에 맞게 제작",
    accent: "#facc15",
    dark: "#713f12",
    points: ["30초 홍보 영상", "쇼츠·릴스", "자막·BGM 구성"],
    thumbnails: [
      "public/portfolio/video-content-samples/brand-shorts.png",
      "public/portfolio/aio-motion-intro/cover.svg",
      "public/portfolio/blogautopilot-multinational/live-run-affiliate.jpg",
    ],
  },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function splitLabel(value, max = 8) {
  const text = String(value);
  if (text.length <= max) return [text];
  const midpoint = Math.ceil(text.length / 2);
  const before = text.lastIndexOf(" ", midpoint);
  const after = text.indexOf(" ", midpoint);
  const cut = before > 2 ? before : after > 0 ? after : midpoint;
  return [text.slice(0, cut).trim(), text.slice(cut).trim()].filter(Boolean);
}

function tspans(lines, x, dy, attrs = "") {
  return lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : dy}" ${attrs}>${esc(line)}</tspan>`)
    .join("");
}

function coverSvg(service, platform) {
  const label = platform === "kmong" ? "KMONG SERVICE" : "SOOMGO MARKET";
  const subtitleLines = splitLabel(service.subtitle, 28);
  return `
  <svg width="652" height="488" viewBox="0 0 652 488" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0f172a"/>
        <stop offset="0.48" stop-color="${service.dark}"/>
        <stop offset="1" stop-color="#111827"/>
      </linearGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity="0.32"/>
      </filter>
    </defs>
    <rect width="652" height="488" rx="0" fill="url(#bg)"/>
    <rect x="34" y="34" width="584" height="420" rx="26" fill="#ffffff" opacity="0.07" stroke="#ffffff" stroke-opacity="0.14"/>
    <text x="58" y="78" fill="${service.accent}" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="3">${label}</text>
    <text x="58" y="155" fill="#ffffff" font-family="Arial, sans-serif" font-size="48" font-weight="800">${esc(service.title)}</text>
    <text x="58" y="205" fill="#dbeafe" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="22" font-weight="600">
      ${tspans(subtitleLines, 58, 31)}
    </text>
    ${service.points
      .map((point, index) => {
        const pointLines = splitLabel(point, 5);
        return `
        <g transform="translate(${58 + index * 176} 315)" filter="url(#shadow)">
          <rect width="154" height="72" rx="18" fill="#020617" opacity="0.78" stroke="${service.accent}" stroke-opacity="0.42"/>
          <circle cx="26" cy="36" r="8" fill="${service.accent}"/>
          <text x="44" y="${pointLines.length === 1 ? 41 : 32}" fill="#ffffff" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="15" font-weight="700">
            ${tspans(pointLines, 44, 20)}
          </text>
        </g>`;
      })
      .join("")}
    <text x="58" y="426" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="15">AIO 에이전시 · 맞춤 제작 포트폴리오 기반</text>
  </svg>`;
}

function profileSvg() {
  return `
  <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="p" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0f172a"/>
        <stop offset="0.55" stop-color="#0e7490"/>
        <stop offset="1" stop-color="#111827"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="1000" fill="url(#p)"/>
    <circle cx="500" cy="410" r="210" fill="#ffffff" opacity="0.08" stroke="#ffffff" stroke-opacity="0.20" stroke-width="3"/>
    <text x="500" y="455" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="168" font-weight="900" letter-spacing="-6">AIO</text>
    <text x="500" y="630" text-anchor="middle" fill="#a5f3fc" font-family="Arial, sans-serif" font-size="44" font-weight="800">에이아이오</text>
    <text x="500" y="700" text-anchor="middle" fill="#e0f2fe" font-family="Arial, sans-serif" font-size="31" font-weight="600">기획 · 디자인 · 개발 · 자동화</text>
  </svg>`;
}

function detailBaseSvg(service) {
  const subtitleLines = splitLabel(service.subtitle, 30);
  return `
  <svg width="1200" height="1800" viewBox="0 0 1200 1800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0f172a"/>
        <stop offset="0.54" stop-color="${service.dark}"/>
        <stop offset="1" stop-color="#111827"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="1800" fill="url(#bg)"/>
    <text x="88" y="112" fill="${service.accent}" font-family="Arial, sans-serif" font-size="28" font-weight="800" letter-spacing="5">AIO PORTFOLIO PROOF</text>
    <text x="88" y="204" fill="#ffffff" font-family="Arial, sans-serif" font-size="76" font-weight="900">${esc(service.title)}</text>
    <text x="88" y="284" fill="#dbeafe" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="34" font-weight="700">
      ${tspans(subtitleLines, 88, 46)}
    </text>
    <rect x="88" y="380" width="1024" height="2" fill="#ffffff" opacity="0.16"/>
    <text x="88" y="450" fill="#ffffff" font-family="Arial, sans-serif" font-size="36" font-weight="800">제공 방향</text>
    ${service.points
      .map(
        (point, index) => `
        <g transform="translate(88 ${500 + index * 80})">
          <circle cx="20" cy="20" r="11" fill="${service.accent}"/>
          <text x="56" y="30" fill="#e5e7eb" font-family="Arial, sans-serif" font-size="31" font-weight="700">${esc(point)}</text>
        </g>`,
      )
      .join("")}
    <text x="88" y="820" fill="#ffffff" font-family="Arial, sans-serif" font-size="36" font-weight="800">포트폴리오 예시</text>
    <rect x="88" y="870" width="1024" height="760" rx="30" fill="#020617" opacity="0.56" stroke="#ffffff" stroke-opacity="0.12"/>
    <text x="88" y="1700" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="27">민감 정보와 외부 연락처를 제외한 등록용 이미지입니다.</text>
  </svg>`;
}

async function thumbnailBuffer(file, width, height) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) {
    return sharp({
      create: {
        width,
        height,
        channels: 4,
        background: "#111827",
      },
    })
      .png()
      .toBuffer();
  }
  return sharp(abs)
    .resize(width, height, { fit: "cover", position: "top" })
    .png()
    .toBuffer();
}

for (const service of services) {
  for (const platform of ["kmong", "soomgo"]) {
    await sharp(Buffer.from(coverSvg(service, platform)))
      .png()
      .toFile(path.join(outDir, `${service.id}-${platform}-cover.png`));
  }

  const base = await sharp(Buffer.from(detailBaseSvg(service))).png().toBuffer();
  const composites = [];
  for (let index = 0; index < service.thumbnails.length; index += 1) {
    const input = await thumbnailBuffer(service.thumbnails[index], 900, 210);
    composites.push({ input, left: 150, top: 940 + index * 225 });
  }
  await sharp(base)
    .composite(composites)
    .png()
    .toFile(path.join(outDir, `${service.id}-detail-proof.png`));
}

await sharp(Buffer.from(profileSvg()))
  .png()
  .toFile(path.join(outDir, "aio-profile-square.png"));

console.log(`Generated ${services.length * 3 + 1} marketplace assets in ${outDir}`);
