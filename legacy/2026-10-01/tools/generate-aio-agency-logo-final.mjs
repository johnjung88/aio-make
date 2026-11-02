import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "public", "brand", "aio-agency-logo-final");
mkdirSync(outDir, { recursive: true });

const color = {
  ink: "#05070A",
  panel: "#090D12",
  card: "#0D1118",
  white: "#F8FAFC",
  cloud: "#F3F7FB",
  cyan: "#06B6D4",
  blue: "#2F6BFF",
  green: "#A8FF3E",
  mutedDark: "#A9B5C5",
  mutedLight: "#657184",
};

function svg(width, height, body, bg = "transparent") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <linearGradient id="aioLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${color.cyan}"/>
      <stop offset=".58" stop-color="${color.blue}"/>
      <stop offset="1" stop-color="${color.green}"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#020617" flood-opacity=".18"/>
    </filter>
  </defs>
  ${bg === "transparent" ? "" : `<rect width="${width}" height="${height}" fill="${bg}"/>`}
  ${body}
</svg>`;
}

function stackedLockup({
  x = 0,
  y = 0,
  scale = 1,
  dark = true,
  align = "left",
  showAgency = true,
} = {}) {
  const text = dark ? color.white : color.ink;
  const muted = dark ? color.mutedDark : color.mutedLight;
  const anchor = align === "center" ? "middle" : "start";
  const aioX = align === "center" ? x + 210 * scale : x;
  const lineX = align === "center" ? x + 70 * scale : x + 2 * scale;
  const smallX = align === "center" ? x + 210 * scale : lineX + 140 * scale;

  return `
  <g>
    <text x="${aioX}" y="${y + 118 * scale}" text-anchor="${anchor}" font-family="Inter, Arial, sans-serif" font-size="${138 * scale}" font-weight="950" letter-spacing="${-4 * scale}" fill="${text}">AIO</text>
    <rect x="${lineX}" y="${y + 156 * scale}" width="${280 * scale}" height="${8 * scale}" rx="${4 * scale}" fill="url(#aioLine)"/>
    <text x="${smallX}" y="${y + 221 * scale}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${27 * scale}" font-weight="900" letter-spacing="${9 * scale}" fill="${muted}">ALL-IN-ONE</text>
    ${
      showAgency
        ? `<text x="${smallX}" y="${y + 282 * scale}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${27 * scale}" font-weight="900" letter-spacing="${10 * scale}" fill="${muted}">AGENCY</text>`
        : ""
    }
  </g>`;
}

function monogramMark({ x = 0, y = 0, size = 220, dark = true } = {}) {
  const bg = dark ? "#10111A" : color.white;
  const text = dark ? color.white : color.ink;
  return `
  <g transform="translate(${x} ${y})">
    <rect width="${size}" height="${size}" rx="${size * 0.24}" fill="${bg}" filter="url(#softShadow)"/>
    <text x="${size * 0.5}" y="${size * 0.51}" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial, sans-serif" font-size="${size * 0.34}" font-weight="950" letter-spacing="-${size * 0.012}" fill="${text}">AIO</text>
    <rect x="${size * 0.28}" y="${size * 0.67}" width="${size * 0.44}" height="${size * 0.045}" rx="${size * 0.022}" fill="url(#aioLine)"/>
  </g>`;
}

function horizontal({ dark = true } = {}) {
  const bg = dark ? color.panel : color.white;
  return svg(
    1600,
    560,
    `
    <rect x="70" y="70" width="1460" height="420" rx="42" fill="${dark ? color.card : "#F7FAFD"}"/>
    ${monogramMark({ x: 185, y: 150, size: 260, dark })}
    ${stackedLockup({ x: 560, y: 125, scale: 1.15, dark })}`,
    bg,
  );
}

function profile({ dark = true } = {}) {
  const bg = dark ? color.panel : color.white;
  return svg(
    1200,
    1200,
    `
    <rect width="1200" height="1200" rx="260" fill="${bg}"/>
    <circle cx="180" cy="150" r="320" fill="${color.cyan}" opacity="${dark ? ".1" : ".08"}"/>
    <circle cx="1060" cy="1040" r="340" fill="${color.green}" opacity="${dark ? ".08" : ".13"}"/>
    ${monogramMark({ x: 390, y: 210, size: 420, dark })}
    ${stackedLockup({ x: 390, y: 690, scale: 1, dark, align: "center" })}`,
    bg,
  );
}

function profileSimple({ dark = true } = {}) {
  const bg = dark ? color.panel : color.white;
  return svg(
    1200,
    1200,
    `
    <rect width="1200" height="1200" rx="260" fill="${bg}"/>
    ${stackedLockup({ x: 390, y: 410, scale: 1, dark, align: "center" })}`,
    bg,
  );
}

function board() {
  return svg(
    1800,
    1200,
    `
    <rect width="1800" height="1200" fill="${color.cloud}"/>
    <rect x="80" y="80" width="1640" height="1040" rx="44" fill="${color.white}"/>
    <text x="130" y="170" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="950" letter-spacing="7" fill="${color.blue}">AIO AGENCY LOGO FINAL</text>
    <text x="130" y="246" font-family="Inter, Arial, sans-serif" font-size="62" font-weight="950" fill="${color.ink}">AIO 종합 에이전시 로고 확정안</text>
    <text x="130" y="304" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="760" fill="${color.mutedLight}">DESIGN 문구를 제거하고, AIO / ALL-IN-ONE / AGENCY 구조로 정리</text>

    <rect x="130" y="382" width="760" height="360" rx="34" fill="${color.panel}"/>
    ${monogramMark({ x: 200, y: 458, size: 210, dark: true })}
    ${stackedLockup({ x: 500, y: 424, scale: .92, dark: true })}
    <text x="130" y="804" font-family="Inter, Arial, sans-serif" font-size="23" font-weight="900" letter-spacing="5" fill="${color.blue}">HORIZONTAL LOCKUP</text>

    <rect x="970" y="382" width="530" height="530" rx="120" fill="${color.panel}"/>
    ${monogramMark({ x: 1125, y: 468, size: 220, dark: true })}
    ${stackedLockup({ x: 1120, y: 726, scale: .56, dark: true, align: "center" })}
    <text x="970" y="972" font-family="Inter, Arial, sans-serif" font-size="23" font-weight="900" letter-spacing="5" fill="${color.blue}">PROFILE / SNS</text>

    <rect x="130" y="860" width="160" height="160" rx="36" fill="${color.cyan}"/>
    <rect x="330" y="860" width="160" height="160" rx="36" fill="${color.blue}"/>
    <rect x="530" y="860" width="160" height="160" rx="36" fill="${color.green}"/>
    <rect x="730" y="860" width="160" height="160" rx="36" fill="${color.ink}"/>
    <text x="130" y="1064" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="900" fill="${color.mutedLight}">#06B6D4</text>
    <text x="330" y="1064" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="900" fill="${color.mutedLight}">#2F6BFF</text>
    <text x="530" y="1064" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="900" fill="${color.mutedLight}">#A8FF3E</text>
    <text x="730" y="1064" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="900" fill="${color.mutedLight}">#05070A</text>
    `,
  );
}

async function writePng(svgText, filename, width) {
  await sharp(Buffer.from(svgText))
    .resize(width)
    .png({ compressionLevel: 9 })
    .toFile(join(outDir, filename));
}

const files = {
  "aio-agency-horizontal-dark.svg": horizontal({ dark: true }),
  "aio-agency-horizontal-light.svg": horizontal({ dark: false }),
  "aio-agency-profile-dark.svg": profile({ dark: true }),
  "aio-agency-profile-light.svg": profile({ dark: false }),
  "aio-agency-profile-simple-dark.svg": profileSimple({ dark: true }),
  "aio-agency-profile-simple-light.svg": profileSimple({ dark: false }),
  "aio-agency-board.svg": board(),
};

for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(outDir, name), content, "utf8");
}

await writePng(files["aio-agency-horizontal-dark.svg"], "aio-agency-horizontal-dark-1600.png", 1600);
await writePng(files["aio-agency-horizontal-light.svg"], "aio-agency-horizontal-light-1600.png", 1600);
await writePng(files["aio-agency-profile-dark.svg"], "aio-agency-profile-dark-1024.png", 1024);
await writePng(files["aio-agency-profile-light.svg"], "aio-agency-profile-light-1024.png", 1024);
await writePng(files["aio-agency-profile-simple-dark.svg"], "aio-agency-profile-simple-dark-1024.png", 1024);
await writePng(files["aio-agency-profile-simple-light.svg"], "aio-agency-profile-simple-light-1024.png", 1024);
await writePng(files["aio-agency-board.svg"], "aio-agency-board-1800.png", 1800);

console.log(`Generated final AIO agency logo kit in ${outDir}.`);
