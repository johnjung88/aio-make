import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "public", "portfolio", "logo-showcase", "_drafts", "moru-redesign-v2");
mkdirSync(outDir, { recursive: true });

const W = 1800;
const H = 1200;
const c = {
  ink: "#17110d",
  espresso: "#24140e",
  roast: "#4d2d21",
  clay: "#9b6644",
  brass: "#c99a67",
  oat: "#e7d0ad",
  cream: "#f7efe3",
  paper: "#fffaf2",
  smoke: "#7c7066",
  line: "#e8dccd",
  green: "#263c32",
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
    <filter id="shadowLg" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="32" stdDeviation="30" flood-color="#160a06" flood-opacity=".18"/>
    </filter>
    <filter id="shadowMd" x="-25%" y="-25%" width="150%" height="155%">
      <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#160a06" flood-opacity=".18"/>
    </filter>
    <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 .032"/>
      </feComponentTransfer>
    </filter>
    <linearGradient id="paperWarm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.paper}"/>
      <stop offset=".64" stop-color="${c.cream}"/>
      <stop offset="1" stop-color="#ead3b7"/>
    </linearGradient>
    <linearGradient id="roastDark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.espresso}"/>
      <stop offset=".62" stop-color="${c.roast}"/>
      <stop offset="1" stop-color="${c.clay}"/>
    </linearGradient>
    <linearGradient id="cardLight" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".58" stop-color="${c.paper}"/>
      <stop offset="1" stop-color="${c.cream}"/>
    </linearGradient>
  </defs>`;
}

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">
  ${defs()}
  ${body}
</svg>`;
}

function shell(light = false) {
  return `
  <rect width="${W}" height="${H}" fill="${light ? c.paper : c.espresso}"/>
  <rect x="54" y="54" width="1692" height="1092" rx="44" fill="${light ? "#ffffff" : "url(#paperWarm)"}"/>
  <rect x="54" y="54" width="1692" height="1092" rx="44" fill="#ffffff" filter="url(#paperGrain)" opacity=".44"/>`;
}

function header(no, eyebrow, title, subtitle, dark = false) {
  const main = dark ? c.paper : c.ink;
  const muted = dark ? "#d9c8b7" : c.smoke;
  return `
  <text x="112" y="122" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="950" letter-spacing="7" fill="${c.clay}">${esc(no)}  ${esc(eyebrow)}</text>
  <text x="112" y="206" font-family="Inter, Arial, sans-serif" font-size="70" font-weight="950" letter-spacing="-1" fill="${main}">${esc(title)}</text>
  <text x="114" y="258" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="720" fill="${muted}">${esc(subtitle)}</text>`;
}

function markA(x, y, s = 1, dark = true) {
  const bg = dark ? "url(#roastDark)" : c.paper;
  const main = dark ? c.paper : c.espresso;
  const accent = dark ? c.brass : c.clay;
  return `
  <g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="100" cy="100" r="88" fill="${bg}"/>
    <circle cx="100" cy="100" r="70" fill="none" stroke="${accent}" stroke-width="7"/>
    <path d="M53 122V76c0-23 28-32 42-13l5 7 5-7c14-19 42-10 42 13v46" fill="none" stroke="${main}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M54 122c28-17 64-17 92 0" fill="none" stroke="${accent}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="100" cy="91" r="7" fill="${accent}"/>
  </g>`;
}

function markB(x, y, s = 1) {
  return `
  <g transform="translate(${x} ${y}) scale(${s})">
    <path d="M100 18c48 32 72 70 72 114 0 29-22 50-52 50-22 0-38-11-48-30-11 19-27 30-49 30-30 0-52-21-52-50 0-44 29-82 79-114Z" fill="${c.espresso}"/>
    <path d="M68 134c21-38 45-64 75-82" fill="none" stroke="${c.brass}" stroke-width="12" stroke-linecap="round"/>
    <path d="M48 120h104" stroke="${c.paper}" stroke-width="10" stroke-linecap="round" opacity=".92"/>
  </g>`;
}

function markC(x, y, s = 1) {
  return `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect x="18" y="18" width="164" height="164" rx="40" fill="${c.espresso}"/>
    <path d="M52 128V70l48 46 48-46v58" fill="none" stroke="${c.paper}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M58 142h84" stroke="${c.brass}" stroke-width="10" stroke-linecap="round"/>
    <path d="M58 54h84" stroke="${c.brass}" stroke-width="7" stroke-linecap="round" opacity=".85"/>
  </g>`;
}

function wordmark(x, y, size = 88, color = c.ink, anchor = "start") {
  return `
  <g>
    <text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter, Arial, sans-serif" font-size="${size}" font-weight="950" letter-spacing="-1.2" fill="${color}">MORU Coffee</text>
    <text x="${x}" y="${y + size * 0.42}" text-anchor="${anchor}" font-family="Inter, Arial, sans-serif" font-size="${Math.round(size * 0.14)}" font-weight="850" letter-spacing="6" fill="${color}" opacity=".55">SMALL BATCH ROASTERY</text>
  </g>`;
}

function lockup(x, y, s = 1, color = c.ink, darkMark = true) {
  return `
  ${markA(x, y, 0.74 * s, darkMark)}
  ${wordmark(x + 170 * s, y + 88 * s, 70 * s, color)}`;
}

function conceptsBoard() {
  const cards = [
    ["A", "Quiet Roastery Seal", "Warm, stampable, premium", markA(0, 0, 1.05, true)],
    ["B", "Bean Route Symbol", "Organic, crafted, memorable", markB(0, 0, 1.05)],
    ["C", "Modular M Stamp", "Modern, compact, digital-ready", markC(0, 0, 1.05)],
  ];
  return svg(`
  ${shell(true)}
  ${header("01", "LOGO EXPLORATION", "Three Directions", "Different moods before locking one final identity system.")}
  <g transform="translate(112 354)">
    ${cards.map(([letter, title, desc, mark], i) => `
    <g transform="translate(${i * 550} 0)">
      <rect width="492" height="610" rx="34" fill="${i === 0 ? c.espresso : "#ffffff"}" filter="url(#shadowLg)"/>
      <text x="42" y="62" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="950" letter-spacing="6" fill="${i === 0 ? c.brass : c.clay}">CONCEPT ${letter}</text>
      <g transform="translate(146 128)">${mark}</g>
      <text x="42" y="402" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="950" fill="${i === 0 ? c.paper : c.ink}">${esc(title)}</text>
      <text x="42" y="448" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="720" fill="${i === 0 ? "#d9c8b7" : c.smoke}">${esc(desc)}</text>
      <path d="M42 500h408" stroke="${i === 0 ? c.paper : c.ink}" stroke-width="2" opacity=".12"/>
      <text x="42" y="552" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="850" letter-spacing="4" fill="${i === 0 ? c.paper : c.ink}" opacity=".42">${i === 0 ? "SELECTED DIRECTION" : "ALTERNATIVE"}</text>
    </g>`).join("")}
  </g>`);
}

function identityBoard() {
  return svg(`
  ${shell(false)}
  ${header("02", "FINAL IDENTITY", "MORU Coffee", "Selected direction: warm seal mark with a bold, readable wordmark.")}
  <g transform="translate(122 360)">
    ${markA(0, 0, 1.36, true)}
    ${wordmark(0, 352, 96, c.ink)}
    <text x="4" y="510" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="760" fill="${c.smoke}">Designed for stamps, labels, takeout,</text>
    <text x="4" y="546" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="760" fill="${c.smoke}">and profile images.</text>
    <g transform="translate(0 630)">
      <rect x="0" y="0" width="90" height="90" rx="22" fill="${c.espresso}"/>
      <rect x="118" y="0" width="90" height="90" rx="22" fill="${c.roast}"/>
      <rect x="236" y="0" width="90" height="90" rx="22" fill="${c.clay}"/>
      <rect x="354" y="0" width="90" height="90" rx="22" fill="${c.brass}"/>
      <rect x="472" y="0" width="90" height="90" rx="22" fill="${c.paper}" stroke="${c.line}" stroke-width="2"/>
    </g>
  </g>
  <g transform="translate(930 318)" filter="url(#shadowLg)">
    <rect x="140" y="0" width="460" height="650" rx="30" fill="${c.roast}"/>
    <rect x="190" y="82" width="360" height="430" rx="18" fill="${c.paper}" opacity=".1"/>
    ${markA(292, 172, 1.12, true)}
    <text x="370" y="380" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="950" fill="${c.paper}">MORU</text>
    <text x="370" y="419" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="850" letter-spacing="6" fill="${c.paper}" opacity=".62">ROASTERY</text>
    <rect x="0" y="418" width="530" height="288" rx="22" fill="url(#cardLight)" transform="rotate(-7 265 562)"/>
    ${markA(70, 492, .55, false)}
    <text x="176" y="535" font-family="Inter, Arial, sans-serif" font-size="37" font-weight="950" fill="${c.ink}" transform="rotate(-7 176 535)">MORU Coffee</text>
    <text x="176" y="568" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="850" letter-spacing="5" fill="${c.ink}" opacity=".45" transform="rotate(-7 176 568)">SMALL BATCH ROASTERY</text>
    <circle cx="610" cy="660" r="86" fill="${c.espresso}"/>
    ${markA(552, 602, .58, true)}
  </g>`);
}

function systemBoard() {
  return svg(`
  ${shell(true)}
  ${header("03", "LOGO SYSTEM", "Usable at Every Size", "Primary, reverse, one-color, symbol-only, and small-size checks.")}
  <g transform="translate(112 344)">
    <rect x="0" y="0" width="756" height="300" rx="34" fill="#ffffff" filter="url(#shadowLg)"/>
    <text x="44" y="60" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="950" letter-spacing="6" fill="${c.clay}">PRIMARY LOCKUP</text>
    ${lockup(54, 116, .82, c.ink, true)}
    <rect x="832" y="0" width="756" height="300" rx="34" fill="${c.espresso}" filter="url(#shadowLg)"/>
    <text x="876" y="60" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="950" letter-spacing="6" fill="${c.brass}">REVERSE LOCKUP</text>
    ${lockup(886, 116, .82, c.paper, true)}
    ${[
      ["SYMBOL", markA(130, 86, 1.12, true)],
      ["ONE COLOR", markA(130, 86, 1.12, false)],
      ["SMALL SIZE", `${markA(90, 130, .42, true)}${markA(205, 112, .6, true)}${markA(350, 88, .82, true)}`],
    ].map(([label, content], i) => `
    <g transform="translate(${i * 544} 394)">
      <rect width="500" height="308" rx="34" fill="#ffffff" filter="url(#shadowLg)"/>
      <text x="38" y="62" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="950" letter-spacing="6" fill="${c.smoke}">${label}</text>
      ${content}
    </g>`).join("")}
  </g>`);
}

function businessCardBoard() {
  return svg(`
  ${shell(false)}
  ${header("04", "BUSINESS CARD", "Front and Back", "A simple card system that works for founders, cafes, salons, and local stores.")}
  <g transform="translate(150 386)" filter="url(#shadowLg)">
    <rect x="0" y="0" width="690" height="410" rx="28" fill="url(#cardLight)" transform="rotate(-4 345 205)"/>
    ${markA(110, 134, .72, false)}
    <text x="244" y="194" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="950" fill="${c.ink}" transform="rotate(-4 244 194)">MORU Coffee</text>
    <text x="244" y="234" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="850" letter-spacing="6" fill="${c.ink}" opacity=".45" transform="rotate(-4 244 234)">SMALL BATCH ROASTERY</text>
    <rect x="780" y="56" width="690" height="410" rx="28" fill="${c.espresso}" transform="rotate(3 1125 261)"/>
    <text x="890" y="178" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="950" fill="${c.paper}" transform="rotate(3 890 178)">Brand Manager</text>
    <text x="890" y="226" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="720" fill="${c.cream}" opacity=".72" transform="rotate(3 890 226)">name@moru.coffee  /  010 0000 0000</text>
    <text x="890" y="268" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="720" fill="${c.cream}" opacity=".72" transform="rotate(3 890 268)">Seoul, Korea  /  @moru.roastery</text>
    ${markA(1272, 316, .62, true)}
  </g>
  <text x="150" y="974" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="850" letter-spacing="5" fill="${c.smoke}">FRONT LOGO SIDE / BACK CONTACT SIDE / PRINT-READY LAYOUT</text>`);
}

function applicationBoard() {
  return svg(`
  ${shell(true)}
  ${header("05", "APPLICATION SET", "Brand Touchpoints", "Not a fake photo mockup: clean vector applications prepared for presentation and sales pages.")}
  <g transform="translate(118 340)" filter="url(#shadowLg)">
    <rect x="70" y="230" width="540" height="310" rx="24" fill="url(#cardLight)" transform="rotate(-6 340 385)"/>
    ${markA(158, 340, .58, false)}
    <text x="270" y="384" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="950" fill="${c.ink}" transform="rotate(-6 270 384)">MORU Coffee</text>
    <rect x="720" y="0" width="450" height="650" rx="32" fill="${c.roast}"/>
    <rect x="778" y="84" width="334" height="430" rx="18" fill="${c.paper}" opacity=".1"/>
    ${markA(878, 178, 1.04, true)}
    <text x="945" y="382" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="950" fill="${c.paper}">MORU</text>
    <text x="945" y="420" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="850" letter-spacing="6" fill="${c.paper}" opacity=".62">ROASTERY</text>
    <rect x="1280" y="70" width="174" height="174" rx="42" fill="${c.espresso}"/>
    ${markA(1314, 104, .53, true)}
    <rect x="1218" y="340" width="370" height="176" rx="88" fill="${c.espresso}"/>
    <path d="M1218 428h370" stroke="${c.paper}" stroke-width="3" opacity=".16"/>
    ${markA(1350, 376, .54, true)}
    <circle cx="1466" cy="680" r="90" fill="${c.paper}"/>
    ${markA(1408, 622, .58, false)}
  </g>
  <text x="118" y="1042" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="850" letter-spacing="5" fill="${c.smoke}">LOGO / BUSINESS CARD / PACKAGE LABEL / SNS PROFILE / STICKER</text>`);
}

function deliveryBoard() {
  const files = [
    ["AI", "Editable source"],
    ["SVG", "Vector web"],
    ["PNG", "Transparent"],
    ["JPG", "Preview"],
    ["PDF", "Print handoff"],
  ];
  return svg(`
  ${shell(true)}
  ${header("06", "DELIVERY PACKAGE", "What Clients Receive", "Clear deliverables make the low event price still feel professional.")}
  <g transform="translate(112 350)">
    ${files.map(([label, desc], i) => `
    <g transform="translate(${i * 320} 0)">
      <rect width="274" height="230" rx="30" fill="#ffffff" filter="url(#shadowLg)"/>
      <text x="38" y="110" font-family="Inter, Arial, sans-serif" font-size="60" font-weight="950" fill="${c.ink}">${label}</text>
      <text x="40" y="156" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="760" fill="${c.smoke}">${desc}</text>
    </g>`).join("")}
  </g>
  <g transform="translate(112 708)">
    <rect width="762" height="310" rx="34" fill="${c.espresso}" filter="url(#shadowLg)"/>
    <text x="48" y="70" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="950" letter-spacing="6" fill="${c.brass}">USAGE GUIDE</text>
    <text x="48" y="132" font-family="Inter, Arial, sans-serif" font-size="29" font-weight="900" fill="${c.paper}">Clear space / color / minimum size</text>
    <text x="48" y="190" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="720" fill="${c.cream}" opacity=".72">Built for profile images, simple signs, labels,</text>
    <text x="48" y="226" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="720" fill="${c.cream}" opacity=".72">name cards, stickers, and future edits.</text>
    <rect x="820" y="0" width="762" height="310" rx="34" fill="#ffffff" filter="url(#shadowLg)"/>
    <text x="868" y="70" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="950" letter-spacing="6" fill="${c.clay}">COLOR SYSTEM</text>
    <rect x="870" y="118" width="116" height="116" rx="28" fill="${c.espresso}"/>
    <rect x="1020" y="118" width="116" height="116" rx="28" fill="${c.roast}"/>
    <rect x="1170" y="118" width="116" height="116" rx="28" fill="${c.clay}"/>
    <rect x="1320" y="118" width="116" height="116" rx="28" fill="${c.brass}"/>
    <rect x="1470" y="118" width="72" height="116" rx="24" fill="${c.paper}" stroke="${c.line}" stroke-width="2"/>
    <text x="870" y="276" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="760" fill="${c.smoke}">Warm, confident, small-business friendly.</text>
  </g>`);
}

const boards = [
  ["01-logo-exploration", conceptsBoard()],
  ["02-final-identity", identityBoard()],
  ["03-logo-system", systemBoard()],
  ["04-business-card", businessCardBoard()],
  ["05-application-set", applicationBoard()],
  ["06-delivery-package", deliveryBoard()],
];

for (const [name, content] of boards) {
  writeFileSync(join(outDir, `${name}.svg`), content, "utf8");
  await sharp(Buffer.from(content)).png().toFile(join(outDir, `${name}.png`));
}

const cells = await Promise.all(
  boards.map(async ([name], i) => {
    const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
      <rect x="0" y="346" width="600" height="54" fill="rgba(36,20,14,.82)"/>
      <text x="22" y="382" font-family="Arial" font-size="22" font-weight="800" fill="#fffaf2">${esc(name)}</text>
    </svg>`);
    const input = await sharp(join(outDir, `${name}.png`))
      .resize(600, 400, { fit: "cover" })
      .composite([{ input: label, left: 0, top: 0 }])
      .png()
      .toBuffer();
    return { input, left: (i % 3) * 600, top: Math.floor(i / 3) * 400 };
  }),
);

await sharp({
  create: { width: 1800, height: 800, channels: 3, background: c.espresso },
})
  .composite(cells)
  .jpeg({ quality: 92 })
  .toFile(join(outDir, "moru-redesign-v2-contact-sheet.jpg"));

console.log(`Generated MORU redesign v2 in ${outDir}`);
