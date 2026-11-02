import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDataPath = path.join(root, "docs", "marketplace", "kmong-upgrade-data.json");
const outDir = path.join(root, "public", "marketplace", "kmong-premium");
const dataPath = path.join(root, "docs", "marketplace", "kmong-premium-data.json");
const copyPath = path.join(root, "docs", "marketplace", "kmong-premium-copy.md");

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.dirname(dataPath), { recursive: true });

const baseServices = JSON.parse(fs.readFileSync(sourceDataPath, "utf8"));

const serviceVisuals = {
  website: {
    tone: ["#07111f", "#0ea5e9", "#22d3ee"],
    hook: "문의 전환까지 설계하는 웹사이트",
    subhook: "첫 화면 메시지, 신뢰 요소, CTA 동선까지 한 번에 정리합니다.",
    proofTitle: "실제 웹 결과물 기반 구성",
    proof: [
      "public/portfolio/aio-design-agency/preview.png",
      "public/portfolio/aio-design-agency/mobile-preview.png",
      "public/portfolio/v-aio-website/live.png",
      "public/portfolio/chueok-korea/live.png",
    ],
    cases: ["AIO 포트폴리오 사이트", "V-AIO 비자 서비스 웹", "추억코리아 반응형 웹"],
    pain: ["첫 화면에서 무엇을 하는지 모호함", "모바일 문의 동선이 약함", "서비스/후기/가격 정보가 흩어짐"],
    outcomes: ["PC·모바일 반응형", "CTA와 문의 흐름 정리", "운영자가 바꾸기 쉬운 섹션 구조"],
  },
  "shopping-mall": {
    tone: ["#062318", "#10b981", "#f59e0b"],
    hook: "상품이 먼저 팔리도록 정리하는 쇼핑몰",
    subhook: "메인, 배너, 카테고리, 상품 진열을 모바일 구매 흐름 기준으로 구성합니다.",
    proofTitle: "카페24 업종별 디자인 샘플",
    proof: [
      "public/portfolio/cafe24-design-pack/contact-sheet.png",
      "public/portfolio/cafe24-design-pack/d01-wide.png",
      "public/portfolio/cafe24-design-pack/d04-preview.png",
      "public/portfolio/cafe24-design-pack/d10-preview.png",
    ],
    cases: ["카페24 12종 업종별 메인", "모바일 상품 진열", "시즌 배너 구성"],
    pain: ["메인 배너만 있고 구매 흐름이 약함", "상품 진열 우선순위가 없음", "모바일 첫 화면이 복잡함"],
    outcomes: ["메인/배너/카테고리 정리", "대표 상품 노출 기준", "운영용 이미지 교체 가이드"],
  },
  "logo-business-card": {
    tone: ["#22111b", "#ec4899", "#f9a8d4"],
    hook: "로고에서 명함까지 바로 쓰는 브랜드 키트",
    subhook: "심볼, 워드마크, 명함, 간단 가이드까지 실제 사용처 기준으로 제작합니다.",
    proofTitle: "다양한 업종 로고 쇼케이스",
    proof: [
      "public/portfolio/logo-showcase/moru-coffee/logo-board.svg",
      "public/portfolio/logo-showcase/vela-skin/mockup-board.svg",
      "public/portfolio/logo-showcase/danchae-table/business-card-mockup.svg",
      "public/portfolio/logo-showcase/flowstack/signage-mockup.svg",
    ],
    cases: ["F&B 브랜드 로고", "뷰티·스킨케어 패키지", "명함·사인 적용"],
    pain: ["로고만 있고 실제 적용 이미지가 없음", "명함·프로필 톤이 제각각", "인쇄용/웹용 파일 구분이 어려움"],
    outcomes: ["심볼·워드마크 구성", "명함 양면 디자인", "웹용/인쇄용 파일 정리"],
  },
  "detail-page": {
    tone: ["#261506", "#f97316", "#fde68a"],
    hook: "모바일에서 읽히는 판매 상세페이지",
    subhook: "제품 장점, 사용 장면, 스펙, FAQ를 구매 흐름대로 배치합니다.",
    proofTitle: "스킨케어 상세페이지 샘플",
    proof: [
      "public/portfolio/detail-page-skincare/cover.png",
      "public/portfolio/detail-page-skincare/detail.png",
      "public/portfolio/detail-page-skincare/mobile.png",
      "public/portfolio/cafe24-design-pack/d02-mobile-final.png",
    ],
    cases: ["제품 상세페이지", "모바일 세로형 흐름", "스펙·FAQ 섹션"],
    pain: ["사진만 나열되어 구매 이유가 약함", "모바일 가독성이 떨어짐", "스펙과 FAQ가 뒤섞임"],
    outcomes: ["구매 흐름 설계", "섹션별 카피 정리", "플랫폼 업로드용 이미지"],
  },
  "ppt-design": {
    tone: ["#161126", "#8b5cf6", "#a78bfa"],
    hook: "읽히는 순서가 살아있는 PPT 디자인",
    subhook: "회사소개서, 제안서, IR, 강의자료를 발표 가능한 원본으로 정리합니다.",
    proofTitle: "목적별 PPT 샘플",
    proof: [
      "public/portfolio/ppt-design/brand-proposal/cover.png",
      "public/portfolio/ppt-design/ir-investment/sample-1.png",
      "public/portfolio/ppt-design/government-grant/sample-2.png",
      "public/portfolio/ppt-design/seminar-lecture/sample-3.png",
    ],
    cases: ["브랜드 제안서", "IR·투자 피치덱", "정부지원사업·강의자료"],
    pain: ["내용은 있는데 슬라이드 흐름이 약함", "표와 도식이 읽히지 않음", "브랜드 톤이 제각각"],
    outcomes: ["PPTX 원본 제공", "도식/표/그래프 정리", "발표용 PDF 동시 납품"],
  },
  "automation-app": {
    tone: ["#061c18", "#14b8a6", "#60a5fa"],
    hook: "반복 업무를 줄이는 자동화·MVP",
    subhook: "입력, 처리, 출력, 운영 화면까지 실제 업무 흐름 기준으로 구현합니다.",
    proofTitle: "대시보드와 운영 자동화 사례",
    proof: [
      "public/portfolio/blogautopilot-multinational/real-demo/app-dashboard.png",
      "public/portfolio/v-aio-admin/dashboard.png",
      "public/portfolio/v-aio-admin/chatbot.png",
      "public/portfolio/blogautopilot-multinational/published-post-ko.png",
    ],
    cases: ["콘텐츠 자동화 대시보드", "상담 운영 관리자", "챗봇·DB·API 흐름"],
    pain: ["엑셀·CSV 반복 정리가 많음", "여러 계정/스케줄 관리가 번거로움", "MVP 검증 화면이 필요함"],
    outcomes: ["자동화 흐름 설계", "운영 대시보드", "사용 가이드와 테스트 결과"],
  },
  "video-content": {
    tone: ["#081625", "#06b6d4", "#f43f5e"],
    hook: "짧은 시간에 메시지가 보이는 영상",
    subhook: "쇼츠, 릴스, 브랜드 인트로, 홍보 영상을 플랫폼 비율에 맞춰 제작합니다.",
    proofTitle: "숏폼·브랜드 영상 구성 샘플",
    proof: [
      "public/portfolio/video-content-samples/brand-shorts.png",
      "public/portfolio/aio-motion-intro/cover.svg",
      "public/marketplace/video-content-detail-proof.png",
      "public/portfolio/ppt-design/brand-proposal/cover-slide.png",
    ],
    cases: ["30초 숏폼", "브랜드 인트로", "홍보 영상 구성안"],
    pain: ["짧은 영상인데 메시지가 안 남음", "자막과 장면 리듬이 어색함", "플랫폼별 비율 준비가 부족함"],
    outcomes: ["MP4 납품", "자막·BGM·썸네일", "16:9 또는 9:16 비율 출력"],
  },
};

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
  const out = [];
  let line = "";
  for (const token of String(text).split(" ")) {
    if ((line + " " + token).trim().length > maxChars) {
      if (line) out.push(line);
      line = token;
    } else {
      line = (line + " " + token).trim();
    }
  }
  if (line) out.push(line);
  return out;
}

function textLines(lines, x, y, opts = {}) {
  const size = opts.size ?? 34;
  const weight = opts.weight ?? 700;
  const fill = opts.fill ?? "#fff";
  const gap = opts.gap ?? size * 1.38;
  const anchor = opts.anchor ? ` text-anchor="${opts.anchor}"` : "";
  return lines
    .map((line, i) => `<text x="${x}" y="${y + i * gap}"${anchor} font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(line)}</text>`)
    .join("");
}

function bulletList(items, x, y, color = "#dbeafe", size = 30) {
  return items
    .map((item, i) => {
      const yy = y + i * 52;
      return `<circle cx="${x}" cy="${yy - 9}" r="5" fill="${color}"/><text x="${x + 22}" y="${yy}" font-size="${size}" font-weight="650" fill="#f8fafc">${esc(item)}</text>`;
    })
    .join("");
}

async function renderSvg(svg, file) {
  await sharp(Buffer.from(svg)).png().toFile(file);
}

function svgBase(w, h, tone, body) {
  const [bg, accent, accent2] = tone;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${bg}"/>
        <stop offset="0.56" stop-color="#111827"/>
        <stop offset="1" stop-color="${accent}"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity="0.32"/>
      </filter>
      <clipPath id="round"><rect x="0" y="0" width="100%" height="100%" rx="30"/></clipPath>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <circle cx="${w - 80}" cy="90" r="170" fill="${accent2}" opacity="0.15"/>
    <circle cx="80" cy="${h - 70}" r="190" fill="${accent}" opacity="0.14"/>
    <g font-family="Arial, 'Malgun Gothic', sans-serif">${body}</g>
  </svg>`;
}

function img(rel, x, y, w, h, rx = 24, opacity = 1) {
  const id = `c${Math.round(x)}${Math.round(y)}${Math.round(w)}${Math.round(h)}`;
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath>
    <image href="${imageDataUri(rel)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})" opacity="${opacity}"/>`;
}

function coverVisual(serviceId, spec) {
  const [, accent, accent2] = spec.tone;
  if (serviceId === "website") {
    return `
      <rect x="390" y="86" width="206" height="160" rx="18" fill="rgba(15,23,42,0.82)" stroke="rgba(255,255,255,0.24)" stroke-width="2"/>
      <circle cx="414" cy="108" r="5" fill="#fb7185"/><circle cx="432" cy="108" r="5" fill="#fbbf24"/><circle cx="450" cy="108" r="5" fill="#34d399"/>
      ${img(spec.proof[0], 406, 122, 174, 104, 12, 0.96)}
      <rect x="462" y="224" width="118" height="148" rx="24" fill="rgba(2,6,23,0.9)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      ${img(spec.proof[1], 475, 240, 92, 112, 14, 0.96)}
      <rect x="398" y="268" width="74" height="28" rx="14" fill="${accent}"/><text x="435" y="287" text-anchor="middle" font-size="12" font-weight="900" fill="#03111f">CTA</text>
      <path d="M471 282 C497 282 497 266 520 266" stroke="${accent2}" stroke-width="3" fill="none" stroke-linecap="round"/>
    `;
  }
  if (serviceId === "shopping-mall") {
    return `
      <rect x="382" y="78" width="222" height="284" rx="24" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
      ${img(spec.proof[1], 398, 96, 84, 90, 14, 0.98)}
      ${img(spec.proof[2], 500, 96, 84, 90, 14, 0.98)}
      ${img(spec.proof[3], 398, 204, 84, 90, 14, 0.98)}
      ${img(spec.proof[0], 500, 204, 84, 90, 14, 0.98)}
      <rect x="410" y="314" width="160" height="34" rx="17" fill="${accent2}"/><text x="490" y="337" text-anchor="middle" font-size="15" font-weight="950" fill="#1f1300">상품 진열 정리</text>
    `;
  }
  if (serviceId === "logo-business-card") {
    return `
      <rect x="386" y="88" width="96" height="96" rx="20" fill="#fff" filter="url(#shadow)"/>
      ${img(spec.proof[0], 398, 100, 72, 72, 14, 0.98)}
      <rect x="500" y="88" width="96" height="96" rx="20" fill="#fff" filter="url(#shadow)"/>
      ${img(spec.proof[1], 512, 100, 72, 72, 14, 0.98)}
      <rect x="386" y="206" width="210" height="118" rx="18" fill="rgba(255,255,255,0.95)" filter="url(#shadow)"/>
      ${img(spec.proof[2], 398, 218, 186, 90, 12, 0.98)}
      <rect x="418" y="344" width="148" height="30" rx="15" fill="${accent2}"/><text x="492" y="364" text-anchor="middle" font-size="14" font-weight="950" fill="#3b1328">실사용 파일</text>
    `;
  }
  if (serviceId === "detail-page") {
    return `
      <rect x="422" y="70" width="128" height="292" rx="28" fill="rgba(2,6,23,0.9)" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
      ${img(spec.proof[2], 434, 88, 104, 242, 20, 0.98)}
      <rect x="382" y="156" width="118" height="142" rx="20" fill="rgba(255,255,255,0.96)" filter="url(#shadow)"/>
      ${img(spec.proof[0], 394, 168, 94, 96, 14, 0.98)}
      <text x="441" y="282" text-anchor="middle" font-size="13" font-weight="950" fill="#431407">제품 USP</text>
      <path d="M508 316 L550 316" stroke="${accent2}" stroke-width="4" stroke-linecap="round"/>
    `;
  }
  if (serviceId === "ppt-design") {
    return `
      <rect x="386" y="104" width="184" height="112" rx="16" fill="rgba(255,255,255,0.96)" transform="rotate(-7 478 160)" filter="url(#shadow)"/>
      ${img(spec.proof[0], 399, 116, 158, 86, 10, 0.98)}
      <rect x="406" y="180" width="184" height="112" rx="16" fill="rgba(255,255,255,0.96)" transform="rotate(5 498 236)" filter="url(#shadow)"/>
      ${img(spec.proof[1], 419, 192, 158, 86, 10, 0.98)}
      <rect x="384" y="266" width="184" height="42" rx="21" fill="${accent2}"/><text x="476" y="293" text-anchor="middle" font-size="16" font-weight="950" fill="#211047">PPTX + PDF</text>
    `;
  }
  if (serviceId === "automation-app") {
    return `
      <rect x="382" y="86" width="214" height="142" rx="20" fill="rgba(2,6,23,0.86)" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
      ${img(spec.proof[0], 398, 104, 182, 104, 12, 0.98)}
      <rect x="390" y="270" width="72" height="44" rx="14" fill="rgba(255,255,255,0.13)" stroke="${accent2}"/>
      <rect x="486" y="270" width="72" height="44" rx="14" fill="rgba(255,255,255,0.13)" stroke="${accent2}"/>
      <rect x="438" y="336" width="72" height="44" rx="14" fill="${accent}"/>
      <path d="M462 292 H486 M522 314 C522 334 500 334 474 336 M426 314 C426 334 448 334 474 336" stroke="${accent2}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <text x="474" y="365" text-anchor="middle" font-size="13" font-weight="950" fill="#04111f">자동화</text>
    `;
  }
  return `
    <rect x="392" y="92" width="174" height="222" rx="28" fill="rgba(2,6,23,0.9)" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
    ${img(spec.proof[0], 406, 108, 146, 174, 20, 0.98)}
    <rect x="384" y="336" width="196" height="28" rx="14" fill="rgba(255,255,255,0.15)"/>
    <rect x="402" y="346" width="42" height="8" rx="4" fill="${accent}"/>
    <rect x="458" y="346" width="42" height="8" rx="4" fill="${accent2}"/>
    <rect x="514" y="346" width="42" height="8" rx="4" fill="#fff" opacity="0.75"/>
  `;
}

async function makeCover(service, spec) {
  const [bg, accent, accent2] = spec.tone;
  const titleLines = wrap(spec.hook, 10);
  const titleSize = titleLines.length > 2 ? 36 : 38;
  const titleGap = titleLines.length > 2 ? 42 : 46;
  const subY = 132 + titleLines.length * titleGap + 24;
  const body = `
    <rect x="34" y="34" width="584" height="420" rx="34" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)"/>
    <text x="62" y="82" font-size="22" font-weight="800" fill="${accent2}">AIO SERVICE</text>
    ${textLines(titleLines, 62, 132, { size: titleSize, weight: 900, fill: "#fff", gap: titleGap })}
    ${textLines(wrap(spec.subhook, 18), 62, subY, { size: 20, weight: 650, fill: "#dbeafe", gap: 28 })}
    <rect x="62" y="354" width="180" height="52" rx="26" fill="${accent}"/>
    <text x="152" y="388" text-anchor="middle" font-size="22" font-weight="900" fill="${bg}">5월 오픈가</text>
    <text x="275" y="388" font-size="22" font-weight="800" fill="#fff">정상가 별도 표기</text>
    ${coverVisual(service.id, spec)}
  `;
  await renderSvg(svgBase(652, 488, spec.tone, body), path.join(outDir, `${service.id}-cover.png`));
}

async function makeProofWall(service, spec) {
  const body = `
    <text x="72" y="110" font-size="34" font-weight="900" fill="${spec.tone[2]}">실제 작업물 기반</text>
    ${textLines(wrap(spec.proofTitle, 16), 72, 178, { size: 64, weight: 950, fill: "#fff", gap: 72 })}
    <text x="72" y="330" font-size="30" font-weight="650" fill="#dbeafe">말뿐인 설명보다 결과 화면을 먼저 보여드립니다.</text>
    ${img(spec.proof[0], 72, 430, 500, 360, 30)}
    ${img(spec.proof[1], 628, 430, 500, 360, 30)}
    ${img(spec.proof[2], 72, 850, 500, 360, 30)}
    ${img(spec.proof[3], 628, 850, 500, 360, 30)}
    <rect x="72" y="1280" width="1056" height="330" rx="34" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)"/>
    <text x="112" y="1358" font-size="34" font-weight="900" fill="#fff">포트폴리오 구성</text>
    ${bulletList(spec.cases, 118, 1436, spec.tone[2], 32)}
    <text x="112" y="1640" font-size="25" font-weight="650" fill="#cbd5e1">외부 연락처 없이 크몽 안에서 상담과 결제를 진행합니다.</text>
  `;
  await renderSvg(svgBase(1200, 1800, spec.tone, body), path.join(outDir, `${service.id}-detail-01-proof.png`));
}

async function makeProblemSolution(service, spec) {
  const body = `
    <text x="72" y="115" font-size="34" font-weight="900" fill="${spec.tone[2]}">구매 전환 포인트</text>
    ${textLines(wrap("이런 문제를 먼저 정리합니다", 13), 72, 190, { size: 64, weight: 950, fill: "#fff", gap: 74 })}
    <rect x="72" y="340" width="500" height="580" rx="34" fill="rgba(15,23,42,0.72)" stroke="rgba(255,255,255,0.16)"/>
    <text x="112" y="420" font-size="36" font-weight="900" fill="#fecaca">Before</text>
    ${bulletList(spec.pain, 120, 510, "#fb7185", 31)}
    <rect x="628" y="340" width="500" height="580" rx="34" fill="rgba(255,255,255,0.11)" stroke="rgba(255,255,255,0.2)"/>
    <text x="668" y="420" font-size="36" font-weight="900" fill="${spec.tone[2]}">After</text>
    ${bulletList(spec.outcomes, 676, 510, spec.tone[2], 31)}
    <rect x="72" y="990" width="1056" height="520" rx="36" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)"/>
    <text x="112" y="1075" font-size="40" font-weight="950" fill="#fff">패키지 선택 기준</text>
    <text x="112" y="1160" font-size="32" font-weight="900" fill="${spec.tone[2]}">STANDARD</text>
    <text x="330" y="1160" font-size="30" font-weight="700" fill="#f8fafc">${esc(service.packages[0][1])} · ${esc(service.packages[0][2])}</text>
    <text x="112" y="1245" font-size="32" font-weight="900" fill="${spec.tone[2]}">DELUXE</text>
    <text x="330" y="1245" font-size="30" font-weight="700" fill="#f8fafc">${esc(service.packages[1][1])} · ${esc(service.packages[1][2])}</text>
    <text x="112" y="1330" font-size="32" font-weight="900" fill="${spec.tone[2]}">PREMIUM</text>
    <text x="330" y="1330" font-size="30" font-weight="700" fill="#f8fafc">${esc(service.packages[2][1])} · ${esc(service.packages[2][2])}</text>
    <rect x="112" y="1410" width="330" height="62" rx="31" fill="${spec.tone[1]}"/>
    <text x="277" y="1451" text-anchor="middle" font-size="27" font-weight="950" fill="#06111f">2026년 5월 한정</text>
  `;
  await renderSvg(svgBase(1200, 1800, spec.tone, body), path.join(outDir, `${service.id}-detail-02-conversion.png`));
}

async function makeProcess(service, spec) {
  const steps = service.process.slice(0, 5);
  const body = `
    <text x="72" y="115" font-size="34" font-weight="900" fill="${spec.tone[2]}">진행 방식</text>
    ${textLines(["작업 범위가", "명확해야 결과가 좋습니다"], 72, 190, { size: 62, weight: 950, fill: "#fff", gap: 72 })}
    <rect x="72" y="380" width="1056" height="720" rx="36" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)"/>
    ${steps
      .map((step, i) => {
        const y = 475 + i * 118;
        return `<circle cx="132" cy="${y - 12}" r="34" fill="${spec.tone[1]}"/><text x="132" y="${y}" text-anchor="middle" font-size="25" font-weight="950" fill="#06111f">${String(i + 1).padStart(2, "0")}</text><text x="196" y="${y}" font-size="34" font-weight="850" fill="#fff">${esc(step)}</text>`;
      })
      .join("")}
    <rect x="72" y="1180" width="1056" height="340" rx="36" fill="rgba(15,23,42,0.72)" stroke="rgba(255,255,255,0.16)"/>
    <text x="112" y="1260" font-size="39" font-weight="950" fill="#fff">구매 전 준비 자료</text>
    ${bulletList(service.requestItems.slice(0, 5), 118, 1342, spec.tone[2], 30)}
    <text x="72" y="1630" font-size="27" font-weight="700" fill="#dbeafe">일정, 수정 횟수, 납품물은 패키지별로 먼저 확인하고 진행합니다.</text>
  `;
  await renderSvg(svgBase(1200, 1800, spec.tone, body), path.join(outDir, `${service.id}-detail-03-process.png`));
}

function enrichDescription(service, spec) {
  return `${service.description.trim()}

[왜 AIO에 맡기면 좋은가요]
- 단순 제작물이 아니라 실제 사용 화면과 고객 동선을 기준으로 구성합니다.
- 상담 단계에서 목표, 자료 상태, 일정, 수정 범위를 먼저 정리해 작업 중 방향이 흔들리지 않게 합니다.
- 포트폴리오 기반의 결과 화면을 참고해 의뢰 전 결과물의 밀도와 톤을 확인하실 수 있습니다.
- 2026년 5월 오픈 이벤트가는 초기 등록 기간에 한해 적용되며, 작업 범위는 패키지 설명을 기준으로 안내드립니다.

[이런 상황에 특히 적합합니다]
${spec.pain.map((item) => `- ${item}`).join("\n")}

[작업 후 기대할 수 있는 정리]
${spec.outcomes.map((item) => `- ${item}`).join("\n")}

[실제 포트폴리오에서 보여드리는 것]
${spec.cases.map((item) => `- ${item}`).join("\n")}

[패키지 선택 가이드]
- ${service.packages[0][0]} ${service.packages[0][1]}: ${service.packages[0][6]} 중심의 빠른 시작형입니다.
- ${service.packages[1][0]} ${service.packages[1][1]}: ${service.packages[1][6]}까지 필요한 경우 추천드립니다.
- ${service.packages[2][0]} ${service.packages[2][1]}: ${service.packages[2][6]}처럼 범위가 넓거나 완성도를 더 높여야 할 때 적합합니다.

[포함되는 기본 진행]
1. 자료 확인과 목표 정리
2. 작업 범위와 우선순위 확정
3. 초안 또는 중간 결과 공유
4. 패키지별 수정 횟수 안에서 피드백 반영
5. 최종 파일과 사용 기준 전달

[별도 협의가 필요한 경우]
- 최초 합의 범위를 넘어서는 신규 기능, 신규 페이지, 추가 시안, 전체 방향 변경
- 촬영, 대량 자료 정리, 외부 서비스 고도 연동, 장기 유지보수
- 저작권 확인이 필요한 유료 이미지·폰트·음원·템플릿 사용

[진행 전 안내]
외부 연락처나 개인 사이트 이동 없이 크몽 메시지 안에서 상담을 진행합니다. 자료가 부족한 경우 가능한 범위를 먼저 안내드리고, 무리한 확정 대신 작업 가능한 단위부터 제안드립니다.
`;
}

const premiumServices = [];
let md = "# 크몽 프리미엄 보강 원고\n\n";

for (const service of baseServices) {
  const spec = serviceVisuals[service.id];
  if (!spec) continue;
  await makeCover(service, spec);
  await makeProofWall(service, spec);
  await makeProblemSolution(service, spec);
  await makeProcess(service, spec);

  const premium = {
    ...service,
    description: enrichDescription(service, spec),
    images: [
      path.join(outDir, `${service.id}-detail-01-proof.png`),
      path.join(outDir, `${service.id}-detail-02-conversion.png`),
      path.join(outDir, `${service.id}-detail-03-process.png`),
    ],
    mainImages: [path.join(outDir, `${service.id}-cover.png`)],
  };
  premiumServices.push(premium);
  md += `## ${service.name}\n\n${premium.description}\n\n`;
}

fs.writeFileSync(dataPath, JSON.stringify(premiumServices, null, 2), "utf8");
fs.writeFileSync(copyPath, md, "utf8");

console.log(`Generated ${premiumServices.length} premium service sets in ${outDir}`);
