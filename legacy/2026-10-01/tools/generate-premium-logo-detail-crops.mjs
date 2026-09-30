import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "public", "portfolio", "logo-showcase");

const slugs = [
  "moru-coffee",
  "salty-yuzu",
  "danchae-table",
  "onda-hair",
  "vela-skin",
  "nudekind",
  "breath-pilates",
  "harufit",
  "mediroot",
  "nova-node",
  "flowstack",
  "promptly-ai",
];

const cropPresets = [
  { name: "premium-logo-detail.png", x: 0, y: 0, w: 0.51, h: 1 },
  { name: "premium-business-card-detail.png", x: 0.5, y: 0, w: 0.3, h: 0.64 },
  { name: "premium-packaging-detail.png", x: 0.77, y: 0, w: 0.23, h: 0.64 },
  { name: "premium-application-detail.png", x: 0.51, y: 0.63, w: 0.49, h: 0.37 },
];

async function framedCrop(src, out, crop) {
  const meta = await sharp(src).metadata();
  const left = Math.max(0, Math.round(meta.width * crop.x));
  const top = Math.max(0, Math.round(meta.height * crop.y));
  const width = Math.min(meta.width - left, Math.round(meta.width * crop.w));
  const height = Math.min(meta.height - top, Math.round(meta.height * crop.h));

  const extracted = await sharp(src).extract({ left, top, width, height }).png().toBuffer();
  const background = await sharp(extracted)
    .resize(1600, 900, { fit: "cover" })
    .blur(24)
    .modulate({ brightness: 0.55, saturation: 0.86 })
    .png()
    .toBuffer();

  const foreground = await sharp(extracted)
    .resize(1480, 820, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
  const foregroundMeta = await sharp(foreground).metadata();
  const shadowSvg = Buffer.from(
    `<svg width="${foregroundMeta.width + 56}" height="${foregroundMeta.height + 56}" xmlns="http://www.w3.org/2000/svg">
      <rect x="28" y="28" width="${foregroundMeta.width}" height="${foregroundMeta.height}" rx="18" fill="#000" opacity="0.34"/>
    </svg>`,
  );
  const shadow = await sharp({
    create: {
      width: foregroundMeta.width + 56,
      height: foregroundMeta.height + 56,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: shadowSvg, left: 0, top: 0 }])
    .blur(20)
    .png()
    .toBuffer();

  const fgLeft = Math.round((1600 - foregroundMeta.width) / 2);
  const fgTop = Math.round((900 - foregroundMeta.height) / 2);

  await sharp(background)
    .composite([
      { input: shadow, left: fgLeft - 28, top: fgTop - 16 },
      { input: foreground, left: fgLeft, top: fgTop },
    ])
    .png()
    .toFile(out);
}

for (const slug of slugs) {
  const dir = join(root, slug);
  mkdirSync(dir, { recursive: true });
  const src = join(dir, "premium-presentation.png");
  if (!existsSync(src)) {
    throw new Error(`Missing premium presentation for ${slug}`);
  }

  for (const crop of cropPresets) {
    await framedCrop(src, join(dir, crop.name), crop);
  }
}

console.log(`Generated ${slugs.length * cropPresets.length} premium detail crops.`);
