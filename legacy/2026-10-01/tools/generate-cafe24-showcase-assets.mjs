import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outRoot = join(process.cwd(), "public", "portfolio", "cafe24-design-pack");
mkdirSync(outRoot, { recursive: true });

const designs = [
  { id: "d01", title: "산지직송 식품몰", category: "Food", accent: "#1f5d2e", accent2: "#f59e0b", bg: "#eef7e9", hero: "Farm to table", modules: ["인증 배지", "오늘 출고", "카테고리 칩"] },
  { id: "d02", title: "클린뷰티 쇼핑몰", category: "Beauty", accent: "#b98c7a", accent2: "#8aa6a3", bg: "#f7eeeb", hero: "Clean formula", modules: ["성분 키워드", "제품 카드", "저자극 메시지"] },
  { id: "d03", title: "밀키트 쇼핑몰", category: "Meal Kit", accent: "#e4572e", accent2: "#f7b32b", bg: "#fff1e8", hero: "15-minute dinner", modules: ["조리 시간", "인기 메뉴", "후기 추천"] },
  { id: "d04", title: "라이브커머스 쇼핑몰", category: "Live", accent: "#df3f3f", accent2: "#111827", bg: "#fff0f0", hero: "Live deal tonight", modules: ["방송 예고", "카운트다운", "특가 CTA"] },
  { id: "d05", title: "반려동물 용품몰", category: "Pet", accent: "#f59e0b", accent2: "#2dd4bf", bg: "#fff8e8", hero: "Care for buddies", modules: ["안전 배지", "나이별 탐색", "추천 상품"] },
  { id: "d06", title: "디지털 템플릿몰", category: "Digital", accent: "#6366f1", accent2: "#22d3ee", bg: "#eef2ff", hero: "Download-ready", modules: ["미리보기", "사용처 필터", "즉시 다운로드"] },
  { id: "d07", title: "건강기능식품몰", category: "Health", accent: "#0f766e", accent2: "#84cc16", bg: "#ecfdf5", hero: "Daily wellness", modules: ["성분 카드", "인증 정보", "정기구독"] },
  { id: "d08", title: "문구 라이프스타일몰", category: "Stationery", accent: "#7c3aed", accent2: "#f472b6", bg: "#f5f3ff", hero: "Curated desk", modules: ["룩북 배너", "컬렉션", "묶음 구매"] },
  { id: "d09", title: "패션 베이직 쇼핑몰", category: "Fashion", accent: "#111827", accent2: "#c4a484", bg: "#f7f2eb", hero: "Everyday fit", modules: ["핏 카테고리", "컬러 스와치", "시즌 컬렉션"] },
  { id: "d10", title: "1인 브랜드 쇼핑몰", category: "Solo Brand", accent: "#7c2d12", accent2: "#fb923c", bg: "#fff7ed", hero: "Maker story", modules: ["브랜드 스토리", "대표 상품", "후기 영역"] },
  { id: "d11", title: "키즈용품 쇼핑몰", category: "Kids", accent: "#0ea5e9", accent2: "#facc15", bg: "#eff6ff", hero: "Safe kids goods", modules: ["연령별 탐색", "소재 배지", "선물 추천"] },
  { id: "d12", title: "프리미엄 티 브랜드몰", category: "Premium Tea", accent: "#365314", accent2: "#ca8a04", bg: "#f7f7ee", hero: "Origin and aroma", modules: ["산지 스토리", "향미 노트", "선물세트"] },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function storefrontSvg(design) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img">
  <rect width="1600" height="900" fill="${design.bg}"/>
  <rect x="86" y="70" width="1428" height="760" rx="34" fill="#ffffff"/>
  <rect x="86" y="70" width="1428" height="78" rx="34" fill="${design.accent}"/>
  <rect x="86" y="112" width="1428" height="92" fill="#ffffff"/>
  <text x="132" y="120" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="900" letter-spacing="5" fill="#ffffff">${esc(design.category)} COMMERCE</text>
  <circle cx="1410" cy="110" r="18" fill="#ffffff" opacity=".75"/>
  <circle cx="1460" cy="110" r="18" fill="${design.accent2}"/>
  <text x="132" y="177" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="900" fill="#111827">${esc(design.title)}</text>
  <text x="1015" y="177" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="#64748b">LOGIN  CART  MY</text>
  <rect x="128" y="246" width="720" height="360" rx="28" fill="${design.bg}"/>
  <text x="170" y="340" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" fill="${design.accent}">${esc(design.category)}</text>
  <text x="170" y="430" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="950" fill="#111827">${esc(design.hero)}</text>
  <rect x="170" y="505" width="210" height="54" rx="27" fill="${design.accent}"/>
  <text x="275" y="540" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="900" fill="#ffffff">SHOP NOW</text>
  <circle cx="740" cy="370" r="145" fill="${design.accent2}" opacity=".28"/>
  <circle cx="710" cy="430" r="105" fill="${design.accent}" opacity=".72"/>
  <rect x="910" y="246" width="250" height="172" rx="24" fill="#f8fafc"/>
  <rect x="1200" y="246" width="250" height="172" rx="24" fill="#f8fafc"/>
  <rect x="910" y="456" width="250" height="150" rx="24" fill="#f8fafc"/>
  <rect x="1200" y="456" width="250" height="150" rx="24" fill="#f8fafc"/>
  ${design.modules.map((module, index) => {
    const x = 930 + (index % 2) * 290;
    const y = 300 + Math.floor(index / 2) * 210;
    return `<circle cx="${x}" cy="${y}" r="22" fill="${index === 1 ? design.accent2 : design.accent}"/><text x="${x + 38}" y="${y + 8}" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="900" fill="#111827">${esc(module)}</text>`;
  }).join("\n  ")}
  <rect x="128" y="670" width="1322" height="84" rx="24" fill="#111827"/>
  <text x="170" y="724" font-family="Inter, Arial, sans-serif" font-size="23" font-weight="800" fill="#ffffff" opacity=".9">Cafe24 Smart Design · Main HTML · Replacement Guide</text>
</svg>
`;
}

function guideSvg(design) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img">
  <rect width="1600" height="900" fill="#0b0b0b"/>
  <text x="96" y="120" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="900" letter-spacing="5" fill="${design.accent2}">DESIGN GUIDE</text>
  <text x="96" y="210" font-family="Inter, Arial, sans-serif" font-size="64" font-weight="950" fill="#ffffff">${esc(design.title)}</text>
  <text x="96" y="275" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700" fill="#a3a3a3">${esc(design.hero)} · Cafe24 storefront concept</text>
  <rect x="96" y="360" width="380" height="290" rx="30" fill="#151515" stroke="#ffffff" stroke-opacity=".08"/>
  <text x="140" y="430" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="900" fill="#ffffff">Palette</text>
  <circle cx="160" cy="520" r="42" fill="${design.accent}"/>
  <circle cx="270" cy="520" r="42" fill="${design.accent2}"/>
  <circle cx="380" cy="520" r="42" fill="${design.bg}"/>
  <rect x="560" y="360" width="440" height="290" rx="30" fill="#151515" stroke="#ffffff" stroke-opacity=".08"/>
  <text x="604" y="430" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="900" fill="#ffffff">Core modules</text>
  ${design.modules.map((module, index) => `<rect x="604" y="${470 + index * 54}" width="300" height="36" rx="18" fill="${index === 1 ? design.accent2 : design.accent}" opacity=".9"/><text x="626" y="${495 + index * 54}" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="900" fill="#ffffff">${esc(module)}</text>`).join("\n  ")}
  <rect x="1084" y="360" width="420" height="290" rx="30" fill="#151515" stroke="#ffffff" stroke-opacity=".08"/>
  <text x="1128" y="430" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="900" fill="#ffffff">Delivery</text>
  <text x="1128" y="492" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#d4d4d4">Main HTML concept</text>
  <text x="1128" y="546" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#d4d4d4">Banner replacement rules</text>
  <text x="1128" y="600" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#d4d4d4">Category and product UI</text>
  <rect x="96" y="735" width="1408" height="72" rx="24" fill="${design.accent}"/>
  <text x="132" y="781" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="900" fill="#ffffff">Single storefront case · shown as one portfolio item</text>
</svg>
`;
}

for (const design of designs) {
  const widePath = join(outRoot, `${design.id}-wide.svg`);
  if (!existsSync(join(outRoot, `${design.id}-wide.png`)) && !existsSync(widePath)) {
    writeFileSync(widePath, storefrontSvg(design), "utf8");
  }

  writeFileSync(join(outRoot, `${design.id}-guide.svg`), guideSvg(design), "utf8");
}

console.log(`Generated Cafe24 guide assets for ${designs.length} storefront concepts.`);
