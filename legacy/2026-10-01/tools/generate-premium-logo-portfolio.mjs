import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outRoot = join(process.cwd(), "public", "portfolio", "logo-showcase");

const brands = [
  {
    slug: "moru-coffee",
    brand: "MORU Coffee",
    sector: "F&B Cafe",
    headline: "Quiet Roastery Identity",
    descriptor: "Small Batch Roastery",
    note: "M + bean + cup silhouette",
    accent: "#C9954A",
    accent2: "#6B442E",
    paper: "#FFF4E4",
    ink: "#21140F",
    deep: "#1A100C",
    theme: "roastery",
  },
  {
    slug: "salty-yuzu",
    brand: "Salty Yuzu",
    sector: "F&B Dessert",
    headline: "Bright Citrus Dessert Mark",
    descriptor: "Yuzu Salt Dessert",
    note: "yuzu slice + salt crystal",
    accent: "#F2A900",
    accent2: "#20A887",
    paper: "#FFF3CE",
    ink: "#20190D",
    deep: "#2B210B",
    theme: "citrus",
  },
  {
    slug: "danchae-table",
    brand: "Danchae Table",
    sector: "Korean Dining",
    headline: "Modern Table Grid Identity",
    descriptor: "Korean Dining",
    note: "bansang grid + table curve",
    accent: "#B6532C",
    accent2: "#D5A64F",
    paper: "#F7EFE4",
    ink: "#211711",
    deep: "#24150E",
    theme: "dining",
  },
  {
    slug: "onda-hair",
    brand: "Onda Hair",
    sector: "Beauty Hair",
    headline: "Fluid Salon Signature",
    descriptor: "Hair Studio",
    note: "wave + hair texture",
    accent: "#9A6759",
    accent2: "#E7BFB1",
    paper: "#F8ECE7",
    ink: "#201513",
    deep: "#241614",
    theme: "wave",
  },
  {
    slug: "vela-skin",
    brand: "Vela Skin",
    sector: "Beauty Skincare",
    headline: "Clean Science Skincare",
    descriptor: "Clinical Glow",
    note: "V line + light point",
    accent: "#71879D",
    accent2: "#D7C1A4",
    paper: "#F2F1EC",
    ink: "#15212B",
    deep: "#111B23",
    theme: "vela",
  },
  {
    slug: "nudekind",
    brand: "Nudekind",
    sector: "Clean Cosmetics",
    headline: "Gentle Barrier Identity",
    descriptor: "Clean Beauty",
    note: "soft n + skin barrier",
    accent: "#C88973",
    accent2: "#A8B996",
    paper: "#F8EEE9",
    ink: "#211714",
    deep: "#281A16",
    theme: "softn",
  },
  {
    slug: "breath-pilates",
    brand: "Breath Pilates",
    sector: "Wellness Studio",
    headline: "Calm Alignment Studio",
    descriptor: "Pilates Studio",
    note: "breath curve + body axis",
    accent: "#5F857D",
    accent2: "#C7D8CA",
    paper: "#EEF5F2",
    ink: "#12231F",
    deep: "#132822",
    theme: "breath",
  },
  {
    slug: "harufit",
    brand: "HaruFit",
    sector: "Fitness Routine",
    headline: "Daily Routine Fitness Mark",
    descriptor: "Fitness Routine",
    note: "H + check + progress",
    accent: "#F05A2A",
    accent2: "#20B8AB",
    paper: "#FFF1E8",
    ink: "#171B1D",
    deep: "#20272A",
    theme: "haru",
  },
  {
    slug: "mediroot",
    brand: "MediRoot",
    sector: "Wellness Clinic",
    headline: "Trust-Led Recovery Clinic",
    descriptor: "Wellness Clinic",
    note: "M + cross + root line",
    accent: "#247B78",
    accent2: "#83AD74",
    paper: "#EAF4F1",
    ink: "#102322",
    deep: "#102B29",
    theme: "root",
  },
  {
    slug: "nova-node",
    brand: "Nova Node",
    sector: "Tech SaaS",
    headline: "Connected Data Node",
    descriptor: "Data Intelligence",
    note: "node network + nova pulse",
    accent: "#665CFF",
    accent2: "#12C8E8",
    paper: "#ECECFF",
    ink: "#11142A",
    deep: "#10132F",
    theme: "node",
  },
  {
    slug: "flowstack",
    brand: "Flowstack",
    sector: "Workflow SaaS",
    headline: "Modular Workflow System",
    descriptor: "Automation System",
    note: "stack layers + flow arrow",
    accent: "#2563EB",
    accent2: "#22C55E",
    paper: "#EAF1FF",
    ink: "#101827",
    deep: "#121A2B",
    theme: "stack",
  },
  {
    slug: "promptly-ai",
    brand: "Promptly AI",
    sector: "AI Tool",
    headline: "Fast Prompt Interface Mark",
    descriptor: "Conversational AI",
    note: "bubble + cursor spark",
    accent: "#7C3AED",
    accent2: "#F97316",
    paper: "#F2ECFF",
    ink: "#181223",
    deep: "#1D1230",
    theme: "prompt",
  },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function defs(spec) {
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1600" y2="1000" gradientUnits="userSpaceOnUse">
      <stop stop-color="${spec.deep}"/>
      <stop offset=".58" stop-color="${spec.ink}"/>
      <stop offset="1" stop-color="${spec.deep}"/>
    </linearGradient>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#fffaf0"/>
      <stop offset="1" stop-color="${spec.paper}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${spec.accent}"/>
      <stop offset="1" stop-color="${spec.accent2}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="34" stdDeviation="26" flood-color="#000000" flood-opacity=".34"/>
    </filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="150%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000000" flood-opacity=".20"/>
    </filter>
    <filter id="texture" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 .045"/></feComponentTransfer>
    </filter>
  </defs>`;
}

function mark(spec, variant = "color") {
  const a = variant === "mono" ? spec.ink : spec.accent;
  const b = variant === "mono" ? spec.ink : spec.accent2;
  const cream = variant === "reverse" ? spec.paper : "#FFF4E4";
  const dark = variant === "reverse" ? spec.deep : spec.ink;

  if (spec.theme === "roastery") {
    return `<circle cx="100" cy="100" r="80" fill="${dark}"/><circle cx="100" cy="100" r="74" fill="none" stroke="${a}" stroke-width="9"/><path d="M44 129V81c0-22 14-36 34-36 13 0 22 6 28 17 6-11 15-17 28-17 20 0 34 14 34 36v48" stroke="${cream}" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/><path d="M48 137c25-18 79-18 104 0" stroke="${a}" stroke-width="18" stroke-linecap="round"/><path d="M100 66c16 15 16 40 0 55-16-15-16-40 0-55Z" fill="${a}"/><path d="M100 72c-4 18-4 30 0 45" stroke="${dark}" stroke-width="4" stroke-linecap="round"/><path d="M57 158c31 14 58 14 86 0" stroke="${cream}" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (spec.theme === "citrus") {
    return `<circle cx="93" cy="104" r="62" fill="${a}"/><circle cx="93" cy="104" r="45" fill="none" stroke="${dark}" stroke-width="7"/><path d="M93 58v92M47 104h92M61 72l65 65M126 72l-65 65" stroke="${dark}" stroke-width="5" stroke-linecap="round"/><circle cx="93" cy="104" r="13" fill="${cream}"/><path d="M148 35l9 22 24 4-18 16 4 24-21-12-21 12 4-24-18-16 24-4Z" fill="${b}" stroke="${dark}" stroke-width="5" stroke-linejoin="round"/>`;
  }
  if (spec.theme === "dining") {
    return `<rect x="36" y="35" width="52" height="52" rx="13" fill="${a}"/><rect x="112" y="35" width="52" height="52" rx="13" fill="${b}"/><rect x="36" y="112" width="52" height="52" rx="13" fill="${b}"/><rect x="112" y="112" width="52" height="52" rx="13" fill="${a}"/><path d="M57 150c25-36 61-36 86 0" fill="none" stroke="${dark}" stroke-width="10" stroke-linecap="round"/><path d="M53 59h111M36 88h128M36 112h128M53 164h111" stroke="${cream}" stroke-width="4" opacity=".56"/>`;
  }
  if (spec.theme === "wave") {
    return `<circle cx="100" cy="100" r="73" fill="none" stroke="${a}" stroke-width="19"/><path d="M35 103c23-37 49-41 78-8 21 24 39 23 61-5" fill="none" stroke="${dark}" stroke-width="13" stroke-linecap="round"/><path d="M52 134c28 21 70 21 98 0" fill="none" stroke="${b}" stroke-width="13" stroke-linecap="round"/><path d="M62 67c24-17 55-18 79-2" fill="none" stroke="${b}" stroke-width="8" stroke-linecap="round" opacity=".9"/>`;
  }
  if (spec.theme === "vela") {
    return `<path d="M40 48 100 158 160 48" fill="none" stroke="${a}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><circle cx="100" cy="75" r="18" fill="${b}"/><circle cx="100" cy="75" r="6" fill="${cream}"/><path d="M68 158h64" stroke="${dark}" stroke-width="9" stroke-linecap="round"/><path d="M66 48c23-17 45-17 68 0" fill="none" stroke="${b}" stroke-width="8" stroke-linecap="round"/>`;
  }
  if (spec.theme === "softn") {
    return `<rect x="35" y="38" width="130" height="124" rx="62" fill="${b}"/><path d="M61 151V75h35c27 0 42 17 42 44v32" fill="none" stroke="${dark}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="M61 76c26-26 61-28 90-5" fill="none" stroke="${a}" stroke-width="13" stroke-linecap="round"/><path d="M141 52c-15-6-35-3-52 12" fill="none" stroke="${cream}" stroke-width="7" stroke-linecap="round" opacity=".82"/>`;
  }
  if (spec.theme === "breath") {
    return `<path d="M100 30v140" stroke="${dark}" stroke-width="10" stroke-linecap="round"/><path d="M100 58c-48 4-68 42-36 74 18 18 41 8 36-16" fill="none" stroke="${a}" stroke-width="15" stroke-linecap="round"/><path d="M100 58c48 4 68 42 36 74-18 18-41 8-36-16" fill="none" stroke="${b}" stroke-width="15" stroke-linecap="round"/><circle cx="100" cy="100" r="14" fill="${cream}" stroke="${dark}" stroke-width="6"/>`;
  }
  if (spec.theme === "haru") {
    return `<rect x="34" y="34" width="132" height="132" rx="42" fill="${a}"/><path d="M64 112 89 137 142 66" fill="none" stroke="${cream}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="M62 72h36m30 0h14M98 72v50" stroke="${b}" stroke-width="12" stroke-linecap="round"/><path d="M57 155h88" stroke="${dark}" stroke-width="7" stroke-linecap="round" opacity=".35"/>`;
  }
  if (spec.theme === "root") {
    return `<path d="M38 156V46l62 61 62-61v110" fill="none" stroke="${a}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 76v80M76 100h48" stroke="${dark}" stroke-width="12" stroke-linecap="round"/><path d="M100 156c-21-20-37-27-58-22M100 156c21-20 37-27 58-22" stroke="${b}" stroke-width="10" stroke-linecap="round"/><circle cx="100" cy="100" r="48" fill="none" stroke="${cream}" stroke-width="6" opacity=".55"/>`;
  }
  if (spec.theme === "node") {
    return `<path d="M100 27v146M27 100h146M54 54l92 92M146 54l-92 92" stroke="${b}" stroke-width="10" stroke-linecap="round"/><circle cx="100" cy="100" r="31" fill="${a}"/><circle cx="100" cy="27" r="13" fill="${dark}"/><circle cx="173" cy="100" r="13" fill="${dark}"/><circle cx="100" cy="173" r="13" fill="${dark}"/><circle cx="27" cy="100" r="13" fill="${dark}"/><circle cx="100" cy="100" r="9" fill="${cream}"/>`;
  }
  if (spec.theme === "stack") {
    return `<rect x="32" y="44" width="95" height="34" rx="11" fill="${a}"/><rect x="53" y="84" width="95" height="34" rx="11" fill="${b}"/><rect x="74" y="124" width="95" height="34" rx="11" fill="${a}"/><path d="M128 58 166 100 128 142" fill="none" stroke="${dark}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 62h61M71 102h61M92 142h61" stroke="${cream}" stroke-width="6" stroke-linecap="round" opacity=".65"/>`;
  }
  return `<path d="M36 48h118c18 0 30 12 30 30v39c0 18-12 30-30 30h-47l-36 28v-28H36c-18 0-28-12-28-30V78c0-18 10-30 28-30Z" fill="${a}"/><path d="M81 77v56l43-27-21-7 18-24" fill="${b}" stroke="${dark}" stroke-width="9" stroke-linejoin="round"/><path d="M146 68l7 16 16 7-16 7-7 16-7-16-16-7 16-7Z" fill="${cream}"/><path d="M51 66h60" stroke="${cream}" stroke-width="8" stroke-linecap="round" opacity=".4"/>`;
}

function svg(width, height, spec, body) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${defs(spec)}
  ${body}
</svg>
`;
}

function symbol(spec, x, y, scale = 1, variant = "color") {
  return `<g transform="translate(${x} ${y}) scale(${scale})">${mark(spec, variant)}</g>`;
}

function word(spec, x, y, size, color, anchor = "start") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-family="Inter, Montserrat, Arial, sans-serif" font-size="${size}" font-weight="860" letter-spacing="-1">${esc(spec.brand)}</text>
  <text x="${x}" y="${y + size * 0.48}" text-anchor="${anchor}" fill="${color}" opacity=".58" font-family="Inter, Montserrat, Arial, sans-serif" font-size="${Math.max(11, Math.round(size * .16))}" font-weight="820" letter-spacing="4">${esc(spec.descriptor.toUpperCase())}</text>`;
}

function lockup(spec, x, y, scale, size, color, variant = "color") {
  return `${symbol(spec, x, y, scale, variant)}${word(spec, x + 230 * scale, y + 104 * scale, size, color)}`;
}

function cover(spec) {
  return svg(1600, 900, spec, `
  <rect width="1600" height="900" fill="url(#bg)"/>
  <g opacity=".10"><circle cx="1300" cy="120" r="220" stroke="${spec.accent}"/><circle cx="1380" cy="760" r="360" stroke="${spec.accent}"/><path d="M70 118h1460M70 770h1460" stroke="${spec.accent}"/></g>
  <text x="92" y="116" fill="${spec.accent}" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="900" letter-spacing="6">${esc(spec.sector.toUpperCase())}</text>
  <text x="92" y="178" fill="${spec.paper}" font-family="Inter, Arial, sans-serif" font-size="52" font-weight="860">${esc(spec.headline)}</text>
  <text x="92" y="222" fill="${spec.paper}" opacity=".58" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="560">${esc(spec.note)} / logo, business card, brand kit</text>
  <g filter="url(#shadow)">${symbol(spec, 154, 328, 1.55, "color")}</g>
  <text x="112" y="670" fill="${spec.paper}" font-family="Inter, Arial, sans-serif" font-size="76" font-weight="860" letter-spacing="-2">${esc(spec.brand)}</text>
  <text x="116" y="722" fill="${spec.accent}" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="820" letter-spacing="7">${esc(spec.descriptor.toUpperCase())}</text>
  <g transform="translate(885 212)" filter="url(#shadow)">
    <rect x="0" y="45" width="520" height="292" rx="18" fill="url(#paper)" transform="rotate(-6 0 45)"/>
    <rect x="54" y="276" width="520" height="292" rx="18" fill="${spec.deep}" transform="rotate(8 54 276)"/>
    <g transform="translate(130 120) rotate(-6)">${symbol(spec, 0, 0, .52, "color")}${word(spec, 120, 60, 30, spec.ink)}</g>
    <g transform="translate(190 362) rotate(8)">${symbol(spec, 0, 0, .5, "reverse")}${word(spec, 116, 58, 29, spec.paper)}</g>
  </g>
  <g transform="translate(92 760)">
    <rect x="0" y="0" width="70" height="34" rx="17" fill="${spec.accent}"/><rect x="86" y="0" width="70" height="34" rx="17" fill="${spec.accent2}"/><rect x="172" y="0" width="70" height="34" rx="17" fill="${spec.paper}"/>
    <text x="286" y="24" fill="${spec.paper}" opacity=".56" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="4">PRIMARY / ACCENT / PAPER</text>
  </g>`);
}

function logoBoard(spec) {
  return svg(1600, 1000, spec, `
  <rect width="1600" height="1000" fill="${spec.deep}"/>
  <g opacity=".12"><circle cx="1250" cy="210" r="168" stroke="${spec.accent}"/><circle cx="1300" cy="790" r="300" stroke="${spec.accent}"/><path d="M1010 155h440M1010 844h440" stroke="${spec.accent}"/></g>
  <g filter="url(#shadow)">${symbol(spec, 335, 215, 2.4, "color")}</g>
  <text x="575" y="754" text-anchor="middle" fill="${spec.paper}" font-family="Inter, Arial, sans-serif" font-size="106" font-weight="860" letter-spacing="-2">${esc(spec.brand)}</text>
  <text x="575" y="824" text-anchor="middle" fill="${spec.accent}" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="800" letter-spacing="12">${esc(spec.descriptor.toUpperCase())}</text>
  <g transform="translate(1040 330)">
    <text x="0" y="0" fill="${spec.accent}" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="850" letter-spacing="4">DESIGN LOGIC</text>
    <text x="0" y="76" fill="${spec.paper}" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="800">${esc(spec.note)}</text>
    <text x="0" y="132" fill="${spec.paper}" opacity=".58" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="500">A compact mark designed for signs,</text>
    <text x="0" y="169" fill="${spec.paper}" opacity=".58" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="500">cards, stickers, profiles and packages.</text>
    <rect x="0" y="244" width="72" height="72" rx="36" fill="${spec.deep}" stroke="${spec.accent}"/>
    <rect x="96" y="244" width="72" height="72" rx="36" fill="${spec.accent2}"/>
    <rect x="192" y="244" width="72" height="72" rx="36" fill="${spec.accent}"/>
    <rect x="288" y="244" width="72" height="72" rx="36" fill="${spec.paper}"/>
    <text x="0" y="358" fill="${spec.paper}" opacity=".52" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="800" letter-spacing="3">BRAND SYSTEM / VECTOR MASTER</text>
  </g>`);
}

function businessCardBoard(spec) {
  return svg(1600, 1000, spec, `
  <rect width="1600" height="1000" fill="${spec.paper}"/>
  <rect width="1600" height="1000" fill="#ffffff" filter="url(#texture)" opacity=".50"/>
  <g opacity=".36"><circle cx="1320" cy="130" r="230" fill="${spec.accent2}"/><circle cx="230" cy="860" r="210" fill="${spec.accent}"/></g>
  <text x="115" y="126" fill="${spec.accent2}" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="850" letter-spacing="6">BUSINESS CARD SYSTEM</text>
  <text x="115" y="192" fill="${spec.ink}" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="860">${esc(spec.brand)}</text>
  <text x="115" y="238" fill="${spec.ink}" opacity=".58" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="540">front / back layout for logo and business card sales portfolio</text>
  <g transform="translate(380 300) rotate(-7)" filter="url(#shadow)">
    <rect width="840" height="486" rx="26" fill="url(#paper)"/>
    <rect x="40" y="40" width="760" height="406" rx="14" stroke="${spec.accent2}" stroke-width="2" opacity=".6"/>
    ${symbol(spec, 150, 155, .86, "color")}
    ${word(spec, 345, 246, 52, spec.ink)}
    <path d="M347 342h280" stroke="${spec.accent}" stroke-width="3"/>
  </g>
  <g transform="translate(705 535) rotate(8)" filter="url(#shadow)">
    <rect width="840" height="486" rx="26" fill="${spec.deep}"/>
    <rect x="40" y="40" width="760" height="406" rx="14" stroke="${spec.accent}" stroke-width="2" opacity=".28"/>
    ${symbol(spec, 635, 185, .82, "reverse")}
    <text x="90" y="154" fill="${spec.paper}" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="850">${esc(spec.brand)}</text>
    <text x="92" y="202" fill="${spec.accent}" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="850" letter-spacing="5">${esc(spec.descriptor.toUpperCase())}</text>
    <path d="M92 292h278" stroke="${spec.accent2}" stroke-width="2" opacity=".56"/>
    <text x="92" y="342" fill="${spec.paper}" opacity=".62" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="540">${esc(spec.slug.replaceAll("-", ""))}.kr</text>
    <text x="92" y="380" fill="${spec.paper}" opacity=".62" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="540">@${esc(spec.slug.replaceAll("-", "."))}</text>
  </g>`);
}

function brandKitBoard(spec) {
  return svg(1600, 1000, spec, `
  <rect width="1600" height="1000" fill="${spec.deep}"/>
  <rect x="70" y="64" width="1460" height="872" rx="42" fill="${spec.paper}"/>
  <rect x="70" y="64" width="1460" height="872" rx="42" fill="#ffffff" filter="url(#texture)" opacity=".44"/>
  <text x="130" y="138" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="950" letter-spacing="6" fill="${spec.accent}">BRAND KIT DELIVERABLES</text>
  <text x="130" y="212" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="950" fill="${spec.ink}">${esc(spec.brand)}</text>
  <text x="130" y="262" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="760" fill="${spec.ink}" opacity=".62">Logo, business card, social profile, application board, and editable source package.</text>
  <g transform="translate(128 340)">
    <rect width="395" height="250" rx="26" fill="#ffffff" filter="url(#soft)"/><text x="34" y="54" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="950" letter-spacing="4" fill="${spec.ink}" opacity=".42">PRIMARY LOGO</text>
    ${lockup(spec, 34, 102, .62, 28, spec.ink)}<path d="M34 198h315" stroke="${spec.ink}" stroke-width="2" opacity=".08"/><text x="34" y="226" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="800" fill="${spec.ink}" opacity=".56">Horizontal / symbol / mono versions</text>
  </g>
  <g transform="translate(558 340)">
    <rect width="395" height="250" rx="26" fill="#ffffff" filter="url(#soft)"/><rect x="38" y="58" width="318" height="142" rx="13" fill="url(#paper)" filter="url(#soft)" transform="rotate(-4 197 129)"/>
    <g transform="translate(78 105) rotate(-4)">${symbol(spec, 0, 0, .42, "color")}${word(spec, 98, 49, 23, spec.ink)}</g><text x="38" y="226" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="800" fill="${spec.ink}" opacity=".56">Business card front design</text>
  </g>
  <g transform="translate(988 340)">
    <rect width="395" height="250" rx="26" fill="#ffffff" filter="url(#soft)"/><rect x="38" y="54" width="132" height="132" rx="34" fill="${spec.deep}" filter="url(#soft)"/>
    ${symbol(spec, 54, 70, .5, "reverse")}<rect x="204" y="58" width="118" height="118" rx="28" fill="${spec.accent}"/>${symbol(spec, 213, 67, .5, "color")}
    <text x="38" y="226" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="800" fill="${spec.ink}" opacity=".56">SNS profile icon set</text>
  </g>
  <g transform="translate(128 638)">
    <rect width="395" height="188" rx="26" fill="${spec.deep}" filter="url(#soft)"/>${symbol(spec, 42, 48, .52, "reverse")}${word(spec, 164, 94, 27, spec.paper)}<text x="34" y="154" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="850" letter-spacing="3" fill="${spec.paper}" opacity=".42">SIGN / PACKAGE MOCKUP</text>
  </g>
  <g transform="translate(558 638)">
    <rect width="395" height="188" rx="26" fill="#ffffff" filter="url(#soft)"/><text x="34" y="52" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="950" letter-spacing="4" fill="${spec.ink}" opacity=".42">SOURCE PACKAGE</text>
    <text x="36" y="112" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="950" fill="${spec.ink}">AI</text><text x="112" y="112" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="950" fill="${spec.ink}">SVG</text><text x="218" y="112" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="950" fill="${spec.ink}">PNG</text><text x="320" y="112" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="950" fill="${spec.ink}">PDF</text><path d="M34 136h324" stroke="${spec.ink}" stroke-width="2" opacity=".08"/><text x="34" y="166" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="800" fill="${spec.ink}" opacity=".56">Editable and delivery-ready file set</text>
  </g>
  <g transform="translate(988 638)">
    <rect width="395" height="188" rx="26" fill="#ffffff" filter="url(#soft)"/><text x="34" y="52" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="950" letter-spacing="4" fill="${spec.ink}" opacity=".42">MINI GUIDE</text>
    <rect x="36" y="82" width="64" height="64" rx="16" fill="${spec.accent}"/><rect x="118" y="82" width="64" height="64" rx="16" fill="${spec.accent2}"/><rect x="200" y="82" width="64" height="64" rx="16" fill="${spec.ink}"/><path d="M304 84h50M304 108h34M304 132h62" stroke="${spec.ink}" stroke-width="8" stroke-linecap="round" opacity=".18"/><text x="34" y="166" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="800" fill="${spec.ink}" opacity=".56">Color, spacing, and usage notes</text>
  </g>`);
}

function monoBoard(spec) {
  return svg(1600, 1000, spec, `
  <rect width="1600" height="1000" fill="#F4F1EC"/>
  <rect x="82" y="92" width="686" height="816" rx="36" fill="${spec.deep}" filter="url(#shadow)"/>
  <rect x="832" y="92" width="686" height="816" rx="36" fill="#ffffff" filter="url(#shadow)"/>
  <text x="132" y="166" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="950" letter-spacing="6" fill="#ffffff" opacity=".48">REVERSE</text>
  ${symbol(spec, 275, 245, 1.88, "reverse")}
  ${word(spec, 425, 690, 46, "#ffffff", "middle")}
  <text x="425" y="815" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="850" letter-spacing="5" fill="#ffffff" opacity=".42">DARK BACKGROUND</text>
  <text x="882" y="166" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="950" letter-spacing="6" fill="${spec.ink}" opacity=".42">MONO</text>
  ${symbol(spec, 1025, 245, 1.88, "mono")}
  ${word(spec, 1175, 690, 46, spec.ink, "middle")}
  <text x="1175" y="815" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="850" letter-spacing="5" fill="${spec.ink}" opacity=".42">ONE-COLOR VERSION</text>`);
}

function guideBoard(spec) {
  return svg(1600, 1000, spec, `
  <rect width="1600" height="1000" fill="${spec.paper}"/>
  <rect width="1600" height="1000" fill="#ffffff" filter="url(#texture)" opacity=".42"/>
  <rect x="78" y="72" width="1444" height="856" rx="38" fill="#ffffff" filter="url(#soft)"/>
  <text x="132" y="150" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="950" letter-spacing="6" fill="${spec.accent}">BRAND GUIDE</text>
  <text x="132" y="220" font-family="Inter, Arial, sans-serif" font-size="50" font-weight="950" fill="${spec.ink}">${esc(spec.brand)}</text>
  <text x="132" y="268" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="750" fill="${spec.ink}" opacity=".58">${esc(spec.note)} / clearspace, scale, and palette rules</text>
  ${symbol(spec, 180, 390, 1.8, "color")}<path d="M150 360h260v260H150Z" fill="none" stroke="${spec.accent}" stroke-width="3" stroke-dasharray="10 12" opacity=".45"/><path d="M180 390h200v200H180Z" fill="none" stroke="${spec.ink}" stroke-width="2" opacity=".12"/><text x="150" y="682" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="900" letter-spacing="3" fill="${spec.ink}" opacity=".45">CLEARSPACE</text>
  ${symbol(spec, 590, 392, 1.1, "color")}${symbol(spec, 815, 420, .72, "color")}${symbol(spec, 985, 448, .45, "color")}<path d="M570 620h548" stroke="${spec.ink}" stroke-width="2" opacity=".12"/><text x="570" y="682" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="900" letter-spacing="3" fill="${spec.ink}" opacity=".45">SCALE TEST</text>
  <rect x="1190" y="380" width="120" height="120" rx="26" fill="${spec.accent}"/><rect x="1340" y="380" width="120" height="120" rx="26" fill="${spec.accent2}"/><rect x="1190" y="535" width="120" height="120" rx="26" fill="${spec.ink}"/><rect x="1340" y="535" width="120" height="120" rx="26" fill="${spec.paper}" stroke="${spec.ink}" stroke-width="2" opacity=".9"/><text x="1190" y="710" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="900" letter-spacing="3" fill="${spec.ink}" opacity=".45">PALETTE</text>`);
}

const renderers = {
  "cover.svg": cover,
  "logo-board.svg": logoBoard,
  "business-card-board.svg": businessCardBoard,
  "brand-kit-board.svg": brandKitBoard,
  "mono-board.svg": monoBoard,
  "guide-board.svg": guideBoard,
};

for (const spec of brands) {
  const dir = join(outRoot, spec.slug);
  mkdirSync(dir, { recursive: true });

  for (const [filename, renderer] of Object.entries(renderers)) {
    writeFileSync(join(dir, filename), renderer(spec), "utf8");
  }
}

console.log(`Generated ${brands.length * Object.keys(renderers).length} premium logo portfolio SVG assets.`);
