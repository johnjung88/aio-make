// Crop the approved cafe contact sheet into nine distinct source photos.
import sharp from "sharp";
const [source] = process.argv.slice(2);
if (!source)
  throw new Error(
    "Usage: node scripts/marketing-feed.mjs <cafe-contact-sheet.png>",
  );
const { width: w, height: h } = await sharp(source).metadata();
for (let i = 0; i < 9; i++)
  await sharp(source)
    .extract({
      left: Math.floor(((i % 3) * w) / 3) + 3,
      top: Math.floor((Math.floor(i / 3) * h) / 3) + 3,
      width: Math.floor(w / 3) - 6,
      height: Math.floor(h / 3) - 6,
    })
    .resize(500, 500)
    .webp({ quality: 88 })
    .toFile("public/marketing-renewal/feed-" + i + ".webp");
