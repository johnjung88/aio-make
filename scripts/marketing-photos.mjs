import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const out = path.resolve("public/marketing-renewal");
await fs.mkdir(out, { recursive: true });
const [portraits, props] = process.argv.slice(2);
if (!portraits || !props)
  throw new Error(
    "Usage: node scripts/marketing-photos.mjs <portrait-contact-sheet.png> <material-contact-sheet.png>",
  );
let { width: w, height: h } = await sharp(portraits).metadata();
for (let i = 0; i < 6; i++)
  await sharp(portraits)
    .extract({
      left: Math.floor(((i % 3) * w) / 3) + 6,
      top: Math.floor((Math.floor(i / 3) * h) / 2) + 6,
      width: Math.floor(w / 3) - 12,
      height: Math.floor(h / 2) - 12,
    })
    .resize(700, 875, { fit: "cover" })
    .webp({ quality: 88 })
    .toFile(
      path.join(
        out,
        i < 3 ? "persona-" + i + ".webp" : "persona-role-" + (i - 3) + ".webp",
      ),
    );
({ width: w, height: h } = await sharp(props).metadata());
for (let i = 0; i < 4; i++)
  await sharp(props)
    .extract({
      left: Math.floor(((i % 2) * w) / 2) + 4,
      top: Math.floor((Math.floor(i / 2) * h) / 2) + 4,
      width: Math.floor(w / 2) - 8,
      height: Math.floor(h / 2) - 8,
    })
    .resize(700, 875, { fit: "cover" })
    .webp({ quality: 88 })
    .toFile(path.join(out, "material-" + i + ".webp"));
console.log("10 source photos saved");
