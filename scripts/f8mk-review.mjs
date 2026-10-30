import fs from "node:fs/promises";
import crypto from "node:crypto";
import sharp from "sharp";
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F8/mk";
await fs.mkdir(`${root}/review`, { recursive: true });
const rows = JSON.parse(
  await fs.readFile(`${root}/after/results.json`, "utf8"),
);
const ids = [...new Set(rows.flatMap((row) => row.regions.map((r) => r.id)))];
for (const id of ids) {
  const images = [];
  let height = 0;
  for (const phase of ["before", "after"]) {
    const buffers = await Promise.all(
      [1440, 1280, 1170, 1024, 390].map((width) =>
        sharp(`${root}/${phase}/${id}-${width}.png`)
          .resize({ width: 440 })
          .png()
          .toBuffer(),
      ),
    );
    const h = Math.max(
      ...(await Promise.all(
        buffers.map(async (b) => (await sharp(b).metadata()).height),
      )),
    );
    buffers.forEach((input, i) =>
      images.push({ input, left: i * 440, top: height }),
    );
    height += h + 16;
  }
  await sharp({
    create: { width: 2200, height, channels: 3, background: "#28232e" },
  })
    .composite(images)
    .jpeg({ quality: 90 })
    .toFile(`${root}/review/${id}.jpg`);
}
const manifest = [];
async function scan(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${e.name}`;
    if (e.isDirectory()) await scan(path);
    else if (/\.(png|jpg)$/.test(path)) {
      const data = await fs.readFile(path),
        m = await sharp(data).metadata();
      manifest.push({
        path: path.slice(root.length + 1),
        width: m.width,
        height: m.height,
        sha256: crypto.createHash("sha256").update(data).digest("hex"),
      });
    }
  }
}
await scan(root);
await fs.writeFile(`${root}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log("Decoded and hashed", manifest.length, "images");
