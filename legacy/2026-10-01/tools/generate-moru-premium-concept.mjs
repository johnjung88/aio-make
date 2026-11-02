import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "public", "portfolio", "logo-showcase", "_drafts", "moru-premium");
mkdirSync(outDir, { recursive: true });

const c = {
  espresso: "#24140f",
  roast: "#4a2b1f",
  cacao: "#6f4631",
  clay: "#a87652",
  latte: "#d8b78f",
  cream: "#f5eee4",
  paper: "#fffaf2",
  ink: "#16110f",
  muted: "#82746a",
  line: "#e8dacc",
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function defs() {
  return `
  <defs>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="34" stdDeviation="32" flood-color="#1b0d08" flood-opacity=".18"/>
    </filter>
    <filter id="tightShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#1b0d08" flood-opacity=".22"/>
    </filter>
    <filter id="printTexture" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".74" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 .035"/>
      </feComponentTransfer>
    </filter>
    <linearGradient id="warmPaper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.paper}"/>
      <stop offset=".58" stop-color="${c.cream}"/>
      <stop offset="1" stop-color="#e8d0b4"/>
    </linearGradient>
    <linearGradient id="darkRoast" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.espresso}"/>
      <stop offset=".58" stop-color="${c.roast}"/>
      <stop offset="1" stop-color="${c.cacao}"/>
    </linearGradient>
    <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e6c7a4"/>
      <stop offset=".52" stop-color="${c.clay}"/>
      <stop offset="1" stop-color="#f1d9b8"/>
    </linearGradient>
  </defs>`;
}

function svg(body, width = 1800, height = 1200) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  ${defs()}
  ${body}
</svg>`;
}

function logoMark(x, y, size = 160, variant = "dark") {
  const bg = variant === "light" ? c.paper : variant === "mono" ? c.ink : "url(#darkRoast)";
  const stroke = variant === "light" ? c.espresso : c.paper;
  const accent = variant === "light" ? c.clay : c.latte;
  return `
  <g transform="translate(${x} ${y}) scale(${size / 160})">
    <circle cx="80" cy="80" r="72" fill="${bg}"/>
    <circle cx="80" cy="80" r="56" fill="none" stroke="${accent}" stroke-width="5" opacity=".9"/>
    <path d="M41 106V58c0-13 17-18 25-7l14 22 14-22c8-11 25-6 25 7v48" fill="none" stroke="${stroke}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M45 103c20-10 50-10 70 0" fill="none" stroke="${accent}" stroke-width="9" stroke-linecap="round"/>
    <circle cx="80" cy="80" r="6" fill="${accent}"/>
  </g>`;
}

function wordmark(x, y, size = 92, color = c.ink, anchor = "start") {
  return `
  <g>
    <text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter, Arial, sans-serif" font-size="${size}" font-weight="950" letter-spacing="-1" fill="${color}">MORU Coffee</text>
    <text x="${x}" y="${y + size * 0.42}" text-anchor="${anchor}" font-family="Inter, Arial, sans-serif" font-size="${Math.round(size * 0.15)}" font-weight="850" letter-spacing="6" fill="${color}" opacity=".55">SMALL BATCH ROASTERY</text>
  </g>`;
}

function lockup(x, y, markSize = 150, textSize = 78, color = c.ink, variant = "light") {
  return `
  ${logoMark(x, y, markSize, variant)}
  ${wordmark(x + markSize + 34, y + markSize * 0.55, textSize, color)}`;
}

function boardHeader(label, title, desc, light = false) {
  const main = light ? c.paper : c.ink;
  const sub = light ? c.cream : c.muted;
  return `
  <text x="110" y="122" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="950" letter-spacing="7" fill="${c.clay}">${esc(label)}</text>
  <text x="110" y="205" font-family="Inter, Arial, sans-serif" font-size="68" font-weight="950" fill="${main}">${esc(title)}</text>
  <text x="112" y="256" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="720" fill="${sub}">${esc(desc)}</text>`;
}

function heroBoard() {
  return svg(`
  <rect width="1800" height="1200" fill="${c.espresso}"/>
  <rect x="58" y="58" width="1684" height="1084" rx="46" fill="url(#warmPaper)"/>
  <rect x="58" y="58" width="1684" height="1084" rx="46" fill="#ffffff" filter="url(#printTexture)" opacity=".5"/>
  ${boardHeader("01 IDENTITY CONCEPT", "MORU Coffee", "Quiet specialty roastery identity for daily ritual and craft.")}
  <g transform="translate(110 370)">
    ${logoMark(0, 0, 260, "dark")}
    ${wordmark(0, 360, 98, c.ink)}
    <rect x="0" y="510" width="88" height="88" rx="22" fill="${c.espresso}"/>
    <rect x="112" y="510" width="88" height="88" rx="22" fill="${c.cacao}"/>
    <rect x="224" y="510" width="88" height="88" rx="22" fill="${c.clay}"/>
    <rect x="336" y="510" width="88" height="88" rx="22" fill="${c.paper}" stroke="${c.line}" stroke-width="2"/>
    <text x="0" y="682" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="850" fill="${c.muted}">Espresso / Cacao / Clay / Warm Cream</text>
  </g>
  <g transform="translate(850 300)" filter="url(#softShadow)">
    <rect x="210" y="0" width="430" height="620" rx="26" fill="${c.cacao}"/>
    <path d="M210 118h430" stroke="#ffffff" stroke-width="2" opacity=".13"/>
    <path d="M210 496h430" stroke="#000000" stroke-width="2" opacity=".12"/>
    <rect x="260" y="82" width="330" height="410" rx="8" fill="${c.paper}" opacity=".1"/>
    ${logoMark(344, 176, 118, "dark")}
    <text x="425" y="353" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="950" fill="${c.paper}">MORU</text>
    <text x="425" y="386" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="850" letter-spacing="5" fill="${c.paper}" opacity=".62">WHOLE BEAN COFFEE</text>
    <rect x="0" y="402" width="470" height="256" rx="18" fill="${c.paper}" transform="rotate(-7 235 530)"/>
    ${logoMark(66, 470, 72, "light")}
    <text x="158" y="516" font-family="Inter, Arial, sans-serif" font-size="33" font-weight="950" fill="${c.ink}" transform="rotate(-7 158 516)">MORU Coffee</text>
    <text x="158" y="546" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="850" letter-spacing="4" fill="${c.ink}" opacity=".45" transform="rotate(-7 158 546)">SMALL BATCH ROASTERY</text>
    <circle cx="640" cy="658" r="96" fill="${c.espresso}"/>
    ${logoMark(580, 598, 120, "dark")}
  </g>`);
}

function systemBoard() {
  return svg(`
  <rect width="1800" height="1200" fill="${c.paper}"/>
  <rect width="1800" height="1200" fill="#ffffff" filter="url(#printTexture)" opacity=".42"/>
  ${boardHeader("02 LOGO SYSTEM", "Built to Scale", "Primary lockup, symbol, reverse mark, one-color version, and small-size test.")}
  <g transform="translate(110 350)">
    <rect x="0" y="0" width="760" height="320" rx="32" fill="#ffffff" filter="url(#softShadow)"/>
    <text x="44" y="62" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="950" letter-spacing="5" fill="${c.clay}">PRIMARY</text>
    ${lockup(46, 118, 132, 68, c.ink, "dark")}
  </g>
  <g transform="translate(930 350)">
    <rect x="0" y="0" width="760" height="320" rx="32" fill="${c.espresso}" filter="url(#softShadow)"/>
    <text x="44" y="62" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="950" letter-spacing="5" fill="${c.latte}">REVERSE</text>
    ${lockup(46, 118, 132, 68, c.paper, "dark")}
  </g>
  <g transform="translate(110 735)">
    <rect x="0" y="0" width="490" height="290" rx="32" fill="#ffffff" filter="url(#softShadow)"/>
    <text x="38" y="58" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="950" letter-spacing="5" fill="${c.muted}">SYMBOL</text>
    ${logoMark(154, 84, 170, "dark")}
  </g>
  <g transform="translate(655 735)">
    <rect x="0" y="0" width="490" height="290" rx="32" fill="#ffffff" filter="url(#softShadow)"/>
    <text x="38" y="58" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="950" letter-spacing="5" fill="${c.muted}">ONE COLOR</text>
    ${logoMark(154, 84, 170, "mono")}
  </g>
  <g transform="translate(1200 735)">
    <rect x="0" y="0" width="490" height="290" rx="32" fill="#ffffff" filter="url(#softShadow)"/>
    <text x="38" y="58" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="950" letter-spacing="5" fill="${c.muted}">SMALL SIZE</text>
    ${logoMark(62, 118, 64, "dark")}
    ${logoMark(172, 108, 84, "dark")}
    ${logoMark(306, 92, 116, "dark")}
  </g>`);
}

function kitBoard() {
  return svg(`
  <rect width="1800" height="1200" fill="${c.espresso}"/>
  <rect x="58" y="58" width="1684" height="1084" rx="46" fill="${c.paper}"/>
  <rect x="58" y="58" width="1684" height="1084" rx="46" fill="#ffffff" filter="url(#printTexture)" opacity=".42"/>
  ${boardHeader("03 BRAND KIT", "Launch-Ready Touchpoints", "Business card, package, sticker, social profile, and cup sleeve system.")}
  <g transform="translate(122 346)" filter="url(#softShadow)">
    <rect x="0" y="190" width="520" height="312" rx="20" fill="#ffffff" transform="rotate(-5 260 346)"/>
    ${logoMark(82, 300, 86, "light")}
    <text x="195" y="352" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="950" fill="${c.ink}" transform="rotate(-5 195 352)">MORU Coffee</text>
    <text x="195" y="386" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="850" letter-spacing="5" fill="${c.ink}" opacity=".45" transform="rotate(-5 195 386)">SMALL BATCH ROASTERY</text>
    <rect x="606" y="22" width="420" height="620" rx="26" fill="${c.cacao}"/>
    <rect x="654" y="92" width="324" height="420" rx="12" fill="${c.paper}" opacity=".12"/>
    ${logoMark(754, 176, 124, "dark")}
    <text x="816" y="362" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="44" font-weight="950" fill="${c.paper}">MORU</text>
    <text x="816" y="397" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="850" letter-spacing="5" fill="${c.paper}" opacity=".56">ROASTERY</text>
    <rect x="1068" y="248" width="340" height="170" rx="85" fill="${c.espresso}"/>
    <path d="M1068 333h340" stroke="${c.paper}" stroke-width="3" opacity=".18"/>
    ${logoMark(1155, 280, 96, "dark")}
    <circle cx="1390" cy="600" r="94" fill="${c.paper}"/>
    ${logoMark(1328, 538, 124, "light")}
    <rect x="1234" y="34" width="176" height="176" rx="42" fill="${c.espresso}"/>
    ${logoMark(1262, 62, 120, "dark")}
  </g>
  <g transform="translate(122 1004)">
    <text x="0" y="0" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="900" letter-spacing="4" fill="${c.muted}">LOGO / BUSINESS CARD / PACKAGE / STICKER / SOCIAL PROFILE / SOURCE FILES</text>
  </g>`);
}

function deliveryBoard() {
  return svg(`
  <rect width="1800" height="1200" fill="${c.paper}"/>
  <rect width="1800" height="1200" fill="#ffffff" filter="url(#printTexture)" opacity=".42"/>
  ${boardHeader("04 DELIVERY GUIDE", "What the Client Gets", "A practical logo package for online profiles, print, signage, and future edits.")}
  <g transform="translate(110 350)">
    ${[
      ["AI", "Editable master file"],
      ["SVG", "Vector web source"],
      ["PNG", "Transparent exports"],
      ["JPG", "Preview images"],
      ["PDF", "Print-ready handoff"],
    ].map((item, i) => `
      <g transform="translate(${i * 318} 0)">
        <rect x="0" y="0" width="270" height="220" rx="30" fill="#ffffff" filter="url(#softShadow)"/>
        <text x="36" y="104" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="950" fill="${c.ink}">${item[0]}</text>
        <text x="38" y="150" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="760" fill="${c.muted}">${item[1]}</text>
      </g>`).join("")}
  </g>
  <g transform="translate(110 682)">
    <rect x="0" y="0" width="760" height="330" rx="34" fill="${c.espresso}" filter="url(#softShadow)"/>
    <text x="50" y="70" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="950" letter-spacing="5" fill="${c.latte}">USAGE RULES</text>
    <text x="50" y="136" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="850" fill="${c.paper}">Clear space / color / minimum size</text>
    <text x="50" y="190" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="700" fill="${c.cream}" opacity=".62">Use the symbol for stamps, social avatars,</text>
    <text x="50" y="224" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="700" fill="${c.cream}" opacity=".62">package labels, and simple signage.</text>
  </g>
  <g transform="translate(930 682)">
    <rect x="0" y="0" width="760" height="330" rx="34" fill="#ffffff" filter="url(#softShadow)"/>
    <text x="50" y="70" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="950" letter-spacing="5" fill="${c.clay}">COLOR SYSTEM</text>
    <rect x="54" y="120" width="120" height="120" rx="28" fill="${c.espresso}"/>
    <rect x="204" y="120" width="120" height="120" rx="28" fill="${c.cacao}"/>
    <rect x="354" y="120" width="120" height="120" rx="28" fill="${c.clay}"/>
    <rect x="504" y="120" width="120" height="120" rx="28" fill="${c.paper}" stroke="${c.line}" stroke-width="2"/>
    <text x="54" y="284" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="800" fill="${c.muted}">Warm, crafted, quiet, and premium without looking heavy.</text>
  </g>`);
}

const boards = [
  ["01-hero-identity", heroBoard()],
  ["02-logo-system", systemBoard()],
  ["03-brand-kit", kitBoard()],
  ["04-delivery-guide", deliveryBoard()],
];

for (const [name, content] of boards) {
  const svgPath = join(outDir, `${name}.svg`);
  const pngPath = join(outDir, `${name}.png`);
  writeFileSync(svgPath, content, "utf8");
  await sharp(Buffer.from(content)).png().toFile(pngPath);
}

const contact = await Promise.all(
  boards.map(async ([name], i) => {
    const input = join(outDir, `${name}.png`);
    const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">
      <rect x="0" y="544" width="900" height="56" fill="rgba(36,20,15,.78)"/>
      <text x="28" y="581" font-family="Arial" font-size="25" font-weight="800" fill="#fffaf2">${esc(name)}</text>
    </svg>`);
    const image = await sharp(input)
      .resize(900, 600, { fit: "cover" })
      .composite([{ input: label, left: 0, top: 0 }])
      .png()
      .toBuffer();
    return { input: image, left: (i % 2) * 900, top: Math.floor(i / 2) * 640 };
  }),
);

await sharp({
  create: { width: 1800, height: 1280, channels: 3, background: c.espresso },
})
  .composite(contact)
  .jpeg({ quality: 92 })
  .toFile(join(outDir, "moru-premium-contact-sheet.jpg"));

console.log(`Generated MORU premium concept boards in ${outDir}`);
