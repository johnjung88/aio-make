import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outRoot = join(process.cwd(), "public", "portfolio", "logo-showcase");
const sourceRoot = join(outRoot, "_sources");
const cardSource = join(sourceRoot, "business-card-base.jpg");
const premiumSources = {
  fnb: join(sourceRoot, "premium-fnb-mockup.png"),
  beauty: join(sourceRoot, "premium-beauty-mockup.png"),
  wellness: join(sourceRoot, "premium-wellness-mockup.png"),
  tech: join(sourceRoot, "premium-tech-mockup.png"),
};

const brands = [
  { slug: "moru-coffee", brand: "MORU Coffee", descriptor: "Roastery identity", accent: "#7A4E2E", accent2: "#C99B6A", ink: "#211712", paper: "#F5EFE6" },
  { slug: "salty-yuzu", brand: "Salty Yuzu", descriptor: "Citrus dessert identity", accent: "#F2A900", accent2: "#1AAE89", ink: "#1F1A10", paper: "#FFF4D4" },
  { slug: "danchae-table", brand: "Danchae Table", descriptor: "Modern table identity", accent: "#A84A2A", accent2: "#D4A64D", ink: "#1E1712", paper: "#F6EFE5" },
  { slug: "onda-hair", brand: "Onda Hair", descriptor: "Fluid salon identity", accent: "#9A6759", accent2: "#E7C5B8", ink: "#201714", paper: "#F8EEEA" },
  { slug: "vela-skin", brand: "Vela Skin", descriptor: "Clean science identity", accent: "#71879D", accent2: "#D9C6AD", ink: "#17212B", paper: "#F3F2ED" },
  { slug: "nudekind", brand: "Nudekind", descriptor: "Gentle beauty identity", accent: "#C88B75", accent2: "#A7B797", ink: "#211916", paper: "#F8EFEA" },
  { slug: "breath-pilates", brand: "Breath Pilates", descriptor: "Alignment studio identity", accent: "#5F857D", accent2: "#C8D8CA", ink: "#13231F", paper: "#EEF5F2" },
  { slug: "harufit", brand: "HaruFit", descriptor: "Daily routine identity", accent: "#F05A2A", accent2: "#20B8AB", ink: "#1A1D1F", paper: "#FFF1E8" },
  { slug: "mediroot", brand: "MediRoot", descriptor: "Recovery clinic identity", accent: "#247B78", accent2: "#7EAD73", ink: "#102322", paper: "#EAF4F1" },
  { slug: "nova-node", brand: "Nova Node", descriptor: "Data node identity", accent: "#5F54FF", accent2: "#12C8E8", ink: "#11142A", paper: "#ECECFF" },
  { slug: "flowstack", brand: "Flowstack", descriptor: "Automation system identity", accent: "#2563EB", accent2: "#22C55E", ink: "#101827", paper: "#EAF1FF" },
  { slug: "promptly-ai", brand: "Promptly AI", descriptor: "Conversational AI identity", accent: "#7C3AED", accent2: "#F97316", ink: "#181223", paper: "#F2ECFF" },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function mark(slug, spec, mono = false) {
  const a = mono ? spec.ink : spec.accent;
  const b = mono ? spec.ink : spec.accent2;
  const s = mono ? spec.ink : spec.ink;
  const white = mono ? spec.paper : "#ffffff";
  const marks = {
    "moru-coffee": `<circle cx="50" cy="50" r="42" fill="${a}"/><path d="M28 52c6-28 39-36 48-8 7 23-16 43-36 30-9-6-14-14-12-22Z" fill="${b}"/><path d="M42 27c16 16 17 41-3 56" fill="none" stroke="${s}" stroke-width="6.5" stroke-linecap="round"/><path d="M26 58h48" stroke="${white}" stroke-width="5" stroke-linecap="round" opacity=".92"/><path d="M36 39c9-7 18-7 27 0" fill="none" stroke="${white}" stroke-width="4" stroke-linecap="round" opacity=".9"/>`,
    "salty-yuzu": `<circle cx="46" cy="51" r="36" fill="${a}"/><circle cx="46" cy="51" r="24" fill="none" stroke="${s}" stroke-width="5"/><path d="M46 27v48M22 51h48M29 34l34 34M63 34 29 68" stroke="${s}" stroke-width="4" stroke-linecap="round"/><circle cx="46" cy="51" r="8" fill="${white}"/><path d="M76 20l6 12 13 3-10 9 2 14-12-7-12 7 2-14-10-9 13-3Z" fill="${b}" stroke="${s}" stroke-width="3" stroke-linejoin="round"/>`,
    "danchae-table": `<rect x="17" y="18" width="29" height="29" rx="8" fill="${a}"/><rect x="54" y="18" width="29" height="29" rx="8" fill="${b}"/><rect x="17" y="55" width="29" height="29" rx="8" fill="${b}"/><rect x="54" y="55" width="29" height="29" rx="8" fill="${a}"/><path d="M30 72c13-18 27-18 40 0" fill="none" stroke="${s}" stroke-width="6" stroke-linecap="round"/><path d="M27 30h56M17 47h66M17 55h66M27 84h56" stroke="${white}" stroke-width="3" opacity=".55"/>`,
    "onda-hair": `<circle cx="50" cy="50" r="37" fill="none" stroke="${a}" stroke-width="11"/><path d="M17 52c11-18 24-21 39-3 11 13 21 12 32-3" fill="none" stroke="${s}" stroke-width="7" stroke-linecap="round"/><path d="M27 68c13 10 31 10 45 0" fill="none" stroke="${b}" stroke-width="7" stroke-linecap="round"/><path d="M32 34c10-8 25-9 36-1" fill="none" stroke="${b}" stroke-width="5" stroke-linecap="round" opacity=".8"/>`,
    "vela-skin": `<path d="M20 24 50 80 80 24" fill="none" stroke="${a}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="37" r="9" fill="${b}"/><circle cx="50" cy="37" r="3" fill="${white}"/><path d="M34 78h32" stroke="${s}" stroke-width="5" stroke-linecap="round"/><path d="M33 25c11-8 23-8 34 0" fill="none" stroke="${b}" stroke-width="5" stroke-linecap="round"/>`,
    "nudekind": `<rect x="18" y="20" width="64" height="60" rx="30" fill="${b}"/><path d="M31 73V35h17c13 0 21 8 21 22v16" fill="none" stroke="${s}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M31 36c13-13 30-14 44-2" fill="none" stroke="${a}" stroke-width="7" stroke-linecap="round"/><path d="M70 24c-7-3-16-2-24 5" fill="none" stroke="${white}" stroke-width="4" stroke-linecap="round" opacity=".9"/>`,
    "breath-pilates": `<path d="M50 15v70" stroke="${s}" stroke-width="5.5" stroke-linecap="round"/><path d="M50 28c-24 2-34 21-18 37 9 9 20 4 18-8" fill="none" stroke="${a}" stroke-width="7.5" stroke-linecap="round"/><path d="M50 28c24 2 34 21 18 37-9 9-20 4-18-8" fill="none" stroke="${b}" stroke-width="7.5" stroke-linecap="round"/><circle cx="50" cy="50" r="7" fill="${white}" stroke="${s}" stroke-width="3"/>`,
    "harufit": `<rect x="17" y="17" width="66" height="66" rx="21" fill="${a}"/><path d="M32 56 45 69 71 33" fill="none" stroke="${white}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M31 36h18m15 0h7M49 36v25" stroke="${b}" stroke-width="6" stroke-linecap="round"/><path d="M28 78h45" stroke="${s}" stroke-width="4" stroke-linecap="round" opacity=".35"/>`,
    "mediroot": `<path d="M18 78V23l32 31 32-31v55" fill="none" stroke="${a}" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 37v40M38 50h24" stroke="${s}" stroke-width="6.5" stroke-linecap="round"/><path d="M50 78c-10-10-18-13-29-11M50 78c10-10 18-13 29-11" stroke="${b}" stroke-width="5.5" stroke-linecap="round"/><circle cx="50" cy="50" r="24" fill="none" stroke="${white}" stroke-width="3" opacity=".55"/>`,
    "nova-node": `<path d="M50 14v72M14 50h72M27 27l46 46M73 27 27 73" stroke="${b}" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="50" r="16" fill="${a}"/><circle cx="50" cy="14" r="7" fill="${s}"/><circle cx="86" cy="50" r="7" fill="${s}"/><circle cx="50" cy="86" r="7" fill="${s}"/><circle cx="14" cy="50" r="7" fill="${s}"/><circle cx="50" cy="50" r="5" fill="${white}"/>`,
    "flowstack": `<rect x="17" y="22" width="48" height="17" rx="6" fill="${a}"/><rect x="27" y="43" width="48" height="17" rx="6" fill="${b}"/><rect x="37" y="64" width="48" height="17" rx="6" fill="${a}"/><path d="M66 29 84 50 66 71" fill="none" stroke="${s}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 31h31M36 52h31M46 73h31" stroke="${white}" stroke-width="3" stroke-linecap="round" opacity=".65"/>`,
    "promptly-ai": `<path d="M17 23h59c9 0 15 6 15 15v20c0 9-6 15-15 15H52L34 87V73H17C8 73 3 67 3 58V38c0-9 5-15 14-15Z" fill="${a}"/><path d="M39 38v28l21-13-10-3 9-12" fill="${b}" stroke="${s}" stroke-width="4.5" stroke-linejoin="round"/><path d="M71 34l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="${white}"/><path d="M24 32h30" stroke="${white}" stroke-width="4" stroke-linecap="round" opacity=".42"/>`,
  };
  return `<g>${marks[slug]}</g>`;
}

function lockupSvg(spec, width, height, color = spec.ink, mono = false, options = {}) {
  const { opacity = 1, shadow = false } = options;
  const markSpec = color === "#ffffff" ? { ...spec, ink: "#ffffff", paper: "#ffffff" } : spec;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <filter id="softInk" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="1.2" flood-color="#000000" flood-opacity=".18"/>
    </filter>
    <g opacity="${opacity}"${shadow ? ' filter="url(#softInk)"' : ""}>
      <g transform="translate(0 2) scale(${height * 0.007})">${mark(spec.slug, markSpec, mono)}</g>
      <text x="${height * 0.9}" y="${height * 0.48}" font-family="Arial, sans-serif" font-size="${height * 0.26}" font-weight="900" fill="${color}">${esc(spec.brand)}</text>
      <text x="${height * 0.92}" y="${height * 0.66}" font-family="Arial, sans-serif" font-size="${height * 0.065}" font-weight="800" letter-spacing="3" fill="${color}" opacity=".62">${esc(spec.descriptor.toUpperCase())}</text>
    </g>
  </svg>`);
}

function applicationGroup(spec) {
  if (["moru-coffee", "salty-yuzu", "danchae-table"].includes(spec.slug)) return "fnb";
  if (["onda-hair", "vela-skin", "nudekind"].includes(spec.slug)) return "beauty";
  if (["breath-pilates", "harufit", "mediroot"].includes(spec.slug)) return "wellness";
  return "tech";
}

async function logoPng(spec, width, height, color = spec.ink, rotate = 0, options = {}) {
  let image = sharp(lockupSvg(spec, width, height, color, false, options)).png();
  if (rotate !== 0) {
    image = image.rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
  }
  return image.toBuffer();
}

async function generateApplication(spec) {
  const dir = join(outRoot, spec.slug);
  mkdirSync(dir, { recursive: true });

  const group = applicationGroup(spec);
  const base = await sharp(premiumSources[group])
    .resize(1600, 1000, { fit: "cover", position: "centre" })
    .modulate({ brightness: 0.99, saturation: group === "tech" ? 0.92 : 0.96 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();

  const largePrint = await logoPng(spec, 440, 112, spec.ink, 0, { opacity: 0.76 });
  const mediumPrint = await logoPng(spec, 340, 88, spec.ink, 0, { opacity: 0.78 });
  const wallMark = await logoPng(spec, 500, 128, spec.ink, 0, { opacity: 0.82 });
  const screenMark = await logoPng(spec, 520, 132, "#ffffff", 0, { opacity: 0.92, shadow: true });

  const placements = {
    fnb: [
      { input: largePrint, left: 1045, top: 480, blend: "multiply" },
    ],
    beauty: [
      { input: mediumPrint, left: 1102, top: 492, blend: "multiply" },
    ],
    wellness: [
      { input: wallMark, left: 434, top: 282, blend: "multiply" },
    ],
    tech: [
      { input: screenMark, left: 770, top: 274, blend: "screen" },
    ],
  }[group];

  await sharp(base)
    .composite(placements)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(join(dir, "photo-application.jpg"));

  await sharp(base)
    .composite(placements)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(join(dir, "photo-signage.jpg"));
}

async function generateBusinessCard(spec) {
  const dir = join(outRoot, spec.slug);
  mkdirSync(dir, { recursive: true });

  const base = sharp(cardSource)
    .rotate()
    .resize({ width: 1600 })
    .extract({ left: 0, top: 250, width: 1600, height: 1000 })
    .modulate({ brightness: 0.98, saturation: 0.94 })
    .toBuffer();

  const logo = await sharp(lockupSvg(spec, 620, 150, spec.ink, false, { opacity: 0.72 }))
    .rotate(0.5, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp(await base)
    .composite([
      { input: logo, left: 480, top: 375, blend: "multiply" },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(join(dir, "photo-business-card.jpg"));
}

for (const spec of brands) {
  await generateBusinessCard(spec);
  await generateApplication(spec);
}

writeFileSync(
  join(sourceRoot, "README.md"),
  [
    "# Photo mockup sources",
    "",
    "- `business-card-base.jpg`: Pexels photo 8490063 by PNW Production.",
    "- `signage-base.jpg`: legacy Pexels sign photo kept for reference.",
    "- `premium-*-mockup.png`: AI-generated blank physical mockup backgrounds, composited with vector logo artwork.",
    "- Generated photo mockups are composited JPGs for fictitious portfolio brands.",
  ].join("\n"),
  "utf8",
);

console.log(`Generated ${brands.length * 2} premium photo-based logo mockups.`);
