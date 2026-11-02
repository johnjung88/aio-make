import { readFile, mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Reproducible brand graphics. Uses the site's own SVG mark; no stock media.
await mkdir("public/brand", { recursive: true });
await mkdir("public/social", { recursive: true });
const mark = await readFile("app/icon.svg");
for (const [path, size] of [
  ["public/favicon-96.png", 96],
  ["public/apple-touch-icon.png", 180],
  ["public/brand/icon-192.png", 192],
  ["public/brand/logo-512.png", 512],
]) {
  await sharp(mark).resize(size, size).png().toFile(path);
}
const pngs = await Promise.all(
  [16, 32, 48].map((size) => sharp(mark).resize(size, size).png().toBuffer()),
);
const ico = Buffer.alloc(6 + 16 * pngs.length);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(pngs.length, 4);
let offset = ico.length;
pngs.forEach((png, i) => {
  const start = 6 + i * 16;
  ico[start] = ico[start + 1] = [16, 32, 48][i];
  ico.writeUInt16LE(1, start + 4);
  ico.writeUInt16LE(32, start + 6);
  ico.writeUInt32LE(png.length, start + 8);
  ico.writeUInt32LE(offset, start + 12);
  offset += png.length;
});
await writeFile("app/favicon.ico", Buffer.concat([ico, ...pngs]));

const cards = [
  {
    id: "main",
    label: "ALL-IN-ONE AGENCY",
    lines: ["마케팅 · 개발 · 영상", "전문가와 AI가 함께 만듭니다"],
    footer: "필요한 분야만, 하나의 파트너에게",
    light: true,
  },
  {
    id: "marketing",
    label: "MARKETING",
    lines: ["고객을 부르는 콘텐츠", "문의로 이어지는 마케팅"],
    footer: "통합 마케팅 · SNS 운영 · SEO·AEO·GEO",
    light: true,
  },
  {
    id: "lab",
    label: "LAB / DEVELOPMENT",
    lines: ["아이디어부터", "실제로 쓰는 시스템까지"],
    footer: "웹사이트 · 쇼핑몰 · 업무 자동화 · 프로그램",
    light: false,
  },
  {
    id: "video",
    label: "STUDIO / VIDEO",
    lines: ["브랜드의 이야기를", "기억에 남는 장면으로"],
    footer: "웹툰 · 애니메이션 · AI 인플루언서 · 브랜드 영상",
    light: false,
  },
];
for (const card of cards) {
  const bg = card.light ? "#F4F3EF" : "#0D0D12";
  const fg = card.light ? "#0D0D12" : "#F4F3EF";
  const secondary = card.light ? "#5B5867" : "#BBB7CA";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${bg}"/>
    <path d="M0 616H1200V630H0Z" fill="#6B4DFF"/>
    <rect x="1020" y="-64" width="300" height="300" rx="62" fill="#6B4DFF" transform="rotate(15 1170 86)"/>
    <rect x="1080" y="300" width="160" height="160" rx="32" fill="#A99BFF" opacity=".18" transform="rotate(15 1160 380)"/>
    <text x="74" y="96" font-family="Arial,sans-serif" font-weight="900" font-size="46" letter-spacing="-2" fill="${fg}">AIO MAKE</text>
    <rect x="334" y="83" width="12" height="12" fill="#6B4DFF"/>
    <text x="76" y="178" font-family="Arial,sans-serif" font-size="19" font-weight="700" letter-spacing="3" fill="#8063F5">${card.label}</text>
    <g font-family="Malgun Gothic,sans-serif" font-weight="700" font-size="57" letter-spacing="-2" fill="${fg}">
      <text x="72" y="291">${card.lines[0]}</text><text x="72" y="376">${card.lines[1]}</text>
    </g>
    <text x="76" y="462" font-family="Malgun Gothic,sans-serif" font-size="24" fill="${secondary}">${card.footer}</text>
    <path d="M76 512H1124" stroke="${secondary}" stroke-opacity=".25"/>
    <text x="76" y="559" font-family="Arial,sans-serif" font-size="21" fill="${secondary}">aio-make.com</text>
    <text x="1124" y="559" text-anchor="end" font-family="Arial,sans-serif" font-size="16" letter-spacing="2" fill="${secondary}">PLAN · CREATE · DELIVER</text>
  </svg>`;
  await writeFile(`public/social/${card.id}-v09.svg`, svg);
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(`public/social/${card.id}-v09.png`);
}
console.log(
  "Created 4 social cards (1200x630), ICO (16/32/48), PNG icons (96/180/192/512).",
);
