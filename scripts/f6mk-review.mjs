import sharp from "sharp";
import fs from "node:fs/promises";
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F6/mk";
await fs.mkdir(`${root}/review`, { recursive: true });
for (const route of [
  "marketing",
  "marketing_services_integrated",
  "marketing_services_sns",
  "marketing_services_ai-influencer",
  "marketing_services_seo",
  "about",
]) {
  const inputs = [];
  let height = 0;
  for (const [i, width] of [1440, 1280, 1170, 1024, 390].entries())
    for (const [j, phase] of ["before", "after"].entries()) {
      const data = await sharp(`${root}/${phase}/${route}_${width}.png`)
        .resize({ width: 240 })
        .png()
        .toBuffer({ resolveWithObject: true });
      height = Math.max(height, data.info.height);
      inputs.push({ input: data.data, left: (i * 2 + j) * 240, top: 40 });
    }
  const label = Buffer.from(
    `<svg width="2400" height="40"><rect width="2400" height="40" fill="white"/>${[1440, 1280, 1170, 1024, 390].map((w, i) => `<text x="${i * 480 + 10}" y="25" font-size="18">${w} BEFORE / AFTER</text>`).join("")}</svg>`,
  );
  await sharp({
    create: {
      width: 2400,
      height: height + 40,
      channels: 3,
      background: "#222",
    },
  })
    .composite([...inputs, { input: label, left: 0, top: 0 }])
    .jpeg({ quality: 85 })
    .toFile(`${root}/review/${route}.jpg`);
}
